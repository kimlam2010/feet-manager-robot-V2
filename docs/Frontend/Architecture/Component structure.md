# Component Structure

## Overview

This document outlines the component structure and organization for the Robot Fleet Management System frontend.

## Component Categories

### 1. UI Components (`/components/ui`)
- Basic building blocks
- Reusable across features
- Styled with Tailwind CSS
- Examples:
  - Button
  - Input
  - Card
  - Modal
  - Table

### 2. Feature Components (`/components/features`)
- Feature-specific components
- Business logic
- State management
- Examples:
  - RobotList
  - WorksetEditor
  - Dashboard
  - Settings

### 3. Shared Components (`/components/shared`)
- Common utilities
- Layout components
- Navigation
- Examples:
  - Header
  - Footer
  - Sidebar
  - Breadcrumbs

## Component Structure

### Basic Component
```typescript
// components/ui/Button.tsx
import { FC } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button: FC<ButtonProps> = ({
  className,
  variant,
  size,
  isLoading,
  children,
  ...props
}) => {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export { Button, buttonVariants };
```

### Feature Component
```typescript
// components/features/RobotList.tsx
import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RobotCard } from './RobotCard';
import { Button } from '@/components/ui/Button';
import { fetchRobots } from '@/lib/api';

export const RobotList: FC = () => {
  const { data: robots, isLoading } = useQuery({
    queryKey: ['robots'],
    queryFn: fetchRobots,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {robots?.map((robot) => (
        <RobotCard key={robot.id} robot={robot} />
      ))}
    </div>
  );
};
```

### Shared Component
```typescript
// components/shared/PageHeader.tsx
import { FC, ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
};
```

## Component Guidelines

### 1. Naming Conventions
- Use PascalCase for component names
- Use camelCase for props and variables
- Prefix with feature name for feature components
- Use descriptive names

### 2. Props
- Define interfaces for props
- Use TypeScript for type safety
- Document props with JSDoc
- Use default props when appropriate

### 3. Styling
- Use Tailwind CSS classes
- Follow design system
- Use CSS variables for theming
- Keep styles modular

### 4. State Management
- Use local state for UI state
- Use global state for app state
- Use React Query for server state
- Keep state minimal

### 5. Performance
- Use React.memo for pure components
- Use useCallback for functions
- Use useMemo for expensive calculations
- Implement lazy loading

### 6. Testing
- Write unit tests
- Test component rendering
- Test user interactions
- Test edge cases

### 7. Documentation
- Document component purpose
- Document props
- Document usage examples
- Document limitations

## Best Practices

### 1. Component Design
- Keep components small
- Single responsibility
- Reusable
- Composable

### 2. Code Organization
- Group related components
- Use index files
- Follow file structure
- Keep imports clean

### 3. Error Handling
- Use error boundaries
- Handle loading states
- Handle error states
- Provide fallbacks

### 4. Accessibility
- Use semantic HTML
- Add ARIA attributes
- Handle keyboard navigation
- Test with screen readers

### 5. Performance
- Optimize renders
- Use code splitting
- Optimize images
- Monitor performance

### 6. Maintenance
- Keep dependencies updated
- Follow coding standards
- Write clean code
- Document changes 