import { useEffect, useRef, useState } from "react";
import { wsUrl } from "../api/backendUrl";
import { tokenStorage } from "../auth/tokenStorage";

/**
 * WebSocket nativo hacia Channels (sin socket.io: Channels habla el
 * protocolo WS estándar). Se reutiliza en messaging (chat) y notifications
 * (campana) — la única diferencia entre ambos usos es la ruta y el handler
 * de mensajes entrantes.
 */
export function useWebSocket(path: string | null, onMessage: (data: unknown) => void) {
  const [conectado, setConectado] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!path) return;
    const token = tokenStorage.getAccess();
    if (!token) return;

    const socket = new WebSocket(`${wsUrl(path)}?token=${token}`);
    socketRef.current = socket;

    socket.onopen = () => setConectado(true);
    socket.onclose = () => setConectado(false);
    socket.onmessage = (event) => {
      try {
        onMessageRef.current(JSON.parse(event.data));
      } catch {
        // Mensaje no-JSON: se ignora, no debería ocurrir con AsyncJsonWebsocketConsumer.
      }
    };

    return () => {
      socket.close();
    };
  }, [path]);

  function enviar(data: unknown): boolean {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }

  return { conectado, enviar };
}
