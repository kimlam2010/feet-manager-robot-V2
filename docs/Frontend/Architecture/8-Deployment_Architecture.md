# Deployment Architecture

## 1. Tổng quan

Quản lý deployment cho ứng dụng React sử dụng Docker và CI/CD pipeline với GitHub Actions.

### 1.1 Mục tiêu
- Deployment tự động
- Zero downtime
- Version control
- Monitoring
- Rollback capability

### 1.2 Phạm vi
- Build Process
- Containerization
- CI/CD Pipeline
- Environment Management
- Monitoring & Logging

## 2. Cấu trúc thư mục

```
.
├── .github/
│   └── workflows/
│       ├── build.yml
│       ├── deploy.yml
│       └── test.yml
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── nginx.conf
├── scripts/
│   ├── build.sh
│   ├── deploy.sh
│   └── healthcheck.sh
└── config/
    ├── development.env
    ├── staging.env
    └── production.env
```

## 3. Build Process

### 3.1 Build Configuration
```typescript
// webpack.config.js
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
```

### 3.2 Build Script
```bash
#!/bin/bash
# scripts/build.sh

# Set environment
export NODE_ENV=production

# Install dependencies
npm ci

# Run tests
npm run test

# Build application
npm run build

# Generate build info
echo "Build completed at $(date)" > build/build-info.txt
echo "Commit: $(git rev-parse HEAD)" >> build/build-info.txt
echo "Branch: $(git rev-parse --abbrev-ref HEAD)" >> build/build-info.txt
```

## 4. Containerization

### 4.1 Dockerfile
```dockerfile
# docker/Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 4.2 Docker Compose
```yaml
# docker/docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: docker/Dockerfile
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 4.3 Nginx Configuration
```nginx
# docker/nginx.conf
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    location /static {
        expires 1y;
        add_header Cache-Control "public";
    }

    location /health {
        access_log off;
        return 200 'healthy\n';
    }
}
```

## 5. CI/CD Pipeline

### 5.1 GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm run test
        
      - name: Build
        run: npm run build
        
      - name: Build Docker image
        run: docker build -t frontend:${{ github.sha }} .
        
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          docker-compose -f docker/docker-compose.yml up -d
          ./scripts/healthcheck.sh
```

### 5.2 Deployment Script
```bash
#!/bin/bash
# scripts/deploy.sh

# Load environment variables
source config/production.env

# Pull latest changes
git pull origin main

# Build and deploy
docker-compose -f docker/docker-compose.yml up -d --build

# Health check
./scripts/healthcheck.sh

# Cleanup old images
docker image prune -f
```

## 6. Environment Management

### 6.1 Environment Configuration
```env
# config/production.env
NODE_ENV=production
REACT_APP_API_URL=https://api.example.com
REACT_APP_WS_URL=wss://ws.example.com
REACT_APP_GA_ID=UA-XXXXXXXXX-X
REACT_APP_SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxx@sentry.io/xxxxxx
```

### 6.2 Environment Setup
```typescript
// src/config/env.ts
interface EnvConfig {
  apiUrl: string;
  wsUrl: string;
  gaId?: string;
  sentryDsn?: string;
}

const env: EnvConfig = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  wsUrl: process.env.REACT_APP_WS_URL || 'ws://localhost:3000',
  gaId: process.env.REACT_APP_GA_ID,
  sentryDsn: process.env.REACT_APP_SENTRY_DSN,
};

export default env;
```

## 7. Monitoring & Logging

### 7.1 Health Check
```bash
#!/bin/bash
# scripts/healthcheck.sh

MAX_RETRIES=5
RETRY_INTERVAL=10

for i in $(seq 1 $MAX_RETRIES); do
  if curl -s http://localhost/health | grep -q "healthy"; then
    echo "Application is healthy"
    exit 0
  fi
  echo "Attempt $i: Application not ready, retrying in $RETRY_INTERVAL seconds..."
  sleep $RETRY_INTERVAL
done

echo "Application failed health check"
exit 1
```

### 7.2 Monitoring Setup
```typescript
// src/utils/monitoring.ts
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initMonitoring = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
    });
  }
};

export const logError = (error: Error) => {
  console.error(error);
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error);
  }
};
```

## 8. Best Practices

### 8.1 Deployment
- Use blue-green deployment
- Implement feature flags
- Monitor deployment metrics
- Have rollback plan
- Test in staging first

### 8.2 Security
- Use HTTPS
- Implement CSP
- Regular security audits
- Dependency updates
- Access control

### 8.3 Performance
- Enable compression
- Use CDN
- Optimize assets
- Cache strategies
- Monitor performance 