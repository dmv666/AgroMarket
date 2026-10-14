# Guía de despliegue

AgroMarket se despliega en dos partes:

- **Frontend** (React) → **Vercel**.
- **Backend** (Django + WebSockets) **y base de datos** (PostgreSQL) → un **servidor propio** con
  Docker, detrás de **Caddy**, que pone el HTTPS automáticamente.

```
                 https://agromarket.vercel.app
  Navegador ───────────────────────────────────────▶  Vercel (archivos estáticos del SPA)
      │
      │  https://api.tudominio.com/api/...   (REST)
      │  wss://api.tudominio.com/ws/...      (chat y notificaciones)
      │  https://api.tudominio.com/media/... (fotos y documentos)
      ▼
  ┌──────────────── Servidor (docker-compose.prod.yml) ────────────────┐
  │  caddy :80/:443 ──▶ backend (daphne :8000) ──▶ db (postgres)      │
  │    └─ sirve /media y /static directo desde los volúmenes           │
  └────────────────────────────────────────────────────────────────────┘
```

El navegador habla **directo** con el backend, y no a través de Vercel, porque Vercel no puede
hacer de proxy para WebSockets. Por eso el frontend necesita saber la URL del backend
(`VITE_BACKEND_URL`) y el backend tiene que permitir el dominio de Vercel (CORS).

**Orden recomendado:** primero el backend (paso 1), porque Vercel necesita su URL. Después el
frontend (paso 2) y al final se conectan los dos (paso 3).

---

## Requisitos

**Servidor:**
- Linux (Ubuntu 22.04/24.04 o similar) con acceso SSH y permisos de `sudo`.
- Mínimo **1 GB de RAM** (2 GB recomendado) y unos 10 GB de disco.
- Puertos **80** y **443** abiertos hacia internet. Caddy los necesita para obtener el
  certificado HTTPS.
- Docker y Docker Compose (se instalan en el paso 1.2).

> Si el "host" es un hosting compartido (cPanel o similar), sin acceso root ni Docker, esta
> guía no aplica. Hace falta un VPS: DigitalOcean, Hetzner, AWS Lightsail, Oracle Cloud Free
> Tier, etc.

