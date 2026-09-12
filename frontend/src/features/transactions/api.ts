import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/client";
import type { Paginado, Transaccion } from "@/shared/api/types";

export function useMisTransacciones() {
  return useQuery({
    queryKey: ["transacciones"],
    queryFn: async () => {
      const { data } = await apiClient.get<Paginado<Transaccion>>("/transactions/");
      return data;
    },
  });
}

export function useRegistrarVenta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { publicacion: number; comprador: number }) => {
      const { data } = await apiClient.post<Transaccion>("/transactions/", payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transacciones"] }),
  });
}

export function useCompletarTransaccion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiClient.post<Transaccion>(`/transactions/${id}/completar/`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transacciones"] }),
  });
}

export function useCalificar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { transaccion: number; puntuacion: number; comentario?: string }) => {
      const { data } = await apiClient.post("/transactions/calificaciones/", payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transacciones"] }),
  });
}
