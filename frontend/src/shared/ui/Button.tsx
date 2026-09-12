import type { ButtonHTMLAttributes } from "react";

type Variante = "primary" | "accent" | "ghost" | "danger";

const clasesPorVariante: Record<Variante, string> = {
  primary: "bg-primary text-primary-ink hover:brightness-110",
  accent: "bg-accent text-accent-ink hover:brightness-105",
  ghost: "bg-transparent border border-line text-ink hover:bg-surface-2",
  danger: "bg-danger text-white hover:brightness-110",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
}

export function Button({ variante = "primary", className = "", ...props }: Props) {
  return (
    <button
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${clasesPorVariante[variante]} ${className}`}
      {...props}
    />
  );
}
