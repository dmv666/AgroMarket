"""Punto único de entrada para avisar a un usuario (RF10).

`notifications` no importa nada del resto del dominio (catalog, messaging,
moderation, transactions) — son ellas las que importan `notify()` desde acá.
Esa dirección única evita imports circulares entre apps de negocio y deja la
regla de "cómo se notifica" en un solo lugar (DRY).
"""
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .models import Notificacion
from .serializers import NotificacionSerializer


def notify(usuario, tipo: str, contenido: str) -> Notificacion:
    notificacion = Notificacion.objects.create(
        usuario=usuario, tipo=tipo, contenido=contenido
    )

    channel_layer = get_channel_layer()
    if channel_layer is not None:
        async_to_sync(channel_layer.group_send)(
            f"user_{usuario.id}",
            {
                "type": "notificacion.evento",
                "notificacion": NotificacionSerializer(notificacion).data,
            },
        )
    return notificacion
