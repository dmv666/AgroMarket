import { useState } from "react";
import { PublicacionesTab } from "./PublicacionesTab";
import { ReportesTab } from "./ReportesTab";
import { VerificacionesTab } from "./VerificacionesTab";
import { usePublicacionesModeracion, useReportes, useVerificacionesPendientes } from "./api";

const TABS = [
  { id: "verificaciones", label: "Verificaciones" },
  { id: "publicaciones", label: "Publicaciones" },
  { id: "reportes", label: "Reportes" },
] as const;

/**
 * Los conteos reutilizan las mismas queries que ya corre cada pestaña (misma
 * queryKey → TanStack Query las deduplica), así que mostrarlos aquí no
 * duplica peticiones al backend.
 */
function useConteos() {
  const verificaciones = useVerificacionesPendientes();
  const publicaciones = usePublicacionesModeracion("pendiente");
  const reportes = useReportes();

  return {
    verificaciones: verificaciones.data?.count,
    publicaciones: publicaciones.data?.count,
    reportes: reportes.data?.results.filter((r) => r.estado !== "resuelto").length,
  };
}

export function AdminPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("verificaciones");
  const conteos = useConteos();

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold">Panel administrativo</h1>
      <p className="mb-6 text-sm text-muted">Verificación de identidad, moderación de publicaciones y reportes de fraude.</p>

      <div className="mb-6 flex gap-1 border-b border-line">
        {TABS.map((t) => {
          const conteo = conteos[t.id];
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
                tab === t.id ? "border-primary text-primary" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {t.label}
              {!!conteo && (
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold ${
                    tab === t.id ? "bg-primary text-primary-ink" : "bg-surface-2 text-muted"
                  }`}
                >
                  {conteo}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {tab === "verificaciones" && <VerificacionesTab />}
      {tab === "publicaciones" && <PublicacionesTab />}
      {tab === "reportes" && <ReportesTab />}
    </div>
  );
}
