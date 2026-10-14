# AgroMarket

Marketplace especializado en el sector agropecuario y agroganadero (insumos veterinarios, alimento
balanceado, animales y genética), con verificación de identidad de usuarios y moderación de
publicaciones. Proyecto MVP — Politécnico Grancolombiano, Emprendimiento de Base Tecnológica.

Cubre los requisitos funcionales RF01–RF11 y no funcionales RNF01–RNF07 del proyecto.

## Stack

- **Backend**: Django 5.2 + Django REST Framework + Django Channels (WebSocket, canal en memoria)
  + PostgreSQL 16 + JWT (SimpleJWT).
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + TanStack Query + React Router.
- **Infraestructura**: Docker Compose (un contenedor por servicio: `db`, `backend`, `frontend`).

Ver [`backend/apps/`](backend/apps) para la organización por dominio (`accounts`, `catalog`,
`messaging`, `transactions`, `moderation`, `notifications`) y [`frontend/src/features/`](frontend/src/features)
para su espejo en el cliente.

## Levantar el proyecto

Requiere [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo.

```bash
cp .env.example .env
docker compose up
```

- Frontend: http://localhost:5173
- API + documentación interactiva (Swagger): http://localhost:8000/api/docs/
- Django admin (gestión técnica de datos): http://localhost:8000/admin/

La primera vez que se ejecuta, `backend` aplica las migraciones automáticamente antes de arrancar
el servidor (ver `backend/entrypoint.sh`).

### Datos de ejemplo

Para no arrancar con el catálogo vacío:

```bash
docker compose exec backend python manage.py seed_demo
```

Crea un administrador, un vendedor y un comprador verificados, y tres publicaciones (una por
categoría), todas aprobadas. Las credenciales quedan impresas en la consola al ejecutarlo.

### Crear tu propio administrador

```bash
docker compose exec backend python manage.py createsuperuser
```

Un superusuario queda automáticamente verificado y marcado como administrador — puede entrar al
panel `/admin` del frontend para aprobar verificaciones, moderar publicaciones y revisar reportes.

## Comandos útiles

```bash
# Tests del backend (pytest)
docker compose run --rm backend python -m pytest apps -v

# Lint backend (ruff) / frontend (eslint)
docker compose run --rm backend python -m ruff check .
docker compose run --rm frontend npx eslint .

# Migraciones tras cambiar un modelo
docker compose run --rm backend python manage.py makemigrations
docker compose run --rm backend python manage.py migrate

# Typecheck del frontend
docker compose run --rm frontend npx tsc -b --noEmit
```

## Despliegue

Frontend en Vercel; backend y base de datos en un servidor propio con Docker y HTTPS automático
(Caddy). Paso a paso en [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md).

## Análisis de calidad con SonarQube

Servidor local de SonarQube (Community Build) definido en `docker-compose.sonar.yml`, separado de
la app para no cargar sus ~2 GB de RAM en el día a día. La configuración del análisis está en
`sonar-project.properties`.

```bash
# 1. Levantar SonarQube (tarda 1–2 min la primera vez)
docker compose -f docker-compose.sonar.yml up -d
```

2. Entrar a http://localhost:9000 con `admin` / `admin`. SonarQube pide cambiar la contraseña.
3. En **My Account → Security**, generar un token de tipo *Global Analysis Token* y guardarlo en
   `.env.sonar` (no se versiona):

   ```
   SONAR_TOKEN=sqa_xxxxxxxxxxxxxxxx
   ```

4. Con la app corriendo (`docker compose up -d`), analizar el repo:

   ```bash
   ./sonar-scan.sh        # macOS / Linux / Git Bash
   .\sonar-scan.ps1       # Windows (PowerShell)
   ```

   El script corre los tests del backend con cobertura (`pytest-cov`) y luego el scanner. Los
   resultados quedan en http://localhost:9000/dashboard?id=agromarket. Repetirlo tras cada
   cambio para ver la evolución.

Para detener SonarQube: `docker compose -f docker-compose.sonar.yml down` (los datos del análisis
se conservan en sus volúmenes).

## Decisiones de arquitectura (resumen)

- **Apps Django por dominio de negocio**, no por tipo técnico — cada una puede evolucionar sin
  romper a las demás (RNF07). `notifications` es la única dependencia común: las demás apps la
  importan para avisar a un usuario (`notify()`), ella no importa nada de vuelta.
- **WebSocket sin Redis**: Django Channels con `InMemoryChannelLayer`, suficiente para un único
  proceso en un MVP. Migrar a Redis más adelante es solo un cambio de configuración.
- **Archivos en `media/` local**: documentos de verificación, fotos de publicaciones y certificados
  sanitarios se sirven desde el propio backend — sin cuentas ni credenciales de un proveedor cloud.
- **Publicaciones por especialización**: `Publicacion` es la tabla base; `InsumoVeterinario`,
  `AlimentoBalanceado` y `AnimalGenetica` son tablas 1–1 con sus propios campos y validaciones (en
  particular, RF04 exige `estado_salud` obligatorio solo para animales/genética).
