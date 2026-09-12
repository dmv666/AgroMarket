from rest_framework import generics, permissions
from rest_framework.parsers import FormParser, MultiPartParser

from .models import Usuario
from .serializers import (
    RegistroSerializer,
    UsuarioPublicoSerializer,
    UsuarioSerializer,
    VerificacionSerializer,
)


class RegistroView(generics.CreateAPIView):
    """RF01 — alta de cuenta. Queda en estado_verificacion=pendiente por
    defecto (ver Usuario.EstadoVerificacion); no puede publicar ni contactar
    hasta que un administrador la apruebe (apps.moderation)."""

    queryset = Usuario.objects.all()
    serializer_class = RegistroSerializer
    permission_classes = [permissions.AllowAny]


class MeView(generics.RetrieveUpdateAPIView):
    """RF08 — el usuario consulta y edita su propia información."""

    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class VerificacionView(generics.UpdateAPIView):
    """RF01 — el usuario envía/reenvía su documento de identidad."""

    serializer_class = VerificacionSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return self.request.user


class UsuarioPublicoView(generics.RetrieveAPIView):
    """Perfil público de vendedor con su reputación (RF07). Abierto a
    cualquiera (RNF02 ya está resuelto a nivel de serializer: no expone
    datos de contacto ni de verificación privados)."""

    queryset = Usuario.objects.all()
    serializer_class = UsuarioPublicoSerializer
    permission_classes = [permissions.AllowAny]
