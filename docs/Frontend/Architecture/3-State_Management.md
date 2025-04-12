# State Management

## 1. Tổng quan

Quản lý state trong ứng dụng React sử dụng kết hợp Redux Toolkit, React Query và Context API.

### 1.1 Mục tiêu
- Quản lý state hiệu quả
- Dễ dàng debug
- Performance tốt
- Code dễ bảo trì
- Tái sử dụng logic

### 1.2 Phạm vi
- Global State
- Server State
- UI State
- Form State

## 2. Cấu trúc thư mục

```
src/
├── store/
│   ├── slices/
│   │   ├── robotSlice.ts
│   │   ├── taskSlice.ts
│   │   └── userSlice.ts
│   ├── hooks.ts
│   └── index.ts
├── hooks/
│   ├── useRobot.ts
│   ├── useTask.ts
│   └── useUser.ts
└── contexts/
    ├── ThemeContext.tsx
    ├── AuthContext.tsx
    └── RobotContext.tsx
```

## 3. Redux Toolkit

### 3.1 Store Configuration
```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import robotReducer from './slices/robotSlice';
import taskReducer from './slices/taskSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    robots: robotReducer,
    tasks: taskReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger, errorHandler),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 3.2 Slice Example
```typescript
// store/slices/robotSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RobotState {
  robots: Robot[];
  selectedRobot: Robot | null;
  loading: boolean;
  error: string | null;
}

const initialState: RobotState = {
  robots: [],
  selectedRobot: null,
  loading: false,
  error: null,
};

const robotSlice = createSlice({
  name: 'robots',
  initialState,
  reducers: {
    setRobots: (state, action: PayloadAction<Robot[]>) => {
      state.robots = action.payload;
    },
    setSelectedRobot: (state, action: PayloadAction<Robot>) => {
      state.selectedRobot = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setRobots, setSelectedRobot, setLoading, setError } = robotSlice.actions;
export default robotSlice.reducer;
```

### 3.3 Custom Hooks
```typescript
// store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## 4. React Query

### 4.1 Query Client Setup
```typescript
// src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* App content */}
    </QueryClientProvider>
  );
}
```

### 4.2 Custom Query Hooks
```typescript
// hooks/useRobot.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { robotApi } from '../services/api';

export const useRobot = (robotId: string) => {
  return useQuery({
    queryKey: ['robot', robotId],
    queryFn: () => robotApi.getRobot(robotId),
  });
};

export const useUpdateRobot = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (robot: Robot) => robotApi.updateRobot(robot),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['robots'] });
    },
  });
};
```

## 5. Context API

### 5.1 Theme Context
```typescript
// contexts/ThemeContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

### 5.2 Robot Context
```typescript
// contexts/RobotContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface RobotContextType {
  selectedRobot: Robot | null;
  setSelectedRobot: (robot: Robot | null) => void;
}

const RobotContext = createContext<RobotContextType | undefined>(undefined);

export const RobotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);

  return (
    <RobotContext.Provider value={{ selectedRobot, setSelectedRobot }}>
      {children}
    </RobotContext.Provider>
  );
};

export const useRobotContext = () => {
  const context = useContext(RobotContext);
  if (!context) {
    throw new Error('useRobotContext must be used within a RobotProvider');
  }
  return context;
};
```

## 6. Form State

### 6.1 React Hook Form
```typescript
// components/forms/RobotForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { robotSchema } from '../schemas/robot';

interface RobotFormProps {
  onSubmit: (data: RobotFormData) => void;
  defaultValues?: Partial<RobotFormData>;
}

const RobotForm: React.FC<RobotFormProps> = ({ onSubmit, defaultValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RobotFormData>({
    resolver: zodResolver(robotSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('name')}
        error={errors.name?.message}
      />
      <Input
        {...register('type')}
        error={errors.type?.message}
      />
      <Button type="submit">Save</Button>
    </form>
  );
};
```

## 7. Best Practices

### 7.1 State Organization
- Keep state as local as possible
- Use Redux for global state
- Use Context for theme/UI state
- Use React Query for server state

### 7.2 Performance
- Memoize selectors
- Use shallow equality checks
- Implement proper cleanup
- Optimize re-renders

### 7.3 Testing
- Test state changes
- Test selectors
- Test async actions
- Test error handling

## 8. Error Handling

### 8.1 Redux Middleware
```typescript
// store/middleware/errorHandler.ts
const errorHandler = () => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    console.error('Redux Error:', error);
    return next({
      type: 'ERROR',
      payload: error.message,
    });
  }
};
```

### 8.2 React Query Error Handling
```typescript
// hooks/useRobot.ts
export const useRobot = (robotId: string) => {
  return useQuery({
    queryKey: ['robot', robotId],
    queryFn: () => robotApi.getRobot(robotId),
    onError: (error) => {
      // Handle error
      console.error('Robot fetch error:', error);
    },
  });
};
```
