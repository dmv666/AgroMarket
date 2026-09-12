import { useState } from "react";
import type { Categoria, ImagenPublicacion } from "@/shared/api/types";
import { IconChevronLeft, IconChevronRight } from "@/shared/ui/icons";
import { CategoriaPlaceholder } from "./CategoriaPlaceholder";

/**
 * Galería de la ficha de producto: imagen grande + carrete de miniaturas,
 * al estilo de una página de producto real (no una sola foto perdida en
 * un cuadro gris). Si todavía no hay fotos, cae al placeholder de
 * categoría en vez de dejar un hueco vacío.
 */
export function Gallery({ imagenes, categoria, titulo }: { imagenes: ImagenPublicacion[]; categoria: Categoria; titulo: string }) {
  const [activa, setActiva] = useState(0);

  if (imagenes.length === 0) {
    return <CategoriaPlaceholder categoria={categoria} className="aspect-[4/3] w-full rounded-2xl" />;
  }

  const actual = imagenes[activa];

  return (
    <div>
      <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-2">
        <img
          key={actual.id}
          src={actual.archivo}
          alt={`${titulo} — foto ${activa + 1}`}
          className="h-full w-full animate-fade-in object-cover"
        />
        {imagenes.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={() => setActiva((i) => (i - 1 + imagenes.length) % imagenes.length)}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink opacity-0 shadow-soft transition-opacity group-hover:opacity-100"
            >
              <IconChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Foto siguiente"
              onClick={() => setActiva((i) => (i + 1) % imagenes.length)}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink opacity-0 shadow-soft transition-opacity group-hover:opacity-100"
            >
              <IconChevronRight className="h-4 w-4" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-2 py-0.5 text-xs font-medium text-white">
              {activa + 1} / {imagenes.length}
            </span>
          </>
        )}
      </div>

      {imagenes.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {imagenes.map((imagen, indice) => (
            <button
              key={imagen.id}
              type="button"
              onClick={() => setActiva(indice)}
              className={`h-16 w-16 flex-none overflow-hidden rounded-lg border-2 transition-colors ${
                indice === activa ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={imagen.archivo} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
