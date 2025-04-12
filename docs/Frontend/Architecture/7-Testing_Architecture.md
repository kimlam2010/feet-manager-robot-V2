# Testing Architecture

## 1. Tổng quan

Quản lý testing trong ứng dụng React sử dụng Jest và React Testing Library với Cypress cho E2E testing.

### 1.1 Mục tiêu
- Đảm bảo chất lượng code
- Phát hiện lỗi sớm
- Tự động hóa testing
- Bảo trì dễ dàng
- CI/CD integration

### 1.2 Phạm vi
- Unit Tests
- Integration Tests
- E2E Tests
- Performance Tests
- Accessibility Tests

## 2. Cấu trúc thư mục

```
src/
├── __tests__/
│   ├── unit/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── integration/
│   │   ├── features/
│   │   └── flows/
│   └── e2e/
│       ├── specs/
│       └── support/
├── components/
│   └── Button/
│       ├── Button.tsx
│       ├── Button.test.tsx
│       └── Button.cy.tsx
└── utils/
    ├── api.ts
    └── api.test.ts
```

## 3. Unit Testing

### 3.1 Component Testing
```typescript
// components/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct styles based on props', () => {
    render(<Button variant="primary" size="lg">Click me</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({
      backgroundColor: '#007bff',
      fontSize: '1.25rem',
    });
  });
});
```

### 3.2 Hook Testing
```typescript
// hooks/useCounter.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('initializes with correct value', () => {
    const { result } = renderHook(() => useCounter(0));
    expect(result.current.count).toBe(0);
  });

  it('increments counter', () => {
    const { result } = renderHook(() => useCounter(0));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  it('decrements counter', () => {
    const { result } = renderHook(() => useCounter(1));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(0);
  });
});
```

## 4. Integration Testing

### 4.1 Feature Testing
```typescript
// __tests__/integration/features/Login.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from '../../../components/Login';
import { AuthProvider } from '../../../contexts/AuthContext';
import { MemoryRouter } from 'react-router-dom';

describe('Login Feature', () => {
  it('handles successful login', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });
  });

  it('handles login error', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
```

### 4.2 Flow Testing
```typescript
// __tests__/integration/flows/UserFlow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../../../App';
import { MemoryRouter } from 'react-router-dom';

describe('User Flow', () => {
  it('completes user registration flow', async () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    );

    // Fill registration form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Verify email
    await waitFor(() => {
      expect(screen.getByText(/verify your email/i)).toBeInTheDocument();
    });

    // Complete profile
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '1234567890' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /complete/i }));

    // Verify dashboard access
    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });
  });
});
```

## 5. E2E Testing

### 5.1 Cypress Setup
```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'src/__tests__/e2e/specs/**/*.cy.ts',
    supportFile: 'src/__tests__/e2e/support/e2e.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
  },
});
```

### 5.2 E2E Test Example
```typescript
// __tests__/e2e/specs/login.cy.ts
describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('successfully logs in', () => {
    cy.get('[data-testid="email"]').type('test@example.com');
    cy.get('[data-testid="password"]').type('password123');
    cy.get('[data-testid="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="welcome-message"]').should('be.visible');
  });

  it('shows error with invalid credentials', () => {
    cy.get('[data-testid="email"]').type('invalid@example.com');
    cy.get('[data-testid="password"]').type('wrong');
    cy.get('[data-testid="submit"]').click();

    cy.get('[data-testid="error-message"]').should('be.visible');
  });
});
```

## 6. Performance Testing

### 6.1 Lighthouse CI
```yaml
# .lighthouserc.yml
ci:
  collect:
    url: ['http://localhost:3000']
    startServerCommand: 'npm start'
    numberOfRuns: 3
  upload:
    target: 'temporary-public-storage'
  assert:
    assertions:
      'categories:performance': ['warn', {minScore: 0.9}]
      'categories:accessibility': ['error', {minScore: 0.9}]
      'categories:best-practices': ['error', {minScore: 0.9}]
      'categories:seo': ['error', {minScore: 0.9}]
```

### 6.2 Performance Test Example
```typescript
// __tests__/performance/AppPerformance.test.ts
import { measurePerformance } from '@testing-library/react';

describe('App Performance', () => {
  it('meets performance metrics', async () => {
    const metrics = await measurePerformance(
      () => render(<App />),
      {
        metrics: [
          'First Contentful Paint',
          'Largest Contentful Paint',
          'Time to Interactive',
        ],
      }
    );

    expect(metrics['First Contentful Paint']).toBeLessThan(1800);
    expect(metrics['Largest Contentful Paint']).toBeLessThan(2500);
    expect(metrics['Time to Interactive']).toBeLessThan(3800);
  });
});
```

## 7. Accessibility Testing

### 7.1 Jest Axe Setup
```typescript
// jest.setup.ts
import { toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';

expect.extend(toHaveNoViolations);
```

### 7.2 Accessibility Test Example
```typescript
// components/Button/Button.test.tsx
import { axe, toHaveNoViolations } from 'jest-axe';

describe('Button Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is keyboard accessible', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(button).toHaveFocus();
    
    fireEvent.keyDown(button, { key: ' ' });
    expect(button).toHaveFocus();
  });
});
```

## 8. Best Practices

### 8.1 Test Organization
- Group tests by feature
- Use descriptive test names
- Follow testing pyramid
- Keep tests independent
- Use proper test isolation

### 8.2 Performance
- Mock external dependencies
- Use proper cleanup
- Optimize test runs
- Use test coverage wisely
- Monitor test duration

### 8.3 Maintainability
- Document test cases
- Use consistent patterns
- Regular test reviews
- Update tests with features
- Clean up obsolete tests 