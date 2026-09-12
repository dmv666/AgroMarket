import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Input } from "@/shared/ui/Field";
import { IconPackage, IconStar } from "@/shared/ui/icons";
import { useToast } from "@/shared/ui/Toast";
import { useMisPublicaciones } from "@/features/catalog/api";
import { CATEGORIA_LABEL, ESTADO_LABEL } from "@/features/catalog/labels";
import { useMisTransacciones } from "@/features/transactions/api";
import { useActualizarPerfil } from "./api";
import { VerificationPanel } from "./VerificationPanel";

const ESTADO_TONO = { pendiente: "warning", aprobada: "success", rechazada: "danger", suspendida: "danger" } as const;

export function ProfilePage() {
  const { usuario, refrescarUsuario } = useAuth();
  const actualizar = useActualizarPerfil();
  const { notificar } = useToast();
  const { data: publicaciones } = useMisPublicaciones();
  const { data: transacciones } = useMisTransacciones();
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    nombre_completo: usuario?.nombre_completo ?? "",
    telefono: usuario?.telefono ?? "",
    ubicacion: usuario?.ubicacion ?? "",
  });

  if (!usuario) return null;

  async function guardar(e: FormEvent) {
    e.preventDefault();
    await actualizar.mutateAsync(form);
    await refrescarUsuario();
    setEditando(false);
    notificar("Perfil actualizado.");
  }

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-surface-2 font-display text-2xl font-semibold text-primary">
          {usuario.nombre_completo.charAt(0)}
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold">{usuario.nombre_completo}</h1>
          <p className="text-sm text-muted">{usuario.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-6">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Datos de la cuenta</h2>
              <Button variante="ghost" className="!px-3 !py-1 text-xs" onClick={() => setEditando((v) => !v)}>
                {editando ? "Cancelar" : "Editar"}
              </Button>
            </div>

            {editando ? (
              <form onSubmit={guardar}>
                <Input
                  etiqueta="Nombre completo"
                  value={form.nombre_completo}
                  onChange={(e) => setForm((f) => ({ ...f, nombre_completo: e.target.value }))}
                />
                <Input
                  etiqueta="Teléfono"
                  value={form.telefono}
                  onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                />
                <Input
                  etiqueta="Ubicación"
                  value={form.ubicacion}
                  onChange={(e) => setForm((f) => ({ ...f, ubicacion: e.target.value }))}
                />
                <Button type="submit" disabled={actualizar.isPending}>
                  {actualizar.isPending ? "Guardando..." : "Guardar cambios"}
                </Button>
              </form>
            ) : (
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-line pb-2.5">
                  <dt className="text-muted">Teléfono</dt>
                  <dd className="font-medium text-ink">{usuario.telefono || "No registrado"}</dd>
                </div>
                <div className="flex justify-between border-b border-line pb-2.5">
                  <dt className="text-muted">Ubicación</dt>
                  <dd className="font-medium text-ink">{usuario.ubicacion || "No registrada"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Reputación</dt>
                  <dd className="flex items-center gap-1 font-medium text-ink">
                    {usuario.total_calificaciones > 0 ? (
                      <>
                        <IconStar className="h-3.5 w-3.5 text-accent" />
                        {Number(usuario.promedio_calificacion).toFixed(1)} ({usuario.total_calificaciones})
                      </>
                    ) : (
                      "Sin calificaciones aún"
                    )}
                  </dd>
                </div>
              </dl>
            )}
          </Card>

          <Card>
            <VerificationPanel />
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <h2 className="mb-3 font-display text-lg font-semibold">Mis publicaciones</h2>
            {!publicaciones || publicaciones.results.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <IconPackage className="h-8 w-8 text-muted" />
                <p className="text-sm text-muted">Aún no has publicado nada.</p>
                <Link to="/publicar" className="text-sm font-semibold text-primary underline underline-offset-2">
                  Publica tu primer producto
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {publicaciones.results.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                    <Link to={`/publicaciones/${p.id}`} className="font-medium hover:text-primary">
                      {p.titulo}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span>{CATEGORIA_LABEL[p.categoria]}</span>
                      <Badge tono={ESTADO_TONO[p.estado]}>{ESTADO_LABEL[p.estado]}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h2 className="mb-3 font-display text-lg font-semibold">Mis transacciones</h2>
            {!transacciones || transacciones.results.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted">Todavía no tienes transacciones registradas.</p>
            ) : (
              <ul className="divide-y divide-line">
                {transacciones.results.map((t) => (
                  <li key={t.id} className="flex items-center justify-between py-2.5 text-sm">
                    <span>
                      {t.comprador.id === usuario.id ? "Compra a " : "Venta a "}
                      <span className="font-medium">
                        {t.comprador.id === usuario.id ? t.vendedor.nombre_completo : t.comprador.nombre_completo}
                      </span>
                    </span>
                    <Badge tono={t.estado === "completada" ? "success" : "warning"}>
                      {t.estado === "completada" ? "Completada" : "Pendiente"}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
