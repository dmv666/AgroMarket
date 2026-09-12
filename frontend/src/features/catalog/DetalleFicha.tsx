import type { Categoria, Detalle } from "@/shared/api/types";

const FILA = "flex justify-between border-b border-line py-2 text-sm last:border-0";

export function DetalleFicha({ categoria, detalle }: { categoria: Categoria; detalle: Detalle | null }) {
  if (!detalle) return null;

  if (categoria === "insumo_veterinario" && "tipo_insumo" in detalle) {
    return (
      <div className="mt-4">
        <div className={FILA}>
          <span className="text-muted">Tipo de insumo</span>
          <span className="font-semibold">{detalle.tipo_insumo}</span>
        </div>
        {detalle.fabricante && (
          <div className={FILA}>
            <span className="text-muted">Fabricante</span>
            <span className="font-semibold">{detalle.fabricante}</span>
          </div>
        )}
        {detalle.fecha_vencimiento && (
          <div className={FILA}>
            <span className="text-muted">Vence</span>
            <span className="font-semibold">{detalle.fecha_vencimiento}</span>
          </div>
        )}
      </div>
    );
  }

  if (categoria === "alimento_balanceado" && "tipo_alimento" in detalle) {
    return (
      <div className="mt-4">
        <div className={FILA}>
          <span className="text-muted">Tipo de alimento</span>
          <span className="font-semibold">{detalle.tipo_alimento}</span>
        </div>
        <div className={FILA}>
          <span className="text-muted">Presentación</span>
          <span className="font-semibold">{detalle.presentacion}</span>
        </div>
        <div className={FILA}>
          <span className="text-muted">Peso</span>
          <span className="font-semibold">{detalle.peso_kg} kg</span>
        </div>
      </div>
    );
  }

  if (categoria === "animal_genetica" && "especie" in detalle) {
    return (
      <div className="mt-4">
        <div className={FILA}>
          <span className="text-muted">Especie</span>
          <span className="font-semibold">{detalle.especie}</span>
        </div>
        <div className={FILA}>
          <span className="text-muted">Raza</span>
          <span className="font-semibold">{detalle.raza}</span>
        </div>
        <div className={FILA}>
          <span className="text-muted">Edad</span>
          <span className="font-semibold">{detalle.edad}</span>
        </div>
        <div className={FILA}>
          <span className="text-muted">Tipo</span>
          <span className="font-semibold capitalize">{detalle.tipo_genetica}</span>
        </div>
        <div className="mt-2 rounded-lg bg-success-bg p-3">
          <p className="mb-1 text-xs font-semibold text-success">Estado de salud</p>
          <p className="text-sm text-ink">{detalle.estado_salud}</p>
        </div>
      </div>
    );
  }

  return null;
}
