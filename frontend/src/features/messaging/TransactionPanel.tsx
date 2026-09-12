import { useState } from "react";
import { useAuth } from "@/shared/auth/AuthContext";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { IconStar } from "@/shared/ui/icons";
import { useToast } from "@/shared/ui/Toast";
import type { Conversacion } from "@/shared/api/types";
import { useCalificar, useCompletarTransaccion, useMisTransacciones, useRegistrarVenta } from "@/features/transactions/api";

/**
 * Sin checkout: el vendedor cierra el trato y lo marca completado desde el
 * mismo chat donde negoció; el comprador califica ahí mismo. Vive junto al
 * chat porque es donde naturalmente ocurre la conversación de venta.
 */
export function TransactionPanel({ conversacion }: { conversacion: Conversacion }) {
  const { usuario } = useAuth();
  const { notificar } = useToast();
  const { data: transacciones } = useMisTransacciones();
  const registrarVenta = useRegistrarVenta();
  const completar = useCompletarTransaccion();
  const calificar = useCalificar();
  const [puntuacion, setPuntuacion] = useState(5);
  const [hoverPuntuacion, setHoverPuntuacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [yaCalificado, setYaCalificado] = useState(false);

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
            onClick={() =>
              registrarVenta.mutate(
                { publicacion: conversacion.publicacion, comprador: conversacion.comprador.id },
                { onSuccess: () => notificar("Venta registrada.") },
              )
            }
          >
            Registrar venta con {conversacion.comprador.nombre_completo}
          </Button>
        ) : transaccion.estado === "pendiente" ? (
          <Button
            variante="accent"
            className="text-xs"
            onClick={() => completar.mutate(transaccion.id, { onSuccess: () => notificar("Venta marcada como completada.") })}
          >
            Marcar venta como completada
          </Button>
        ) : (
          <Badge tono="success">Venta completada</Badge>
        )
      ) : transaccion?.estado === "completada" && !yaCalificado ? (
        <div>
          <p className="mb-2 text-xs font-semibold">¿Cómo te fue con esta compra?</p>
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5" onMouseLeave={() => setHoverPuntuacion(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onMouseEnter={() => setHoverPuntuacion(n)}
                  onClick={() => setPuntuacion(n)}
                  aria-label={`${n} estrellas`}
                  className="p-0.5"
                >
                  <IconStar
                    className={`h-[18px] w-[18px] ${
                      n <= (hoverPuntuacion || puntuacion) ? "text-accent" : "text-line"
                    }`}
                  />
                </button>
              ))}
            </div>
            <input
              className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm outline-none focus:border-primary"
              placeholder="Comentario (opcional)"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
            <Button
              className="!px-3 !py-1.5 text-xs"
              onClick={async () => {
                try {
                  await calificar.mutateAsync({ transaccion: transaccion.id, puntuacion, comentario });
                  setYaCalificado(true);
                  notificar("¡Gracias por tu calificación!");
                } catch {
                  notificar("Ya habías calificado esta transacción.", "danger");
                }
              }}
            >
              Enviar
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
