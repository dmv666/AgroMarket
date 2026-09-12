import type { SVGProps } from "react";

/**
 * Set de iconos propio, trazo consistente (1.6-1.8px, redondeado) — sustituye
 * los emoji usados en el primer borrador. Un marketplace de insumos y
 * ganado necesita verse serio y confiable, no como un prototipo; emoji de
 * sistema varían de tamaño/estilo entre plataformas y no transmiten eso.
 */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconSyringe(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m18 2 4 4" />
      <path d="m17 7 2-2" />
      <path d="M12.5 6.5 20 14l-2.5 2.5L10 9" />
      <path d="m9 10-6.5 6.5a2 2 0 0 0 0 2.83l.17.17a2 2 0 0 0 2.83 0L12 13" />
      <path d="m7 12 3 3" />
      <path d="m5 14 3 3" />
    </svg>
  );
}

export function IconWheat(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 22V4" />
      <path d="M12 7 9 4M12 7l3-3" />
      <path d="M12 11 9 8m3 3 3-3" />
      <path d="M12 15 9 12m3 3 3-3" />
      <path d="M12 19 9 16m3 3 3-3" />
    </svg>
  );
}

export function IconCattle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 9c-1.5-2.5-1-5.5 1.3-6" />
      <path d="M19 9c1.5-2.5 1-5.5-1.3-6" />
      <rect x="5.5" y="8" width="13" height="10" rx="5" />
      <circle cx="9.6" cy="13" r=".6" fill="currentColor" stroke="none" />
      <circle cx="14.4" cy="13" r=".6" fill="currentColor" stroke="none" />
      <path d="M9.7 16.2c.7.6 1.9.6 2.6 0" />
      <path d="M9 8.3c1-.7 5-.7 6 0" />
    </svg>
  );
}

export function IconChat(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5.5h16v11H9l-4 3.5v-3.5H4Z" />
    </svg>
  );
}

export function IconStar(props: IconProps) {
  return (
    <svg {...base} {...props} fill="currentColor" stroke="none">
      <path d="M12 3.5 14.5 9l6 .8-4.3 4.2 1 6-5.2-2.8-5.2 2.8 1-6L3.5 9.8l6-.8Z" />
    </svg>
  );
}

export function IconStarOutline(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 14.5 9l6 .8-4.3 4.2 1 6-5.2-2.8-5.2 2.8 1-6L3.5 9.8l6-.8Z" />
    </svg>
  );
}

export function IconShieldCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 5 5.5v5c0 5 3 8.5 7 10 4-1.5 7-5 7-10v-5Z" />
      <path d="m9 12 2 2 4-4.5" />
    </svg>
  );
}

export function IconUpload(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 15V4M8 8l4-4 4 4" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

export function IconCamera(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.3" />
    </svg>
  );
}

export function IconLocation(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function IconBell(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function IconChevronLeft(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15 5 8 12l7 7" />
    </svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function IconFlag(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 21V4" />
      <path d="M6 4h12l-3 4 3 4H6" />
    </svg>
  );
}

export function IconUser(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c1.2-4 4-6 7-6s5.8 2 7 6" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12l6 6L20 6" />
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

export function IconPackage(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m3.5 8 8.5-4 8.5 4-8.5 4-8.5-4Z" />
      <path d="M3.5 8v8l8.5 4 8.5-4V8" />
      <path d="M12 12v8" />
    </svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function IconSun(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.3M12 19.2v2.3M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.3M19.2 12h2.3M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
    </svg>
  );
}

export function IconMoon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

export function IconCookie(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 12.5a8 8 0 1 1-8-8.5c0 1.7 1.3 3 3 3a3 3 0 0 0 3-3c1.2 1.4 2 3.2 2 5.2v3.3Z" />
      <circle cx="9.5" cy="13" r=".8" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="16" r=".8" fill="currentColor" stroke="none" />
      <circle cx="14" cy="11" r=".8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export const CATEGORIA_ICONOS = {
  insumo_veterinario: IconSyringe,
  alimento_balanceado: IconWheat,
  animal_genetica: IconCattle,
} as const;
