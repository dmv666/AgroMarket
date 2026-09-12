from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from apps.notifications.models import Notificacion
from apps.notifications.services import notify

from .models import Conversacion, Mensaje
from .serializers import MensajeSerializer


def grupo_conversacion(conversacion_id: int) -> str:
    return f"conversacion_{conversacion_id}"


def enviar_mensaje(conversacion: Conversacion, remitente, contenido: str) -> Mensaje:
    """Único punto de entrada para crear un mensaje (RF06): lo usan tanto el
    endpoint REST como el ChatConsumer, así que persistencia, difusión en
    vivo y notificación quedan garantizadas sin importar el canal de entrada.
    """
    mensaje = Mensaje.objects.create(
        conversacion=conversacion, remitente=remitente, contenido=contenido
    )
    conversacion.save(update_fields=["actualizado_en"])

    channel_layer = get_channel_layer()
    if channel_layer is not None:
        async_to_sync(channel_layer.group_send)(
            grupo_conversacion(conversacion.id),
            {"type": "chat.mensaje", "mensaje": MensajeSerializer(mensaje).data},
        )

    destinatario = (
        conversacion.vendedor
        if remitente.id == conversacion.comprador_id
        else conversacion.comprador
    )
    notify(
        destinatario,
        Notificacion.Tipo.MENSAJE,
        f"Nuevo mensaje de {remitente.nombre_completo}",
    )
    return mensaje
