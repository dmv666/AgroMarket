import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Proxy /api y /ws hacia el backend: en desarrollo el SPA y la API viven en
// puertos distintos (5173 / 8000); esto evita configurar CORS+WS por separado
// para cada llamada y deja las URLs relativas en el código del cliente.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
    // Docker Desktop en Windows no siempre reenvía los eventos de cambio de
    // archivo del host al contenedor a través del bind mount — sin polling,
    // Vite se queda sirviendo versiones viejas de los archivos sin avisar.
    watch: {
      usePolling: true,
      interval: 300,
    },
    proxy: {
      // Sin changeOrigin: Django ve el Host original (localhost:5173), no
      // "backend:8000". Con changeOrigin puesto, DRF construye las URLs de
      // archivo (fotos, documento de verificación) usando ese Host interno
      // de Docker, que el navegador del usuario no puede resolver.
      "/api": {
        target: "http://backend:8000",
      },
      "/ws": {
        target: "ws://backend:8000",
        ws: true,
      },
      // Las fotos de publicaciones y documentos de verificación se sirven
      // desde aquí — mismo origen que el resto del SPA, sin líos de CORS.
      "/media": {
        target: "http://backend:8000",
      },
    },
  },
});
