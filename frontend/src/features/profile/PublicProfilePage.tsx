import { useParams } from "react-router-dom";
import { usePublicaciones } from "@/features/catalog/api";
import { PublicacionCard } from "@/features/catalog/PublicacionCard";
import { Badge } from "@/shared/ui/Badge";
import { Card } from "@/shared/ui/Card";
import { PantallaCargando } from "@/shared/ui/Spinner";
import { IconShieldCheck, IconStar } from "@/shared/ui/icons";
import { usePerfilPublico } from "./api";

export function PublicProfilePage() {
  const { id } = useParams();
  const { data: usuario, isLoading } = usePerfilPublico(id!);
  const { data: publicaciones } = usePublicaciones({ vendedor: id });

  if (isLoading) return <PantallaCargando />;
  if (!usuario) return <p>No se encontró este usuario.</p>;

  return (
    <div>
      <Card className="mx-auto mb-8 max-w-2xl">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-surface-2 font-display text-2xl font-semibold text-primary">
            {usuario.nombre_completo.charAt(0)}
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold">{usuario.nombre_completo}</h1>
            <p className="text-sm text-muted">{usuario.ubicacion || "Ubicación no indicada"}</p>
            {usuario.estado_verificacion === "aprobado" && (
              <Badge tono="success">
                <IconShieldCheck className="h-3 w-3" /> Verificado
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-5 flex gap-8 border-t border-line pt-5">
          <div>
            <p className="flex items-center gap-1 font-display text-lg font-semibold">
              {usuario.total_calificaciones > 0 ? (
                <>
                  <IconStar className="h-4 w-4 text-accent" />
                  {Number(usuario.promedio_calificacion).toFixed(1)}
                </>
              ) : (
                "—"
              )}
            </p>
            <p className="text-xs text-muted">calificación</p>
          </div>
          <div>
            <p className="font-display text-lg font-semibold">{usuario.total_calificaciones}</p>
            <p className="text-xs text-muted">reseñas</p>
          </div>
          <div>
            <p className="font-display text-lg font-semibold">{new Date(usuario.creado_en).getFullYear()}</p>
            <p className="text-xs text-muted">en AgroMarket desde</p>
          </div>
        </div>
      </Card>

      <h2 className="mb-4 font-display text-lg font-semibold">Publicaciones activas</h2>
      {!publicaciones || publicaciones.results.length === 0 ? (
        <p className="text-sm text-muted">Este usuario no tiene publicaciones activas por ahora.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {publicaciones.results.map((p) => (
            <PublicacionCard key={p.id} publicacion={p} />
          ))}
        </div>
      )}
    </div>
  );
}
