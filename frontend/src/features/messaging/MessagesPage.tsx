import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";
import { PantallaCargando } from "@/shared/ui/Spinner";
import { IconChat } from "@/shared/ui/icons";
import { useConversaciones } from "./api";
import { ChatPanel } from "./ChatPanel";

export function MessagesPage() {
  const { usuario } = useAuth();
  const { data, isLoading } = useConversaciones();
  const [params, setParams] = useSearchParams();
  const conversacionId = params.get("conversacion");

  if (isLoading) return <PantallaCargando />;

  const conversaciones = data?.results ?? [];
  const activa = conversaciones.find((c) => String(c.id) === conversacionId) ?? conversaciones[0];
  // En móvil solo cabe una vista a la vez: la lista, o la conversación
  // abierta (con un botón para volver) — como cualquier app de chat.
  // Nada de esto aplica desde `sm` hacia arriba, donde ambas conviven.
  const hayConversacionEnUrl = Boolean(conversacionId);

  return (
    <div className="grid h-[75vh] grid-cols-1 overflow-hidden rounded-2xl border border-line bg-surface shadow-soft sm:grid-cols-[300px_1fr]">
      <div className={`overflow-y-auto border-r border-line ${hayConversacionEnUrl ? "hidden sm:block" : ""}`}>
        <div className="border-b border-line px-4 py-3">
          <p className="font-display text-base font-semibold">Mensajes</p>
        </div>
        {conversaciones.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
            <IconChat className="h-6 w-6 text-line" />
            <p className="text-sm text-muted">Todavía no tienes conversaciones.</p>
            <p className="text-xs text-muted">Contacta a un vendedor desde una publicación para empezar a chatear.</p>
          </div>
        ) : (
          conversaciones.map((c) => {
            const otraParte = usuario?.id === c.comprador.id ? c.vendedor : c.comprador;
            return (
              <button
                key={c.id}
                onClick={() => setParams({ conversacion: String(c.id) })}
                className={`flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left transition-colors hover:bg-surface-2 ${
                  activa?.id === c.id ? "bg-surface-2" : ""
                }`}
              >
                <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-surface-2 font-display text-sm font-semibold text-primary">
                  {otraParte.nombre_completo.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{otraParte.nombre_completo}</p>
                  <p className="truncate text-xs text-muted">{c.ultimo_mensaje?.contenido ?? "Sin mensajes aún"}</p>
                </div>
              </button>
            );
          })
        )}
      </div>
      <div className={hayConversacionEnUrl ? "" : "hidden sm:block"}>
        {activa ? (
          <ChatPanel
            key={activa.id}
            conversacion={activa}
            onVolver={() => setParams({})}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <IconChat className="h-7 w-7 text-line" />
            <p className="text-sm text-muted">Selecciona una conversación para ver los mensajes</p>
          </div>
        )}
      </div>
    </div>
  );
}
