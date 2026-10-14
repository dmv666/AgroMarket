// Único lugar que toca localStorage para los tokens — si mañana cambia el
// mecanismo de persistencia (p.ej. cookies httpOnly), solo se toca este archivo.
const ACCESS_KEY = "agromarket_access";
const REFRESH_KEY = "agromarket_refresh";

export const tokenStorage = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  setAccess: (access: string) => localStorage.setItem(ACCESS_KEY, access),
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};
