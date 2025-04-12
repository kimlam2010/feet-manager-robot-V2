# Deployment Process Guide

## 1. Tổng quan

Hướng dẫn quy trình triển khai cho dự án Feet Robot Manager V2, sử dụng TypeScript và React, tuân thủ kiến trúc hệ thống và các tiêu chuẩn đã định nghĩa.

### 1.1 Mục tiêu
- Đảm bảo triển khai an toàn và ổn định
- Tối ưu hóa hiệu suất triển khai
- Hỗ trợ quy mô vừa (10 Workset, 100 robot)
- Tuân thủ kiến trúc hệ thống
- Tự động hóa quy trình triển khai

### 1.2 Phạm vi
- Build Process
- Testing Process
- Deployment Process
- Monitoring Process
- Rollback Process

### 1.3 Giới hạn hệ thống
- Tối đa 10 Workset
- Tối đa 100 robot
- Bản đồ 2D đơn giản
- Giao thức: MQTT, WebSocket, gRPC
- Cơ sở dữ liệu: PostgreSQL, SQLite (mobile)

## 2. Deployment Architecture

### 2.1 Deployment Structure
```
.
├── .github/              # GitHub Actions workflows
│   ├── workflows/        # CI/CD workflows
│   └── environments/     # Environment configurations
├── scripts/             # Deployment scripts
│   ├── build/           # Build scripts
│   ├── deploy/          # Deployment scripts
│   └── test/            # Test scripts
└── config/              # Configuration files
    ├── dev/             # Development config
    ├── staging/         # Staging config
    └── prod/            # Production config
```

### 2.2 Deployment Types
```typescript
// Environment Types
interface Environment {
  name: string;
  url: string;
  apiUrl: string;
  features: string[];
  limits: {
    worksets: number;
    robots: number;
  };
}

// Build Types
interface BuildConfig {
  mode: 'development' | 'production';
  sourceMap: boolean;
  minify: boolean;
  analyze: boolean;
}

// Deployment Types
interface DeploymentConfig {
  environment: Environment;
  build: BuildConfig;
  tests: boolean;
  notify: boolean;
}
```

## 3. Deployment Implementation

### 3.1 Build Process
```typescript
// scripts/build/build.ts
import { exec } from 'child_process';
import { BuildConfig } from '../types/build';

export const build = async (config: BuildConfig) => {
  const { mode, sourceMap, minify, analyze } = config;
  
  const env = {
    ...process.env,
    NODE_ENV: mode,
    REACT_APP_ENV: mode,
    GENERATE_SOURCEMAP: sourceMap ? 'true' : 'false',
    MINIFY: minify ? 'true' : 'false'
  };
  
  const command = `react-scripts build`;
  
  if (analyze) {
    command += ` && source-map-explorer 'build/static/js/*.js'`;
  }
  
  return new Promise((resolve, reject) => {
    exec(command, { env }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      
      console.log(stdout);
      console.error(stderr);
      resolve(true);
    });
  });
};

// package.json
{
  "scripts": {
    "build": "tsc && react-scripts build",
    "build:dev": "NODE_ENV=development npm run build",
    "build:prod": "NODE_ENV=production npm run build",
    "build:analyze": "source-map-explorer 'build/static/js/*.js'"
  }
}
```

### 3.2 Testing Process
```typescript
// scripts/test/test.ts
import { exec } from 'child_process';
import { TestConfig } from '../types/test';

export const test = async (config: TestConfig) => {
  const { unit, integration, e2e } = config;
  
  const commands = [];
  
  if (unit) {
    commands.push('npm run test:unit');
  }
  
  if (integration) {
    commands.push('npm run test:integration');
  }
  
  if (e2e) {
    commands.push('npm run test:e2e');
  }
  
  for (const command of commands) {
    await new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        
        console.log(stdout);
        console.error(stderr);
        resolve(true);
      });
    });
  }
};

// package.json
{
  "scripts": {
    "test": "react-scripts test",
    "test:unit": "jest --config jest.config.js",
    "test:integration": "jest --config jest.integration.config.js",
    "test:e2e": "playwright test"
  }
}
```

