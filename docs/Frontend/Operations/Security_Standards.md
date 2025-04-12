# Security Standards

## 1. Tổng quan

Tài liệu này cung cấp hướng dẫn chi tiết về các tiêu chuẩn bảo mật trong dự án Feet Robot Manager V2, bao gồm các best practices, patterns và các ví dụ cụ thể.

### 1.1 Mục tiêu
- Bảo vệ dữ liệu người dùng
- Ngăn chặn các cuộc tấn công phổ biến
- Tuân thủ các tiêu chuẩn bảo mật
- Duy trì tính bảo mật của ứng dụng
- Đảm bảo an toàn thông tin

### 1.2 Các mối đe dọa chính
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- SQL Injection
- Man-in-the-Middle (MITM)
- Clickjacking
- Information Disclosure

## 2. Authentication & Authorization

### 2.1 JWT Implementation
```typescript
// ❌ Bad
const token = localStorage.getItem('token');
fetch('/api/data', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

// ✅ Good
interface TokenPayload {
  sub: string;
  exp: number;
  iat: number;
  role: string;
}

class AuthService {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_KEY = 'refresh_token';

  static async login(credentials: LoginCredentials): Promise<void> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new AuthError('Login failed');
    }

    const { token, refreshToken } = await response.json();
    this.setTokens(token, refreshToken);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem(this.REFRESH_KEY);
    if (!refreshToken) {
      throw new AuthError('No refresh token available');
    }

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      this.clearTokens();
      throw new AuthError('Token refresh failed');
    }

    const { token } = await response.json();
    this.setTokens(token, refreshToken);
  }

  private static setTokens(token: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_KEY, refreshToken);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
  }
}
```

### 2.2 Role-Based Access Control
```typescript
// ❌ Bad
function canAccessFeature(user) {
  return user.role === 'admin';
}

// ✅ Good
enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

interface Permission {
  resource: string;
  action: 'read' | 'write' | 'delete';
}

class RBACService {
  private static readonly PERMISSIONS: Record<UserRole, Permission[]> = {
    [UserRole.ADMIN]: [
      { resource: '*', action: 'read' },
      { resource: '*', action: 'write' },
      { resource: '*', action: 'delete' },
    ],
    [UserRole.MANAGER]: [
      { resource: 'robots', action: 'read' },
      { resource: 'robots', action: 'write' },
    ],
    [UserRole.USER]: [
      { resource: 'robots', action: 'read' },
    ],
  };

  static hasPermission(userRole: UserRole, permission: Permission): boolean {
    const rolePermissions = this.PERMISSIONS[userRole];
    if (!rolePermissions) return false;

    return rolePermissions.some(p => 
      (p.resource === '*' || p.resource === permission.resource) &&
      p.action === permission.action
    );
  }
}
```

## 3. Data Protection

### 3.1 Input Validation
```typescript
// ❌ Bad
function updateRobot(id, data) {
  return fetch(`/api/robots/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// ✅ Good
interface RobotUpdate {
  name?: string;
  status?: 'active' | 'inactive';
  settings?: {
    speed?: number;
    power?: number;
  };
}

class ValidationService {
  static validateRobotUpdate(data: unknown): RobotUpdate {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Invalid update data');
    }

    const update = data as RobotUpdate;

    if (update.name && typeof update.name !== 'string') {
      throw new ValidationError('Invalid name format');
    }

    if (update.status && !['active', 'inactive'].includes(update.status)) {
      throw new ValidationError('Invalid status value');
    }

    if (update.settings) {
      if (update.settings.speed && typeof update.settings.speed !== 'number') {
        throw new ValidationError('Invalid speed value');
      }
      if (update.settings.power && typeof update.settings.power !== 'number') {
        throw new ValidationError('Invalid power value');
      }
    }

    return update;
  }
}
```

### 3.2 Data Encryption
```typescript
// ❌ Bad
localStorage.setItem('sensitive_data', JSON.stringify(data));

// ✅ Good
class EncryptionService {
  private static readonly ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

  static async encrypt(data: unknown): Promise<string> {
    const text = JSON.stringify(data);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(text);
    
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(this.ENCRYPTION_KEY),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    );

    return JSON.stringify({
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encryptedBuffer))
    });
  }

  static async decrypt(encrypted: string): Promise<unknown> {
    const { iv, data } = JSON.parse(encrypted);
    const encoder = new TextEncoder();
    
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(this.ENCRYPTION_KEY),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      key,
      new Uint8Array(data)
    );

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedBuffer));
  }
}
```

## 4. API Security

### 4.1 CSRF Protection
```typescript
// ❌ Bad
fetch('/api/data', {
  method: 'POST',
  body: JSON.stringify(data)
});

