# Backend Integration Guide

## 1. API Specifications

### 1.1 REST API Endpoints
```typescript
interface ApiEndpoints {
  // Authentication
  auth: {
    login: '/api/auth/login';
    logout: '/api/auth/logout';
    refresh: '/api/auth/refresh';
  };
  
  // Worksets
  worksets: {
    list: '/api/worksets';
    create: '/api/worksets';
    get: (id: string) => `/api/worksets/${id}`;
    update: (id: string) => `/api/worksets/${id}`;
    delete: (id: string) => `/api/worksets/${id}`;
  };
  
  // Robots
  robots: {
    list: '/api/robots';
    create: '/api/robots';
    get: (id: string) => `/api/robots/${id}`;
    update: (id: string) => `/api/robots/${id}`;
    delete: (id: string) => `/api/robots/${id}`;
    control: (id: string) => `/api/robots/${id}/control`;
  };
  
  // Maps
  maps: {
    list: '/api/maps';
    create: '/api/maps';
    get: (id: string) => `/api/maps/${id}`;
    update: (id: string) => `/api/maps/${id}`;
    delete: (id: string) => `/api/maps/${id}`;
  };
  
  // Tasks
  tasks: {
    list: '/api/tasks';
    create: '/api/tasks';
    get: (id: string) => `/api/tasks/${id}`;
    update: (id: string) => `/api/tasks/${id}`;
    delete: (id: string) => `/api/tasks/${id}`;
    schedule: (id: string) => `/api/tasks/${id}/schedule`;
  };
}
```

### 1.2 API Response Types
```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface ErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}
```

## 2. Database Schema

### 2.1 Workset Schema
```typescript
interface Workset {
  id: string;
  name: string;
  description?: string;
  robots: Robot[];
  maps: Map[];
  createdAt: string;
  updatedAt: string;
}
```

### 2.2 Robot Schema
```typescript
interface Robot {
  id: string;
  name: string;
  status: 'idle' | 'busy' | 'offline';
  battery: number;
  position: {
    x: number;
    y: number;
    theta: number;
  };
  worksetId: string;
  createdAt: string;
  updatedAt: string;
}
```

### 2.3 Map Schema
```typescript
interface Map {
  id: string;
  name: string;
  filePath: string;
  resolution: number;
  origin: {
    x: number;
    y: number;
    theta: number;
  };
  worksetId: string;
  features: MapFeature[];
  createdAt: string;
  updatedAt: string;
}

interface MapFeature {
  type: 'point' | 'line' | 'polygon';
  coordinates: number[][];
  properties: Record<string, any>;
}
```

### 2.4 Task Schema
```typescript
interface Task {
  id: string;
  name: string;
  type: 'navigation' | 'inspection' | 'maintenance';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  robotId: string;
  worksetId: string;
  schedule: {
    start: string;
    end: string;
    repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  };
  parameters: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
```

## 3. Authentication Flow

### 3.1 JWT Authentication
```typescript
interface AuthState {
  user: {
    id: string;
    username: string;
    email: string;
    roles: string[];
  };
  token: string;
  expiresAt: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  user: AuthState['user'];
  token: string;
  expiresAt: string;
}
```

### 3.2 Role-Based Access Control
```typescript
interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

interface Permission {
  id: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}
```

## 4. Real-Time Communication

### 4.1 WebSocket Events
```typescript
interface WebSocketEvents {
  // Robot Events
  'robot:status': {
    robotId: string;
    status: Robot['status'];
    battery: number;
    position: Robot['position'];
  };
  
  // Task Events
  'task:status': {
    taskId: string;
    status: Task['status'];
    progress: number;
  };
  
  // System Events
  'system:alert': {
    type: 'error' | 'warning' | 'info';
    message: string;
    timestamp: string;
  };
}
```

### 4.2 MQTT Topics
```typescript
interface MQTTTopics {
  // Robot Topics
  robot: {
    status: (robotId: string) => `robot/${robotId}/status`;
    control: (robotId: string) => `robot/${robotId}/control`;
    telemetry: (robotId: string) => `robot/${robotId}/telemetry`;
  };
  
  // Task Topics
  task: {
    status: (taskId: string) => `task/${taskId}/status`;
    progress: (taskId: string) => `task/${taskId}/progress`;
  };
  
  // System Topics
  system: {
    alert: 'system/alert';
    maintenance: 'system/maintenance';
  };
}
```

## 5. Related Documents
- [System Overview](./1-System_Overview.md)
- [Development Guide](../Development/0-Development_Guide.md)
- [API Integration](../Development/3-API_Integration.md)
- [Error Handling](../Development/4-Error_Handling.md)
- [Security Implementation](../Development/7-Security_Implementation.md) 