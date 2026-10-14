import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "../auth/tokenStorage";
import { BACKEND_URL } from "./backendUrl";

// Instancia única de axios para toda la app: un solo lugar inyecta el JWT y
// maneja el refresh automático (DRY — ninguna feature vuelve a escribir
// esta lógica por su cuenta).
export const apiClient = axios.create({ baseURL: `${BACKEND_URL}/api` });

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refrescando: Promise<string | null> | null = null;

async function refrescarToken(): Promise<string | null> {
  const refresh = tokenStorage.getRefresh();
  if (!refresh) return null;
  try {
    const { data } = await axios.post(`${BACKEND_URL}/api/auth/login/refresh/`, { refresh });
    tokenStorage.setAccess(data.access);
    return data.access as string;
  } catch {
    tokenStorage.clear();
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _reintentado?: boolean }) | undefined;
    if (error.response?.status === 401 && original && !original._reintentado) {
      original._reintentado = true;
      refrescando ??= refrescarToken();
      const nuevoAccess = await refrescando;
      refrescando = null;
      if (nuevoAccess) {
        original.headers.Authorization = `Bearer ${nuevoAccess}`;
        return apiClient(original);
      }
    }
    return Promise.reject(error);
  },
);
