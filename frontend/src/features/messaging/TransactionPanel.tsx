import { useState } from "react";
import { useAuth } from "@/shared/auth/AuthContext";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import type { Conversacion } from "@/shared/api/types";
import { useCalificar, useCompletarTransaccion, useMisTransacciones, useRegistrarVenta } from "@/features/transactions/api";

/**
 * RF07/RF08 sin checkout: el vendedor cierra el trato y lo marca completado
 * desde el mismo chat donde negoció; el comprador califica ahí mismo. Vive
 * junto al chat porque es donde naturalmente ocurre la conversación de venta.
 */
export function TransactionPanel({ conversacion }: { conversacion: Conversacion }) {
  const { usuario } = useAuth();
  const { data: transacciones } = useMisTransacciones();
  const registrarVenta = useRegistrarVenta();
  const completar = useCompletarTransaccion();
  const calificar = useCalificar();
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);

  if (!usuario) return null;
  const esVendedor = usuario.id === conversacion.vendedor.id;

  const transaccion = transacciones?.results.find(
    (t) => t.publicacion === conversacion.publicacion && t.comprador.id === conversacion.comprador.id,
  );

  return (
    <div className="border-t border-line bg-surface-2 px-4 py-3">
      {esVendedor ? (
        !transaccion ? (
          <Button
            variante="ghost"
            className="text-xs"
            onClick={() => registrarVenta.mutate({ publicacion: conversacion.publicacion, comprador: conversacion.comprador.id })}
          >
            Registrar venta con {conversacion.comprador.nombre_completo}
          </Button>
        ) : transaccion.estado === "pendiente" ? (
          <Button variante="accent" className="text-xs" onClick={() => completar.mutate(transaccion.id)}>
            Marcar venta como completada
          </Button>
        ) : (
          <Badge tono="success">Venta completada</Badge>
        )
      ) : transaccion?.estado === "completada" ? (
        <div>
          <p className="mb-2 text-xs font-semibold">Califica esta compra (RF07)</p>
          <div className="flex items-center gap-2">
            <select
              value={puntuacion}
              onChange={(e) => setPuntuacion(Number(e.target.value))}
              className="rounded border border-line bg-surface px-2 py-1 text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {"★".repeat(n)}
                </option>
              ))}
            </select>
            <input
              className="flex-1 rounded border border-line bg-surface px-2 py-1 text-sm"
              placeholder="Comentario (opcional)"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
            <Button
              className="text-xs"
              onClick={async () => {
                setMensaje(null);
                try {
                  await calificar.mutateAsync({ transaccion: transaccion.id, puntuacion, comentario });
                  setMensaje("¡Gracias por tu calificación!");
                } catch {
                  setMensaje("Ya calificaste esta transacción.");
                }
              }}
            >
              Enviar
            </Button>
          </div>
          {mensaje && <p className="mt-1 text-xs text-muted">{mensaje}</p>}
        </div>
      ) : null}
    </div>
  );
}
