import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";
import { NotificationBell } from "@/features/notifications/NotificationBell";
import { Button } from "@/shared/ui/Button";

const enlace = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-1.5 text-sm font-semibold ${isActive ? "bg-primary text-primary-ink" : "text-ink hover:bg-surface-2"}`;

export function Layout() {
  const { usuario, logout } = useAuth();

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-10 border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link to="/" className="font-display text-xl font-bold text-primary">
            🌾 Campo Directo
          </Link>
          <nav className="flex flex-1 items-center gap-1">
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
          {usuario ? (
            <div className="flex items-center gap-2">
              <NotificationBell />
              <NavLink to="/perfil" className={enlace}>
                {usuario.nombre_completo.split(" ")[0]}
              </NavLink>
              <Button variante="ghost" onClick={logout}>
                Salir
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm font-semibold text-ink">
                Ingresar
              </Link>
              <Link
                to="/registro"
                className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-accent-ink hover:brightness-105"
              >
                Registrarme
              </Link>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
