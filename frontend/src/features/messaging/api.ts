import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/client";
import type { Conversacion, Mensaje, Paginado } from "@/shared/api/types";

export function useConversaciones() {
  return useQuery({
    queryKey: ["conversaciones"],
    queryFn: async () => {
      const { data } = await apiClient.get<Paginado<Conversacion>>("/messaging/conversaciones/");
      return data;
    },
    refetchInterval: 15_000,
  });
}

export function useIniciarConversacion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (publicacionId: number) => {
      const { data } = await apiClient.post<Conversacion>("/messaging/conversaciones/", {
        publicacion: publicacionId,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversaciones"] });
    },
  });
}

export function useMensajes(conversacionId: number | null) {
  return useQuery({
    queryKey: ["mensajes", conversacionId],
    enabled: conversacionId !== null,
    queryFn: async () => {
      const { data } = await apiClient.get<Paginado<Mensaje>>(
        `/messaging/conversaciones/${conversacionId}/mensajes/`,
      );
      return data;
    },
  });
}
