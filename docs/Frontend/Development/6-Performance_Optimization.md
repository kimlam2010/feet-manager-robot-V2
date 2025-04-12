# Performance Optimization Guide

## 1. Tổng quan

Hướng dẫn tối ưu hiệu suất cho dự án Feet Robot Manager V2, sử dụng TypeScript và React, tuân thủ kiến trúc hệ thống và các tiêu chuẩn đã định nghĩa.

### 1.1 Mục tiêu
- Cải thiện thời gian tải trang
- Tối ưu hiệu suất render
- Giảm tiêu thụ tài nguyên
- Hỗ trợ quy mô vừa (10 Workset, 100 robot)
- Tuân thủ kiến trúc hệ thống

### 1.2 Phạm vi
- Bundle Optimization
- Code Splitting
- Lazy Loading
- Memoization
- Virtualization
- Caching
- Network Optimization

### 1.3 Giới hạn hệ thống
- Tối đa 10 Workset
- Tối đa 100 robot
- Bản đồ 2D đơn giản
- Giao thức: MQTT, WebSocket, gRPC
- Cơ sở dữ liệu: PostgreSQL, SQLite (mobile)

## 2. Performance Architecture

### 2.1 Optimization Structure
```
src/
├── optimizations/     # Performance optimizations
│   ├── bundle/       # Bundle optimization
│   ├── code/         # Code optimization
│   ├── network/      # Network optimization
│   └── render/       # Render optimization
├── hooks/            # Performance hooks
│   ├── useMemo/      # Memoization hooks
│   ├── useCallback/  # Callback hooks
│   └── useRef/       # Ref hooks
└── utils/            # Performance utilities
    ├── debounce/     # Debounce utilities
    ├── throttle/     # Throttle utilities
    └── cache/        # Caching utilities
```

### 2.2 Performance Types
```typescript
// Performance Metrics
interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkRequests: number;
}

// Optimization Config
interface OptimizationConfig {
  bundleSize: number;
  chunkSize: number;
  cacheTime: number;
  debounceTime: number;
}

// Performance Thresholds
interface PerformanceThresholds {
  maxLoadTime: number;
  maxRenderTime: number;
  maxMemoryUsage: number;
  maxNetworkRequests: number;
}
```

## 3. Optimization Implementation

### 3.1 Bundle Optimization
```typescript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxSize: 244000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 10
        }
      }
    }
  }
};

// package.json
{
  "scripts": {
    "build": "webpack --mode production",
    "analyze": "webpack-bundle-analyzer"
  }
}
```

### 3.2 Code Splitting
```typescript
// App.tsx
import React, { lazy, Suspense } from 'react';

const RobotManagement = lazy(() => import('./pages/RobotManagement'));
const WorksetManagement = lazy(() => import('./pages/WorksetManagement'));
const MapEditor = lazy(() => import('./pages/MapEditor'));

const App: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Router>
        <Routes>
          <Route path="/robots" element={<RobotManagement />} />
          <Route path="/worksets" element={<WorksetManagement />} />
          <Route path="/map" element={<MapEditor />} />
        </Routes>
      </Router>
    </Suspense>
  );
};
```

### 3.3 Memoization
```typescript
// hooks/useMemoizedRobot.ts
import { useMemo } from 'react';
import { Robot } from '../types/robot';

export const useMemoizedRobot = (robot: Robot) => {
  return useMemo(() => ({
    id: robot.id,
    name: robot.name,
    status: robot.status,
    battery: robot.battery
  }), [robot.id, robot.status, robot.battery]);
};

// components/RobotList.tsx
import React, { memo } from 'react';
import { Robot } from '../types/robot';

interface RobotListProps {
  robots: Robot[];
  onSelect: (robot: Robot) => void;
}

export const RobotList: React.FC<RobotListProps> = memo(({ robots, onSelect }) => {
  return (
    <div className="robot-list">
      {robots.map(robot => (
        <RobotCard
          key={robot.id}
          robot={robot}
          onClick={() => onSelect(robot)}
        />
      ))}
    </div>
  );
});
```

