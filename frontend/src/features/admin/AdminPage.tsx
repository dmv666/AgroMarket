import { useState } from "react";
import { PublicacionesTab } from "./PublicacionesTab";
import { ReportesTab } from "./ReportesTab";
import { VerificacionesTab } from "./VerificacionesTab";

const TABS = [
  { id: "verificaciones", label: "Verificaciones (RF09)" },
  { id: "publicaciones", label: "Publicaciones (RF09)" },
  { id: "reportes", label: "Reportes (RF11)" },
] as const;

export function AdminPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("verificaciones");

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold">Panel administrativo</h1>
      <p className="mb-6 text-sm text-muted">Verificación de identidad, moderación de publicaciones y reportes de fraude.</p>

      <div className="mb-6 flex gap-1 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-semibold ${
              tab === t.id ? "border-b-2 border-primary text-primary" : "text-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "verificaciones" && <VerificacionesTab />}
      {tab === "publicaciones" && <PublicacionesTab />}
      {tab === "reportes" && <ReportesTab />}
    </div>
  );
}
