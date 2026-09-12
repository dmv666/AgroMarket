export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-5 w-5 animate-spin rounded-full border-2 border-line border-t-primary ${className}`}
      role="status"
      aria-label="Cargando"
    />
  );
}

export function PantallaCargando() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
