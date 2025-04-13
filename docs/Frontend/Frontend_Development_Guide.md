# Hướng dẫn phát triển Frontend

## Mục lục
1. [Tổng quan](#tổng-quan)
2. [Cấu trúc dự án](#cấu-trúc-dự-án)
3. [Công nghệ sử dụng](#công-nghệ-sử-dụng)
4. [Quy ước code](#quy-ước-code)
5. [Component](#component)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Tài liệu tham khảo](#tài-liệu-tham-khảo)

## Tổng quan

Frontend của Feet Robot Manager V2 được phát triển bằng React và TypeScript, sử dụng các công nghệ hiện đại để tạo trải nghiệm người dùng tốt nhất.

## Cấu trúc dự án

### Directory Organization
```
src/
├── components/
│   ├── layouts/        # Layout components
│   ├── features/       # Feature-specific components
│   ├── ui/            # Reusable UI components
│   └── shared/        # Shared utilities and components
├── pages/             # Page components
├── routes/            # Route configurations
├── contexts/          # React contexts
├── hooks/             # Custom hooks
├── services/          # API and service integrations
├── utils/             # Utility functions
└── types/             # TypeScript type definitions
```

## Công nghệ sử dụng

### Core
- React 18
- TypeScript 5
- Vite

### UI/UX
- Styled Components
- Material UI
- React Router
- React Query

### State Management
- Redux Toolkit
- React Context

### Testing
- Jest
- React Testing Library
- Cypress

### Development Tools
- ESLint
- Prettier
- Husky
- Commitlint

## Quy ước code

### Naming Convention
- Components: PascalCase
- Files: kebab-case
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Types/Interfaces: PascalCase

### Code Style
- 2 spaces indentation
- Single quotes
- Semicolons
- Trailing commas
- Max line length: 100

### Git Commit
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code refactoring
- test: Testing
- chore: Maintenance

## Component

### Common Components
- Button
- Input
- Select
- Modal
- Table
- Card
- Form
- Loading
- ErrorBoundary

### Feature Components
- Dashboard
- RobotControl
- MapViewer
- TaskScheduler
- WorksetManager

### Component Structure
```tsx
import React from 'react';
import styled from 'styled-components';

interface Props {
  // Props interface
}

const StyledComponent = styled.div`
  // Styles
`;

export const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  // Component logic
  
  return (
    <StyledComponent>
      {/* JSX */}
    </StyledComponent>
  );
};
```

## State Management

### Redux Store Structure
```typescript
{
  auth: {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
  },
  robot: {
    robots: Robot[];
    selectedRobot: Robot | null;
    status: RobotStatus;
    loading: boolean;
    error: string | null;
  },
  map: {
    maps: Map[];
    selectedMap: Map | null;
    loading: boolean;
    error: string | null;
  },
  task: {
    tasks: Task[];
    selectedTask: Task | null;
    loading: boolean;
    error: string | null;
  }
}
```

### Context Usage
- Theme
- Authentication
- Workset Selection
- Robot Control

## API Integration

### API Structure
```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);

export default api;
```

### API Endpoints
```typescript
// services/robot.ts
import api from './api';

export const robotApi = {
  getRobots: () => api.get<Robot[]>('/robots'),
  getRobot: (id: string) => api.get<Robot>(`/robots/${id}`),
  createRobot: (data: CreateRobotData) => api.post<Robot>('/robots', data),
  updateRobot: (id: string, data: UpdateRobotData) => api.put<Robot>(`/robots/${id}`, data),
  deleteRobot: (id: string) => api.delete(`/robots/${id}`),
};
```

## Testing

### Unit Testing
```typescript
// tests/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../../src/components/common/Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Integration Testing
```typescript
// tests/features/Dashboard.test.tsx
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../../src/features/dashboard/components/Dashboard';

describe('Dashboard', () => {
  it('displays robot status', async () => {
    render(<Dashboard />);
    expect(await screen.findByText('Active Robots')).toBeInTheDocument();
  });
});
```

## Deployment

### Build Process
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
VITE_MAPBOX_TOKEN=your_token
```

## Tài liệu tham khảo

### React
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- [React Router](https://reactrouter.com/docs/en/v6)

### TypeScript
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Testing
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/guides/overview/why-cypress)

### Styling
- [Styled Components](https://styled-components.com/docs)
- [Material UI](https://mui.com/getting-started/installation/)

### State Management
- [Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started)
- [React Query](https://tanstack.com/query/v4/docs/overview)

## Routing and Layout

### Setting Up Routes
1. Define public routes in `routes/public.tsx`:
```typescript
const publicRoutes = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
];
```

2. Define protected routes in `routes/protected.tsx`:
```typescript
const protectedRoutes = [
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/robots',
    element: <RobotManagement />
  }
];
```

3. Configure main router in `App.tsx`:
```typescript
function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/robots/*" element={<RobotManagement />} />
      </Route>
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
```

### Creating Layout Components
1. MainLayout structure:
```typescript
function MainLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box component="main" sx={{ flex: 1, p: 3 }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}
```

2. ProtectedRoute implementation:
```typescript
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}
```

## Best Practices

### Component Development
1. Keep components focused and small
2. Use TypeScript for type safety
3. Implement proper error handling
4. Add loading states where needed
5. Use proper naming conventions

### Routing
1. Use nested routes for related features
2. Implement proper route protection
3. Handle 404 and error routes
4. Use lazy loading for performance
5. Keep route configuration organized

### State Management
1. Use context for global state
2. Keep local state minimal
3. Implement proper error handling
4. Use loading states appropriately
5. Cache API responses when possible

### Performance
1. Implement code splitting
2. Use lazy loading for routes
3. Optimize re-renders
4. Cache API responses
5. Use proper memoization

## Testing

### Component Testing
1. Test component rendering
2. Test user interactions
3. Test error states
4. Test loading states
5. Test accessibility

### Routing Testing
1. Test route protection
2. Test navigation
3. Test route parameters
4. Test error routes
5. Test authentication flow

## Deployment

### Build Process
1. Run type checking
2. Run tests
3. Build production bundle
4. Optimize assets
5. Generate source maps

### Environment Configuration
1. Set up environment variables
2. Configure API endpoints
3. Set up authentication
4. Configure logging
5. Set up error tracking 