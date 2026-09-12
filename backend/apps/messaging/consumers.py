from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .models import Conversacion
from .services import enviar_mensaje, grupo_conversacion


class ChatConsumer(AsyncJsonWebsocketConsumer):
    """RF06 — un grupo por conversación; solo sus dos participantes pueden
    unirse. `enviar_mensaje()` (compartido con el endpoint REST) hace la
    persistencia, la difusión y la notificación — este consumer solo es el
    transporte."""

    async def connect(self):
        self.conversacion_id = int(self.scope["url_route"]["kwargs"]["conversacion_id"])
        user = self.scope["user"]

        if not user or not user.is_authenticated:
            await self.close()
            return

        self.conversacion = await self._obtener_conversacion_si_participa(user)
        if self.conversacion is None:
            await self.close()
            return

        self.group_name = grupo_conversacion(self.conversacion_id)
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        contenido = (content.get("contenido") or "").strip()
        if not contenido:
            return
        await self._enviar(contenido)

    async def chat_mensaje(self, event):
        await self.send_json(event["mensaje"])

    @database_sync_to_async
    def _obtener_conversacion_si_participa(self, user):
        try:
            conversacion = Conversacion.objects.get(pk=self.conversacion_id)
        except Conversacion.DoesNotExist:
            return None
        if user.id not in (conversacion.comprador_id, conversacion.vendedor_id):
            return None
        return conversacion

    @database_sync_to_async
    def _enviar(self, contenido):
        enviar_mensaje(self.conversacion, self.scope["user"], contenido)
