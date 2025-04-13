# Component Design Guide

## Component Design Patterns

### Presentational Components
```typescript
// src/components/RobotCard.tsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Robot } from '../../types/robot';

interface RobotCardProps {
  robot: Robot;
  onEdit: (robot: Robot) => void;
  onDelete: (robot: Robot) => void;
}

export const RobotCard: React.FC<RobotCardProps> = ({
  robot,
  onEdit,
  onDelete,
}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{robot.name}</Typography>
        <Typography variant="body2">Type: {robot.type}</Typography>
        <Typography variant="body2">Status: {robot.status}</Typography>
        <Button onClick={() => onEdit(robot)}>Edit</Button>
        <Button onClick={() => onDelete(robot)}>Delete</Button>
      </CardContent>
    </Card>
  );
};
```

### Container Components
```typescript
// src/containers/RobotListContainer.tsx
import React from 'react';
import { useRobots } from '../../hooks/useRobots';
import { RobotList } from '../components/RobotList';

export const RobotListContainer: React.FC = () => {
  const { robots, isLoading, error } = useRobots();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <RobotList robots={robots} />;
};
```

### Higher-Order Components
```typescript
// src/hocs/withErrorBoundary.tsx
import React from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const withErrorBoundary = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return (props: P) => (
    <ErrorBoundary>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );
};
```

### Render Props
```typescript
// src/components/DataProvider.tsx
import React from 'react';

interface DataProviderProps<T> {
  children: (data: T, loading: boolean, error: Error | null) => React.ReactNode;
  fetchData: () => Promise<T>;
}

export const DataProvider = <T extends object>({
  children,
  fetchData,
}: DataProviderProps<T>) => {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchData]);

  return <>{children(data as T, loading, error)}</>;
};
```

## Component Best Practices

### Props Design
1. Use TypeScript interfaces for props
2. Keep props minimal and focused
3. Use default props when appropriate
4. Document props with JSDoc comments
5. Use prop-types for runtime validation
6. Avoid prop drilling
7. Use context for global props

### State Management
1. Keep state local when possible
2. Lift state up when needed
3. Use proper state initialization
4. Handle state updates correctly
5. Use proper state dependencies
6. Implement proper error handling
7. Use proper loading states

### Performance
1. Use React.memo for pure components
2. Implement proper key props
3. Use useCallback for event handlers
4. Use useMemo for expensive calculations
5. Implement proper lazy loading
6. Use proper code splitting
7. Implement proper virtualization

### Accessibility
1. Use proper ARIA attributes
2. Implement keyboard navigation
3. Use proper focus management
4. Provide proper alt text
5. Use proper color contrast
6. Implement proper screen reader support
7. Test with accessibility tools

## Component Structure

### File Organization
```
src/
  components/
    common/
      Button.tsx
      Input.tsx
      Select.tsx
    layout/
      Header.tsx
      Sidebar.tsx
      Footer.tsx
    features/
      robots/
        RobotCard.tsx
        RobotList.tsx
        RobotForm.tsx
  containers/
    RobotListContainer.tsx
    RobotFormContainer.tsx
  hocs/
    withErrorBoundary.tsx
    withLoading.tsx
  hooks/
    useRobots.ts
    useRobot.ts
  types/
    robot.ts
    common.ts
```

### Component Structure
```typescript
// src/components/RobotCard.tsx
import React from 'react';
import { styled } from '@mui/material/styles';
import { Robot } from '../../types/robot';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(2),
}));

// Types
interface RobotCardProps {
  robot: Robot;
  onEdit: (robot: Robot) => void;
  onDelete: (robot: Robot) => void;
}

// Component
export const RobotCard: React.FC<RobotCardProps> = ({
  robot,
  onEdit,
  onDelete,
}) => {
  // Hooks
  const [isEditing, setIsEditing] = React.useState(false);

  // Handlers
  const handleEdit = () => {
    setIsEditing(true);
    onEdit(robot);
  };

  const handleDelete = () => {
    onDelete(robot);
  };

  // Render
  return (
    <StyledCard>
      {/* Component content */}
    </StyledCard>
  );
};
```

## Component Testing

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