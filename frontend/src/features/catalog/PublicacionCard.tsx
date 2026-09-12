import { Link } from "react-router-dom";
import type { Publicacion } from "@/shared/api/types";
import { IconStar } from "@/shared/ui/icons";
import { CategoriaPlaceholder } from "./CategoriaPlaceholder";
import { CATEGORIA_LABEL, formatearPrecio } from "./labels";

export function PublicacionCard({ publicacion }: { publicacion: Publicacion }) {
  const portada = publicacion.imagenes[0]?.archivo;

  return (
    <Link
      to={`/publicaciones/${publicacion.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lifted"
    >
      <div className="aspect-[4/3] w-full overflow-hidden">
        {portada ? (
          <img
            src={portada}
            alt={publicacion.titulo}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <CategoriaPlaceholder categoria={publicacion.categoria} className="h-full w-full" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-xs font-medium text-muted">{CATEGORIA_LABEL[publicacion.categoria]}</span>
        <h3 className="font-display text-base font-semibold leading-snug text-ink">{publicacion.titulo}</h3>
        <p className="text-xs text-muted">{publicacion.ubicacion}</p>
        <div className="mt-auto flex items-end justify-between pt-3">
          <span className="font-display text-lg font-semibold text-ink">{formatearPrecio(publicacion.precio)}</span>
          {publicacion.vendedor.total_calificaciones > 0 && (
            <span className="flex items-center gap-1 text-xs font-medium text-accent">
              <IconStar className="h-3.5 w-3.5" />
              {Number(publicacion.vendedor.promedio_calificacion).toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
