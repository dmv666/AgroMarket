import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { useAprobarVerificacion, useRechazarVerificacion, useVerificacionesPendientes } from "./api";

export function VerificacionesTab() {
  const { data, isLoading } = useVerificacionesPendientes();
  const aprobar = useAprobarVerificacion();
  const rechazar = useRechazarVerificacion();

  if (isLoading) return <p className="text-sm text-muted">Cargando...</p>;
  if (!data || data.results.length === 0) return <p className="text-sm text-muted">No hay verificaciones pendientes.</p>;

  return (
    <div className="space-y-3">
      {data.results.map((u) => (
        <Card key={u.id} className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{u.nombre_completo}</p>
            <p className="text-xs text-muted">
              {u.email} · {u.tipo_documento} {u.numero_documento}
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="text-xs" onClick={() => aprobar.mutate(u.id)}>
              Aprobar
            </Button>
            <Button variante="danger" className="text-xs" onClick={() => rechazar.mutate(u.id)}>
              Rechazar
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
