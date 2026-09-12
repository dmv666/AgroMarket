import pytest
from rest_framework.test import APIClient

from .models import Usuario


@pytest.mark.django_db
class TestGateDeVerificacionRF01:
    """RF01: 'Un usuario no puede publicar ni contactar a otro usuario si su
    proceso de verificación de identidad no ha sido aprobado por el sistema.'"""

    def _usuario(self, email, estado=Usuario.EstadoVerificacion.PENDIENTE):
        return Usuario.objects.create_user(
            email=email, password="claveSegura123", nombre_completo="Test", estado_verificacion=estado
        )

    def test_usuario_no_verificado_no_puede_publicar(self):
        usuario = self._usuario("pendiente@test.co")
        client = APIClient()
        client.force_authenticate(usuario)

        respuesta = client.post(
            "/api/catalog/publicaciones/",
            {
                "categoria": "insumo_veterinario",
                "titulo": "x",
                "precio": "1",
                "ubicacion": "x",
                "detalle": {"tipo_insumo": "x"},
            },
            format="json",
        )

        assert respuesta.status_code == 403

    def test_usuario_verificado_si_puede_publicar(self):
        usuario = self._usuario("aprobado@test.co", Usuario.EstadoVerificacion.APROBADO)
        client = APIClient()
        client.force_authenticate(usuario)

        respuesta = client.post(
            "/api/catalog/publicaciones/",
            {
                "categoria": "insumo_veterinario",
                "titulo": "Vacuna",
                "precio": "1000",
                "ubicacion": "Meta",
                "detalle": {"tipo_insumo": "vacuna"},
            },
            format="json",
        )

        assert respuesta.status_code == 201
