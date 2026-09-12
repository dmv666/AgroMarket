import type { ReactNode } from "react";

export function LegalLayout({ titulo, actualizado, children }: { titulo: string; actualizado: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-[70ch] pb-16">
      <h1 className="mb-1 font-display text-3xl font-semibold text-ink">{titulo}</h1>
      <p className="mb-8 text-sm text-muted">Última actualización: {actualizado}</p>
      <div className="space-y-7 text-sm leading-relaxed text-ink [&_h2]:mb-2 [&_h2]:mt-0 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_p]:text-muted [&_li]:text-muted">
        {children}
      </div>
    </article>
  );
}

export function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section>
      <h2>{titulo}</h2>
      {children}
    </section>
  );
}
