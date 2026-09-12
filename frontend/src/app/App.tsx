import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/shared/auth/AuthContext";
import { LoginPage } from "@/features/auth/LoginPage";
import { RegisterPage } from "@/features/auth/RegisterPage";
import { CatalogPage } from "@/features/catalog/CatalogPage";
import { PublicationDetailPage } from "@/features/catalog/PublicationDetailPage";
import { PublishPage } from "@/features/catalog/PublishPage";
import { MessagesPage } from "@/features/messaging/MessagesPage";
import { ProfilePage } from "@/features/profile/ProfilePage";
import { PublicProfilePage } from "@/features/profile/PublicProfilePage";
import { AdminPage } from "@/features/admin/AdminPage";
import { TerminosPage } from "@/features/legal/TerminosPage";
import { PrivacidadPage } from "@/features/legal/PrivacidadPage";
import { CookieConsent } from "@/shared/ui/CookieConsent";
import { ThemeProvider } from "@/shared/ui/ThemeContext";
import { ToastProvider } from "@/shared/ui/Toast";
import { queryClient } from "./queryClient";
import { Layout } from "./Layout";
import { RutaAdmin, RutaProtegida } from "./RutaProtegida";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<CatalogPage />} />
                  <Route path="publicaciones/:id" element={<PublicationDetailPage />} />
                  <Route path="usuarios/:id" element={<PublicProfilePage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="registro" element={<RegisterPage />} />
                  <Route path="terminos" element={<TerminosPage />} />
                  <Route path="privacidad" element={<PrivacidadPage />} />

                  <Route element={<RutaProtegida />}>
                    <Route path="publicar" element={<PublishPage />} />
                    <Route path="mensajes" element={<MessagesPage />} />
                    <Route path="perfil" element={<ProfilePage />} />
                  </Route>

                  <Route element={<RutaAdmin />}>
                    <Route path="admin" element={<AdminPage />} />
                  </Route>
                </Route>
              </Routes>
              <CookieConsent />
            </BrowserRouter>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
