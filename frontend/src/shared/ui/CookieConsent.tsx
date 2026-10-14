import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import { IconCookie } from "./icons";

const CLAVE_ALMACENAMIENTO = "agromarket-cookies-aceptadas";

function yaDecidido() {
  try {
    return localStorage.getItem(CLAVE_ALMACENAMIENTO) === "1";
  } catch {
    return false;
  }
}

/**
 * AgroMarket no usa cookies de rastreo ni publicidad — solo
 * almacenamiento local para la sesión (token) y preferencias (tema). El
 * aviso es honesto sobre eso en vez de simular un selector de categorías
 * que no tendría nada real que activar o desactivar.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(() => !yaDecidido());

  if (!visible) return null;

  function aceptar() {
    try {
      localStorage.setItem(CLAVE_ALMACENAMIENTO, "1");
    } catch {
      /* almacenamiento no disponible (modo privado) — no bloquea el uso del sitio */
    }
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 animate-fade-in border-t border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex gap-3">
          <IconCookie className="mt-0.5 h-5 w-5 flex-none text-accent" />
          <p className="text-sm text-muted">
            Usamos almacenamiento local para mantener tu sesión iniciada y recordar tus preferencias. No usamos
            cookies de rastreo ni publicidad de terceros.{" "}
            <Link to="/privacidad" className="font-medium text-ink underline underline-offset-2 hover:text-primary">
              Más información
            </Link>
          </p>
        </div>
        <Button onClick={aceptar} className="w-full flex-none sm:w-auto">
          Entendido
        </Button>
      </div>
    </div>
  );
}
