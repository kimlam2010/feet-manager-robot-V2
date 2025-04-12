# Security Implementation Guide

## 1. Tổng quan

Hướng dẫn triển khai bảo mật cho dự án Feet Robot Manager V2, sử dụng TypeScript và React, tuân thủ kiến trúc hệ thống và các tiêu chuẩn đã định nghĩa.

### 1.1 Mục tiêu
- Bảo vệ dữ liệu người dùng
- Ngăn chặn truy cập trái phép
- Đảm bảo tính toàn vẹn dữ liệu
- Hỗ trợ quy mô vừa (10 Workset, 100 robot)
- Tuân thủ kiến trúc hệ thống

### 1.2 Phạm vi
- Authentication
- Authorization
- Data Encryption
- Input Validation
- XSS Prevention
- CSRF Protection
- API Security

### 1.3 Giới hạn hệ thống
- Tối đa 10 Workset
- Tối đa 100 robot
- Bản đồ 2D đơn giản
- Giao thức: MQTT, WebSocket, gRPC
- Cơ sở dữ liệu: PostgreSQL, SQLite (mobile)

## 2. Security Architecture

### 2.1 Security Structure
```
src/
├── security/         # Security implementations
│   ├── auth/        # Authentication
│   ├── crypto/      # Cryptography
│   ├── validation/  # Input validation
│   └── api/         # API security
├── hooks/           # Security hooks
│   ├── useAuth/     # Authentication hooks
│   ├── useRole/     # Role hooks
│   └── useSecure/   # Security hooks
└── utils/           # Security utilities
    ├── sanitize/    # Sanitization
    ├── encrypt/     # Encryption
    └── validate/    # Validation
```

### 2.2 Security Types
```typescript
// Authentication Types
interface AuthState {
  user: User | null;
  token: string | null;
  roles: string[];
  permissions: string[];
}

// Role Types
interface Role {
  id: string;
  name: string;
  permissions: string[];
}

// Permission Types
interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

// Security Config
interface SecurityConfig {
  tokenExpiry: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  sessionTimeout: number;
}
```

## 3. Security Implementation

### 3.1 Authentication
```typescript
// security/auth/authService.ts
import { jwtDecode } from 'jwt-decode';
import { AuthState, User } from '../types/auth';

export const authService = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const { token } = await response.json();
    const decoded = jwtDecode(token) as { user: User; roles: string[] };
    
    return {
      user: decoded.user,
      token,
      roles: decoded.roles,
      permissions: getPermissions(decoded.roles)
    };
  },
  
  logout: () => {
    localStorage.removeItem('auth');
    window.location.href = '/login';
  },
  
  refreshToken: async () => {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    const { token } = await response.json();
    return token;
  }
};

// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { authService } from '../security/auth/authService';

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthState | null>(null);
  
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);
  
  const login = async (credentials: { username: string; password: string }) => {
    const authState = await authService.login(credentials);
    setAuth(authState);
    localStorage.setItem('auth', JSON.stringify(authState));
  };
  
  const logout = () => {
    authService.logout();
    setAuth(null);
  };
  
  return {
    auth,
    login,
    logout
  };
};
```

### 3.2 Authorization
```typescript
// security/auth/authorization.ts
import { AuthState } from '../types/auth';

export const hasPermission = (
  auth: AuthState | null,
  resource: string,
  action: string
): boolean => {
  if (!auth) return false;
  
  return auth.permissions.includes(`${resource}:${action}`);
};

export const hasRole = (
  auth: AuthState | null,
  role: string
): boolean => {
  if (!auth) return false;
  
  return auth.roles.includes(role);
};

// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { hasPermission } from '../security/auth/authorization';

interface ProtectedRouteProps {
  children: React.ReactNode;
  resource: string;
  action: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  resource,
  action
}) => {
  const { auth } = useAuth();
  
  if (!auth) {
    return <Navigate to="/login" />;
  }
  
  if (!hasPermission(auth, resource, action)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <>{children}</>;
};
```

### 3.3 Data Encryption
```typescript
// security/crypto/encryption.ts
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY;

export const encryption = {
  encrypt: (data: any): string => {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      SECRET_KEY
    ).toString();
  },
  
  decrypt: (encryptedData: string): any => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
};

// hooks/useEncryptedStorage.ts
import { useState, useEffect } from 'react';
import { encryption } from '../security/crypto/encryption';

export const useEncryptedStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    if (stored) {
      return encryption.decrypt(stored);
    }
    return initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, encryption.encrypt(value));
  }, [key, value]);
  
  return [value, setValue] as const;
};
```

