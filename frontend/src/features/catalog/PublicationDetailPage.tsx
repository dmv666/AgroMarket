import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { PantallaCargando } from "@/shared/ui/Spinner";
import { useCrearReporte } from "@/features/admin/api";
import { useIniciarConversacion } from "@/features/messaging/api";
import { usePublicacion } from "./api";
import { CATEGORIA_LABEL, ESTADO_LABEL, formatearPrecio } from "./labels";
import { DetalleFicha } from "./DetalleFicha";

export function PublicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
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
      setErrorContacto("Debes completar tu verificación de identidad antes de contactar a un vendedor (RF01).");
    }
  }

  async function reportar() {
    if (!motivoReporte.trim()) return;
    await crearReporte.mutateAsync({ motivo: motivoReporte, publicacion_reportada: publicacion!.id });
    setMostrarReporte(false);
    setMotivoReporte("");
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <div className="mb-4 flex h-72 items-center justify-center overflow-hidden rounded-xl border border-line bg-surface-2 text-7xl">
          {publicacion.imagenes[0] ? (
            <img src={publicacion.imagenes[0].archivo} alt={publicacion.titulo} className="h-full w-full object-cover" />
          ) : (
            "🌾"
          )}
        </div>
        <Badge tono="neutral">{CATEGORIA_LABEL[publicacion.categoria]}</Badge>
        {publicacion.estado !== "aprobada" && (
          <span className="ml-2">
            <Badge tono={publicacion.estado === "pendiente" ? "warning" : "danger"}>
              {ESTADO_LABEL[publicacion.estado]}
            </Badge>
          </span>
        )}
        <h1 className="mt-2 font-display text-2xl font-bold">{publicacion.titulo}</h1>
        <p className="mt-1 text-sm text-muted">{publicacion.ubicacion}</p>
        {publicacion.descripcion && <p className="mt-4 whitespace-pre-line text-ink">{publicacion.descripcion}</p>}
        {publicacion.motivo_moderacion && (
          <p className="mt-4 rounded-lg bg-danger-bg p-3 text-sm text-danger">
            Motivo de moderación: {publicacion.motivo_moderacion}
          </p>
        )}
        <DetalleFicha categoria={publicacion.categoria} detalle={publicacion.detalle} />
      </div>

      <div className="flex flex-col gap-4">
        <Card>
          <div className="mb-3 flex items-baseline justify-between">
            <span className="font-mono text-xl font-bold">{formatearPrecio(publicacion.precio)}</span>
            <span className="text-xs text-muted">{publicacion.cantidad_disponible} disponibles</span>
          </div>
          <Link to={`/usuarios/${publicacion.vendedor.id}`} className="mb-3 block">
            <p className="font-semibold">{publicacion.vendedor.nombre_completo}</p>
            {publicacion.vendedor.total_calificaciones > 0 ? (
              <p className="text-xs text-accent">
                ★ {Number(publicacion.vendedor.promedio_calificacion).toFixed(1)} ({publicacion.vendedor.total_calificaciones})
              </p>
            ) : (
              <p className="text-xs text-muted">Sin calificaciones aún</p>
            )}
            {publicacion.vendedor.estado_verificacion === "aprobado" && <Badge tono="success">✓ Verificado</Badge>}
          </Link>

          {!esDueno && usuario && (
            <Button onClick={contactar} disabled={iniciarConversacion.isPending} className="w-full">
              Contactar vendedor
            </Button>
          )}
          {!usuario && (
            <Link to="/login" className="block text-center text-sm font-semibold text-primary">
              Inicia sesión para contactar
            </Link>
          )}
          {errorContacto && <p className="mt-2 text-xs text-danger">{errorContacto}</p>}
        </Card>

        {usuario && !esDueno && (
          <Card>
            {!mostrarReporte ? (
              <button className="text-xs text-muted underline" onClick={() => setMostrarReporte(true)}>
                Reportar esta publicación
              </button>
            ) : (
              <div>
                <p className="mb-2 text-xs font-semibold">Motivo del reporte</p>
                <textarea
                  className="mb-2 w-full rounded-lg border border-line p-2 text-sm"
                  value={motivoReporte}
                  onChange={(e) => setMotivoReporte(e.target.value)}
                  placeholder="Explica brevemente qué está mal"
                />
                <Button variante="danger" onClick={reportar} className="w-full">
                  Enviar reporte
                </Button>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
