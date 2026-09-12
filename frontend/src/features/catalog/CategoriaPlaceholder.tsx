import type { Categoria } from "@/shared/api/types";
import { CATEGORIA_ICONOS } from "@/shared/ui/icons";
import { CATEGORIA_COLOR } from "./labels";

/**
 * Se muestra mientras una publicación no tiene fotos propias todavía —
 * a propósito distinto por categoría (color + icono), para que una ficha
 * sin imagen se lea como "sin foto por ahora", no como un error de carga.
 */
export function CategoriaPlaceholder({ categoria, className = "" }: { categoria: Categoria; className?: string }) {
  const Icono = CATEGORIA_ICONOS[categoria];
  const color = CATEGORIA_COLOR[categoria];

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        color: color.texto,
        background: `linear-gradient(160deg, ${color.fondo}, color-mix(in srgb, ${color.fondo} 55%, white))`,
      }}
    >
      <Icono className="h-[34%] w-[34%] max-h-20 max-w-20" strokeWidth={1.3} />
    </div>
  );
}
