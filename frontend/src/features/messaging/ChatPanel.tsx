import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";
import { useWebSocket } from "@/shared/hooks/useWebSocket";
import { usePublicacion } from "@/features/catalog/api";
import { IconChevronLeft } from "@/shared/ui/icons";
import type { Conversacion } from "@/shared/api/types";
import { useMensajes } from "./api";
import { TransactionPanel } from "./TransactionPanel";

export function ChatPanel({ conversacion, onVolver }: { conversacion: Conversacion; onVolver: () => void }) {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();
  const { data } = useMensajes(conversacion.id);
  const { data: publicacion } = usePublicacion(conversacion.publicacion);
  const [texto, setTexto] = useState("");
  const finRef = useRef<HTMLDivElement>(null);

  // El WS es el canal principal — cada mensaje entrante (propio o del otro
  // participante, `enviar_mensaje()` los difunde a ambos) refresca el
  // historial en vez de mantener un estado paralelo en memoria.
  const { enviar, conectado } = useWebSocket(`/ws/chat/${conversacion.id}/`, () => {
    queryClient.invalidateQueries({ queryKey: ["mensajes", conversacion.id] });
  });

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.results.length]);

  const otraParte = usuario?.id === conversacion.comprador.id ? conversacion.vendedor : conversacion.comprador;

  function enviarMensaje() {
    if (!texto.trim()) return;
    // Si el socket todavía se está conectando (conexión rural lenta) no se
    // descarta el mensaje: se deja el texto en el campo para que el
    // usuario pueda reintentar en vez de perder lo que escribió.
    if (enviar({ contenido: texto.trim() })) {
      setTexto("");
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <button onClick={onVolver} className="-ml-1 rounded-lg p-1 text-muted hover:bg-surface-2 sm:hidden" aria-label="Volver a la lista">
          <IconChevronLeft className="h-5 w-5" />
        </button>
        <Link
          to={`/usuarios/${otraParte.id}`}
          className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-surface-2 font-display text-sm font-semibold text-primary"
        >
          {otraParte.nombre_completo.charAt(0)}
        </Link>
        <div className="min-w-0">
          <Link to={`/usuarios/${otraParte.id}`} className="truncate text-sm font-semibold text-ink hover:text-primary">
            {otraParte.nombre_completo}
          </Link>
          {publicacion && (
            <Link to={`/publicaciones/${publicacion.id}`} className="block truncate text-xs text-muted hover:text-primary">
              Sobre: {publicacion.titulo}
            </Link>
          )}
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
        {data?.results.map((m) => {
          const esPropio = m.remitente.id === usuario?.id;
          return (
            <div key={m.id} className={`flex ${esPropio ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-2xl px-3.5 py-2 text-sm ${
                  esPropio ? "bg-primary text-primary-ink" : "border border-line bg-surface"
                }`}
              >
                {m.contenido}
                <span className={`mt-0.5 block text-right text-[10px] ${esPropio ? "text-primary-ink/60" : "text-muted"}`}>
                  {new Date(m.creado_en).toLocaleTimeString("es-CO", { hour: "numeric", minute: "2-digit" })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={finRef} />
      </div>
      <TransactionPanel conversacion={conversacion} />
      <form
        className="flex gap-2 border-t border-line p-3"
        onSubmit={(e) => {
          e.preventDefault();
          enviarMensaje();
        }}
      >
        <input
          className="flex-1 rounded-full border border-line px-4 py-2 text-sm outline-none focus:border-primary"
          placeholder={conectado ? "Escribe un mensaje..." : "Conectando..."}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <button
          type="submit"
          disabled={!conectado}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-ink disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
