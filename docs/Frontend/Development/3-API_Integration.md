# API Integration Guide

## 1. Tổng quan

Hướng dẫn tích hợp API cho dự án Feet Robot Manager V2, sử dụng TypeScript và React, tuân thủ kiến trúc hệ thống và các tiêu chuẩn đã định nghĩa.

### 1.1 Mục tiêu
- Đảm bảo tính nhất quán của API calls
- Tăng khả năng tái sử dụng
- Cải thiện khả năng bảo trì
- Tuân thủ kiến trúc hệ thống
- Hỗ trợ quy mô nhỏ (3 Workset, 20 robot)

### 1.2 Phạm vi
- REST API Integration
- WebSocket Integration
- MQTT Integration
- gRPC Integration
- Error Handling
- Authentication
- Authorization

### 1.3 Giới hạn hệ thống
- Tối đa 3 Workset
- Tối đa 20 robot
- Bản đồ 2D đơn giản
- Giao thức: MQTT, WebSocket, gRPC
- Cơ sở dữ liệu: PostgreSQL, SQLite (mobile)

## 2. API Architecture

### 2.1 Service Structure
```
src/services/
├── api/                # REST API services
│   ├── robot.ts       # Robot API
│   ├── workset.ts     # Workset API
│   ├── task.ts        # Task API
│   └── map.ts         # Map API
├── websocket/         # WebSocket services
│   ├── robot.ts       # Robot WebSocket
│   └── task.ts        # Task WebSocket
├── mqtt/              # MQTT services
│   ├── robot.ts       # Robot MQTT
│   └── task.ts        # Task MQTT
├── grpc/              # gRPC services
│   ├── robot.ts       # Robot gRPC
│   └── task.ts        # Task gRPC
└── types/             # API types
    ├── robot.ts       # Robot types
    ├── workset.ts     # Workset types
    ├── task.ts        # Task types
    └── map.ts         # Map types
```

### 2.2 API Types
```typescript
// Robot types
interface Robot {
  id: string;
  name: string;
  status: RobotStatus;
  position: Position;
  battery: number;
  worksetId: string;
  lastUpdated: Date;
}

type RobotStatus = 'idle' | 'working' | 'error';

// Workset types
interface Workset {
  id: string;
  name: string;
  robots: Robot[];
  maps: Map[];
  tasks: Task[];
}

// Task types
interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  robotId: string;
  worksetId: string;
  schedule?: Schedule;
}

type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

// Map types
interface Map {
  id: string;
  name: string;
  worksetId: string;
  filePath: string;
  resolution: number;
  features: GeoJSON.FeatureCollection;
}
```

## 3. API Implementation

### 3.1 REST API
```typescript
// api/robot.ts
import axios from 'axios';
import { Robot, RobotStatus } from '../types/robot';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const robotApi = {
  // Get all robots
  getAll: async (): Promise<Robot[]> => {
    const response = await axios.get(`${API_BASE_URL}/robots`);
    return response.data;
  },

  // Get robot by id
  getById: async (id: string): Promise<Robot> => {
    const response = await axios.get(`${API_BASE_URL}/robots/${id}`);
    return response.data;
  },

  // Update robot status
  updateStatus: async (id: string, status: RobotStatus): Promise<Robot> => {
    const response = await axios.patch(`${API_BASE_URL}/robots/${id}/status`, { status });
    return response.data;
  },

  // Control robot
  control: async (id: string, command: RobotCommand): Promise<Robot> => {
    const response = await axios.post(`${API_BASE_URL}/robots/${id}/control`, { command });
    return response.data;
  }
};
```

### 3.2 WebSocket
```typescript
// websocket/robot.ts
import { io, Socket } from 'socket.io-client';
import { Robot, RobotStatus } from '../types/robot';

const WS_BASE_URL = process.env.REACT_APP_WS_BASE_URL;

export class RobotWebSocket {
  private socket: Socket;

  constructor() {
    this.socket = io(`${WS_BASE_URL}/robots`);
  }

  // Connect to robot
  connect(robotId: string): void {
    this.socket.emit('connect-robot', { robotId });
  }

  // Disconnect from robot
  disconnect(robotId: string): void {
    this.socket.emit('disconnect-robot', { robotId });
  }

  // Listen to robot status updates
  onStatusUpdate(callback: (robot: Robot) => void): void {
    this.socket.on('robot-status-update', callback);
  }

  // Send control command
  sendCommand(robotId: string, command: RobotCommand): void {
    this.socket.emit('robot-command', { robotId, command });
  }
}
```

### 3.3 MQTT
```typescript
// mqtt/robot.ts
import mqtt from 'mqtt';
import { Robot, RobotStatus } from '../types/robot';

const MQTT_BROKER = process.env.REACT_APP_MQTT_BROKER;

export class RobotMQTT {
  private client: mqtt.Client;

  constructor() {
    this.client = mqtt.connect(MQTT_BROKER);
  }

  // Subscribe to robot topic
  subscribe(robotId: string): void {
    this.client.subscribe(`robots/${robotId}/status`);
    this.client.subscribe(`robots/${robotId}/position`);
  }

  // Unsubscribe from robot topic
  unsubscribe(robotId: string): void {
    this.client.unsubscribe(`robots/${robotId}/status`);
    this.client.unsubscribe(`robots/${robotId}/position`);
  }

  // Listen to robot messages
  onMessage(callback: (topic: string, message: string) => void): void {
    this.client.on('message', callback);
  }

  // Publish command
  publishCommand(robotId: string, command: RobotCommand): void {
    this.client.publish(`robots/${robotId}/command`, JSON.stringify(command));
  }
}
```

