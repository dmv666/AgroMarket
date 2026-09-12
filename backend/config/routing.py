"""Agrega los websocket_urlpatterns de cada app en una sola lista para el ASGI router."""
from apps.messaging.routing import websocket_urlpatterns as messaging_ws
from apps.notifications.routing import websocket_urlpatterns as notifications_ws

websocket_urlpatterns = [*messaging_ws, *notifications_ws]
