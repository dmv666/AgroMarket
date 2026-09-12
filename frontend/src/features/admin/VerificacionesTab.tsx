import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Lightbox } from "@/shared/ui/Lightbox";
import { IconLocation, IconShieldCheck } from "@/shared/ui/icons";
import { useToast } from "@/shared/ui/Toast";
import { tiempoRelativo } from "@/shared/lib/tiempoRelativo";
import { TIPO_DOCUMENTO_LABEL } from "@/features/profile/labels";
import { useAprobarVerificacion, useRechazarVerificacion, useVerificacionesPendientes } from "./api";

export function VerificacionesTab() {
  const { data, isLoading } = useVerificacionesPendientes();
  const aprobar = useAprobarVerificacion();
  const rechazar = useRechazarVerificacion();
  const { notificar } = useToast();
  const [documentoAmpliado, setDocumentoAmpliado] = useState<string | null>(null);

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
        <Card key={u.id} className="transition-shadow hover:shadow-lifted">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {u.documento_identidad_archivo ? (
              esImagen(u.documento_identidad_archivo) ? (
                <button
                  onClick={() => setDocumentoAmpliado(u.documento_identidad_archivo)}
                  className="group flex h-20 w-20 flex-none items-center justify-center overflow-hidden rounded-lg border border-line bg-surface-2"
                  title="Ver documento en grande"
                >
                  <img
                    src={u.documento_identidad_archivo}
                    alt="Documento de identidad"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </button>
              ) : (
                <a
                  href={u.documento_identidad_archivo}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-20 w-20 flex-none items-center justify-center rounded-lg border border-line bg-surface-2 text-xs font-semibold text-muted hover:border-primary/50 hover:text-primary"
                  title="Abrir documento (PDF)"
                >
                  Ver PDF
                </a>
              )
            ) : (
              <div className="flex h-20 w-20 flex-none items-center justify-center rounded-lg bg-surface-2 text-xs text-muted">
                Sin doc.
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <Link to={`/usuarios/${u.id}`} className="font-semibold text-ink hover:text-primary">
                  {u.nombre_completo}
                </Link>
                <span className="text-xs text-muted">{u.email}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted">
                {TIPO_DOCUMENTO_LABEL[u.tipo_documento] ?? u.tipo_documento} · {u.numero_documento}
                {u.telefono && <> · {u.telefono}</>}
              </p>
              {u.ubicacion && (
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                  <IconLocation className="h-3.5 w-3.5 flex-none" />
                  {u.ubicacion}
                </p>
              )}
              {u.fecha_solicitud_verificacion && (
                <p className="mt-1 text-xs text-muted">Solicitado {tiempoRelativo(u.fecha_solicitud_verificacion)}</p>
              )}
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
          </div>
        </Card>
      ))}

      {documentoAmpliado && (
        <Lightbox src={documentoAmpliado} alt="Documento de identidad" onClose={() => setDocumentoAmpliado(null)} />
      )}
    </div>
  );
}
