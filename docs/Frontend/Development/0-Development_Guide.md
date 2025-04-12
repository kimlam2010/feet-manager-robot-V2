# Frontend Development Guide

## 1. Tổng quan

Hướng dẫn phát triển frontend cho dự án Feet Robot Manager V2, bao gồm các quy tắc, tiêu chuẩn và best practices.

### 1.1 Mục tiêu
- Đảm bảo tính nhất quán của codebase
- Tăng khả năng bảo trì
- Cải thiện chất lượng code
- Tuân thủ kiến trúc hệ thống
- Hỗ trợ quy mô nhỏ (3 Workset, 20 robot)

### 1.2 Phạm vi
- Web Application (React)
- Mobile Application (React Native)
- API Integration
- Testing
- Documentation

### 1.3 Giới hạn hệ thống
- Tối đa 3 Workset
- Tối đa 20 robot
- Bản đồ 2D đơn giản
- Giao thức: MQTT, WebSocket, gRPC
- Cơ sở dữ liệu: PostgreSQL, SQLite (mobile)

## 2. Kiến trúc tổng thể

### 2.1 Thành phần chính
- **Frontend Layer**: React.js, Redux, Material-UI
- **API Layer**: REST API, WebSocket, MQTT, gRPC
- **Business Logic Layer**: Node.js, Express
- **Data Layer**: PostgreSQL, SQLite (mobile)

### 2.2 Giao thức giao tiếp
- **REST API**: /api/v1/* endpoints
- **WebSocket**: Realtime updates
- **MQTT**: Robot control & monitoring
- **gRPC**: High-performance robot communication

### 2.3 Cấu trúc dữ liệu
```typescript
// Core data types
interface Robot {
  id: string;
  name: string;
  status: 'idle' | 'working' | 'error';
  position: {
    x: number;
    y: number;
  };
  battery: number;
  worksetId: string;
  lastUpdated: Date;
}

interface Workset {
  id: string;
  name: string;
  description: string;
  robots: Robot[];
  tasks: Task[];
  maps: Map[];
}

interface Task {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  robotId: string;
  worksetId: string;
  schedule?: Schedule;
}

interface Map {
  id: string;
  name: string;
  worksetId: string;
  filePath: string;
  resolution: number;
  features: GeoJSON.FeatureCollection;
}
```

## 3. Tích hợp với System Architecture

### 3.1 API Integration
```typescript
// src/api/config.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// MQTT Client
import * as mqtt from 'mqtt';

const mqttClient = mqtt.connect(process.env.MQTT_URL, {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASS,
  clientId: `web_${Math.random().toString(16).slice(2, 10)}`
});

// WebSocket Client
import { io } from 'socket.io-client';

const socket = io(process.env.WS_URL, {
  auth: {
    token: localStorage.getItem('token')
  }
});

// gRPC Client
import { RobotServiceClient } from '../proto/robot_grpc_web_pb';

const robotService = new RobotServiceClient(process.env.GRPC_URL);
```

### 3.2 Monitoring & Logging
```typescript
// src/utils/monitoring.ts
import * as Sentry from '@sentry/react';

export const initMonitoring = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
    });
  }
};

// src/utils/logging.ts
import { Logger } from './logger';

export const logger = new Logger({
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.NODE_ENV === 'production' ? 'json' : 'pretty',
  destination: process.env.LOG_DESTINATION
});
```

### 3.3 Security Implementation
```typescript
// src/utils/security.ts
import { encrypt, decrypt } from './crypto';

export const secureStorage = {
  setItem: (key: string, value: any) => {
    const encrypted = encrypt(JSON.stringify(value));
    localStorage.setItem(key, encrypted);
  },
  getItem: (key: string) => {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    return JSON.parse(decrypt(encrypted));
  }
};

// src/utils/auth.ts
import { jwtDecode } from 'jwt-decode';

export const checkTokenExpiration = (token: string) => {
  const decoded = jwtDecode(token);
  return decoded.exp * 1000 > Date.now();
};
```

## 4. Development Workflow

### 4.1 Setup Development Environment
```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

### 4.2 Code Quality Tools
```json
// package.json
{
  "scripts": {
    "lint": "eslint src/**/*.{ts,tsx}",
    "format": "prettier --write src/**/*.{ts,tsx}",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "e2e": "cypress run"
  }
}
```

## 5. Deployment Process

### 5.1 Build Configuration
```typescript
// webpack.config.js
module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[contenthash].js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
```

### 5.2 Docker Configuration
```dockerfile
# Dockerfile
FROM node:16-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

## 10. Tài liệu liên quan

### 10.1 Architecture
- [Frontend Architecture](../Architecture/1-README.md)
- [Component Architecture](../Architecture/2-Component_Architecture.md)
- [State Management](../Architecture/3-State_Management.md)
- [Routing Architecture](../Architecture/4-Routing_Architecture.md)
- [API Integration](../Architecture/5-API_Integration.md)
- [Styling Architecture](../Architecture/6-Styling_Architecture.md)
- [Testing Architecture](../Architecture/7-Testing_Architecture.md)
- [Deployment Architecture](../Architecture/8-Deployment_Architecture.md)
- [Security Architecture](../Architecture/9-Security_Architecture.md)
- [Design System](../Architecture/10-Design_System.md)

### 10.2 Development
- [Coding Standards](./1-Coding_Standards.md)
- [Component Development](./2-Component_Development.md)
- [API Integration](./3-API_Integration.md)
- [Error Handling](./4-Error_Handling.md)
- [Testing Strategy](./5-Testing_Strategy.md)
- [Performance Optimization](./6-Performance_Optimization.md)
- [Security Implementation](./7-Security_Implementation.md)
- [Deployment Process](./8-Deployment_Process.md)

### 10.3 System
- [System Documentation](../../Systerm/System_Documentation.md)
- [Features](../../User Guild/Features)
- [Getting Started](../../User Guild/Getting_Started)
- [Troubleshooting](../../User Guild/Troubleshooting)