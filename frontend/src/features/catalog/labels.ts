import type { Categoria, EstadoPublicacion } from "@/shared/api/types";

export const CATEGORIA_LABEL: Record<Categoria, string> = {
  insumo_veterinario: "Insumo veterinario",
  alimento_balanceado: "Alimento balanceado",
  animal_genetica: "Animal / genética",
};

export const CATEGORIA_ICONO: Record<Categoria, string> = {
  insumo_veterinario: "💉",
  alimento_balanceado: "🌽",
  animal_genetica: "🐄",
};

export const ESTADO_LABEL: Record<EstadoPublicacion, string> = {
  pendiente: "Pendiente de revisión",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
  suspendida: "Suspendida",
};

export function formatearPrecio(precio: string) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(
    Number(precio),
  );
}
