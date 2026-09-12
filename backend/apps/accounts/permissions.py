from rest_framework.permissions import BasePermission


class EsUsuarioVerificado(BasePermission):
    """RF01, criterio de aceptación literal: un usuario no puede publicar ni
    contactar a otro usuario si su verificación de identidad no está
    aprobada. Una sola clase, reutilizada por catalog (crear publicación) y
    messaging (iniciar conversación) — la regla vive en un solo lugar.
    """

    message = "Debes completar la verificación de identidad antes de publicar o contactar a otros usuarios."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.esta_verificado
        )