### 3.4 Virtualization
```typescript
// components/VirtualizedRobotList.tsx
import React from 'react';
import { FixedSizeList } from 'react-window';
import { Robot } from '../types/robot';

interface VirtualizedRobotListProps {
  robots: Robot[];
  height: number;
  itemSize: number;
}

export const VirtualizedRobotList: React.FC<VirtualizedRobotListProps> = ({
  robots,
  height,
  itemSize
}) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const robot = robots[index];
    return (
      <div style={style}>
        <RobotCard robot={robot} />
      </div>
    );
  };

  return (
    <FixedSizeList
      height={height}
      itemCount={robots.length}
      itemSize={itemSize}
      width="100%"
      overscanCount={5}
    >
      {Row}
    </FixedSizeList>
  );
};
```

### 3.5 Caching
```typescript
// utils/cache.ts
interface CacheConfig {
  key: string;
  data: any;
  ttl: number;
}

export const cache = {
  set: ({ key, data, ttl }: CacheConfig) => {
    const item = {
      data,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(key, JSON.stringify(item));
  },
  
  get: (key: string) => {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const { data, timestamp, ttl } = JSON.parse(item);
    if (Date.now() - timestamp > ttl) {
      localStorage.removeItem(key);
      return null;
    }
    
    return data;
  }
};

// hooks/useCachedRobots.ts
import { useState, useEffect } from 'react';
import { cache } from '../utils/cache';
import { Robot } from '../types/robot';

export const useCachedRobots = () => {
  const [robots, setRobots] = useState<Robot[]>([]);
  
  useEffect(() => {
    const cachedRobots = cache.get('robots');
    if (cachedRobots) {
      setRobots(cachedRobots);
    }
    
    // Fetch fresh data
    fetchRobots().then(data => {
      setRobots(data);
      cache.set({
        key: 'robots',
        data,
        ttl: 5 * 60 * 1000 // 5 minutes
      });
    });
  }, []);
  
  return robots;
};
```

### 3.6 Network Optimization
```typescript
// utils/debounce.ts
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// hooks/useDebouncedSearch.ts
import { useState, useCallback } from 'react';
import { debounce } from '../utils/debounce';

export const useDebouncedSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      // Perform search
      searchRobots(term);
    }, 300),
    []
  );
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    debouncedSearch(term);
  };
  
  return {
    searchTerm,
    handleSearch
  };
};
```

## 4. Performance Monitoring

### 4.1 Performance Metrics
```typescript
// utils/performance.ts
export const measurePerformance = () => {
  const metrics: PerformanceMetrics = {
    loadTime: performance.now() - performance.timing.navigationStart,
    renderTime: 0,
    memoryUsage: 0,
    networkRequests: 0
  };
  
  // Measure render time
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'paint') {
        metrics.renderTime = entry.startTime;
      }
    }
  });
  
  observer.observe({ entryTypes: ['paint'] });
  
  // Measure memory usage
  if (performance.memory) {
    metrics.memoryUsage = performance.memory.usedJSHeapSize;
  }
  
  // Count network requests
  const resources = performance.getEntriesByType('resource');
  metrics.networkRequests = resources.length;
  
  return metrics;
};
```

### 4.2 Performance Alerts
```typescript
// utils/performance-alerts.ts
interface PerformanceAlert {
  metric: keyof PerformanceMetrics;
  threshold: number;
  message: string;
}

export const checkPerformance = (metrics: PerformanceMetrics) => {
  const alerts: PerformanceAlert[] = [
    {
      metric: 'loadTime',
      threshold: 3000,
      message: 'Page load time exceeds 3 seconds'
    },
    {
      metric: 'renderTime',
      threshold: 1000,
      message: 'Render time exceeds 1 second'
    },
    {
      metric: 'memoryUsage',
      threshold: 100 * 1024 * 1024,
      message: 'Memory usage exceeds 100MB'
    },
    {
      metric: 'networkRequests',
      threshold: 50,
      message: 'Network requests exceed 50'
    }
  ];
  
  return alerts.filter(alert => metrics[alert.metric] > alert.threshold);
};
```

## 5. Tài liệu liên quan

### 5.1 Development
- [Coding Standards](./1-Coding_Standards.md)
- [Component Development](./2-Component_Development.md)
- [API Integration](./3-API_Integration.md)
- [Error Handling](./4-Error_Handling.md)
- [Testing Strategy](./5-Testing_Strategy.md)
- [Security Implementation](./7-Security_Implementation.md)
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