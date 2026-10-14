import type { ReactNode } from "react";
import { IconCattle, IconShieldCheck, IconWheat } from "@/shared/ui/icons";

const PUNTOS = [
  { Icono: IconShieldCheck, texto: "Vendedores con identidad verificada" },
  { Icono: IconCattle, texto: "Animales con trazabilidad sanitaria" },
  { Icono: IconWheat, texto: "Insumos y alimento balanceado en tu zona" },
];

/**
 * Panel de marca + formulario, en vez de una tarjeta centrada suelta sobre
 * el fondo — es lo primero que ve alguien nuevo en AgroMarket y debe
 * transmitir de qué se trata la plataforma, no solo pedir credenciales.
 */
export function AuthLayout({ titulo, subtitulo, children }: { titulo: string; subtitulo: string; children: ReactNode }) {
  return (
    <div className="mx-auto mt-6 max-w-4xl overflow-hidden rounded-2xl border border-line shadow-lifted sm:mt-12">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="hidden flex-col justify-between bg-primary p-8 text-primary-ink sm:flex">
          <div>
            <p className="font-display text-xl font-semibold">🌾 AgroMarket</p>
            <p className="mt-3 text-sm leading-relaxed text-primary-ink/80">
              El marketplace para comprar y vender directo con productores y proveedores
              agropecuarios verificados.
            </p>
          </div>
          <ul className="space-y-3.5">
            {PUNTOS.map(({ Icono, texto }) => (
              <li key={texto} className="flex items-center gap-2.5 text-sm">
                <Icono className="h-[18px] w-[18px] flex-none text-primary-ink/70" />
                {texto}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface p-8">
          <h1 className="mb-1 font-display text-2xl font-semibold">{titulo}</h1>
          <p className="mb-6 text-sm text-muted">{subtitulo}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
