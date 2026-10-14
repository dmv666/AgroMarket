// Origen del backend. Vacío en desarrollo: las rutas quedan relativas (/api,
// /ws) y el proxy de vite.config.ts las redirige. En producción (Vercel) el
// SPA y la API viven en dominios distintos, y Vercel no puede hacer de proxy
// para WebSockets, así que se apunta directo al backend (ver docs/DESPLIEGUE.md).
export const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL ?? "").replace(/\/+$/, "");

/** URL del WebSocket: mismo host que el backend, con ws:// o wss:// según corresponda. */
export function wsUrl(path: string): string {
  if (BACKEND_URL) {
    return BACKEND_URL.replace(/^http/, "ws") + path;
  }
  const protocolo = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocolo}//${window.location.host}${path}`;
}
