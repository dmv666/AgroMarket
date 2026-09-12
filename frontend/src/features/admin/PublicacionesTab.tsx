import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Select } from "@/shared/ui/Field";
import { CATEGORIA_LABEL } from "@/features/catalog/labels";
import { useAprobarPublicacion, usePublicacionesModeracion, useRechazarPublicacion, useSuspenderPublicacion } from "./api";

export function PublicacionesTab() {
  const [estado, setEstado] = useState("pendiente");
  const { data, isLoading } = usePublicacionesModeracion(estado);
  const aprobar = useAprobarPublicacion();
  const rechazar = useRechazarPublicacion();
  const suspender = useSuspenderPublicacion();

  function pedirMotivo(): string | undefined {
    return window.prompt("Motivo (visible para el vendedor):") ?? undefined;
  }

  return (
    <div>
      <Select etiqueta="Estado" value={estado} onChange={(e) => setEstado(e.target.value)} className="max-w-xs">
        <option value="pendiente">Pendientes</option>
        <option value="aprobada">Aprobadas</option>
        <option value="rechazada">Rechazadas</option>
        <option value="suspendida">Suspendidas</option>
      </Select>

      {isLoading ? (
        <p className="text-sm text-muted">Cargando...</p>
      ) : !data || data.results.length === 0 ? (
        <p className="text-sm text-muted">No hay publicaciones en este estado.</p>
      ) : (
        <div className="space-y-3">
          {data.results.map((p) => (
            <Card key={p.id} className="flex items-center justify-between">
              <div>
                <Link to={`/publicaciones/${p.id}`} className="font-semibold hover:text-primary">
                  {p.titulo}
                </Link>
                <p className="text-xs text-muted">
                  {CATEGORIA_LABEL[p.categoria]} · {p.vendedor.nombre_completo}
                </p>
              </div>
              <div className="flex gap-2">
                {estado !== "aprobada" && (
                  <Button className="text-xs" onClick={() => aprobar.mutate({ id: p.id })}>
                    Aprobar
                  </Button>
                )}
                {estado !== "rechazada" && (
                  <Button variante="danger" className="text-xs" onClick={() => rechazar.mutate({ id: p.id, motivo: pedirMotivo() })}>
                    Rechazar
                  </Button>
                )}
                {estado === "aprobada" && (
                  <Button variante="ghost" className="text-xs" onClick={() => suspender.mutate({ id: p.id, motivo: pedirMotivo() })}>
                    Suspender
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
