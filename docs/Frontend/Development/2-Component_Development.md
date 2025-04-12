# Component Development Guide

## 1. Tổng quan

Hướng dẫn phát triển component cho dự án Feet Robot Manager V2, sử dụng React và TypeScript, tuân thủ kiến trúc Atomic Design và các tiêu chuẩn đã định nghĩa.

### 1.1 Mục tiêu
- Đảm bảo tính nhất quán của UI/UX
- Tăng khả năng tái sử dụng component
- Cải thiện khả năng bảo trì
- Tuân thủ kiến trúc Atomic Design
- Hỗ trợ quy mô nhỏ (3 Workset, 20 robot)

### 1.2 Phạm vi
- Web Application (React)
- Mobile Application (React Native)
- UI Components
- Business Components
- Integration Components

### 1.3 Giới hạn hệ thống
- Tối đa 3 Workset
- Tối đa 20 robot
- Bản đồ 2D đơn giản
- Giao thức: MQTT, WebSocket, gRPC
- Cơ sở dữ liệu: PostgreSQL, SQLite (mobile)

## 2. Component Architecture

### 2.1 Atomic Design
```
src/components/
├── atoms/         # Basic building blocks
│   ├── Button/
│   ├── Input/
│   ├── Icon/
│   └── Typography/
├── molecules/     # Simple combinations
│   ├── SearchBar/
│   ├── RobotStatus/
│   └── TaskCard/
├── organisms/     # Complex UI sections
│   ├── RobotList/
│   ├── MapViewer/
│   └── TaskScheduler/
├── templates/     # Page layouts
│   ├── Dashboard/
│   ├── Workset/
│   └── Settings/
└── pages/         # Complete pages
    ├── Home/
    ├── Robots/
    └── Tasks/
```

### 2.2 Component Types
```typescript
// Atom Component
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'small' | 'medium' | 'large';
  onClick: () => void;
  children: React.ReactNode;
}

// Molecule Component
interface RobotStatusProps {
  status: RobotStatus;
  battery: number;
  lastUpdated: Date;
}

// Organism Component
interface RobotListProps {
  robots: Robot[];
  onSelect: (robot: Robot) => void;
  onEdit: (robot: Robot) => void;
  onDelete: (robot: Robot) => void;
}

// Template Component
interface DashboardLayoutProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  content: React.ReactNode;
  footer: React.ReactNode;
}
```

## 3. Component Development

### 3.1 Development Process
1. **Analysis**
   - Xác định yêu cầu
   - Phân tích UI/UX
   - Xác định loại component
   - Xác định props và state

2. **Implementation**
   - Tạo component structure
   - Implement logic
   - Add styling
   - Add tests

3. **Testing**
   - Unit tests
   - Integration tests
   - Performance tests
   - Accessibility tests

4. **Documentation**
   - Props documentation
   - Usage examples
   - Best practices
   - Performance considerations

