import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";
import { NotificationBell } from "@/features/notifications/NotificationBell";
import { IconClose, IconMenu } from "@/shared/ui/icons";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";

const enlace = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive ? "bg-surface-2 text-ink" : "text-muted hover:text-ink"
  }`;

const enlaceMovil = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2.5 text-base font-medium ${isActive ? "bg-surface-2 text-ink" : "text-ink"}`;

export function Layout() {
  const { usuario, logout } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation();

  useEffect(() => setMenuAbierto(false), [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="sticky top-0 z-10 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-5 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-1.5 font-display text-lg font-semibold text-primary">
            🌾 AgroMarket
          </Link>
          <nav className="hidden flex-1 items-center gap-1 md:flex">
            <NavLink to="/" end className={enlace}>
              Inicio
            </NavLink>
            {usuario && (
              <>
                <NavLink to="/publicar" className={enlace}>
                  Publicar
                </NavLink>
                <NavLink to="/mensajes" className={enlace}>
                  Mensajes
                </NavLink>
                {usuario.es_administrador && (
                  <NavLink to="/admin" className={enlace}>
                    Panel admin
                  </NavLink>
                )}
              </>
            )}
          </nav>

          <div className="ml-auto hidden items-center gap-1 md:flex">
            <ThemeToggle />
            {usuario ? (
              <>
                <NotificationBell />
                <Link
                  to="/perfil"
                  className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 font-display text-sm font-semibold text-primary hover:ring-2 hover:ring-primary/20"
                  title={usuario.nombre_completo}
                >
                  {usuario.nombre_completo.charAt(0)}
                </Link>
                <button
                  onClick={logout}
                  className="ml-1 rounded-lg px-3 py-1.5 text-sm font-medium text-muted hover:bg-surface-2 hover:text-ink"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-ink">
                  Ingresar
                </Link>
                <Link
                  to="/registro"
                  className="rounded-lg bg-accent px-3.5 py-1.5 text-sm font-semibold text-accent-ink hover:brightness-105"
                >
                  Registrarme
                </Link>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-1 md:hidden">
            <ThemeToggle />
            {usuario && <NotificationBell />}
            <button
              onClick={() => setMenuAbierto((v) => !v)}
              className="rounded-lg p-2 text-ink hover:bg-surface-2"
              aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            >
              {menuAbierto ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuAbierto && (
          <nav className="border-t border-line px-4 pb-4 pt-2 md:hidden">
            <NavLink to="/" end className={enlaceMovil}>
              Inicio
            </NavLink>
            {usuario ? (
              <>
                <NavLink to="/publicar" className={enlaceMovil}>
                  Publicar
                </NavLink>
                <NavLink to="/mensajes" className={enlaceMovil}>
                  Mensajes
                </NavLink>
                <NavLink to="/perfil" className={enlaceMovil}>
                  Mi perfil
                </NavLink>
                {usuario.es_administrador && (
                  <NavLink to="/admin" className={enlaceMovil}>
                    Panel admin
                  </NavLink>
                )}
                <button onClick={logout} className="mt-1 block w-full rounded-lg px-3 py-2.5 text-left text-base font-medium text-danger">
                  Salir
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={enlaceMovil}>
                  Ingresar
                </NavLink>
                <NavLink to="/registro" className={enlaceMovil}>
                  Registrarme
                </NavLink>
              </>
            )}
          </nav>
        )}
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-6 text-xs text-muted sm:flex-row sm:justify-between sm:px-6">
          <p>© 2026 AgroMarket — proyecto académico, Politécnico Grancolombiano.</p>
          <div className="flex gap-4">
            <Link to="/terminos" className="hover:text-ink">
              Términos y condiciones
            </Link>
            <Link to="/privacidad" className="hover:text-ink">
              Privacidad
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
