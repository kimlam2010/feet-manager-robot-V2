# Security Architecture

## 1. Tổng quan

Quản lý bảo mật cho ứng dụng React với các biện pháp bảo mật toàn diện.

### 1.1 Mục tiêu
- Bảo vệ dữ liệu người dùng
- Ngăn chặn tấn công
- Tuân thủ quy định
- Bảo mật end-to-end
- Phát hiện sớm rủi ro

### 1.2 Phạm vi
- Authentication
- Authorization
- Data Protection
- Network Security
- Security Monitoring

## 2. Cấu trúc thư mục

```
src/
├── security/
│   ├── auth/
│   │   ├── AuthProvider.tsx
│   │   ├── useAuth.ts
│   │   └── authUtils.ts
│   ├── encryption/
│   │   ├── crypto.ts
│   │   └── keyManagement.ts
│   ├── headers/
│   │   ├── CSP.ts
│   │   └── securityHeaders.ts
│   └── monitoring/
│       ├── sentry.ts
│       └── securityLogger.ts
└── config/
    ├── security.ts
    └── env.ts
```

## 3. Authentication

### 3.1 Auth Provider
```typescript
// security/auth/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode<User>(storedToken);
        if (decoded.exp && decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setUser(decoded);
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    }
  }, []);

  const login = async (credentials: Credentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const { token } = await response.json();
      const decoded = jwtDecode<User>(token);

      localStorage.setItem('token', token);
      setToken(token);
      setUser(decoded);
      navigate('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 3.2 Protected Route
```typescript
// security/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
```

## 4. Authorization

### 4.1 Role-Based Access
```typescript
// security/auth/useAuthorization.ts
import { useAuth } from './useAuth';

interface Permission {
  resource: string;
  action: 'read' | 'write' | 'delete';
}

export const useAuthorization = () => {
  const { user } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!user?.roles) return false;

    return user.roles.some(role => {
      const rolePermissions = getRolePermissions(role);
      return rolePermissions.some(
        p => p.resource === permission.resource && p.action === permission.action
      );
    });
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};
```

### 4.2 Permission Component
```typescript
// security/auth/Permission.tsx
import { useAuthorization } from './useAuthorization';

interface PermissionProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Permission: React.FC<PermissionProps> = ({
  permission,
  children,
  fallback = null,
}) => {
  const { hasPermission } = useAuthorization();

  return hasPermission(permission) ? <>{children}</> : <>{fallback}</>;
};
```

## 5. Data Protection

### 5.1 Encryption
```typescript
// security/encryption/crypto.ts
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY;

export const encrypt = (data: string): string => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decrypt = (encryptedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const hash = (data: string): string => {
  return CryptoJS.SHA256(data).toString();
};
```

### 5.2 Secure Storage
```typescript
// security/encryption/secureStorage.ts
import { encrypt, decrypt } from './crypto';

export const secureStorage = {
  setItem: (key: string, value: string): void => {
    const encryptedValue = encrypt(value);
    localStorage.setItem(key, encryptedValue);
  },

  getItem: (key: string): string | null => {
    const encryptedValue = localStorage.getItem(key);
    if (!encryptedValue) return null;
    return decrypt(encryptedValue);
  },

  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },
};
```

## 6. Network Security

### 6.1 Security Headers
```typescript
// security/headers/securityHeaders.ts
export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https://api.example.com wss://ws.example.com;",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};
```

### 6.2 API Security
```typescript
// security/api/axiosConfig.ts
import axios from 'axios';
import { useAuth } from '../auth/useAuth';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 7. Security Monitoring

### 7.1 Error Tracking
```typescript
// security/monitoring/sentry.ts
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initErrorTracking = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV,
      beforeSend(event) {
        if (event.user) {
          delete event.user.email;
          delete event.user.ip_address;
        }
        return event;
      },
    });
  }
};
```

### 7.2 Security Logger
```typescript
// security/monitoring/securityLogger.ts
export const securityLogger = {
  logSecurityEvent: (event: SecurityEvent) => {
    if (process.env.NODE_ENV === 'production') {
      console.log('[Security Event]', {
        timestamp: new Date().toISOString(),
        eventType: event.type,
        severity: event.severity,
        details: event.details,
      });
    }
  },

  logAuthAttempt: (success: boolean, username: string) => {
    securityLogger.logSecurityEvent({
      type: 'auth_attempt',
      severity: success ? 'info' : 'warning',
      details: { success, username },
    });
  },

  logPermissionDenied: (userId: string, resource: string, action: string) => {
    securityLogger.logSecurityEvent({
      type: 'permission_denied',
      severity: 'warning',
      details: { userId, resource, action },
    });
  },
};
```

## 8. Best Practices

### 8.1 Authentication
- Use JWT with short expiration
- Implement refresh tokens
- Secure token storage
- Session management
- Password policies

### 8.2 Authorization
- Role-based access control
- Permission granularity
- Principle of least privilege
- Regular access reviews
- Audit logging

### 8.3 Data Protection
- Encrypt sensitive data
- Secure storage
- Data minimization
- Regular backups
- Data retention policies

### 8.4 Network Security
- HTTPS enforcement
- CSP implementation
- CORS configuration
- Rate limiting
- DDoS protection

### 8.5 Monitoring
- Real-time monitoring
- Alert systems
- Incident response
- Regular audits
- Security updates 