### 3.3 Deployment Process
```typescript
// scripts/deploy/deploy.ts
import { exec } from 'child_process';
import { DeploymentConfig } from '../types/deployment';

export const deploy = async (config: DeploymentConfig) => {
  const { environment, build, tests, notify } = config;
  
  try {
    // Build
    await build(build);
    
    // Test
    if (tests) {
      await test({
        unit: true,
        integration: true,
        e2e: true
      });
    }
    
    // Deploy
    const command = `aws s3 sync build/ s3://${environment.bucket} --delete`;
    
    await new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        
        console.log(stdout);
        console.error(stderr);
        resolve(true);
      });
    });
    
    // Notify
    if (notify) {
      await notifyDeployment({
        environment: environment.name,
        version: process.env.npm_package_version,
        status: 'success'
      });
    }
    
    return true;
  } catch (error) {
    if (notify) {
      await notifyDeployment({
        environment: environment.name,
        version: process.env.npm_package_version,
        status: 'failed',
        error: error.message
      });
    }
    
    throw error;
  }
};

// package.json
{
  "scripts": {
    "deploy": "node scripts/deploy/deploy.js",
    "deploy:dev": "NODE_ENV=development npm run deploy",
    "deploy:staging": "NODE_ENV=staging npm run deploy",
    "deploy:prod": "NODE_ENV=production npm run deploy"
  }
}
```

### 3.4 Monitoring Process
```typescript
// scripts/monitor/monitor.ts
import { exec } from 'child_process';
import { MonitorConfig } from '../types/monitor';

export const monitor = async (config: MonitorConfig) => {
  const { environment, metrics } = config;
  
  const command = `node scripts/monitor/metrics.js ${environment} ${metrics.join(' ')}`;
  
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      
      console.log(stdout);
      console.error(stderr);
      resolve(true);
    });
  });
};

// package.json
{
  "scripts": {
    "monitor": "node scripts/monitor/monitor.js",
    "monitor:dev": "NODE_ENV=development npm run monitor",
    "monitor:staging": "NODE_ENV=staging npm run monitor",
    "monitor:prod": "NODE_ENV=production npm run monitor"
  }
}
```

### 3.5 Rollback Process
```typescript
// scripts/rollback/rollback.ts
import { exec } from 'child_process';
import { RollbackConfig } from '../types/rollback';

export const rollback = async (config: RollbackConfig) => {
  const { environment, version, notify } = config;
  
  try {
    const command = `aws s3 sync s3://${environment.bucket}/${version} build/`;
    
    await new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        
        console.log(stdout);
        console.error(stderr);
        resolve(true);
      });
    });
    
    if (notify) {
      await notifyRollback({
        environment: environment.name,
        version,
        status: 'success'
      });
    }
    
    return true;
  } catch (error) {
    if (notify) {
      await notifyRollback({
        environment: environment.name,
        version,
        status: 'failed',
        error: error.message
      });
    }
    
    throw error;
  }
};

// package.json
{
  "scripts": {
    "rollback": "node scripts/rollback/rollback.js",
    "rollback:dev": "NODE_ENV=development npm run rollback",
    "rollback:staging": "NODE_ENV=staging npm run rollback",
    "rollback:prod": "NODE_ENV=production npm run rollback"
  }
}
```

## 4. CI/CD Integration

### 4.1 GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
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
        
      - name: Test
        run: npm run test
        
      - name: Deploy
        if: github.ref == 'refs/heads/main'
        run: npm run deploy:prod
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## 5. Tài liệu liên quan

### 5.1 Development
- [Coding Standards](./1-Coding_Standards.md)
- [Component Development](./2-Component_Development.md)
- [API Integration](./3-API_Integration.md)
- [Error Handling](./4-Error_Handling.md)
- [Testing Strategy](./5-Testing_Strategy.md)
- [Performance Optimization](./6-Performance_Optimization.md)
- [Security Implementation](./7-Security_Implementation.md)

### 5.2 Architecture
- [Frontend Architecture](../Architecture/1-README.md)
- [Component Architecture](../Architecture/2-Component_Architecture.md)
- [State Management](../Architecture/3-State_Management.md)
- [API Integration](../Architecture/5-API_Integration.md)
- [Deployment Architecture](../Architecture/8-Deployment_Architecture.md)
- [System Documentation](../../Systerm/System_Documentation.md)
- [Features](../../User Guild/Features)
- [Getting Started](../../User Guild/Getting_Started)
- [Troubleshooting](../../User Guild/Troubleshooting) 