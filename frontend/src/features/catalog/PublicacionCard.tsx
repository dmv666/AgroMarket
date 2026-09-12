import { Link } from "react-router-dom";
import type { Publicacion } from "@/shared/api/types";
import { Badge } from "@/shared/ui/Badge";
import { Card } from "@/shared/ui/Card";
import { CATEGORIA_ICONO, CATEGORIA_LABEL, formatearPrecio } from "./labels";

export function PublicacionCard({ publicacion }: { publicacion: Publicacion }) {
  const portada = publicacion.imagenes[0]?.archivo;

  return (
    <Link to={`/publicaciones/${publicacion.id}`}>
      <Card className="flex h-full flex-col gap-3 p-0 overflow-hidden hover:border-primary">
        <div className="flex h-32 items-center justify-center bg-surface-2 text-5xl">
          {portada ? (
            <img src={portada} alt={publicacion.titulo} className="h-full w-full object-cover" />
          ) : (
            CATEGORIA_ICONO[publicacion.categoria]
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 px-4 pb-4">
          <Badge tono="neutral">{CATEGORIA_LABEL[publicacion.categoria]}</Badge>
          <h3 className="font-display text-base font-semibold text-ink">{publicacion.titulo}</h3>
          <p className="text-xs text-muted">{publicacion.ubicacion}</p>
          <div className="mt-auto flex items-center justify-between pt-2">
            <span className="font-mono text-sm font-bold text-ink">{formatearPrecio(publicacion.precio)}</span>
            {publicacion.vendedor.total_calificaciones > 0 && (
              <span className="text-xs text-accent">
                ★ {Number(publicacion.vendedor.promedio_calificacion).toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
