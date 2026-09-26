#!/bin/bash
# deploy-local.sh - Automated Local Deployment Script
set -e

DOCKER_IMAGE=${1:-"thanhthunguyen1462005/product-api:latest"}
export DOCKER_IMAGE

echo "========================================="
echo " Automated CD Deployment to Local Docker "
echo "========================================="

echo "1. Pulling latest image from Docker Hub: $DOCKER_IMAGE..."
docker compose -f docker-compose-prod.yaml pull product-api

echo "2. Deploying updated containers with Docker Compose..."
docker compose -f docker-compose-prod.yaml up -d

echo "3. Verifying Container Status and Health..."
sleep 5
docker compose -f docker-compose-prod.yaml ps

echo "4. Testing /health endpoint..."
curl -f http://localhost:3000/health || echo "Health check not yet ready"
echo -e "\nDeployment completed successfully!"
