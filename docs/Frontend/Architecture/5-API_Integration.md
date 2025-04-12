# API Integration

## 1. Tổng quan

Tích hợp API trong ứng dụng React sử dụng Axios và React Query để quản lý các request và caching.

### 1.1 Mục tiêu
- Quản lý API request hiệu quả
- Caching và state management
- Error handling
- Type safety
- Performance optimization

### 1.2 Phạm vi
- REST API
- WebSocket
- Authentication
- Error Handling
- Caching

## 2. Cấu trúc thư mục

```
src/
├── api/
│   ├── client.ts
│   ├── endpoints.ts
│   ├── types.ts
│   └── services/
│       ├── auth.ts
│       ├── robot.ts
│       └── task.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useRobot.ts
│   └── useTask.ts
└── utils/
    ├── errorHandler.ts
    └── responseHandler.ts
```

## 3. API Client

### 3.1 Axios Configuration
```typescript
// api/client.ts
import axios from 'axios';
import { getToken } from '../utils/auth';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 3.2 API Endpoints
```typescript
// api/endpoints.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  ROBOTS: {
    LIST: '/robots',
    DETAIL: (id: string) => `/robots/${id}`,
    CONTROL: (id: string) => `/robots/${id}/control`,
    STATUS: (id: string) => `/robots/${id}/status`,
  },
  TASKS: {
    LIST: '/tasks',
    CREATE: '/tasks',
    DETAIL: (id: string) => `/tasks/${id}`,
    UPDATE: (id: string) => `/tasks/${id}`,
  },
};
```

## 4. API Services

### 4.1 Auth Service
```typescript
// api/services/auth.ts
import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH);
    return response.data;
  },
};
```

### 4.2 Robot Service
```typescript
// api/services/robot.ts
import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';

export const robotService = {
  getRobots: async (): Promise<Robot[]> => {
    const response = await apiClient.get(API_ENDPOINTS.ROBOTS.LIST);
    return response.data;
  },

  getRobot: async (id: string): Promise<Robot> => {
    const response = await apiClient.get(API_ENDPOINTS.ROBOTS.DETAIL(id));
    return response.data;
  },

  controlRobot: async (id: string, command: RobotCommand): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.ROBOTS.CONTROL(id), command);
  },

  getRobotStatus: async (id: string): Promise<RobotStatus> => {
    const response = await apiClient.get(API_ENDPOINTS.ROBOTS.STATUS(id));
    return response.data;
  },
};
```

## 5. React Query Integration

### 5.1 Query Client Setup
```typescript
// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* App content */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
```

### 5.2 Custom Query Hooks
```typescript
// hooks/useRobot.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { robotService } from '../api/services/robot';

export const useRobot = (id: string) => {
  return useQuery({
    queryKey: ['robot', id],
    queryFn: () => robotService.getRobot(id),
  });
};

export const useRobots = () => {
  return useQuery({
    queryKey: ['robots'],
    queryFn: () => robotService.getRobots(),
  });
};

export const useControlRobot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, command }: { id: string; command: RobotCommand }) =>
      robotService.controlRobot(id, command),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['robot', id] });
    },
  });
};
```

## 6. WebSocket Integration

### 6.1 WebSocket Client
```typescript
// api/websocket.ts
import { getToken } from '../utils/auth';

class WebSocketClient {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(url: string) {
    const token = getToken();
    this.socket = new WebSocket(`${url}?token=${token}`);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.reconnect();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(process.env.REACT_APP_WS_URL!), 1000 * this.reconnectAttempts);
    }
  }

  send(message: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  onMessage(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.onmessage = (event) => {
        callback(JSON.parse(event.data));
      };
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const wsClient = new WebSocketClient();
```

### 6.2 WebSocket Hook
```typescript
// hooks/useWebSocket.ts
import { useEffect, useCallback } from 'react';
import { wsClient } from '../api/websocket';

export const useWebSocket = (onMessage: (data: any) => void) => {
  useEffect(() => {
    wsClient.connect(process.env.REACT_APP_WS_URL!);
    wsClient.onMessage(onMessage);

    return () => {
      wsClient.disconnect();
    };
  }, [onMessage]);
};
```

## 7. Error Handling

### 7.1 Error Types
```typescript
// api/types.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, public errors: Record<string, string[]>) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}
```

### 7.2 Error Handler
```typescript
// utils/errorHandler.ts
import { ApiError, ValidationError, UnauthorizedError } from '../api/types';

export const handleApiError = (error: any) => {
  if (error instanceof ValidationError) {
    // Handle validation errors
    console.error('Validation errors:', error.errors);
  } else if (error instanceof UnauthorizedError) {
    // Handle unauthorized errors
    window.location.href = '/login';
  } else if (error instanceof ApiError) {
    // Handle other API errors
    console.error('API error:', error.message);
  } else {
    // Handle unexpected errors
    console.error('Unexpected error:', error);
  }
};
```

## 8. Best Practices

### 8.1 API Design
- Use consistent endpoint structure
- Implement proper error handling
- Use TypeScript for type safety
- Document API endpoints

### 8.2 Performance
- Implement request caching
- Use request batching
- Optimize payload size
- Handle rate limiting

### 8.3 Security
- Implement proper authentication
- Use HTTPS
- Sanitize input data
- Validate responses 