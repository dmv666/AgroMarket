import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { apiClient } from "../api/client";
import type { Usuario } from "../api/types";
import { tokenStorage } from "./tokenStorage";

interface RegistroPayload {
  email: string;
  password: string;
  nombre_completo: string;
  telefono?: string;
  ubicacion?: string;
}

interface AuthContextValue {
  usuario: Usuario | null;
  cargando: boolean;
  login: (email: string, password: string) => Promise<void>;
  registrar: (payload: RegistroPayload) => Promise<void>;
  logout: () => void;
  refrescarUsuario: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargarUsuario = useCallback(async () => {
    if (!tokenStorage.getAccess()) {
      setUsuario(null);
      return;
    }
    try {
      const { data } = await apiClient.get<Usuario>("/auth/me/");
      setUsuario(data);
    } catch {
      tokenStorage.clear();
      setUsuario(null);
    }
  }, []);

  useEffect(() => {
    cargarUsuario().finally(() => setCargando(false));
  }, [cargarUsuario]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await apiClient.post("/auth/login/", { email, password });
      tokenStorage.set(data.access, data.refresh);
      await cargarUsuario();
    },
    [cargarUsuario],
  );

  const registrar = useCallback(
    async (payload: RegistroPayload) => {
      await apiClient.post("/auth/registro/", payload);
      await login(payload.email, payload.password);
    },
    [login],
  );

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUsuario(null);
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, registrar, logout, refrescarUsuario: cargarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