### 3.4 gRPC
```typescript
// grpc/robot.ts
import { RobotServiceClient } from '../proto/robot_grpc_pb';
import { Robot, RobotStatus } from '../types/robot';

const GRPC_SERVER = process.env.REACT_APP_GRPC_SERVER;

export class RobotGRPC {
  private client: RobotServiceClient;

  constructor() {
    this.client = new RobotServiceClient(GRPC_SERVER);
  }

  // Get robot status
  async getStatus(robotId: string): Promise<RobotStatus> {
    const request = new GetStatusRequest();
    request.setRobotId(robotId);
    
    const response = await this.client.getStatus(request);
    return response.getStatus();
  }

  // Send control command
  async sendCommand(robotId: string, command: RobotCommand): Promise<void> {
    const request = new ControlRequest();
    request.setRobotId(robotId);
    request.setCommand(command);
    
    await this.client.control(request);
  }
}
```

## 4. Error Handling

### 4.1 API Error Types
```typescript
interface ApiError {
  code: string;
  message: string;
  details?: any;
}

type ApiErrorResponse = {
  error: ApiError;
};
```

### 4.2 Error Handling Implementation
```typescript
// utils/error-handler.ts
import { AxiosError } from 'axios';

export const handleApiError = (error: AxiosError): void => {
  if (error.response) {
    // Server responded with error
    const apiError = error.response.data as ApiErrorResponse;
    console.error('API Error:', apiError.error);
    
    switch (apiError.error.code) {
      case 'ROBOT_NOT_FOUND':
        // Handle robot not found
        break;
      case 'ROBOT_BUSY':
        // Handle robot busy
        break;
      case 'INVALID_COMMAND':
        // Handle invalid command
        break;
      default:
        // Handle other errors
        break;
    }
  } else if (error.request) {
    // Request was made but no response
    console.error('Network Error:', error.message);
  } else {
    // Something else happened
    console.error('Error:', error.message);
  }
};
```

## 5. Authentication & Authorization

### 5.1 JWT Implementation
```typescript
// utils/auth.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const auth = {
  // Login
  login: async (username: string, password: string): Promise<string> => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password
    });
    
    const token = response.data.token;
    localStorage.setItem('token', token);
    return token;
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem('token');
  },

  // Get token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};
```

### 5.2 API Interceptor
```typescript
// utils/api-interceptor.ts
import axios from 'axios';
import { auth } from './auth';

axios.interceptors.request.use(
  (config) => {
    const token = auth.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      auth.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 6. Testing

### 6.1 API Tests
```typescript
// tests/api/robot.test.ts
import { robotApi } from '../../services/api/robot';
import { mockRobot } from '../mocks/robot';

describe('Robot API', () => {
  it('should get all robots', async () => {
    const robots = await robotApi.getAll();
    expect(robots).toBeInstanceOf(Array);
  });

  it('should get robot by id', async () => {
    const robot = await robotApi.getById(mockRobot.id);
    expect(robot).toEqual(mockRobot);
  });

  it('should update robot status', async () => {
    const updatedRobot = await robotApi.updateStatus(mockRobot.id, 'working');
    expect(updatedRobot.status).toBe('working');
  });
});
```

### 6.2 WebSocket Tests
```typescript
// tests/websocket/robot.test.ts
import { RobotWebSocket } from '../../services/websocket/robot';
import { mockRobot } from '../mocks/robot';

describe('Robot WebSocket', () => {
  let ws: RobotWebSocket;

  beforeEach(() => {
    ws = new RobotWebSocket();
  });

  it('should connect to robot', () => {
    const connectSpy = jest.spyOn(ws, 'connect');
    ws.connect(mockRobot.id);
    expect(connectSpy).toHaveBeenCalledWith(mockRobot.id);
  });

  it('should handle status updates', () => {
    const callback = jest.fn();
    ws.onStatusUpdate(callback);
    
    // Simulate status update
    const statusUpdate = { ...mockRobot, status: 'working' };
    ws.socket.emit('robot-status-update', statusUpdate);
    
    expect(callback).toHaveBeenCalledWith(statusUpdate);
  });
});
```

## 7. Tài liệu liên quan

### 7.1 Development
- [Coding Standards](./1-Coding_Standards.md)
- [Component Development](./2-Component_Development.md)
- [Error Handling](./4-Error_Handling.md)
- [Testing Strategy](./5-Testing_Strategy.md)
- [Performance Optimization](./6-Performance_Optimization.md)
- [Security Implementation](./7-Security_Implementation.md)
- [Deployment Process](./8-Deployment_Process.md)

### 7.2 Architecture
- [Frontend Architecture](../Architecture/1-README.md)
- [Component Architecture](../Architecture/2-Component_Architecture.md)
- [State Management](../Architecture/3-State_Management.md)
- [API Integration](../Architecture/5-API_Integration.md)
- [Security Architecture](../Architecture/9-Security_Architecture.md)
- [System Documentation](../../Systerm/System_Documentation.md)
- [Features](../../User Guild/Features)
- [Getting Started](../../User Guild/Getting_Started)
- [Troubleshooting](../../User Guild/Troubleshooting) 