# Routing Architecture

## 1. Tổng quan

Quản lý routing trong ứng dụng React sử dụng React Router v6 với cấu trúc route động và lazy loading.

### 1.1 Mục tiêu
- Quản lý route hiệu quả
- Bảo vệ route
- Lazy loading
- SEO friendly
- UX tốt

### 1.2 Phạm vi
- Public Routes
- Protected Routes
- Dynamic Routes
- Nested Routes
- Route Guards

## 2. Cấu trúc thư mục

```
src/
├── routes/
│   ├── index.tsx
│   ├── public.tsx
│   ├── protected.tsx
│   └── types.ts
├── layouts/
│   ├── PublicLayout.tsx
│   ├── DashboardLayout.tsx
│   └── ErrorLayout.tsx
└── pages/
    ├── public/
    │   ├── Login/
    │   └── Register/
    └── protected/
        ├── Dashboard/
        ├── Robots/
        └── Settings/
```

## 3. Route Configuration

### 3.1 Main Router
```typescript
// routes/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { publicRoutes } from './public';
import { protectedRoutes } from './protected';
import { ErrorBoundary } from '../components/ErrorBoundary';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <ErrorBoundary />,
    children: publicRoutes,
  },
  {
    path: '/app',
    element: <ProtectedLayout />,
    errorElement: <ErrorBoundary />,
    children: protectedRoutes,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
```

### 3.2 Public Routes
```typescript
// routes/public.tsx
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Login = lazy(() => import('../pages/public/Login'));
const Register = lazy(() => import('../pages/public/Register'));

export const publicRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
];
```

### 3.3 Protected Routes
```typescript
// routes/protected.tsx
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';

const Dashboard = lazy(() => import('../pages/protected/Dashboard'));
const Robots = lazy(() => import('../pages/protected/Robots'));
const Settings = lazy(() => import('../pages/protected/Settings'));

export const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: '/robots',
    element: <ProtectedRoute><Robots /></ProtectedRoute>,
  },
  {
    path: '/robots/:id',
    element: <ProtectedRoute><RobotDetails /></ProtectedRoute>,
  },
  {
    path: '/settings',
    element: <ProtectedRoute><Settings /></ProtectedRoute>,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];
```

## 4. Route Guards

### 4.1 Protected Route Component
```typescript
// components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
```

### 4.2 Role-Based Route Guard
```typescript
// components/RoleRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
```

## 5. Layout Components

### 5.1 Public Layout
```typescript
// layouts/PublicLayout.tsx
import { Outlet } from 'react-router-dom';

export const PublicLayout: React.FC = () => {
  return (
    <div className="public-layout">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
```

### 5.2 Dashboard Layout
```typescript
// layouts/DashboardLayout.tsx
import { Outlet } from 'react-router-dom';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
```

## 6. Navigation

### 6.1 Custom Navigation Hook
```typescript
// hooks/useNavigation.ts
import { useNavigate, useLocation } from 'react-router-dom';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (path: string) => {
    navigate(path);
  };

  const goBack = () => {
    navigate(-1);
  };

  const getCurrentPath = () => {
    return location.pathname;
  };

  return { goTo, goBack, getCurrentPath };
};
```

### 6.2 Navigation Component
```typescript
// components/Navigation.tsx
import { NavLink } from 'react-router-dom';

export const Navigation: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/robots">Robots</NavLink>
        </li>
        <li>
          <NavLink to="/settings">Settings</NavLink>
        </li>
      </ul>
    </nav>
  );
};
```

## 7. Best Practices

### 7.1 Route Organization
- Group related routes
- Use lazy loading
- Implement proper guards
- Handle 404 routes

### 7.2 Performance
- Code splitting
- Route preloading
- Caching
- Error boundaries

### 7.3 Security
- Route protection
- Role-based access
- Authentication checks
- Session management

## 8. Error Handling

### 8.1 Error Boundary
```typescript
// components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

### 8.2 Error Fallback
```typescript
// components/ErrorFallback.tsx
interface ErrorFallbackProps {
  error: Error | null;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  const { goBack } = useNavigation();

  return (
    <div className="error-fallback">
      <h1>Something went wrong</h1>
      <p>{error?.message}</p>
      <button onClick={goBack}>Go Back</button>
    </div>
  );
};
``` 