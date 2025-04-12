# Frontend Deployment Guide

## 1. Tổng quan

Hướng dẫn triển khai Frontend của Feet Robot Manager V2, bao gồm các bước chuẩn bị, cấu hình và triển khai.

### 1.1 Mục tiêu
- Triển khai tự động và nhất quán
- Đảm bảo tính sẵn sàng cao
- Dễ dàng rollback khi cần
- Theo dõi và giám sát hiệu quả

### 1.2 Phạm vi
- Development Environment
- Staging Environment
- Production Environment

## 2. Yêu cầu hệ thống

### 2.1 Server Requirements
```yaml
development:
  cpu: 2 cores
  memory: 4GB
  storage: 50GB
  network: 100Mbps

staging:
  cpu: 4 cores
  memory: 8GB
  storage: 100GB
  network: 1Gbps

production:
  cpu: 8 cores
  memory: 16GB
  storage: 200GB
  network: 1Gbps
```

### 2.2 Software Requirements
```yaml
node: '>=16.0.0'
npm: '>=7.0.0'
docker: '>=20.10.0'
nginx: '>=1.18.0'
```

## 3. CI/CD Pipeline

### 3.1 Pipeline Configuration
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Upload coverage
        uses: codecov/codecov-action@v2

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-artifact@v2
        with:
          name: dist
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - name: Download artifact
        uses: actions/download-artifact@v2
        with:
          name: dist
      - name: Deploy to production
        run: |
          scp -r dist/* user@server:/var/www/feet-robot
```

### 3.2 Environment Variables
```env
# Development
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
VITE_MAPBOX_TOKEN=your_token

# Staging
VITE_API_URL=https://staging.api.feet-robot.com
VITE_WS_URL=wss://staging.api.feet-robot.com
VITE_MAPBOX_TOKEN=your_token

# Production
VITE_API_URL=https://api.feet-robot.com
VITE_WS_URL=wss://api.feet-robot.com
VITE_MAPBOX_TOKEN=your_token
```

## 4. Docker Deployment

### 4.1 Dockerfile
```dockerfile
# Build stage
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 4.2 Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=${API_URL}
      - VITE_WS_URL=${WS_URL}
    restart: unless-stopped
```

## 5. Nginx Configuration

### 5.1 Nginx Config
```nginx
server {
    listen 80;
    server_name feet-robot.com;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 6. Monitoring Setup

### 6.1 Error Tracking
```typescript
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

### 6.2 Performance Monitoring
```typescript
import { init } from '@sentry/react';

init({
  dsn: process.env.VITE_SENTRY_DSN,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      ),
    }),
  ],
  tracesSampleRate: 0.1,
});
```

## 7. Backup Strategy

### 7.1 Backup Configuration
```yaml
backup:
  frequency: daily
  retention: 30 days
  locations:
    - local: /backups
    - remote: s3://feet-robot-backups
  content:
    - static assets
    - build artifacts
    - configuration files
```

## 8. Rollback Procedure

### 8.1 Rollback Steps
1. Identify the issue
2. Stop the current deployment
3. Restore from backup
4. Verify the restore
5. Update DNS if needed
6. Monitor the system

### 8.2 Rollback Script
```bash
#!/bin/bash

# Stop current deployment
docker-compose down

# Restore from backup
tar -xzf /backups/latest.tar.gz -C /var/www/feet-robot

# Start the previous version
docker-compose up -d

# Verify the restore
curl -I https://feet-robot.com
```

## 9. Maintenance Procedures

### 9.1 Regular Maintenance
```yaml
maintenance:
  daily:
    - check logs
    - verify backups
    - monitor performance
  weekly:
    - update dependencies
    - clean old backups
    - optimize database
  monthly:
    - security audit
    - performance review
    - capacity planning
```

### 9.2 Emergency Procedures
```yaml
emergency:
  steps:
    - identify issue
    - assess impact
    - notify team
    - implement fix
    - verify solution
    - document incident
  contacts:
    - devops: +1234567890
    - security: +1234567891
    - management: +1234567892
```

## 10. Documentation

### 10.1 Required Documentation
- Deployment procedures
- Configuration guides
- Troubleshooting guides
- Security procedures
- Backup procedures

### 10.2 Maintenance
- Regular updates
- Version control
- Change logs
- Issue tracking 