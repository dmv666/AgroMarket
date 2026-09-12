from rest_framework.permissions import SAFE_METHODS, BasePermission


class EsPropietario(BasePermission):
    """Solo el dueño del objeto puede modificarlo/eliminarlo; lectura abierta
    a quien ya tenga permiso de ver la vista. Se reutiliza en catalog,
    messaging y transactions en vez de reescribir la misma comparación.
    """

    owner_field = "usuario_id"

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        owner_id = getattr(obj, self.owner_field, None)
        return owner_id == request.user.id


class EsAdministrador(BasePermission):
    """Puerta de acceso al panel administrativo (RF09, RF11)."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.es_administrador
        )
