import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { IconCheck, IconClose } from "./icons";

interface ToastItem {
  id: number;
  mensaje: string;
  tono: "success" | "danger";
}

interface ToastContextValue {
  notificar: (mensaje: string, tono?: "success" | "danger") => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let contador = 0;

/**
 * Confirmación visible para cualquier acción que antes fallaba en
 * silencio (enviar verificación, publicar, reportar...). Sin esto, un
 * envío exitoso y uno fallido se veían exactamente igual: nada cambiaba
 * en pantalla.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const notificar = useCallback((mensaje: string, tono: "success" | "danger" = "success") => {
    const id = ++contador;
    setItems((prev) => [...prev, { id, mensaje, tono }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 4200);
  }, []);

  return (
    <ToastContext.Provider value={{ notificar }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex flex-col items-center gap-2 px-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-medium shadow-lg animate-toast-in ${
              item.tono === "success" ? "bg-ink text-bg" : "bg-danger text-white"
            }`}
          >
            {item.tono === "success" ? (
              <IconCheck className="h-4 w-4 flex-none" />
            ) : (
              <IconClose className="h-4 w-4 flex-none" />
            )}
            {item.mensaje}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}
