import { useParams } from "react-router-dom";
import { Badge } from "@/shared/ui/Badge";
import { Card } from "@/shared/ui/Card";
import { PantallaCargando } from "@/shared/ui/Spinner";
import { usePerfilPublico } from "./api";

export function PublicProfilePage() {
  const { id } = useParams();
  const { data: usuario, isLoading } = usePerfilPublico(id!);

  if (isLoading) return <PantallaCargando />;
  if (!usuario) return <p>No se encontró este usuario.</p>;

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 font-display text-2xl font-bold text-primary">
          {usuario.nombre_completo.charAt(0)}
        </div>
        <h1 className="font-display text-xl font-semibold">{usuario.nombre_completo}</h1>
        <p className="text-sm text-muted">{usuario.ubicacion || "Ubicación no indicada"}</p>
        <div className="mt-3 flex items-center gap-2">
          {usuario.estado_verificacion === "aprobado" && <Badge tono="success">✓ Vendedor verificado</Badge>}
        </div>
        <div className="mt-4 flex gap-6 border-t border-line pt-4">
          <div>
            <p className="font-mono text-lg font-bold">
              {usuario.total_calificaciones > 0 ? Number(usuario.promedio_calificacion).toFixed(1) : "—"} ★
            </p>
            <p className="text-xs text-muted">calificación</p>
          </div>
          <div>
            <p className="font-mono text-lg font-bold">{usuario.total_calificaciones}</p>
            <p className="text-xs text-muted">reseñas</p>
          </div>
          <div>
            <p className="font-mono text-lg font-bold">{new Date(usuario.creado_en).getFullYear()}</p>
            <p className="text-xs text-muted">en Campo Directo desde</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
