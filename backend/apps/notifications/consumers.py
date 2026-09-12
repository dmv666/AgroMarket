from channels.generic.websocket import AsyncJsonWebsocketConsumer


class NotificationConsumer(AsyncJsonWebsocketConsumer):
    """RF10 — cada usuario autenticado se suscribe a su propio grupo
    (`user_<id>`) y recibe ahí cualquier notificación que `notify()` emita,
    sin importar qué app del dominio la haya disparado.
    """

    async def connect(self):
        user = self.scope["user"]
        if not user or not user.is_authenticated:
            await self.close()
            return
        self.group_name = f"user_{user.id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def notificacion_evento(self, event):
        await self.send_json(event["notificacion"])
