import type { Categoria, EstadoPublicacion } from "@/shared/api/types";

export const CATEGORIA_LABEL: Record<Categoria, string> = {
  insumo_veterinario: "Insumo veterinario",
  alimento_balanceado: "Alimento balanceado",
  animal_genetica: "Animal / genética",
};

export const CATEGORIA_COLOR: Record<Categoria, { texto: string; fondo: string }> = {
  insumo_veterinario: { texto: "var(--color-cat-vet)", fondo: "var(--color-cat-vet-bg)" },
  alimento_balanceado: { texto: "var(--color-cat-alimento)", fondo: "var(--color-cat-alimento-bg)" },
  animal_genetica: { texto: "var(--color-cat-animal)", fondo: "var(--color-cat-animal-bg)" },
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
