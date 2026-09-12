import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";
import { PantallaCargando } from "@/shared/ui/Spinner";
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

  return (
    <div className="grid h-[70vh] grid-cols-[280px_1fr] overflow-hidden rounded-xl border border-line bg-surface">
      <div className="overflow-y-auto border-r border-line">
        {conversaciones.length === 0 ? (
          <p className="p-4 text-sm text-muted">
            Todavía no tienes conversaciones. Contacta a un vendedor desde una publicación.
          </p>
        ) : (
          conversaciones.map((c) => {
            const otraParte = usuario?.id === c.comprador.id ? c.vendedor : c.comprador;
            return (
              <button
                key={c.id}
                onClick={() => setParams({ conversacion: String(c.id) })}
                className={`block w-full border-b border-line px-4 py-3 text-left text-sm hover:bg-surface-2 ${
                  activa?.id === c.id ? "bg-surface-2" : ""
                }`}
              >
                <p className="font-semibold">{otraParte.nombre_completo}</p>
                <p className="truncate text-xs text-muted">{c.ultimo_mensaje?.contenido ?? "Sin mensajes aún"}</p>
              </button>
            );
          })
        )}
      </div>
      <div>
        {activa ? (
          <ChatPanel key={activa.id} conversacion={activa} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            Selecciona una conversación
          </div>
        )}
      </div>
    </div>
  );
}
