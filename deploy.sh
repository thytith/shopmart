#!/bin/bash

# ShopSmart Deployment Script
set -e

echo "🚀 Starting ShopSmart API deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Log function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    error "Node.js is not installed. Please install Node.js 18 or higher."
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    warn "PM2 is not installed. Installing..."
    npm install -g pm2
fi

# Create logs directory
mkdir -p /var/log/shopsmart

# Backup current deployment
if pm2 list | grep -q "shopsmart-api"; then
    log "Backing up current deployment..."
    pm2 stop shopsmart-api || true
    cp -r . ../shopsmart-backup-$(date +%Y%m%d-%H%M%S) || true
fi

# Install dependencies
log "Installing dependencies..."
npm ci --production

# Run database setup (if first deployment)
if [ ! -f .db-setup-complete ]; then
    log "Setting up database..."
    # This would typically run your database migrations
    # For now, we'll just create a marker file
    touch .db-setup-complete
fi

# Start application with PM2
log "Starting application..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup startup script (if not already done)
if ! pm2 startup | grep -q "already"; then
    pm2 startup
fi

# Health check
log "Performing health check..."
sleep 5
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    log "✅ Health check passed!"
else
    error "❌ Health check failed!"
fi

log "🎉 Deployment completed successfully!"
log "📊 Check status: pm2 status"
log "📋 View logs: pm2 logs shopsmart-api"
log "🌐 API URL: http://localhost:3000"
