import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { PantallaCargando } from "@/shared/ui/Spinner";
import { IconChevronLeft, IconFlag, IconShieldCheck, IconStar } from "@/shared/ui/icons";
import { useToast } from "@/shared/ui/Toast";
import { useCrearReporte } from "@/features/admin/api";
import { useIniciarConversacion } from "@/features/messaging/api";
import { usePublicacion } from "./api";
import { CATEGORIA_LABEL, ESTADO_LABEL, formatearPrecio } from "./labels";
import { DetalleFicha } from "./DetalleFicha";
import { Gallery } from "./Gallery";

export function PublicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { notificar } = useToast();
  const { data: publicacion, isLoading } = usePublicacion(id!);
  const iniciarConversacion = useIniciarConversacion();
  const crearReporte = useCrearReporte();
  const [mostrarReporte, setMostrarReporte] = useState(false);
  const [motivoReporte, setMotivoReporte] = useState("");
  const [errorContacto, setErrorContacto] = useState<string | null>(null);

  if (isLoading) return <PantallaCargando />;
  if (!publicacion) return <p>No se encontró la publicación.</p>;

  const esDueno = usuario?.id === publicacion.vendedor.id;

  async function contactar() {
    setErrorContacto(null);
    try {
      const conversacion = await iniciarConversacion.mutateAsync(publicacion!.id);
      navigate(`/mensajes?conversacion=${conversacion.id}`);
    } catch {
      setErrorContacto("Debes completar tu verificación de identidad antes de contactar a un vendedor.");
    }
  }

  async function reportar() {
    if (!motivoReporte.trim()) return;
    await crearReporte.mutateAsync({ motivo: motivoReporte, publicacion_reportada: publicacion!.id });
    setMostrarReporte(false);
    setMotivoReporte("");
    notificar("Reporte enviado. Un administrador lo revisará.");
  }

  return (
    <div>
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <IconChevronLeft className="h-4 w-4" /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge tono="neutral">{CATEGORIA_LABEL[publicacion.categoria]}</Badge>
            {publicacion.estado !== "aprobada" && (
              <Badge tono={publicacion.estado === "pendiente" ? "warning" : "danger"}>
                {ESTADO_LABEL[publicacion.estado]}
              </Badge>
            )}
          </div>
          <h1 className="font-display text-3xl font-semibold leading-tight text-ink">{publicacion.titulo}</h1>
          <p className="mt-1.5 text-sm text-muted">{publicacion.ubicacion}</p>

          <div className="mt-5">
            <Gallery imagenes={publicacion.imagenes} categoria={publicacion.categoria} titulo={publicacion.titulo} />
          </div>

          {publicacion.motivo_moderacion && (
            <p className="mt-5 rounded-lg bg-danger-bg p-3 text-sm text-danger">
              Motivo de moderación: {publicacion.motivo_moderacion}
            </p>
          )}

          {publicacion.descripcion && (
            <p className="mt-6 max-w-prose whitespace-pre-line leading-relaxed text-ink">{publicacion.descripcion}</p>
          )}

          <div className="mt-6 border-t border-line pt-6">
            <h2 className="mb-3 font-display text-lg font-semibold">Detalles</h2>
            <DetalleFicha categoria={publicacion.categoria} detalle={publicacion.detalle} />
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:sticky lg:top-20">
          <Card>
            <div className="mb-4 flex items-baseline justify-between">
              <span className="font-display text-2xl font-semibold">{formatearPrecio(publicacion.precio)}</span>
              <span className="text-xs text-muted">{publicacion.cantidad_disponible} disponibles</span>
            </div>

            <Link to={`/usuarios/${publicacion.vendedor.id}`} className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-surface-2 font-display text-lg font-semibold text-primary">
                {publicacion.vendedor.nombre_completo.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{publicacion.vendedor.nombre_completo}</p>
                {publicacion.vendedor.total_calificaciones > 0 ? (
                  <p className="flex items-center gap-1 text-xs text-accent">
                    <IconStar className="h-3 w-3" />
                    {Number(publicacion.vendedor.promedio_calificacion).toFixed(1)} ({publicacion.vendedor.total_calificaciones})
                  </p>
                ) : (
                  <p className="text-xs text-muted">Sin calificaciones aún</p>
                )}
              </div>
            </Link>

            {publicacion.vendedor.estado_verificacion === "aprobado" && (
              <div className="mb-4 flex items-center gap-1.5 text-xs font-medium text-success">
                <IconShieldCheck className="h-4 w-4" /> Identidad verificada
              </div>
            )}

            {esDueno ? (
              <p className="rounded-lg bg-surface-2 px-3 py-2.5 text-center text-xs text-muted">
                Esta es tu publicación
              </p>
            ) : usuario ? (
              <Button onClick={contactar} disabled={iniciarConversacion.isPending} className="w-full">
                {iniciarConversacion.isPending ? "Abriendo chat..." : "Contactar vendedor"}
              </Button>
            ) : (
              <Link
                to="/login"
                className="block w-full rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-ink"
              >
                Inicia sesión para contactar
              </Link>
            )}
            {errorContacto && <p className="mt-2 text-xs text-danger">{errorContacto}</p>}
          </Card>

          {usuario && !esDueno && (
            <div>
              {!mostrarReporte ? (
                <button
                  className="flex items-center gap-1.5 text-xs text-muted hover:text-danger"
                  onClick={() => setMostrarReporte(true)}
                >
                  <IconFlag className="h-3.5 w-3.5" /> Reportar esta publicación
                </button>
              ) : (
                <Card>
                  <p className="mb-2 text-xs font-semibold">Motivo del reporte</p>
                  <textarea
                    className="mb-2 w-full rounded-lg border border-line p-2 text-sm outline-none focus:border-primary"
                    value={motivoReporte}
                    onChange={(e) => setMotivoReporte(e.target.value)}
                    placeholder="Explica brevemente qué está mal"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button variante="danger" onClick={reportar} className="flex-1">
                      Enviar reporte
                    </Button>
                    <Button variante="ghost" onClick={() => setMostrarReporte(false)}>
                      Cancelar
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
