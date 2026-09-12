import pytest
from rest_framework.test import APIClient

from apps.accounts.models import Usuario
from apps.catalog.models import Publicacion


def _admin():
    return Usuario.objects.create_superuser(
        email="admin@test.co", password="claveSegura123", nombre_completo="Admin"
    )


def _publicacion_aprobada():
    vendedor = Usuario.objects.create_user(
        email="vendedor@test.co",
        password="claveSegura123",
        nombre_completo="Vendedor",
        estado_verificacion=Usuario.EstadoVerificacion.APROBADO,
    )
    return Publicacion.objects.create(
        vendedor=vendedor,
        categoria=Publicacion.Categoria.INSUMO_VETERINARIO,
        titulo="Vacuna",
        precio="1000",
        ubicacion="Meta",
        estado=Publicacion.Estado.APROBADA,
    )


@pytest.mark.django_db
class TestSuspensionInmediataRF09:
    """RF09: 'Una publicación suspendida por el administrador deja de ser
    visible para los demás usuarios de forma inmediata.'"""

    def test_suspender_la_quita_del_catalogo_publico(self):
        publicacion = _publicacion_aprobada()
        client = APIClient()
        client.force_authenticate(_admin())

        respuesta = client.post(
            f"/api/moderation/publicaciones/{publicacion.id}/suspender/",
            {"motivo": "Sospecha de fraude"},
            format="json",
        )
        assert respuesta.status_code == 200

        catalogo = APIClient().get("/api/catalog/publicaciones/")
        assert catalogo.data["count"] == 0

    def test_solo_administrador_puede_suspender(self):
        publicacion = _publicacion_aprobada()
        no_admin = Usuario.objects.create_user(
            email="otro@test.co", password="claveSegura123", nombre_completo="Otro"
        )
        client = APIClient()
        client.force_authenticate(no_admin)

        respuesta = client.post(f"/api/moderation/publicaciones/{publicacion.id}/suspender/", {}, format="json")

        assert respuesta.status_code == 403
