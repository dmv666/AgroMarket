import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const clasesBase =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-primary";

function Etiqueta({ children }: { children: ReactNode }) {
  return <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">{children}</label>;
}

interface CampoProps {
  etiqueta: string;
  error?: string;
}

export function Input({ etiqueta, error, ...props }: CampoProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="mb-4">
      <Etiqueta>{etiqueta}</Etiqueta>
      <input className={clasesBase} {...props} />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

export function Textarea({ etiqueta, error, ...props }: CampoProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="mb-4">
      <Etiqueta>{etiqueta}</Etiqueta>
      <textarea className={`${clasesBase} min-h-24 resize-y`} {...props} />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

export function Select({
  etiqueta,
  error,
  children,
  ...props
}: CampoProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="mb-4">
      <Etiqueta>{etiqueta}</Etiqueta>
      <select className={clasesBase} {...props}>
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
