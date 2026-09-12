import { Link } from "react-router-dom";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { useReportes, useResolverReporte } from "./api";

const ESTADO_TONO = { sin_revisar: "danger", en_revision: "warning", resuelto: "success" } as const;

export function ReportesTab() {
  const { data, isLoading } = useReportes();
  const resolver = useResolverReporte();

  if (isLoading) return <p className="text-sm text-muted">Cargando...</p>;
  if (!data || data.results.length === 0) return <p className="text-sm text-muted">No hay reportes registrados.</p>;

  return (
    <div className="space-y-3">
      {data.results.map((r) => (
        <Card key={r.id}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold">{r.motivo}</p>
              {r.descripcion && <p className="mt-1 text-xs text-muted">{r.descripcion}</p>}
              <p className="mt-1 text-xs text-muted">
                {r.publicacion_reportada ? (
                  <Link to={`/publicaciones/${r.publicacion_reportada}`} className="underline">
                    Ver publicación reportada
                  </Link>
                ) : (
                  `Usuario reportado #${r.usuario_reportado}`
                )}
                {" · "}
                {new Date(r.creado_en).toLocaleDateString("es-CO")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tono={ESTADO_TONO[r.estado]}>{r.estado.replace("_", " ")}</Badge>
              {r.estado !== "resuelto" && (
                <Button className="text-xs" onClick={() => resolver.mutate(r.id)}>
                  Marcar resuelto
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
