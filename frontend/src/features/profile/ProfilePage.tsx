import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Input } from "@/shared/ui/Field";
import { useMisPublicaciones } from "@/features/catalog/api";
import { CATEGORIA_LABEL, ESTADO_LABEL } from "@/features/catalog/labels";
import { useMisTransacciones } from "@/features/transactions/api";
import { useActualizarPerfil } from "./api";
import { VerificationPanel } from "./VerificationPanel";

const ESTADO_TONO = { pendiente: "warning", aprobada: "success", rechazada: "danger", suspendida: "danger" } as const;

export function ProfilePage() {
  const { usuario, refrescarUsuario } = useAuth();
  const actualizar = useActualizarPerfil();
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
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="flex flex-col gap-6">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h1 className="font-display text-xl font-semibold">Mi cuenta</h1>
            <button className="text-xs font-semibold text-primary" onClick={() => setEditando((v) => !v)}>
              {editando ? "Cancelar" : "Editar"}
            </button>
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
                Guardar cambios
              </Button>
            </form>
          ) : (
            <div className="space-y-1 text-sm">
              <p className="font-semibold">{usuario.nombre_completo}</p>
              <p className="text-muted">{usuario.email}</p>
              <p className="text-muted">{usuario.telefono || "Sin teléfono"}</p>
              <p className="text-muted">{usuario.ubicacion || "Sin ubicación"}</p>
              {usuario.total_calificaciones > 0 && (
                <p className="text-accent">
                  ★ {Number(usuario.promedio_calificacion).toFixed(1)} ({usuario.total_calificaciones} calificaciones)
                </p>
              )}
            </div>
          )}
        </Card>

        <Card>
          <VerificationPanel />
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <h2 className="mb-3 font-display text-lg font-semibold">Mis publicaciones (RF08)</h2>
          {!publicaciones || publicaciones.results.length === 0 ? (
            <p className="text-sm text-muted">Aún no has publicado nada.</p>
          ) : (
            <ul className="divide-y divide-line">
              {publicaciones.results.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                  <Link to={`/publicaciones/${p.id}`} className="font-semibold hover:text-primary">
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
            <p className="text-sm text-muted">Todavía no tienes transacciones registradas.</p>
          ) : (
            <ul className="divide-y divide-line">
              {transacciones.results.map((t) => (
                <li key={t.id} className="flex items-center justify-between py-2 text-sm">
                  <span>
                    {t.comprador.id === usuario.id ? "Compra a " : "Venta a "}
                    {t.comprador.id === usuario.id ? t.vendedor.nombre_completo : t.comprador.nombre_completo}
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
  );
}
