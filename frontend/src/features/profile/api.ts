import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/client";
import type { Usuario, UsuarioPublico } from "@/shared/api/types";

export function usePerfilPublico(id: number | string) {
  return useQuery({
    queryKey: ["usuario-publico", id],
    queryFn: async () => {
      const { data } = await apiClient.get<UsuarioPublico>(`/auth/usuarios/${id}/`);
      return data;
    },
  });
}

export function useActualizarPerfil() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cambios: Partial<Pick<Usuario, "nombre_completo" | "telefono" | "ubicacion">>) => {
      const { data } = await apiClient.patch<Usuario>("/auth/me/", cambios);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });
}

export function useEnviarVerificacion() {
  return useMutation({
    mutationFn: async (payload: {
      tipo_documento: string;
      numero_documento: string;
      documento_identidad_archivo: File;
    }) => {
      const formData = new FormData();
      formData.append("tipo_documento", payload.tipo_documento);
      formData.append("numero_documento", payload.numero_documento);
      formData.append("documento_identidad_archivo", payload.documento_identidad_archivo);
      const { data } = await apiClient.patch<Usuario>("/auth/me/verificacion/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
  });
}
