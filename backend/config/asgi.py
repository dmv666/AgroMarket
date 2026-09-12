import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

# get_asgi_application() debe llamarse antes de importar cualquier cosa que
# toque modelos (routing -> consumers -> models), para que el registro de
# apps de Django ya esté listo.
django_asgi_app = get_asgi_application()

from apps.core.ws_auth import JWTAuthMiddleware  # noqa: E402
from config.routing import websocket_urlpatterns  # noqa: E402

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": JWTAuthMiddleware(URLRouter(websocket_urlpatterns)),
    }
)
