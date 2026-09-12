import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/client";
import type { Paginado, Publicacion } from "@/shared/api/types";

export interface FiltrosCatalogo {
  categoria?: string;
  ubicacion?: string;
  precio_min?: string;
  precio_max?: string;
  vendedor?: number | string;
}

export function usePublicaciones(filtros: FiltrosCatalogo) {
  return useQuery({
    queryKey: ["publicaciones", filtros],
    queryFn: async () => {
      const { data } = await apiClient.get<Paginado<Publicacion>>("/catalog/publicaciones/", {
        params: filtros,
      });
      return data;
    },
  });
}

export function usePublicacion(id: number | string) {
  return useQuery({
    queryKey: ["publicacion", id],
    queryFn: async () => {
      const { data } = await apiClient.get<Publicacion>(`/catalog/publicaciones/${id}/`);
      return data;
    },
  });
}

export function useMisPublicaciones() {
  return useQuery({
    queryKey: ["mis-publicaciones"],
    queryFn: async () => {
      const { data } = await apiClient.get<Paginado<Publicacion>>("/catalog/mis-publicaciones/");
      return data;
    },
  });
}

interface CrearPublicacionPayload {
  categoria: string;
  titulo: string;
  descripcion?: string;
  precio: string;
  cantidad_disponible?: number;
  ubicacion: string;
  detalle: Record<string, unknown>;
}

export function useCrearPublicacion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CrearPublicacionPayload) => {
      const { data } = await apiClient.post<Publicacion>("/catalog/publicaciones/", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mis-publicaciones"] });
    },
  });
}

export function useSubirImagen(publicacionId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (archivo: File) => {
      const formData = new FormData();
      formData.append("archivo", archivo);
      const { data } = await apiClient.post(
        `/catalog/publicaciones/${publicacionId}/imagenes/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publicacion", publicacionId] });
    },
  });
}
