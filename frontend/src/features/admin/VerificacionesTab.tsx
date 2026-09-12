import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { IconShieldCheck } from "@/shared/ui/icons";
import { useToast } from "@/shared/ui/Toast";
import { TIPO_DOCUMENTO_LABEL } from "@/features/profile/labels";
import { useAprobarVerificacion, useRechazarVerificacion, useVerificacionesPendientes } from "./api";

export function VerificacionesTab() {
  const { data, isLoading } = useVerificacionesPendientes();
  const aprobar = useAprobarVerificacion();
  const rechazar = useRechazarVerificacion();
  const { notificar } = useToast();

  if (isLoading) return <p className="text-sm text-muted">Cargando...</p>;
  if (!data || data.results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center">
        <IconShieldCheck className="h-6 w-6 text-line" />
        <p className="text-sm text-muted">No hay verificaciones pendientes por ahora.</p>
      </div>
    );
  }

  const esImagen = (url: string) => /\.(png|jpe?g|webp|gif)$/i.test(url);

  return (
    <div className="space-y-3">
      {data.results.map((u) => (
        <Card key={u.id} className="flex items-center gap-4">
          {u.documento_identidad_archivo ? (
            <a
              href={u.documento_identidad_archivo}
              target="_blank"
              rel="noreferrer"
              className="flex h-16 w-16 flex-none items-center justify-center overflow-hidden rounded-lg border border-line bg-surface-2"
              title="Ver documento completo"
            >
              {esImagen(u.documento_identidad_archivo) ? (
                <img src={u.documento_identidad_archivo} alt="Documento" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs font-semibold text-muted">PDF</span>
              )}
            </a>
          ) : (
            <div className="flex h-16 w-16 flex-none items-center justify-center rounded-lg bg-surface-2 text-xs text-muted">
              Sin doc.
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-ink">{u.nombre_completo}</p>
            <p className="truncate text-xs text-muted">{u.email}</p>
            <p className="text-xs text-muted">
              {TIPO_DOCUMENTO_LABEL[u.tipo_documento] ?? u.tipo_documento} · {u.numero_documento}
            </p>
          </div>

          <div className="flex flex-none gap-2">
            <Button
              className="text-xs"
              onClick={() => aprobar.mutate(u.id, { onSuccess: () => notificar(`${u.nombre_completo} fue verificado.`) })}
            >
              Aprobar
            </Button>
            <Button
              variante="danger"
              className="text-xs"
              onClick={() => rechazar.mutate(u.id, { onSuccess: () => notificar(`Verificación de ${u.nombre_completo} rechazada.`) })}
            >
              Rechazar
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
