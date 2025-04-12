# Coding Standards

## 1. Tổng quan

Quy tắc và tiêu chuẩn viết code cho dự án Feet Robot Manager V2, sử dụng TypeScript và React, tuân thủ kiến trúc hệ thống đã định nghĩa.

### 1.1 Mục tiêu
- Đảm bảo tính nhất quán của codebase
- Tăng khả năng bảo trì
- Cải thiện chất lượng code
- Tuân thủ kiến trúc hệ thống
- Hỗ trợ quy mô nhỏ (3 Workset, 20 robot)

### 1.2 Phạm vi
- Web Application (React)
- Mobile Application (React Native)
- API Integration
- Testing
- Documentation

### 1.3 Giới hạn hệ thống
- Tối đa 3 Workset
- Tối đa 20 robot
- Bản đồ 2D đơn giản
- Giao thức: MQTT, WebSocket, gRPC
- Cơ sở dữ liệu: PostgreSQL, SQLite (mobile)

## 2. TypeScript Standards

### 2.1 Type Definitions
```typescript
// Sử dụng interface cho objects
interface Robot {
  id: string;
  name: string;
  status: RobotStatus;
  position: Position;
  battery: number;
  worksetId: string;
  lastUpdated: Date;
}

// Sử dụng type cho unions và intersections
type RobotStatus = 'idle' | 'working' | 'error';
type Position = { x: number; y: number };

// Generic types
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type AsyncResponse<T> = Promise<ApiResponse<T>>;

// Map types
interface Map {
  id: string;
  name: string;
  worksetId: string;
  filePath: string;
  resolution: number;
  features: GeoJSON.FeatureCollection;
}

// Task types
interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  robotId: string;
  worksetId: string;
  schedule?: Schedule;
}

type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
```

### 2.2 Type Safety
```typescript
// Strict null checks
const getRobotName = (robot: Robot | null): string => {
  if (!robot) throw new Error('Robot not found');
  return robot.name;
};

// Type guards
const isRobot = (obj: any): obj is Robot => {
  return 'id' in obj && 'status' in obj;
};
```

## 3. React Standards

### 3.1 Component Structure
```typescript
// Functional components với TypeScript
interface RobotCardProps {
  robot: Robot;
  onSelect?: (robot: Robot) => void;
  className?: string;
}

export const RobotCard: React.FC<RobotCardProps> = ({
  robot,
  onSelect,
  className
}) => {
  // Implementation
};

// Custom hooks
const useRobot = (id: string) => {
  // Implementation
};

// Map Editor component
interface MapEditorProps {
  map: Map;
  onSave: (map: Map) => void;
  onCancel: () => void;
}

export const MapEditor: React.FC<MapEditorProps> = ({
  map,
  onSave,
  onCancel
}) => {
  // Implementation
};

// Task Scheduler component
interface TaskSchedulerProps {
  robot: Robot;
  onSchedule: (task: Task) => void;
  onCancel: () => void;
}

export const TaskScheduler: React.FC<TaskSchedulerProps> = ({
  robot,
  onSchedule,
  onCancel
}) => {
  // Implementation
};
```

### 3.2 State Management
```typescript
// Redux slice
const robotSlice = createSlice({
  name: 'robots',
  initialState,
  reducers: {
    setRobots: (state, action: PayloadAction<Robot[]>) => {
      state.robots = action.payload;
    }
  }
});
```

## 4. File Structure

### 4.1 Directory Organization
```
src/
├── api/                # API services
│   ├── atoms/         # Atomic components
│   ├── molecules/     # Molecular components
│   ├── organisms/     # Organism components
│   ├── templates/     # Template components
│   └── pages/         # Page components
├── hooks/             # Custom hooks
├── store/             # State management
├── types/             # TypeScript types
├── utils/             # Utility functions
├── services/          # Business logic services
├── config/            # Configuration files
└── assets/            # Static assets
```

### 4.2 Naming Conventions
- Files: PascalCase for components (RobotCard.tsx)
- Interfaces: PascalCase (Robot, RobotProps)
- Types: PascalCase (RobotStatus)
- Functions: camelCase (getRobotStatus)
- Constants: UPPER_SNAKE_CASE (API_ENDPOINT)

## 5. Code Style

### 5.1 ESLint Configuration
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### 5.2 Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## 6. Documentation

### 6.1 Code Comments
```typescript
/**
 * RobotCard component displays robot information
 * @param {Robot} robot - Robot object
 * @param {Function} onSelect - Selection callback
 * @returns {JSX.Element} Robot card component
 */

/**
 * MapEditor component for editing 2D maps
 * @param {Map} map - Map object to edit
 * @param {Function} onSave - Save callback
 * @param {Function} onCancel - Cancel callback
 * @returns {JSX.Element} Map editor component
 */

/**
 * TaskScheduler component for scheduling robot tasks
 * @param {Robot} robot - Robot to schedule tasks for
 * @param {Function} onSchedule - Schedule callback
 * @param {Function} onCancel - Cancel callback
 * @returns {JSX.Element} Task scheduler component
 */
```

### 6.2 README Standards
- Project overview
- Setup instructions
- Development guidelines
- Testing procedures
- Deployment process

## 7. Testing Standards

### 7.1 Unit Tests
```typescript
describe('RobotCard', () => {
  it('should render robot information', () => {
    // Test implementation
  });
});

describe('MapEditor', () => {
  it('should render map editor', () => {
    // Test implementation
  });
});

describe('TaskScheduler', () => {
  it('should render task scheduler', () => {
    // Test implementation
  });
});
```

### 7.2 Integration Tests
```typescript
describe('RobotList integration', () => {
  it('should fetch and display robots', async () => {
    // Test implementation
  });
});
```

## 8. Performance Standards

### 8.1 Code Optimization
- Use React.memo for pure components
- Implement proper memoization
- Optimize re-renders
- Use proper lazy loading
- Implement code splitting
- Optimize map rendering
- Optimize task scheduling

### 8.2 Bundle Optimization
- Tree shaking
- Dynamic imports
- Route-based code splitting
- Asset optimization
- Cache management
- Map data optimization
- Task data optimization

## 9. Security Standards

### 9.1 Data Protection
- Input validation
- Output sanitization
- Secure storage
- API security
- Error handling
- Map data security
- Task data security

### 9.2 Authentication
- JWT handling
- Session management
- Access control
- Secure routing
- API authentication
- Robot authentication
- Map access control

## 10. Tài liệu liên quan

### 10.1 Development
- [Component Development](./2-Component_Development.md)
- [API Integration](./3-API_Integration.md)
- [Error Handling](./4-Error_Handling.md)
- [Testing Strategy](./5-Testing_Strategy.md)
- [Performance Optimization](./6-Performance_Optimization.md)
- [Security Implementation](./7-Security_Implementation.md)
- [Deployment Process](./8-Deployment_Process.md)

### 10.2 Architecture
- [Frontend Architecture](../Architecture/1-README.md)
- [Component Architecture](../Architecture/2-Component_Architecture.md)
- [State Management](../Architecture/3-State_Management.md)
- [API Integration](../Architecture/5-API_Integration.md)
- [Security Architecture](../Architecture/9-Security_Architecture.md)
- [System Documentation](../../Systerm/System_Documentation.md)
- [Features](../../User Guild/Features)
- [Getting Started](../../User Guild/Getting_Started)
- [Troubleshooting](../../User Guild/Troubleshooting) 