import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Select } from "@/shared/ui/Field";
import { IconLocation } from "@/shared/ui/icons";
import { useToast } from "@/shared/ui/Toast";
import { tiempoRelativo } from "@/shared/lib/tiempoRelativo";
import { CategoriaPlaceholder } from "@/features/catalog/CategoriaPlaceholder";
import { CATEGORIA_LABEL } from "@/features/catalog/labels";
import { useAprobarPublicacion, usePublicacionesModeracion, useRechazarPublicacion, useSuspenderPublicacion } from "./api";

const formatoPrecio = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

type Accion = "rechazar" | "suspender";

export function PublicacionesTab() {
  const [estado, setEstado] = useState("pendiente");
  const { data, isLoading } = usePublicacionesModeracion(estado);
  const aprobar = useAprobarPublicacion();
  const rechazar = useRechazarPublicacion();
  const suspender = useSuspenderPublicacion();
  const { notificar } = useToast();
  const [pendiente, setPendiente] = useState<{ id: number; accion: Accion } | null>(null);
  const [motivo, setMotivo] = useState("");

  function confirmarAccion() {
    if (!pendiente) return;
    const mutation = pendiente.accion === "rechazar" ? rechazar : suspender;
    mutation.mutate(
      { id: pendiente.id, motivo },
      { onSuccess: () => notificar(pendiente.accion === "rechazar" ? "Publicación rechazada." : "Publicación suspendida.") },
    );
    setPendiente(null);
    setMotivo("");
  }

  return (
    <div>
      <div className="mb-5 max-w-xs">
        <Select etiqueta="Estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="pendiente">Pendientes</option>
          <option value="aprobada">Aprobadas</option>
          <option value="rechazada">Rechazadas</option>
          <option value="suspendida">Suspendidas</option>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted">Cargando...</p>
      ) : !data || data.results.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">No hay publicaciones en este estado.</p>
      ) : (
        <div className="space-y-3">
          {data.results.map((p) => (
            <Card key={p.id} className="transition-shadow hover:shadow-lifted">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 flex-none overflow-hidden rounded-lg">
                  {p.imagenes[0] ? (
                    <img src={p.imagenes[0].archivo} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <CategoriaPlaceholder categoria={p.categoria} className="h-full w-full" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <Link to={`/publicaciones/${p.id}`} className="font-semibold hover:text-primary">
                      {p.titulo}
                    </Link>
                    <span className="font-display text-sm font-semibold text-accent">
                      {formatoPrecio.format(Number(p.precio))}
                    </span>
                  </div>
                  <p className="text-xs text-muted">
                    {CATEGORIA_LABEL[p.categoria]} · {p.vendedor.nombre_completo}
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted">
                    {p.ubicacion && (
                      <span className="flex items-center gap-1">
                        <IconLocation className="h-3.5 w-3.5 flex-none" />
                        {p.ubicacion}
                      </span>
                    )}
                    <span>Publicado {tiempoRelativo(p.creado_en)}</span>
                  </p>
                  {p.motivo_moderacion && (
                    <p className="mt-1 text-xs text-danger">Motivo previo: {p.motivo_moderacion}</p>
                  )}
                </div>
                <div className="flex flex-none gap-2">
                  {estado !== "aprobada" && (
                    <Button
                      className="text-xs"
                      onClick={() => aprobar.mutate({ id: p.id }, { onSuccess: () => notificar("Publicación aprobada.") })}
                    >
                      Aprobar
                    </Button>
                  )}
                  {estado !== "rechazada" && (
                    <Button variante="danger" className="text-xs" onClick={() => setPendiente({ id: p.id, accion: "rechazar" })}>
                      Rechazar
                    </Button>
                  )}
                  {estado === "aprobada" && (
                    <Button variante="ghost" className="text-xs" onClick={() => setPendiente({ id: p.id, accion: "suspender" })}>
                      Suspender
                    </Button>
                  )}
                </div>
              </div>

              {pendiente?.id === p.id && (
                <div className="mt-3 border-t border-line pt-3">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                    Motivo (lo verá el vendedor)
                  </label>
                  <textarea
                    autoFocus
                    className="mb-2 w-full rounded-lg border border-line p-2 text-sm outline-none focus:border-primary"
                    rows={2}
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder={pendiente.accion === "rechazar" ? "Ej. faltan datos de sanidad" : "Ej. reporte confirmado de fraude"}
                  />
                  <div className="flex gap-2">
                    <Button variante="danger" className="text-xs" onClick={confirmarAccion}>
                      Confirmar {pendiente.accion === "rechazar" ? "rechazo" : "suspensión"}
                    </Button>
                    <Button variante="ghost" className="text-xs" onClick={() => setPendiente(null)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
