# deploy-local.ps1 - Automated Local Deployment Script
param (
    [string]$DockerImage = "thanhthunguyen1462005/product-api:latest"
)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Automated CD Deployment to Local Docker " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$env:DOCKER_IMAGE = $DockerImage

Write-Host "1. Pulling latest image from Docker Hub: $DockerImage..." -ForegroundColor Yellow
docker compose -f docker-compose-prod.yaml pull product-api

Write-Host "2. Deploying updated containers with Docker Compose..." -ForegroundColor Yellow
docker compose -f docker-compose-prod.yaml up -d

Write-Host "3. Verifying Container Status and Health..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
docker compose -f docker-compose-prod.yaml ps

Write-Host "4. Testing /health endpoint..." -ForegroundColor Yellow
try {
    $res = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
    Write-Host "Health Check Status: $($res.status) | Database: $($res.database)" -ForegroundColor Green
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Warning: Healthcheck not yet ready or failed: $_" -ForegroundColor Red
}
