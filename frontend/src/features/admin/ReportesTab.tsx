import { Link } from "react-router-dom";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { IconFlag } from "@/shared/ui/icons";
import { useToast } from "@/shared/ui/Toast";
import { tiempoRelativo } from "@/shared/lib/tiempoRelativo";
import { useReportes, useResolverReporte } from "./api";

const ESTADO_TONO = { sin_revisar: "danger", en_revision: "warning", resuelto: "success" } as const;
const ESTADO_LABEL = { sin_revisar: "Sin revisar", en_revision: "En revisión", resuelto: "Resuelto" } as const;

export function ReportesTab() {
  const { data, isLoading } = useReportes();
  const resolver = useResolverReporte();
  const { notificar } = useToast();

  if (isLoading) return <p className="text-sm text-muted">Cargando...</p>;
  if (!data || data.results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center">
        <IconFlag className="h-6 w-6 text-line" />
        <p className="text-sm text-muted">No hay reportes registrados.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.results.map((r) => (
        <Card key={r.id} className="transition-shadow hover:shadow-lifted">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-danger-bg text-danger">
                <IconFlag className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{r.motivo}</p>
                {r.descripcion && <p className="mt-1 text-xs text-muted">{r.descripcion}</p>}
                <p className="mt-1.5 text-xs text-muted">
                  Reportado por <span className="font-medium text-ink">{r.usuario_reporta_nombre}</span>
                  {" · "}
                  {tiempoRelativo(r.creado_en)}
                </p>
                <p className="mt-1 text-xs">
                  {r.publicacion_reportada ? (
                    <Link
                      to={`/publicaciones/${r.publicacion_reportada}`}
                      className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                    >
                      Publicación: {r.publicacion_reportada_titulo}
                    </Link>
                  ) : (
                    <Link
                      to={`/usuarios/${r.usuario_reportado}`}
                      className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                    >
                      Usuario: {r.usuario_reportado_nombre}
                    </Link>
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-none items-center gap-2">
              <Badge tono={ESTADO_TONO[r.estado]}>{ESTADO_LABEL[r.estado]}</Badge>
              {r.estado !== "resuelto" && (
                <Button
                  className="text-xs"
                  onClick={() => resolver.mutate(r.id, { onSuccess: () => notificar("Reporte marcado como resuelto.") })}
                >
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
