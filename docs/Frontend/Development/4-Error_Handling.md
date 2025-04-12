# Error Handling Guide

## 1. Tổng quan

Hướng dẫn xử lý lỗi cho dự án Feet Robot Manager V2, sử dụng TypeScript và React, tuân thủ kiến trúc hệ thống và các tiêu chuẩn đã định nghĩa.

### 1.1 Mục tiêu
- Đảm bảo tính nhất quán trong xử lý lỗi
- Tăng khả năng phục hồi của ứng dụng
- Cải thiện trải nghiệm người dùng
- Tuân thủ kiến trúc hệ thống
- Hỗ trợ quy mô nhỏ (10 Workset, 100 robot)

### 1.2 Phạm vi
- API Error Handling
- UI Error Handling
- State Error Handling
- Network Error Handling
- Validation Error Handling
- Authentication Error Handling
- Authorization Error Handling

### 1.3 Giới hạn hệ thống
- Tối đa 10 Workset
- Tối đa 100 robot
- Bản đồ 2D đơn giản
- Giao thức: MQTT, WebSocket, gRPC
- Cơ sở dữ liệu: PostgreSQL, SQLite (mobile)

## 2. Error Architecture

### 2.1 Error Structure
```
src/errors/
├── types/             # Error types
│   ├── api.ts        # API errors
│   ├── ui.ts         # UI errors
│   ├── state.ts      # State errors
│   └── network.ts    # Network errors
├── handlers/         # Error handlers
│   ├── api.ts        # API error handler
│   ├── ui.ts         # UI error handler
│   └── global.ts     # Global error handler
└── components/       # Error components
    ├── ErrorBoundary.tsx
    ├── ErrorMessage.tsx
    └── ErrorFallback.tsx
```

### 2.2 Error Types
```typescript
// API Error Types
interface ApiError {
  code: string;
  message: string;
  details?: any;
}

type ApiErrorResponse = {
  error: ApiError;
};

// UI Error Types
interface UIError {
  type: 'validation' | 'state' | 'render';
  message: string;
  component: string;
  details?: any;
}

// State Error Types
interface StateError {
  type: 'initialization' | 'update' | 'synchronization';
  message: string;
  state: string;
  details?: any;
}

// Network Error Types
interface NetworkError {
  type: 'timeout' | 'connection' | 'server';
  message: string;
  url?: string;
  details?: any;
}
```

## 3. Error Implementation

### 3.1 API Error Handling
```typescript
// handlers/api.ts
import { AxiosError } from 'axios';
import { ApiError, ApiErrorResponse } from '../types/api';

export const handleApiError = (error: AxiosError): void => {
  if (error.response) {
    // Server responded with error
    const apiError = error.response.data as ApiErrorResponse;
    console.error('API Error:', apiError.error);
    
    switch (apiError.error.code) {
      case 'ROBOT_NOT_FOUND':
        // Handle robot not found
        showError('Robot not found');
        break;
      case 'ROBOT_BUSY':
        // Handle robot busy
        showError('Robot is busy');
        break;
      case 'INVALID_COMMAND':
        // Handle invalid command
        showError('Invalid command');
        break;
      case 'WORKSET_LIMIT':
        // Handle workset limit
        showError('Maximum workset limit reached');
        break;
      case 'ROBOT_LIMIT':
        // Handle robot limit
        showError('Maximum robot limit reached');
        break;
      default:
        // Handle other errors
        showError('An error occurred');
        break;
    }
  } else if (error.request) {
    // Request was made but no response
    console.error('Network Error:', error.message);
    showError('Network error occurred');
  } else {
    // Something else happened
    console.error('Error:', error.message);
    showError('An unexpected error occurred');
  }
};
```

### 3.2 UI Error Handling
```typescript
// handlers/ui.ts
import { UIError } from '../types/ui';

export const handleUIError = (error: UIError): void => {
  console.error('UI Error:', error);
  
  switch (error.type) {
    case 'validation':
      // Handle validation error
      showValidationError(error.message);
      break;
    case 'state':
      // Handle state error
      showStateError(error.message);
      break;
    case 'render':
      // Handle render error
      showRenderError(error.message);
      break;
  }
};

// components/ErrorMessage.tsx
interface ErrorMessageProps {
  error: UIError;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry
}) => {
  return (
    <div className="error-message">
      <h3>Error</h3>
      <p>{error.message}</p>
      {onRetry && (
        <button onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
};
```