### 3.2 Code Examples
```typescript
// Atom Component
export const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  onClick,
  children
}) => {
  return (
    <button
      className={`button button--${variant} button--${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Molecule Component
export const RobotStatus: React.FC<RobotStatusProps> = ({
  status,
  battery,
  lastUpdated
}) => {
  return (
    <div className="robot-status">
      <StatusIndicator status={status} />
      <BatteryIndicator level={battery} />
      <LastUpdated time={lastUpdated} />
    </div>
  );
};

// Organism Component
export const RobotList: React.FC<RobotListProps> = ({
  robots,
  onSelect,
  onEdit,
  onDelete
}) => {
  return (
    <div className="robot-list">
      {robots.map(robot => (
        <RobotCard
          key={robot.id}
          robot={robot}
          onSelect={() => onSelect(robot)}
          onEdit={() => onEdit(robot)}
          onDelete={() => onDelete(robot)}
        />
      ))}
    </div>
  );
};
```

## 4. Styling Guidelines

### 4.1 CSS-in-JS
```typescript
// Using styled-components
const Button = styled.button<{ variant: string; size: string }>`
  padding: ${props => props.size === 'large' ? '12px 24px' : '8px 16px'};
  background-color: ${props => props.variant === 'primary' ? '#007bff' : '#6c757d'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;
```

### 4.2 Theme Integration
```typescript
// Theme configuration
const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8'
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px'
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: {
      small: '12px',
      medium: '14px',
      large: '16px'
    }
  }
};
```

## 5. Performance Optimization

### 5.1 Memoization
```typescript
// Using React.memo
const RobotCard = React.memo(({ robot, onSelect }) => {
  return (
    <div onClick={() => onSelect(robot)}>
      <RobotStatus status={robot.status} />
      <RobotInfo robot={robot} />
    </div>
  );
});

// Using useMemo
const RobotList = ({ robots }) => {
  const sortedRobots = useMemo(() => {
    return [...robots].sort((a, b) => a.name.localeCompare(b.name));
  }, [robots]);
  
  return (
    <div>
      {sortedRobots.map(robot => (
        <RobotCard key={robot.id} robot={robot} />
      ))}
    </div>
  );
};
```

### 5.2 Lazy Loading
```typescript
// Lazy loading components
const MapEditor = React.lazy(() => import('./MapEditor'));
const TaskScheduler = React.lazy(() => import('./TaskScheduler'));

// Using Suspense
const Dashboard = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MapEditor />
      <TaskScheduler />
    </Suspense>
  );
};
```

## 6. Testing Guidelines

### 6.1 Unit Testing
```typescript
// Using Jest and React Testing Library
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
    expect(screen.getByText('80%')).toBeInTheDocument();
  });
});
```

### 6.2 Integration Testing
```typescript
describe('RobotList integration', () => {
  it('should handle robot selection', async () => {
    const onSelect = jest.fn();
    const robots = [
      { id: '1', name: 'Robot 1' },
      { id: '2', name: 'Robot 2' }
    ];
    
    render(<RobotList robots={robots} onSelect={onSelect} />);
    
    fireEvent.click(screen.getByText('Robot 1'));
    expect(onSelect).toHaveBeenCalledWith(robots[0]);
  });
});
```

## 7. Accessibility Guidelines

### 7.1 ARIA Attributes
```typescript
const Button = ({ children, ...props }) => (
  <button
    role="button"
    aria-label={props['aria-label']}
    {...props}
  >
    {children}
  </button>
);

const RobotStatus = ({ status }) => (
  <div
    role="status"
    aria-live="polite"
    aria-label={`Robot status: ${status}`}
  >
    <StatusIndicator status={status} />
  </div>
);
```

### 7.2 Keyboard Navigation
```typescript
const RobotList = ({ robots, onSelect }) => {
  const handleKeyDown = (event, robot) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onSelect(robot);
    }
  };
  
  return (
    <div role="list">
      {robots.map(robot => (
        <div
          key={robot.id}
          role="listitem"
          tabIndex={0}
          onKeyDown={e => handleKeyDown(e, robot)}
          onClick={() => onSelect(robot)}
        >
          <RobotCard robot={robot} />
        </div>
      ))}
    </div>
  );
};
```

## 8. Tài liệu liên quan

### 8.1 Development
- [Coding Standards](./1-Coding_Standards.md)
- [API Integration](./3-API_Integration.md)
- [Error Handling](./4-Error_Handling.md)
- [Testing Strategy](./5-Testing_Strategy.md)
- [Performance Optimization](./6-Performance_Optimization.md)
- [Security Implementation](./7-Security_Implementation.md)
- [Deployment Process](./8-Deployment_Process.md)

### 8.2 Architecture
- [Frontend Architecture](../Architecture/1-README.md)
- [Component Architecture](../Architecture/2-Component_Architecture.md)
- [State Management](../Architecture/3-State_Management.md)
- [API Integration](../Architecture/5-API_Integration.md)
- [Security Architecture](../Architecture/9-Security_Architecture.md)
- [System Documentation](../../Systerm/System_Documentation.md)
- [Features](../../User Guild/Features)
- [Getting Started](../../User Guild/Getting_Started)
- [Troubleshooting](../../User Guild/Troubleshooting) 