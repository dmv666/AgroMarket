import { IconMoon, IconSun } from "./icons";
import { useTheme } from "./ThemeContext";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { tema, alternar } = useTheme();
  const esOscuro = tema === "dark";

  return (
    <button
      onClick={alternar}
      className={`rounded-lg p-2 text-muted transition-colors hover:bg-surface-2 hover:text-ink ${className}`}
      aria-label={esOscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={esOscuro ? "Modo claro" : "Modo oscuro"}
    >
      {esOscuro ? <IconSun className="h-[18px] w-[18px]" /> : <IconMoon className="h-[18px] w-[18px]" />}
    </button>
  );
}
