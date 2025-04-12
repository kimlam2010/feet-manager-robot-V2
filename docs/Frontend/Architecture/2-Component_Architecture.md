# Component Architecture

## 1. Tổng quan

Kiến trúc component trong ứng dụng React dựa trên Atomic Design và được tích hợp với Design System.

### 1.1 Mục tiêu
- Tái sử dụng component
- Dễ bảo trì
- Performance tốt
- Accessibility đạt chuẩn
- Responsive design

### 1.2 Phạm vi
- Atomic Design
- Component Composition
- State Management
- Styling
- Testing

## 2. Cấu trúc thư mục

```
src/
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   ├── Input/
│   │   └── Typography/
│   ├── molecules/
│   │   ├── SearchBar/
│   │   ├── FormField/
│   │   └── Card/
│   ├── organisms/
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── Footer/
│   ├── templates/
│   │   ├── DashboardLayout/
│   │   ├── AuthLayout/
│   │   └── ErrorLayout/
│   └── pages/
│       ├── Dashboard/
│       ├── RobotControl/
│       └── Settings/
```

## 3. Component Types

### 3.1 Atoms
- Các component cơ bản nhất
- Không phụ thuộc vào component khác
- Ví dụ: Button, Input, Icon
- Sử dụng Design System tokens

```typescript
// Example: Button
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

const Button = styled.button<ButtonProps>`
  padding: ${({ theme, size }) => theme.spacing[size]};
  font-size: ${({ theme, size }) => theme.typography.fontSize[size]};
  background-color: ${({ theme, variant }) => theme.colors[variant].main};
  color: ${({ theme, variant }) => theme.colors[variant].contrast};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme, variant }) => theme.colors[variant].dark};
  }
`;
```

### 3.2 Molecules
- Kết hợp các atoms
- Có logic đơn giản
- Ví dụ: SearchBar, FormField
- Sử dụng styled-components

```typescript
// Example: SearchBar
interface SearchBarProps {
  placeholder: string;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <SearchBarContainer>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleSearch}
      />
      <Button variant="primary" onClick={() => onSearch(query)}>
        Search
      </Button>
    </SearchBarContainer>
  );
};
```

### 3.3 Organisms
- Kết hợp các molecules và atoms
- Có logic phức tạp
- Ví dụ: Header, Sidebar
- Sử dụng Context API khi cần

```typescript
// Example: Header
interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const { robots } = useRobotContext();

  return (
    <HeaderContainer>
      <Logo />
      <SearchBar onSearch={handleSearch} />
      <UserMenu user={user} onLogout={onLogout} />
      <ThemeToggle onClick={toggleTheme} />
    </HeaderContainer>
  );
};
```

### 3.4 Templates
- Layout components
- Định nghĩa cấu trúc trang
- Ví dụ: DashboardLayout, AuthLayout
- Sử dụng React Router

```typescript
// Example: DashboardLayout
interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
        <Header />
        <Content>{children}</Content>
      </MainContent>
    </LayoutContainer>
  );
};
```

### 3.5 Pages
- Components cấp cao nhất
- Kết hợp các templates và organisms
- Ví dụ: Dashboard, RobotControl
- Sử dụng Redux khi cần

```typescript
// Example: Dashboard
const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { robots, loading } = useSelector(state => state.robots);

  useEffect(() => {
    dispatch(fetchRobots());
  }, [dispatch]);

  return (
    <DashboardLayout>
      <DashboardStats robots={robots} />
      <DashboardCharts robots={robots} />
      <RecentActivity robots={robots} />
    </DashboardLayout>
  );
};
```

## 4. State Management

### 4.1 Local State
- Sử dụng useState cho UI state
- Sử dụng useReducer cho complex state
- Ví dụ: Form state, UI state

### 4.2 Context State
- Sử dụng cho global UI state
- Ví dụ: Theme, Auth, Robot
- Tạo custom hooks để sử dụng

### 4.3 Redux State
- Sử dụng cho global app state
- Ví dụ: Robots, Tasks, Settings
- Sử dụng Redux Toolkit

## 5. Styling

### 5.1 Styled Components
- Sử dụng Design System tokens
- Tách styles vào file riêng
- Sử dụng theme provider

### 5.2 CSS Modules
- Sử dụng cho global styles
- Sử dụng cho third-party components
- Sử dụng cho legacy code

## 6. Testing

### 6.1 Unit Tests
- Test atoms và molecules
- Sử dụng Jest và React Testing Library
- Test props và events

### 6.2 Integration Tests
- Test organisms và templates
- Test state management
- Test routing

### 6.3 E2E Tests
- Test pages
- Test user flows
- Sử dụng Cypress

## 7. Best Practices

### 7.1 Component Design
- Single Responsibility
- Composition over Inheritance
- Props Validation
- Default Props

### 7.2 Performance
- Memoization
- Lazy Loading
- Code Splitting
- Virtualization

### 7.3 Documentation
- JSDoc Comments
- Storybook Stories
- README Files
- TypeScript Types

## 8. Component Lifecycle

### 8.1 Mounting
```typescript
// Example
const RobotStatus: React.FC<RobotStatusProps> = ({ robotId }) => {
  useEffect(() => {
    // Fetch initial data
    fetchRobotStatus(robotId);
  }, [robotId]);

  return <div>Status: {status}</div>;
};
```

### 8.2 Updating
```typescript
// Example
const RobotList: React.FC<RobotListProps> = ({ robots }) => {
  useEffect(() => {
    // Update when robots change
    updateList(robots);
  }, [robots]);

  return (
    <ul>
      {robots.map(robot => (
        <RobotItem key={robot.id} robot={robot} />
      ))}
    </ul>
  );
};
```

### 8.3 Unmounting
```typescript
// Example
const RobotControl: React.FC<RobotControlProps> = ({ robotId }) => {
  useEffect(() => {
    // Setup WebSocket connection
    const ws = new WebSocket(`ws://api/robots/${robotId}`);

    return () => {
      // Cleanup on unmount
      ws.close();
    };
  }, [robotId]);

  return <div>Control Panel</div>;
};
```

## 9. Error Handling

### 9.1 Error Boundaries
```typescript
// Example
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

### 9.2 Loading States
```typescript
// Example
const RobotDetails: React.FC<RobotDetailsProps> = ({ robotId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [robot, setRobot] = useState(null);

  useEffect(() => {
    const fetchRobot = async () => {
      try {
        setLoading(true);
        const data = await fetchRobotDetails(robotId);
        setRobot(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRobot();
  }, [robotId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <Error message={error.message} />;
  return <RobotInfo robot={robot} />;
};
``` 