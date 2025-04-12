# Testing Strategy Guide

## 1. Tổng quan

Hướng dẫn chiến lược kiểm thử cho dự án Feet Robot Manager V2, sử dụng TypeScript và React, tuân thủ kiến trúc hệ thống và các tiêu chuẩn đã định nghĩa.

### 1.1 Mục tiêu
- Đảm bảo chất lượng code
- Phát hiện lỗi sớm
- Tăng độ tin cậy của hệ thống
- Hỗ trợ quy mô nhỏ (10 Workset, 100 robot)
- Tuân thủ kiến trúc hệ thống

### 1.2 Phạm vi
- Unit Testing
- Integration Testing
- End-to-End Testing
- Performance Testing
- Security Testing
- Accessibility Testing

### 1.3 Giới hạn hệ thống
- Tối đa 3 Workset
- Tối đa 20 robot
- Bản đồ 2D đơn giản
- Giao thức: MQTT, WebSocket, gRPC
- Cơ sở dữ liệu: PostgreSQL, SQLite (mobile)

## 2. Testing Architecture

### 2.1 Test Structure
```
tests/
├── unit/              # Unit tests
│   ├── components/    # Component tests
│   ├── hooks/         # Hook tests
│   ├── utils/         # Utility tests
│   └── services/      # Service tests
├── integration/       # Integration tests
│   ├── api/          # API integration tests
│   ├── state/        # State integration tests
│   └── ui/           # UI integration tests
├── e2e/              # End-to-end tests
│   ├── robot/        # Robot management tests
│   ├── workset/      # Workset management tests
│   └── map/          # Map management tests
└── performance/      # Performance tests
    ├── load/         # Load tests
    └── stress/       # Stress tests
```

### 2.2 Test Types
```typescript
// Unit Test Types
interface UnitTest {
  name: string;
  component: string;
  test: () => void;
}

// Integration Test Types
interface IntegrationTest {
  name: string;
  feature: string;
  test: () => void;
}

// E2E Test Types
interface E2ETest {
  name: string;
  scenario: string;
  steps: string[];
  test: () => void;
}

// Performance Test Types
interface PerformanceTest {
  name: string;
  metric: string;
  threshold: number;
  test: () => void;
}
```

## 3. Test Implementation

### 3.1 Unit Testing
```typescript
// tests/unit/components/RobotCard.test.tsx
import { render, screen } from '@testing-library/react';
import { RobotCard } from '../../../src/components/RobotCard';

describe('RobotCard', () => {
  it('should render robot information', () => {
    const robot = {
      id: '1',
      name: 'Robot 1',
      status: 'idle',
      battery: 80
    };
    
    render(<RobotCard robot={robot} />);
    
    expect(screen.getByText('Robot 1')).toBeInTheDocument();
    expect(screen.getByText('Idle')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });
  
  it('should handle robot status changes', () => {
    const robot = {
      id: '1',
      name: 'Robot 1',
      status: 'busy',
      battery: 60
    };
    
    render(<RobotCard robot={robot} />);
    
    expect(screen.getByText('Busy')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
  });
});

// tests/unit/hooks/useRobot.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useRobot } from '../../../src/hooks/useRobot';

describe('useRobot', () => {
  it('should initialize robot state', () => {
    const { result } = renderHook(() => useRobot('1'));
    
    expect(result.current.robot).toBeNull();
    expect(result.current.loading).toBe(true);
  });
  
  it('should fetch robot data', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useRobot('1'));
    
    await waitForNextUpdate();
    
    expect(result.current.robot).not.toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
```

### 3.2 Integration Testing
```typescript
// tests/integration/api/robot.test.ts
import { render, screen, waitFor } from '@testing-library/react';
import { RobotProvider } from '../../../src/providers/RobotProvider';
import { RobotList } from '../../../src/components/RobotList';

describe('Robot API Integration', () => {
  it('should fetch and display robots', async () => {
    render(
      <RobotProvider>
        <RobotList />
      </RobotProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Robot 1')).toBeInTheDocument();
      expect(screen.getByText('Robot 2')).toBeInTheDocument();
    });
  });
  
  it('should handle robot updates', async () => {
    render(
      <RobotProvider>
        <RobotList />
      </RobotProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Idle')).toBeInTheDocument();
    });
    
    // Simulate robot status change
    await waitFor(() => {
      expect(screen.getByText('Busy')).toBeInTheDocument();
    });
  });
});

// tests/integration/state/workset.test.ts
import { render, screen, waitFor } from '@testing-library/react';
import { WorksetProvider } from '../../../src/providers/WorksetProvider';
import { WorksetList } from '../../../src/components/WorksetList';

describe('Workset State Integration', () => {
  it('should manage workset state', async () => {
    render(
      <WorksetProvider>
        <WorksetList />
      </WorksetProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Workset 1')).toBeInTheDocument();
      expect(screen.getByText('Workset 2')).toBeInTheDocument();
    });
  });
  
  it('should handle workset limit', async () => {
    render(
      <WorksetProvider>
        <WorksetList />
      </WorksetProvider>
    );
    
    // Try to add more than 3 worksets
    await waitFor(() => {
      expect(screen.getByText('Maximum workset limit reached')).toBeInTheDocument();
    });
  });
});
```

