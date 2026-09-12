"""Autenticación JWT para conexiones WebSocket (Channels).

Un navegador no puede mandar cabeceras custom en el handshake de WebSocket,
así que el access token viaja como query string: `wss://host/ws/chat/1/?token=...`.
Se reutiliza el mismo JWT que ya emite SimpleJWT para la API REST — un solo
mecanismo de autenticación en todo el sistema, no dos.
"""
from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import AccessToken


@database_sync_to_async
def _get_user_from_token(token: str):
    from apps.accounts.models import Usuario

    try:
        validated = AccessToken(token)
        return Usuario.objects.get(id=validated["user_id"])
    except (InvalidToken, TokenError, Usuario.DoesNotExist, KeyError):
        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope.get("query_string", b"").decode())
        token = query_string.get("token", [None])[0]
        scope["user"] = await _get_user_from_token(token) if token else AnonymousUser()
        return await super().__call__(scope, receive, send)