// ✅ Good
class APIService {
  private static async getCsrfToken(): Promise<string> {
    const response = await fetch('/api/csrf-token');
    const { token } = await response.json();
    return token;
  }

  static async post<T>(endpoint: string, data: unknown): Promise<T> {
    const token = await this.getCsrfToken();
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': token
      },
      body: JSON.stringify(data),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new APIError('Request failed');
    }

    return response.json();
  }
}
```

### 4.2 Rate Limiting
```typescript
// ❌ Bad
async function login(credentials) {
  return fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

// ✅ Good
class RateLimiter {
  private static readonly limits = new Map<string, number[]>();
  private static readonly WINDOW = 60 * 1000; // 1 minute
  private static readonly MAX_REQUESTS = 5;

  static async checkLimit(key: string): Promise<boolean> {
    const now = Date.now();
    const timestamps = this.limits.get(key) || [];
    
    // Remove old timestamps
    const recent = timestamps.filter(time => now - time < this.WINDOW);
    
    if (recent.length >= this.MAX_REQUESTS) {
      return false;
    }
    
    recent.push(now);
    this.limits.set(key, recent);
    return true;
  }
}

class AuthService {
  static async login(credentials: LoginCredentials): Promise<void> {
    const ip = await this.getClientIP();
    const canProceed = await RateLimiter.checkLimit(ip);
    
    if (!canProceed) {
      throw new RateLimitError('Too many login attempts');
    }

    // Proceed with login
  }
}
```

## 5. Content Security

### 5.1 XSS Prevention
```typescript
// ❌ Bad
function displayUserInput(input) {
  return <div dangerouslySetInnerHTML={{ __html: input }} />;
}

// ✅ Good
class SanitizationService {
  static sanitizeHTML(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  static sanitizeURL(url: string): string {
    try {
      const parsed = new URL(url);
      const allowedProtocols = ['http:', 'https:'];
      
      if (!allowedProtocols.includes(parsed.protocol)) {
        throw new Error('Invalid protocol');
      }
      
      return parsed.toString();
    } catch {
      return '';
    }
  }
}
```

### 5.2 CSP Implementation
```html
<!-- ❌ Bad -->
<meta http-equiv="Content-Security-Policy" content="default-src *">

<!-- ✅ Good -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.example.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://*.example.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  form-action 'self';
">
```

## 6. Security Headers

### 6.1 HTTP Headers
```typescript
// ❌ Bad
app.use(helmet());

// ✅ Good
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.example.com"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  frameguard: { action: 'deny' },
}));
```

## 7. Monitoring & Logging

### 7.1 Security Logging
```typescript
// ❌ Bad
console.error('Security violation:', error);

// ✅ Good
class SecurityLogger {
  static async logSecurityEvent(event: SecurityEvent): Promise<void> {
    await fetch('/api/security/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        eventType: event.type,
        severity: event.severity,
        details: event.details,
        userAgent: navigator.userAgent,
        ip: await this.getClientIP(),
      }),
    });
  }
}
```

### 7.2 Error Tracking
```typescript
// ❌ Bad
try {
  // Code that might fail
} catch (error) {
  console.error(error);
}

// ✅ Good
class ErrorTracker {
  static async trackError(error: Error, context: ErrorContext): Promise<void> {
    await fetch('/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      }),
    });
  }
}
```

## 8. Best Practices

### 8.1 Security Checklist
- [ ] Input validation implemented
- [ ] Output encoding applied
- [ ] Authentication secure
- [ ] Authorization properly configured
- [ ] CSRF protection enabled
- [ ] XSS prevention in place
- [ ] Secure headers set
- [ ] Error handling secure
- [ ] Data encryption used
- [ ] Security logging enabled

### 8.2 Regular Audits
- Code security reviews
- Dependency vulnerability checks
- Penetration testing
- Security scanning
- Compliance verification

## 9. Tools và Resources

### 9.1 Security Tools
- [OWASP ZAP](https://www.zaproxy.org/)
- [SonarQube](https://www.sonarqube.org/)
- [Snyk](https://snyk.io/)
- [ESLint Security Plugin](https://github.com/nodesecurity/eslint-plugin-security)
- [Helmet](https://helmetjs.github.io/)

### 9.2 Testing Tools
- [Jest](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Cypress](https://www.cypress.io/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

### 9.3 Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Security Headers](https://securityheaders.com/)
- [CSP Reference](https://content-security-policy.com/) 