### 3.3 State Error Handling
```typescript
// handlers/state.ts
import { StateError } from '../types/state';

export const handleStateError = (error: StateError): void => {
  console.error('State Error:', error);
  
  switch (error.type) {
    case 'initialization':
      // Handle initialization error
      showError('Failed to initialize state');
      break;
    case 'update':
      // Handle update error
      showError('Failed to update state');
      break;
    case 'synchronization':
      // Handle synchronization error
      showError('Failed to synchronize state');
      break;
  }
};

// hooks/useStateError.ts
export const useStateError = () => {
  const [error, setError] = useState<StateError | null>(null);
  
  const handleError = useCallback((error: StateError) => {
    setError(error);
    handleStateError(error);
  }, []);
  
  return {
    error,
    handleError,
    clearError: () => setError(null)
  };
};
```

### 3.4 Network Error Handling
```typescript
// handlers/network.ts
import { NetworkError } from '../types/network';

export const handleNetworkError = (error: NetworkError): void => {
  console.error('Network Error:', error);
  
  switch (error.type) {
    case 'timeout':
      // Handle timeout error
      showError('Request timed out');
      break;
    case 'connection':
      // Handle connection error
      showError('Connection error');
      break;
    case 'server':
      // Handle server error
      showError('Server error');
      break;
  }
};

// hooks/useNetworkError.ts
export const useNetworkError = () => {
  const [error, setError] = useState<NetworkError | null>(null);
  
  const handleError = useCallback((error: NetworkError) => {
    setError(error);
    handleNetworkError(error);
  }, []);
  
  return {
    error,
    handleError,
    clearError: () => setError(null)
  };
};
```

## 4. Error Boundaries

### 4.1 Global Error Boundary
```typescript
// components/ErrorBoundary.tsx
import React, { Component, ErrorInfo } from 'react';
import { ErrorFallback } from './ErrorFallback';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          onReset={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}
```

### 4.2 Error Fallback
```typescript
// components/ErrorFallback.tsx
interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  onReset
}) => {
  return (
    <div className="error-fallback">
      <h2>Something went wrong</h2>
      <p>{error?.message}</p>
      <button onClick={onReset}>
        Try again
      </button>
    </div>
  );
};
```

## 5. Error Logging

### 5.1 Error Logger
```typescript
// utils/logger.ts
export const logger = {
  error: (message: string, error: any): void => {
    console.error(message, error);
    // Send to error tracking service
    sendToErrorTracking({
      message,
      error,
      timestamp: new Date(),
      userAgent: navigator.userAgent
    });
  },
  
  warn: (message: string, warning: any): void => {
    console.warn(message, warning);
  },
  
  info: (message: string, info: any): void => {
    console.info(message, info);
  }
};
```

### 5.2 Error Tracking
```typescript
// utils/error-tracking.ts
interface ErrorTrackingData {
  message: string;
  error: any;
  timestamp: Date;
  userAgent: string;
}

export const sendToErrorTracking = (data: ErrorTrackingData): void => {
  // Send to error tracking service
  fetch('/api/error-tracking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
};
```

## 6. Testing

### 6.1 Error Tests
```typescript
// tests/error-handling.test.ts
import { handleApiError } from '../handlers/api';
import { handleUIError } from '../handlers/ui';
import { handleStateError } from '../handlers/state';
import { handleNetworkError } from '../handlers/network';

describe('Error Handling', () => {
  it('should handle API errors', () => {
    const error = {
      response: {
        data: {
          error: {
            code: 'ROBOT_NOT_FOUND',
            message: 'Robot not found'
          }
        }
      }
    };
    
    handleApiError(error);
    // Assert error handling
  });
  
  it('should handle UI errors', () => {
    const error = {
      type: 'validation',
      message: 'Invalid input',
      component: 'RobotForm'
    };
    
    handleUIError(error);
    // Assert error handling
  });
  
  it('should handle state errors', () => {
    const error = {
      type: 'initialization',
      message: 'Failed to initialize',
      state: 'robotState'
    };
    
    handleStateError(error);
    // Assert error handling
  });
  
  it('should handle network errors', () => {
    const error = {
      type: 'timeout',
      message: 'Request timed out',
      url: '/api/robots'
    };
    
    handleNetworkError(error);
    // Assert error handling
  });
});
```

## 7. Tài liệu liên quan

### 7.1 Development
- [Coding Standards](./1-Coding_Standards.md)
- [Component Development](./2-Component_Development.md)
- [API Integration](./3-API_Integration.md)
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