# Equivalente de sonar-scan.sh para Windows (PowerShell). Ver README, sección SonarQube.
# Uso: .\sonar-scan.ps1
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Test-Path .env.sonar)) {
    Write-Error "Falta .env.sonar con SONAR_TOKEN=... (ver README, seccion SonarQube)."
}

Write-Host "==> Tests del backend con cobertura..."
# coverage.xml sale con rutas relativas a backend/ (<source>apps</source>); el
# scanner ve el repo desde la raíz, así que se reescribe a backend/apps.
docker compose run --rm backend sh -c "python -m pytest apps --cov=apps --cov-report=xml -q && sed -i 's#<source>apps</source>#<source>backend/apps</source>#' coverage.xml"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "==> Analisis de SonarQube..."
docker compose -f docker-compose.sonar.yml run --rm scanner
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "==> Listo: http://localhost:9000/dashboard?id=agromarket"