**Dominio:** un dominio o subdominio para el backend, por ejemplo `api.tudominio.com`.
- **Sin dominio propio:** se puede usar [sslip.io](https://sslip.io), que es gratis y no
  requiere registro. Si la IP del servidor es `203.0.113.10`, el dominio es
  `203-0-113-10.sslip.io`. Ya apunta a esa IP y Caddy le saca certificado igual.

**Cuenta en Vercel** conectada a GitHub, con acceso al repositorio.

---

## 1. Backend y base de datos (servidor)

### 1.1 Apuntar el dominio al servidor

En el panel DNS del dominio, crear un registro **A**:

| Tipo | Nombre | Valor |
|---|---|---|
| A | `api` | IP pública del servidor |

Se puede verificar con `ping api.tudominio.com`, que debe responder la IP del servidor. La
propagación puede tardar unos minutos. Si se usa sslip.io, este paso se omite.

### 1.2 Instalar Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER   # para usar docker sin sudo
# cerrar la sesión SSH y volver a entrar para que tome el grupo
docker compose version          # debe mostrar v2.x
```

Si el servidor usa firewall (`ufw`):

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 443/udp
sudo ufw enable
```

En proveedores cloud (AWS, Oracle, etc.) también hay que abrir los puertos 80 y 443 en el
*security group* o firewall del panel web.

### 1.3 Descargar el proyecto y configurar las variables

```bash
git clone https://github.com/dmv666/AgroMarket.git
cd AgroMarket
cp .env.prod.example .env.prod
```

Generar una `SECRET_KEY`:

```bash
docker run --rm python:3.12-slim python -c "import secrets; print(secrets.token_urlsafe(50))"
```

Editar `.env.prod` (`nano .env.prod`) y reemplazar **todos** los valores de ejemplo:

| Variable | Valor |
|---|---|
| `BACKEND_DOMAIN` | `api.tudominio.com` (solo el dominio, sin `https://`) |
| `SECRET_KEY` | la clave generada arriba |
| `ALLOWED_HOSTS` | `api.tudominio.com` |
| `CORS_ALLOWED_ORIGINS` | la URL del frontend en Vercel. Si todavía no existe, dejar el valor de ejemplo: se corrige en el paso 3 |
| `CSRF_TRUSTED_ORIGINS` | `https://api.tudominio.com` |
| `POSTGRES_PASSWORD` | una contraseña larga y aleatoria |

`DEBUG` debe quedar en `False`. `.env.prod` tiene secretos y **nunca se sube al repositorio**
(ya está en `.gitignore`).

### 1.4 Levantar

```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml logs -f    # Ctrl+C para salir de los logs
```

El primer arranque tarda unos minutos porque construye la imagen. Al levantar, el backend
aplica las migraciones y genera los archivos estáticos él solo, y Caddy obtiene el certificado
HTTPS.

Verificación: abrir **https://api.tudominio.com/api/docs/**. Debe cargar Swagger con candado
de HTTPS.

### 1.5 Crear el administrador

```bash
docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

El superusuario queda verificado y como administrador. Entra al panel `/admin` del frontend y
también al admin de Django en `https://api.tudominio.com/admin/`.

> **No usar `seed_demo` en producción:** crea usuarios con contraseñas públicas (están en el
> código). Solo se justifica en una instancia de demostración que se borrará después.

---

## 2. Frontend (Vercel)

1. En [vercel.com/new](https://vercel.com/new), **importar** el repositorio de GitHub.
2. Configurar el proyecto:
   - **Root Directory:** `frontend` (importante: el `package.json` del frontend está ahí).
   - **Framework Preset:** Vite. Lo detecta solo, y `frontend/vercel.json` ya define el build.
3. En **Environment Variables**, agregar:

   | Nombre | Valor |
   |---|---|
   | `VITE_BACKEND_URL` | `https://api.tudominio.com` (con `https://` y sin `/` al final) |

4. **Deploy.** Al terminar, Vercel da la URL del sitio, por ejemplo
   `https://agromarket.vercel.app`.

> `VITE_BACKEND_URL` se incrusta en el código **al construir**, no al ejecutar. Si se cambia,
> hay que hacer **Redeploy** en Vercel para que tome efecto.

`frontend/vercel.json` ya redirige todas las rutas a `index.html`. Sin esa regla, recargar una
página como `/publicaciones/5` daría 404 en Vercel.

---

## 3. Conectar frontend y backend

En el servidor, poner la URL de Vercel en `CORS_ALLOWED_ORIGINS` dentro de `.env.prod`:

```
CORS_ALLOWED_ORIGINS=https://agromarket.vercel.app
```

Va sin `/` al final. Si hay un dominio propio para el frontend, se agregan los dos separados
por coma. Después se aplica el cambio:

```bash
docker compose -f docker-compose.prod.yml up -d --force-recreate backend
```

### Lista de verificación

Abrir la URL de Vercel y comprobar:

- [ ] El catálogo carga (la API responde y CORS está bien).
- [ ] Registro e inicio de sesión funcionan.
- [ ] Recargar la página (F5) en una ruta interna no da 404.
- [ ] Se puede crear una publicación con foto y la foto se ve (media sirve por HTTPS).
- [ ] El chat entre comprador y vendedor llega en tiempo real (WebSockets).
- [ ] La campana de notificaciones se actualiza sin recargar.
- [ ] `https://api.tudominio.com/admin/` permite iniciar sesión y se ve con estilos.

---

## Actualizar a una nueva versión

- **Frontend:** Vercel despliega solo cada push a `main`.
- **Backend:**

  ```bash
  cd AgroMarket
  git pull
  docker compose -f docker-compose.prod.yml up -d --build
  ```

  Las migraciones nuevas se aplican solas al reiniciar.

## Respaldos

Los datos viven en volúmenes de Docker: `postgres_data` (base de datos) y `media` (fotos y
documentos subidos). Se recomienda respaldar ambos con regularidad:

```bash
# Base de datos -> archivo .sql
docker compose -f docker-compose.prod.yml exec -T db \
  sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' > respaldo_$(date +%F).sql

# Archivos subidos -> .tar.gz
docker run --rm -v agromarket-prod_media:/media -v "$PWD":/respaldo alpine \
  tar czf /respaldo/media_$(date +%F).tar.gz -C /media .
```

Restaurar la base de datos:

```bash
docker compose -f docker-compose.prod.yml exec -T db \
  sh -c 'psql -U "$POSTGRES_USER" "$POSTGRES_DB"' < respaldo_AAAA-MM-DD.sql
```

> `docker compose -f docker-compose.prod.yml down -v` **borra los volúmenes**, es decir, la base
> de datos y los archivos. Para detener sin perder datos, usar `down` sin `-v`.

---

## Problemas comunes

| Síntoma | Causa probable | Solución |
|---|---|---|
| En la consola del navegador: *blocked by CORS policy* | La URL de Vercel no está en `CORS_ALLOWED_ORIGINS`, o tiene `/` al final | Corregir `.env.prod` y recrear el backend (paso 3) |
| El frontend sigue llamando a `/api` de Vercel (404) o a una URL vieja | `VITE_BACKEND_URL` falta o se cambió sin redeploy | Revisar la variable en Vercel y hacer **Redeploy** |
| `Bad Request (400)` al abrir el backend | El dominio no está en `ALLOWED_HOSTS` | Agregarlo en `.env.prod` y recrear el backend |
| El navegador no confía en el certificado, o Caddy repite errores de *ACME* en los logs | El DNS aún no apunta al servidor, o los puertos 80/443 están cerrados | Verificar el registro A y el firewall; `docker compose -f docker-compose.prod.yml logs caddy` |
| *CSRF verification failed* en `/admin/` | Falta `CSRF_TRUSTED_ORIGINS` | `CSRF_TRUSTED_ORIGINS=https://api.tudominio.com` y recrear el backend |
| El chat o las notificaciones no llegan en tiempo real | El WebSocket no conecta | En las herramientas del navegador (pestaña *Network → WS*), la URL debe ser `wss://api.tudominio.com/ws/...`. Si no, revisar `VITE_BACKEND_URL` |
| Las vistas previas de Vercel (URLs `*-git-*.vercel.app`) fallan con CORS | Solo se permite la URL de producción | Agregar esa URL a `CORS_ALLOWED_ORIGINS` si se quiere probar ahí |

Logs de cada servicio:

```bash
docker compose -f docker-compose.prod.yml logs -f backend   # o: caddy, db
```

## Limitaciones conocidas del MVP

- **Un solo proceso de backend.** Los WebSockets usan `InMemoryChannelLayer`, así que **no** hay
  que levantar varias réplicas del backend: los mensajes no se cruzarían entre ellas. Para
  escalar habría que pasar a Redis (`channels-redis`), que es solo un cambio de configuración en
  `CHANNEL_LAYERS`.
- **Archivos en el disco del servidor.** Las fotos y los documentos quedan en el volumen `media`.
  Si el servidor se pierde sin respaldo, se pierden también.
