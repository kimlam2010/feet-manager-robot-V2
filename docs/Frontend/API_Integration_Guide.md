# API Integration Guide

## API Service Structure

### Base Service
```typescript
// src/api/services/base.ts
import axios from 'axios';
import { API_BASE_URL } from '../../../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Service Types
```typescript
// src/api/types/index.ts
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
```

### Service Implementation
```typescript
// src/api/services/robot.ts
import api from './base';
import { ApiResponse, PaginatedResponse, ErrorResponse } from '../types';
import { Robot } from '../../../types/robot';

export const robotService = {
  // Get all robots
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Robot>> => {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Robot>>>(
        '/robots',
        { params }
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get robot by id
  getById: async (id: string): Promise<Robot> => {
    try {
      const response = await api.get<ApiResponse<Robot>>(`/robots/${id}`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create robot
  create: async (data: Partial<Robot>): Promise<Robot> => {
    try {
      const response = await api.post<ApiResponse<Robot>>('/robots', data);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update robot
  update: async (id: string, data: Partial<Robot>): Promise<Robot> => {
    try {
      const response = await api.put<ApiResponse<Robot>>(`/robots/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete robot
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/robots/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Error handling utility
const handleApiError = (error: any): ErrorResponse => {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data.message || 'An error occurred',
      errors: error.response.data.errors,
    };
  }
  return {
    status: 500,
    message: 'Network error occurred',
  };
};
```

## API Integration Patterns

### Using React Query
```typescript
// src/hooks/useRobots.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { robotService } from '../../api/services/robot';
import { Robot } from '../../types/robot';

export const useRobots = () => {
  const queryClient = useQueryClient();

  // Get all robots
  const { data: robots, isLoading, error } = useQuery({
    queryKey: ['robots'],
    queryFn: () => robotService.getAll(),
  });

  // Create robot
  const createRobot = useMutation({
    mutationFn: (data: Partial<Robot>) => robotService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['robots'] });
    },
  });

  // Update robot
  const updateRobot = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Robot> }) =>
      robotService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['robots'] });
    },
  });

  // Delete robot
  const deleteRobot = useMutation({
    mutationFn: (id: string) => robotService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['robots'] });
    },
  });

  return {
    robots,
    isLoading,
    error,
    createRobot,
    updateRobot,
    deleteRobot,
  };
};
```

### Using Context
```typescript
// src/contexts/RobotContext.tsx
import React, { createContext, useContext } from 'react';
import { useRobots } from '../hooks/useRobots';
import { Robot } from '../types/robot';

interface RobotContextType {
  robots: Robot[];
  isLoading: boolean;
  error: any;
  createRobot: (data: Partial<Robot>) => Promise<void>;
  updateRobot: (id: string, data: Partial<Robot>) => Promise<void>;
  deleteRobot: (id: string) => Promise<void>;
}

const RobotContext = createContext<RobotContextType | undefined>(undefined);

export const RobotProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const robotData = useRobots();

  return (
    <RobotContext.Provider value={robotData}>{children}</RobotContext.Provider>
  );
};

export const useRobotContext = () => {
  const context = useContext(RobotContext);
  if (!context) {
    throw new Error('useRobotContext must be used within a RobotProvider');
  }
  return context;
};
```

## Error Handling

### Global Error Boundary
```typescript
// src/components/ErrorBoundary.tsx
import React from 'react';
import { ErrorFallback } from './ErrorFallback';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

### API Error Handling
```typescript
// src/utils/errorHandling.ts
import { ErrorResponse } from '../api/types';

export const handleApiError = (error: any): ErrorResponse => {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data.message || 'An error occurred',
      errors: error.response.data.errors,
    };
  }
  return {
    status: 500,
    message: 'Network error occurred',
  };
};

export const displayError = (error: ErrorResponse) => {
  if (error.errors) {
    return Object.entries(error.errors)
      .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
      .join('\n');
  }
  return error.message;
};
```

## Best Practices

### API Integration
1. Use TypeScript for type safety
2. Implement proper error handling
3. Use interceptors for common tasks
4. Implement retry logic for failed requests
5. Cache responses when appropriate
6. Handle offline scenarios
7. Implement proper loading states

### State Management
1. Use React Query for server state
2. Use Context for global UI state
3. Implement optimistic updates
4. Handle concurrent updates
5. Implement proper error recovery
6. Use proper loading indicators
7. Implement proper error messages

### Performance
1. Implement request debouncing
2. Use proper caching strategies
3. Implement request cancellation
4. Use proper loading states
5. Implement proper error handling
6. Use proper retry strategies
7. Implement proper offline support 