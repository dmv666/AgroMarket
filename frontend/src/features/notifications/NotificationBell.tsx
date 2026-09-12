import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/shared/auth/AuthContext";
import { useWebSocket } from "@/shared/hooks/useWebSocket";
import { useMarcarNotificacionesLeidas, useNotificaciones } from "./api";

export function NotificationBell() {
  const { usuario } = useAuth();
  const [abierto, setAbierto] = useState(false);
  const queryClient = useQueryClient();
  const { data } = useNotificaciones();
  const marcarLeidas = useMarcarNotificacionesLeidas();

  // RF10: cada notificación nueva llega por este socket personal
  // (grupo `user_<id>` en el backend) — al recibir una, basta con
  // invalidar la lista para que se re-consulte y quede al día.
  useWebSocket(usuario ? "/ws/notificaciones/" : null, () => {
    queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
  });

  if (!usuario) return null;

  const noLeidas = data?.results.filter((n) => !n.leida).length ?? 0;

  return (
    <div className="relative">
      <button
        onClick={() => {
          setAbierto((v) => !v);
          if (noLeidas > 0) marcarLeidas.mutate();
        }}
        className="relative rounded-full p-2 hover:bg-surface-2"
        aria-label="Notificaciones"
      >
        🔔
        {noLeidas > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-ink">
            {noLeidas}
          </span>
        )}
      </button>
      {abierto && (
        <div className="absolute right-0 z-20 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg border border-line bg-surface shadow-lg">
          {!data || data.results.length === 0 ? (
            <p className="p-4 text-sm text-muted">Sin notificaciones todavía.</p>
          ) : (
            data.results.map((n) => (
              <div key={n.id} className="border-b border-line px-4 py-3 text-sm last:border-0">
                <p className="text-ink">{n.contenido}</p>
                <p className="mt-1 text-xs text-muted">{new Date(n.creado_en).toLocaleString("es-CO")}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
