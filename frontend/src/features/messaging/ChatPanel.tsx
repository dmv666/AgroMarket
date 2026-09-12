import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/shared/auth/AuthContext";
import { useWebSocket } from "@/shared/hooks/useWebSocket";
import type { Conversacion } from "@/shared/api/types";
import { useMensajes } from "./api";
import { TransactionPanel } from "./TransactionPanel";

export function ChatPanel({ conversacion }: { conversacion: Conversacion }) {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();
  const { data } = useMensajes(conversacion.id);
  const [texto, setTexto] = useState("");
  const finRef = useRef<HTMLDivElement>(null);

  // RF06: el WS es el canal principal — cada mensaje entrante (propio o del
  // otro participante, `enviar_mensaje()` los difunde a ambos) refresca el
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
    // Si el socket todavía se está conectando (frecuente en RNF05, conexión
    // rural lenta) no se descarta el mensaje: se deja el texto en el campo
    // para que el usuario pueda reintentar en vez de perder lo que escribió.
    if (enviar({ contenido: texto.trim() })) {
      setTexto("");
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line px-4 py-3">
        <p className="font-semibold">{otraParte.nombre_completo}</p>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
        {data?.results.map((m) => {
          const esPropio = m.remitente.id === usuario?.id;
          return (
            <div key={m.id} className={`flex ${esPropio ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${
                  esPropio ? "bg-primary text-primary-ink" : "border border-line bg-surface"
                }`}
              >
                {m.contenido}
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