### 3.3 End-to-End Testing
```typescript
// tests/e2e/robot/management.test.ts
import { test, expect } from '@playwright/test';

test.describe('Robot Management', () => {
  test('should create and manage robots', async ({ page }) => {
    // Navigate to robot management
    await page.goto('/robots');
    
    // Create new robot
    await page.click('button:has-text("Add Robot")');
    await page.fill('input[name="name"]', 'Test Robot');
    await page.click('button:has-text("Save")');
    
    // Verify robot created
    await expect(page.locator('text=Test Robot')).toBeVisible();
    
    // Update robot status
    await page.click('button:has-text("Start")');
    await expect(page.locator('text=Busy')).toBeVisible();
    
    // Delete robot
    await page.click('button:has-text("Delete")');
    await expect(page.locator('text=Test Robot')).not.toBeVisible();
  });
  
  test('should handle robot limit', async ({ page }) => {
    // Navigate to robot management
    await page.goto('/robots');
    
    // Try to add more than 20 robots
    for (let i = 0; i < 21; i++) {
      await page.click('button:has-text("Add Robot")');
      await page.fill('input[name="name"]', `Robot ${i}`);
      await page.click('button:has-text("Save")');
    }
    
    // Verify error message
    await expect(page.locator('text=Maximum robot limit reached')).toBeVisible();
  });
});
```

### 3.4 Performance Testing
```typescript
// tests/performance/load/robot.test.ts
import { test, expect } from '@playwright/test';

test.describe('Robot Performance', () => {
  test('should handle multiple robot updates', async ({ page }) => {
    // Navigate to robot management
    await page.goto('/robots');
    
    // Measure response time for robot updates
    const startTime = performance.now();
    
    // Simulate multiple robot updates
    for (let i = 0; i < 20; i++) {
      await page.click(`button:has-text("Update Robot ${i}")`);
    }
    
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    // Verify performance
    expect(responseTime).toBeLessThan(1000); // Should complete within 1 second
  });
  
  test('should handle map rendering', async ({ page }) => {
    // Navigate to map view
    await page.goto('/map');
    
    // Measure map rendering time
    const startTime = performance.now();
    
    // Wait for map to render
    await page.waitForSelector('.map-container');
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Verify performance
    expect(renderTime).toBeLessThan(500); // Should render within 500ms
  });
});
```

## 4. Test Configuration

### 4.1 Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/serviceWorker.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### 4.2 Playwright Configuration
```javascript
// playwright.config.js
module.exports = {
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'on-first-retry'
  },
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 2
};
```

## 5. Test Automation

### 5.1 CI/CD Integration
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
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run unit tests
        run: npm test
        
      - name: Run integration tests
        run: npm run test:integration
        
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Run performance tests
        run: npm run test:performance
```

## 6. Tài liệu liên quan

### 6.1 Development
- [Coding Standards](./1-Coding_Standards.md)
- [Component Development](./2-Component_Development.md)
- [API Integration](./3-API_Integration.md)
- [Error Handling](./4-Error_Handling.md)
- [Performance Optimization](./6-Performance_Optimization.md)
- [Security Implementation](./7-Security_Implementation.md)
- [Deployment Process](./8-Deployment_Process.md)

### 6.2 Architecture
- [Frontend Architecture](../Architecture/1-README.md)
- [Component Architecture](../Architecture/2-Component_Architecture.md)
- [State Management](../Architecture/3-State_Management.md)
- [API Integration](../Architecture/5-API_Integration.md)
- [Security Architecture](../Architecture/9-Security_Architecture.md)
- [System Documentation](../../Systerm/System_Documentation.md)
- [Features](../../User Guild/Features)
- [Getting Started](../../User Guild/Getting_Started)
- [Troubleshooting](../../User Guild/Troubleshooting) 