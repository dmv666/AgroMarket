import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";
import { PantallaCargando } from "@/shared/ui/Spinner";

export function RutaProtegida() {
  const { usuario, cargando } = useAuth();
  if (cargando) return <PantallaCargando />;
  if (!usuario) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function RutaAdmin() {
  const { usuario, cargando } = useAuth();
  if (cargando) return <PantallaCargando />;
  if (!usuario) return <Navigate to="/login" replace />;
  if (!usuario.es_administrador) return <Navigate to="/" replace />;
  return <Outlet />;
}
