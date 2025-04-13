# State Management Guide

## State Management Patterns

### Server State with React Query
```typescript
// src/hooks/useRobots.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { robotService } from '../../api/services/robot';
import { Robot } from '../../types/robot';

export const useRobots = () => {
  const queryClient = useQueryClient();

  // Get all robots
  const { data: robots, isLoading, error } = useQuery({
    queryKey: ['robots'],
    queryFn: () => robotService.getAll(),
  });

  // Create robot
  const createRobot = useMutation({
    mutationFn: (data: Partial<Robot>) => robotService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['robots'] });
    },
  });

  return {
    robots,
    isLoading,
    error,
    createRobot,
  };
};
```

### Global UI State with Context
```typescript
// src/contexts/AppContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
```

### Local State with useState
```typescript
// src/components/RobotForm.tsx
import React, { useState } from 'react';
import { Robot } from '../../types/robot';

interface RobotFormProps {
  initialData?: Partial<Robot>;
  onSubmit: (data: Partial<Robot>) => void;
}

export const RobotForm: React.FC<RobotFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Partial<Robot>>(
    initialData || {
      name: '',
      type: '',
      status: 'idle',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

## State Management Best Practices

### Server State
1. Use React Query for data fetching
2. Implement proper error handling
3. Use optimistic updates
4. Implement proper loading states
5. Cache responses appropriately
6. Handle offline scenarios
7. Implement proper retry logic

### Global UI State
1. Use Context for theme and layout
2. Keep global state minimal
3. Split contexts by domain
4. Implement proper error boundaries
5. Use proper loading indicators
6. Handle concurrent updates
7. Implement proper error recovery

### Local State
1. Use useState for simple state
2. Use useReducer for complex state
3. Keep state close to where it's used
4. Lift state up when needed
5. Use proper state initialization
6. Implement proper state updates
7. Handle state dependencies

## State Management Patterns

### Form State
```typescript
// src/hooks/useForm.ts
import { useState, useCallback } from 'react';

interface FormState<T> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
}

export const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {} as Record<keyof T, string>,
    touched: {} as Record<keyof T, boolean>,
  });

  const handleChange = useCallback(
    (name: keyof T, value: any) => {
      setState((prev) => ({
        ...prev,
        values: {
          ...prev.values,
          [name]: value,
        },
        touched: {
          ...prev.touched,
          [name]: true,
        },
      }));
    },
    []
  );

  const handleBlur = useCallback((name: keyof T) => {
    setState((prev) => ({
      ...prev,
      touched: {
        ...prev.touched,
        [name]: true,
      },
    }));
  }, []);

  const setErrors = useCallback((errors: Record<keyof T, string>) => {
    setState((prev) => ({
      ...prev,
      errors,
    }));
  }, []);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    handleChange,
    handleBlur,
    setErrors,
  };
};
```

### Pagination State
```typescript
// src/hooks/usePagination.ts
import { useState, useCallback } from 'react';

interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export const usePagination = (initialState: PaginationState) => {
  const [state, setState] = useState<PaginationState>(initialState);

  const handlePageChange = useCallback((page: number) => {
    setState((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const handleLimitChange = useCallback((limit: number) => {
    setState((prev) => ({
      ...prev,
      limit,
      page: 1,
    }));
  }, []);

  const setTotal = useCallback((total: number) => {
    setState((prev) => ({
      ...prev,
      total,
    }));
  }, []);

  return {
    ...state,
    handlePageChange,
    handleLimitChange,
    setTotal,
  };
};
```

### Filter State
```typescript
// src/hooks/useFilters.ts
import { useState, useCallback } from 'react';

interface FilterState {
  search: string;
  status: string[];
  type: string[];
}

export const useFilters = (initialState: FilterState) => {
  const [state, setState] = useState<FilterState>(initialState);

  const handleSearchChange = useCallback((search: string) => {
    setState((prev) => ({
      ...prev,
      search,
    }));
  }, []);

  const handleStatusChange = useCallback((status: string[]) => {
    setState((prev) => ({
      ...prev,
      status,
    }));
  }, []);

  const handleTypeChange = useCallback((type: string[]) => {
    setState((prev) => ({
      ...prev,
      type,
    }));
  }, []);

  return {
    ...state,
    handleSearchChange,
    handleStatusChange,
    handleTypeChange,
  };
};
```

## Performance Optimization

### Memoization
```typescript
// src/components/RobotList.tsx
import React, { useMemo } from 'react';
import { Robot } from '../../types/robot';

interface RobotListProps {
  robots: Robot[];
  onRobotClick: (robot: Robot) => void;
}

export const RobotList: React.FC<RobotListProps> = ({
  robots,
  onRobotClick,
}) => {
  const sortedRobots = useMemo(() => {
    return [...robots].sort((a, b) => a.name.localeCompare(b.name));
  }, [robots]);

  return (
    <ul>
      {sortedRobots.map((robot) => (
        <li key={robot.id} onClick={() => onRobotClick(robot)}>
          {robot.name}
        </li>
      ))}
    </ul>
  );
};
```

### Lazy Loading
```typescript
// src/components/RobotDetails.tsx
import React, { lazy, Suspense } from 'react';

const RobotStats = lazy(() => import('./RobotStats'));
const RobotLogs = lazy(() => import('./RobotLogs'));

export const RobotDetails: React.FC = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <RobotStats />
        <RobotLogs />
      </Suspense>
    </div>
  );
};
```

### Virtualization
```typescript
// src/components/VirtualizedList.tsx
import React from 'react';
import { FixedSizeList } from 'react-window';

interface VirtualizedListProps {
  items: any[];
  itemHeight: number;
  renderItem: (item: any) => React.ReactNode;
}

export const VirtualizedList: React.FC<VirtualizedListProps> = ({
  items,
  itemHeight,
  renderItem,
}) => {
  return (
    <FixedSizeList
      height={400}
      width="100%"
      itemCount={items.length}
      itemSize={itemHeight}
    >
      {({ index, style }) => (
        <div style={style}>{renderItem(items[index])}</div>
      )}
    </FixedSizeList>
  );
};
``` 