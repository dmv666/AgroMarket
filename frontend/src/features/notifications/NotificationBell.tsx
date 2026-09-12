import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/shared/auth/AuthContext";
import { useWebSocket } from "@/shared/hooks/useWebSocket";
import { tiempoRelativo } from "@/shared/lib/tiempoRelativo";
import { IconBell, IconChat, IconCheck, IconClose, IconFlag, IconStar } from "@/shared/ui/icons";
import type { TipoNotificacion } from "@/shared/api/types";
import { useMarcarNotificacionesLeidas, useNotificaciones } from "./api";

const ICONO_POR_TIPO: Record<TipoNotificacion, typeof IconChat> = {
  mensaje: IconChat,
  publicacion_aprobada: IconCheck,
  publicacion_rechazada: IconClose,
  publicacion_reportada: IconFlag,
  calificacion_recibida: IconStar,
  verificacion_aprobada: IconCheck,
  verificacion_rechazada: IconClose,
};

export function NotificationBell() {
  const { usuario } = useAuth();
  const [abierto, setAbierto] = useState(false);
  const queryClient = useQueryClient();
  const { data } = useNotificaciones();
  const marcarLeidas = useMarcarNotificacionesLeidas();

  // Cada notificación nueva llega por este socket personal (grupo
  // `user_<id>` en el backend) — al recibir una, basta con invalidar la
  // lista para que se re-consulte y quede al día.
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
        className="relative rounded-full p-2 text-ink hover:bg-surface-2"
        aria-label="Notificaciones"
      >
        <IconBell className="h-5 w-5" />
        {noLeidas > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-ink">
            {noLeidas}
          </span>
        )}
      </button>
      {abierto && (
        <>
          <button className="fixed inset-0 z-10 cursor-default" aria-hidden onClick={() => setAbierto(false)} />
          <div className="absolute right-0 z-20 mt-2 max-h-96 w-80 overflow-y-auto rounded-xl border border-line bg-surface shadow-lifted">
            <div className="border-b border-line px-4 py-2.5">
              <p className="text-sm font-semibold">Notificaciones</p>
            </div>
            {!data || data.results.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <IconBell className="h-6 w-6 text-line" />
                <p className="text-sm text-muted">Todo tranquilo por aquí.</p>
              </div>
            ) : (
              data.results.map((n) => {
                const Icono = ICONO_POR_TIPO[n.tipo];
                return (
                  <div key={n.id} className="flex gap-2.5 border-b border-line px-4 py-3 text-sm last:border-0">
                    <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-surface-2 text-muted">
                      <Icono className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-ink">{n.contenido}</p>
                      <p className="mt-0.5 text-xs text-muted">{tiempoRelativo(n.creado_en)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
