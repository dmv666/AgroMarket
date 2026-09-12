from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import MeView, RegistroView, UsuarioPublicoView, VerificacionView

urlpatterns = [
    path("registro/", RegistroView.as_view(), name="registro"),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("login/refresh/", TokenRefreshView.as_view(), name="login-refresh"),
    path("me/", MeView.as_view(), name="me"),
    path("me/verificacion/", VerificacionView.as_view(), name="verificacion"),
    path("usuarios/<int:pk>/", UsuarioPublicoView.as_view(), name="usuario-publico"),
]
