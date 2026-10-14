import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Tema = "light" | "dark";
const CLAVE_ALMACENAMIENTO = "agromarket-tema";

function temaInicial(): Tema {
  const guardado = localStorage.getItem(CLAVE_ALMACENAMIENTO);
  if (guardado === "light" || guardado === "dark") return guardado;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

interface ThemeContextValue {
  tema: Tema;
  alternar: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * El toggle solo fija un valor explícito en <html data-theme> + localStorage;
 * si el usuario nunca lo toca, el CSS sigue las preferencias del sistema
 * (prefers-color-scheme) sin que este contexto intervenga.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(temaInicial);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
    localStorage.setItem(CLAVE_ALMACENAMIENTO, tema);
  }, [tema]);

  const alternar = useCallback(() => {
    setTema((actual) => (actual === "dark" ? "light" : "dark"));
  }, []);

  return <ThemeContext.Provider value={{ tema, alternar }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  return ctx;
}