### 3.4 Input Validation
```typescript
// security/validation/validator.ts
import * as yup from 'yup';

export const robotSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must not exceed 50 characters'),
  
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['idle', 'busy', 'offline']),
  
  battery: yup
    .number()
    .required('Battery level is required')
    .min(0, 'Battery level must be at least 0')
    .max(100, 'Battery level must not exceed 100')
});

export const worksetSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must not exceed 50 characters'),
  
  robots: yup
    .array()
    .max(100, 'Maximum 100 robots allowed')
});

// hooks/useValidation.ts
import { useCallback } from 'react';
import { robotSchema, worksetSchema } from '../security/validation/validator';

export const useValidation = () => {
  const validateRobot = useCallback(async (data: any) => {
    try {
      await robotSchema.validate(data, { abortEarly: false });
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors: Record<string, string> = {};
        error.inner.forEach(err => {
          if (err.path) {
            errors[err.path] = err.message;
          }
        });
        return { isValid: false, errors };
      }
      throw error;
    }
  }, []);
  
  const validateWorkset = useCallback(async (data: any) => {
    try {
      await worksetSchema.validate(data, { abortEarly: false });
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors: Record<string, string> = {};
        error.inner.forEach(err => {
          if (err.path) {
            errors[err.path] = err.message;
          }
        });
        return { isValid: false, errors };
      }
      throw error;
    }
  }, []);
  
  return {
    validateRobot,
    validateWorkset
  };
};
```

### 3.5 XSS Prevention
```typescript
// security/sanitize/sanitizer.ts
import DOMPurify from 'dompurify';

export const sanitizer = {
  sanitize: (html: string): string => {
    return DOMPurify.sanitize(html);
  },
  
  sanitizeObject: <T extends Record<string, any>>(obj: T): T => {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = DOMPurify.sanitize(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizer.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized as T;
  }
};

// components/SanitizedContent.tsx
import React from 'react';
import { sanitizer } from '../security/sanitize/sanitizer';

interface SanitizedContentProps {
  content: string;
}

export const SanitizedContent: React.FC<SanitizedContentProps> = ({
  content
}) => {
  const sanitized = sanitizer.sanitize(content);
  
  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};
```

### 3.6 CSRF Protection
```typescript
// security/csrf/csrf.ts
export const csrf = {
  getToken: (): string | null => {
    return localStorage.getItem('csrf-token');
  },
  
  setToken: (token: string): void => {
    localStorage.setItem('csrf-token', token);
  },
  
  validateToken: (token: string): boolean => {
    const storedToken = csrf.getToken();
    return storedToken === token;
  }
};

// api/axios.ts
import axios from 'axios';
import { csrf } from '../security/csrf/csrf';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = csrf.getToken();
  if (token) {
    config.headers['X-CSRF-Token'] = token;
  }
  return config;
});

export default api;
```

## 4. Security Monitoring

### 4.1 Security Logging
```typescript
// security/logging/securityLogger.ts
interface SecurityLog {
  timestamp: Date;
  event: string;
  user?: string;
  details: Record<string, any>;
}

export const securityLogger = {
  log: (event: string, details: Record<string, any>) => {
    const log: SecurityLog = {
      timestamp: new Date(),
      event,
      details
    };
    
    // Send to security monitoring service
    fetch('/api/security/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(log)
    });
  }
};

// hooks/useSecurityLogging.ts
import { useEffect } from 'react';
import { securityLogger } from '../security/logging/securityLogger';

export const useSecurityLogging = () => {
  useEffect(() => {
    const handleSecurityEvent = (event: SecurityEvent) => {
      securityLogger.log(event.type, {
        user: event.user,
        details: event.details
      });
    };
    
    window.addEventListener('security', handleSecurityEvent);
    return () => {
      window.removeEventListener('security', handleSecurityEvent);
    };
  }, []);
};
```

## 5. Tài liệu liên quan

### 5.1 Development
- [Coding Standards](./1-Coding_Standards.md)
- [Component Development](./2-Component_Development.md)
- [API Integration](./3-API_Integration.md)
- [Error Handling](./4-Error_Handling.md)
- [Testing Strategy](./5-Testing_Strategy.md)
- [Performance Optimization](./6-Performance_Optimization.md)
- [Deployment Process](./8-Deployment_Process.md)

### 5.2 Architecture
- [Frontend Architecture](../Architecture/1-README.md)
- [Component Architecture](../Architecture/2-Component_Architecture.md)
- [State Management](../Architecture/3-State_Management.md)
- [API Integration](../Architecture/5-API_Integration.md)
- [Security Architecture](../Architecture/9-Security_Architecture.md)
- [System Documentation](../../Systerm/System_Documentation.md)
- [Features](../../User Guild/Features)
- [Getting Started](../../User Guild/Getting_Started)
- [Troubleshooting](../../User Guild/Troubleshooting) 