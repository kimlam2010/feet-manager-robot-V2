# Testing Guide

## Overview

This document outlines the testing strategy and practices for the Robot Fleet Management System frontend.

## Testing Tools

### 1. Unit Testing
- Jest
- React Testing Library
- MSW (Mock Service Worker)

### 2. Integration Testing
- Jest
- React Testing Library
- MSW

### 3. E2E Testing
- Cypress
- Playwright

## Setup

### 1. Install Dependencies
```bash
pnpm add -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event msw
pnpm add -D cypress @cypress/react @cypress/webpack-dev-server
```

### 2. Configure Jest
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
};
```

### 3. Configure MSW
```javascript
// src/mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/robots', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name: 'Robot 1' },
        { id: 2, name: 'Robot 2' },
      ])
    );
  }),
];
```

## Testing Practices

### 1. Component Testing

```typescript
// components/ui/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 2. Hook Testing

```typescript
// hooks/useRobots.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useRobots } from './useRobots';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('useRobots', () => {
  it('fetches robots', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result, waitFor } = renderHook(() => useRobots(), { wrapper });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual([
      { id: 1, name: 'Robot 1' },
      { id: 2, name: 'Robot 2' },
    ]);
  });
});
```

### 3. API Testing

```typescript
// lib/api.test.ts
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { fetchRobots } from './api';

const server = setupServer(
  rest.get('/api/robots', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name: 'Robot 1' },
        { id: 2, name: 'Robot 2' },
      ])
    );
  })
);

describe('API', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('fetches robots', async () => {
    const robots = await fetchRobots();
    expect(robots).toEqual([
      { id: 1, name: 'Robot 1' },
      { id: 2, name: 'Robot 2' },
    ]);
  });
});
```

### 4. E2E Testing

```typescript
// cypress/e2e/robots.cy.ts
describe('Robots', () => {
  it('displays robots list', () => {
    cy.visit('/robots');
    cy.get('[data-testid="robot-list"]').should('exist');
    cy.get('[data-testid="robot-item"]').should('have.length', 2);
  });

  it('creates a new robot', () => {
    cy.visit('/robots/new');
    cy.get('[data-testid="robot-name"]').type('New Robot');
    cy.get('[data-testid="submit-button"]').click();
    cy.url().should('include', '/robots');
    cy.get('[data-testid="robot-item"]').should('have.length', 3);
  });
});
```

## Best Practices

### 1. Test Organization
- Group tests by feature
- Use descriptive names
- Keep tests focused
- Follow DRY principle

### 2. Component Testing
- Test component rendering
- Test user interactions
- Test props
- Test edge cases

### 3. Hook Testing
- Test hook behavior
- Test dependencies
- Test side effects
- Test error handling

### 4. API Testing
- Mock API calls
- Test success cases
- Test error cases
- Test edge cases

### 5. E2E Testing
- Test critical paths
- Test user flows
- Test error handling
- Test edge cases

## Common Issues

### 1. Async Testing
- Use async/await
- Use waitFor
- Handle loading states
- Handle error states

### 2. Mocking
- Mock external dependencies
- Mock API calls
- Mock browser APIs
- Mock timers

### 3. State Management
- Test state changes
- Test actions
- Test reducers
- Test selectors

### 4. Performance
- Test render times
- Test memory usage
- Test network requests
- Test bundle size

## Maintenance

### 1. Regular Tasks
- Update tests
- Fix failing tests
- Add new tests
- Remove obsolete tests

### 2. Documentation
- Document test cases
- Document test setup
- Document test utilities
- Document test patterns

### 3. Review
- Review test coverage
- Review test quality
- Review test performance
- Review test maintainability

### 4. Optimization
- Optimize test speed
- Optimize test memory
- Optimize test setup
- Optimize test cleanup 