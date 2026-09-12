import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/client";
import type { Notificacion, Paginado } from "@/shared/api/types";

export function useNotificaciones() {
  return useQuery({
    queryKey: ["notificaciones"],
    queryFn: async () => {
      const { data } = await apiClient.get<Paginado<Notificacion>>("/notifications/");
      return data;
    },
  });
}

export function useMarcarNotificacionesLeidas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/notifications/marcar-leidas/");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notificaciones"] }),
  });
}
