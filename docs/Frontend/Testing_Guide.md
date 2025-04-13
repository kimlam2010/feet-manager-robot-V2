# Frontend Testing Guide

## Testing Strategy

### Unit Testing
1. Component Testing
   - Test rendering
   - Test user interactions
   - Test state changes
   - Test error handling
   - Test loading states

2. Hook Testing
   - Test state management
   - Test side effects
   - Test error handling
   - Test cleanup

3. Utility Testing
   - Test helper functions
   - Test formatters
   - Test validators

### Integration Testing
1. Route Testing
   - Test route protection
   - Test navigation
   - Test route parameters
   - Test error routes
   - Test authentication flow

2. Layout Testing
   - Test layout structure
   - Test responsive behavior
   - Test navigation menu
   - Test header/footer
   - Test sidebar

3. Feature Testing
   - Test complete user flows
   - Test API integration
   - Test state persistence
   - Test error recovery

## Testing Patterns

### Unit Testing
```typescript
// src/components/RobotCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RobotCard } from './RobotCard';

describe('RobotCard', () => {
  const mockRobot = {
    id: '1',
    name: 'Test Robot',
    type: 'Test Type',
    status: 'idle',
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  it('renders robot information', () => {
    render(
      <RobotCard
        robot={mockRobot}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Robot')).toBeInTheDocument();
    expect(screen.getByText('Type: Test Type')).toBeInTheDocument();
    expect(screen.getByText('Status: idle')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <RobotCard
        robot={mockRobot}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockRobot);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <RobotCard
        robot={mockRobot}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('Delete'));
    expect(mockOnDelete).toHaveBeenCalledWith(mockRobot);
  });
});
```

### Integration Testing
```typescript
// src/containers/RobotListContainer.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { RobotListContainer } from './RobotListContainer';
import { useRobots } from '../../hooks/useRobots';

jest.mock('../../hooks/useRobots');

describe('RobotListContainer', () => {
  const mockRobots = [
    {
      id: '1',
      name: 'Test Robot 1',
      type: 'Test Type',
      status: 'idle',
    },
    {
      id: '2',
      name: 'Test Robot 2',
      type: 'Test Type',
      status: 'busy',
    },
  ];

  beforeEach(() => {
    (useRobots as jest.Mock).mockReturnValue({
      robots: mockRobots,
      isLoading: false,
      error: null,
    });
  });

  it('renders robot list', async () => {
    render(<RobotListContainer />);

    await waitFor(() => {
      expect(screen.getByText('Test Robot 1')).toBeInTheDocument();
      expect(screen.getByText('Test Robot 2')).toBeInTheDocument();
    });
  });

  it('shows loading state', () => {
    (useRobots as jest.Mock).mockReturnValue({
      robots: [],
      isLoading: true,
      error: null,
    });

    render(<RobotListContainer />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    (useRobots as jest.Mock).mockReturnValue({
      robots: [],
      isLoading: false,
      error: new Error('Test error'),
    });

    render(<RobotListContainer />);
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });
});
```

### API Testing
```typescript
// src/api/robot.test.ts
import { robotApi } from './robot';

describe('robotApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRobots', () => {
    it('fetches robots successfully', async () => {
      const mockRobots = [
        {
          id: '1',
          name: 'Test Robot 1',
          type: 'Test Type',
          status: 'idle',
        },
      ];

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockRobots),
      });

      const result = await robotApi.getRobots();
      expect(result).toEqual(mockRobots);
    });

    it('handles fetch error', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      await expect(robotApi.getRobots()).rejects.toThrow('Network error');
    });
  });
});
```

### Custom Hook Testing
```typescript
// src/hooks/useRobots.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useRobots } from './useRobots';
import { robotApi } from '../api/robot';

jest.mock('../api/robot');

describe('useRobots', () => {
  const mockRobots = [
    {
      id: '1',
      name: 'Test Robot 1',
      type: 'Test Type',
      status: 'idle',
    },
  ];

  beforeEach(() => {
    (robotApi.getRobots as jest.Mock).mockResolvedValue(mockRobots);
  });

  it('fetches robots on mount', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useRobots());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.robots).toEqual([]);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.robots).toEqual(mockRobots);
  });

  it('handles fetch error', async () => {
    const error = new Error('Network error');
    (robotApi.getRobots as jest.Mock).mockRejectedValue(error);

    const { result, waitForNextUpdate } = renderHook(() => useRobots());

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(error);
    expect(result.current.robots).toEqual([]);
  });
});
```

## Testing Best Practices

### Unit Testing Best Practices
1. Test one thing at a time
2. Use descriptive test names
3. Keep tests simple and focused
4. Use proper test setup and teardown
5. Mock external dependencies
6. Use proper test data
7. Follow the AAA pattern (Arrange, Act, Assert)

### Integration Testing Best Practices
1. Test component interactions
2. Test data flow
3. Test error handling
4. Test loading states
5. Test edge cases
6. Use proper test data
7. Follow the AAA pattern

### API Testing Best Practices
1. Test successful responses
2. Test error responses
3. Test request parameters
4. Test response data
5. Test error handling
6. Use proper test data
7. Mock network requests

### Custom Hook Testing Best Practices
1. Test hook initialization
2. Test hook updates
3. Test hook cleanup
4. Test error handling
5. Test loading states
6. Use proper test data
7. Follow the AAA pattern

## Testing Tools

### Jest
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/serviceWorker.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### React Testing Library
```typescript
// src/setupTests.ts
import '@testing-library/jest-dom';
import 'jest-styled-components';
```

### MSW (Mock Service Worker)
```typescript
// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/robots', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          name: 'Test Robot 1',
          type: 'Test Type',
          status: 'idle',
        },
      ])
    );
  }),
];
```

## Test Coverage

### Coverage Requirements
1. Components: 80% coverage
2. Hooks: 90% coverage
3. API: 90% coverage
4. Utils: 100% coverage

### Coverage Report
```bash
# Generate coverage report
npm run test -- --coverage

# Generate coverage report with watch
npm run test:watch -- --coverage
```

## Continuous Integration

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'
    - name: Install dependencies
      run: npm ci
    - name: Run tests
      run: npm test
    - name: Upload coverage
      uses: codecov/codecov-action@v2
      with:
        token: ${{ secrets.CODECOV_TOKEN }}
``` 