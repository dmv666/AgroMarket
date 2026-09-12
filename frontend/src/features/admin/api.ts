import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/client";
import type { Paginado, Publicacion, Reporte, Usuario } from "@/shared/api/types";

export function useVerificacionesPendientes() {
  return useQuery({
    queryKey: ["admin-verificaciones"],
    queryFn: async () => {
      const { data } = await apiClient.get<Paginado<Usuario>>("/moderation/verificaciones/");
      return data;
    },
  });
}

function useDecisionVerificacion(accion: "aprobar" | "rechazar") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (usuarioId: number) => {
      await apiClient.post(`/moderation/verificaciones/${usuarioId}/${accion}/`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-verificaciones"] }),
  });
}
export const useAprobarVerificacion = () => useDecisionVerificacion("aprobar");
export const useRechazarVerificacion = () => useDecisionVerificacion("rechazar");

export function usePublicacionesModeracion(estado: string) {
  return useQuery({
    queryKey: ["admin-publicaciones", estado],
    queryFn: async () => {
      const { data } = await apiClient.get<Paginado<Publicacion>>("/moderation/publicaciones/", {
        params: { estado },
      });
      return data;
    },
  });
}

function useDecisionPublicacion(accion: "aprobar" | "rechazar" | "suspender") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, motivo }: { id: number; motivo?: string }) => {
      await apiClient.post(`/moderation/publicaciones/${id}/${accion}/`, { motivo });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-publicaciones"] }),
  });
}
export const useAprobarPublicacion = () => useDecisionPublicacion("aprobar");
export const useRechazarPublicacion = () => useDecisionPublicacion("rechazar");
export const useSuspenderPublicacion = () => useDecisionPublicacion("suspender");

export function useReportes() {
  return useQuery({
    queryKey: ["admin-reportes"],
    queryFn: async () => {
      const { data } = await apiClient.get<Paginado<Reporte>>("/moderation/reportes/");
      return data;
    },
  });
}

export function useResolverReporte() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.post(`/moderation/reportes/${id}/resolver/`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-reportes"] }),
  });
}

export function useCrearReporte() {
  return useMutation({
    mutationFn: async (payload: {
      motivo: string;
      descripcion?: string;
      publicacion_reportada?: number;
      usuario_reportado?: number;
    }) => {
      const { data } = await apiClient.post("/moderation/reportes/", payload);
      return data;
    },
  });
}
