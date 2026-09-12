type Tono = "success" | "warning" | "danger" | "neutral";

const clasesPorTono: Record<Tono, string> = {
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
  neutral: "bg-surface-2 text-muted",
};

export function Badge({ tono = "neutral", children }: { tono?: Tono; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${clasesPorTono[tono]}`}>
      {children}
    </span>
  );
}
