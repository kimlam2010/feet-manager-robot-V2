# Styling Architecture

## Overview
The project uses Styled-components as the sole styling solution. PostCSS and CSS Modules are not used in this project.

## Styling Standards
- Use Styled-components for all styling
- DO NOT use PostCSS or CSS Modules
- Follow theme system guidelines
- Implement responsive design
- Ensure accessibility compliance
- Optimize for performance
- Use TypeScript for type safety
- Document component styles
- Test across browsers

## Core Principles
1. Component-based styling
2. Theme-driven design
3. Type-safe styling
4. Performance optimization
5. Accessibility compliance

## Implementation Guidelines

### 1. Component Styling
- Use Styled-components for all component styles
- Follow Atomic Design principles
- Implement responsive design using theme breakpoints
- Use TypeScript for type safety

### 2. Theme System
- Centralize theme configuration
- Use TypeScript for theme type definitions
- Implement dark/light mode support
- Provide consistent spacing and typography

### 3. Performance
- Implement code splitting
- Use dynamic imports for large components
- Optimize critical CSS
- Minimize style recalculations

### 4. Accessibility
- Ensure sufficient color contrast
- Support keyboard navigation
- Implement focus management
- Follow WCAG guidelines

## Best Practices
1. Use TypeScript for type safety
2. Follow Atomic Design principles
3. Implement responsive design
4. Ensure accessibility compliance
5. Optimize for performance
6. Use theme variables consistently
7. Document component styling
8. Test across browsers
9. Implement error boundaries
10. Follow naming conventions

## Example Usage
```typescript
import styled from 'styled-components';
import { Theme } from '../theme';

interface ButtonProps {
  variant: 'primary' | 'secondary';
}

export const Button = styled.button<ButtonProps>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme, variant }) => 
    variant === 'primary' ? theme.colors.primary : theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
```

## Testing
- Test component styles
- Test theme integration
- Test responsive behavior
- Test accessibility
- Test performance

## Documentation
- Document component styles
- Document theme variables
- Document responsive breakpoints
- Document accessibility features
- Document performance considerations

## 1. Tổng quan

Quản lý styling trong ứng dụng React sử dụng Styled Components với Design System.

### 1.1 Mục tiêu
- Tính nhất quán trong UI
- Dễ bảo trì
- Performance tốt
- Tái sử dụng styles
- Responsive design

### 1.2 Phạm vi
- Global Styles
- Component Styles
- Theme System
- Responsive Design
- Animation

## 2. Cấu trúc thư mục

```
src/
├── styles/
│   ├── theme.ts
│   ├── global.ts
│   ├── mixins.ts
│   └── animations.ts
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.styles.ts
│   └── Card/
│       ├── Card.tsx
│       └── Card.styles.ts
└── layouts/
    ├── MainLayout/
    │   ├── MainLayout.tsx
    │   └── MainLayout.styles.ts
    └── AuthLayout/
        ├── AuthLayout.tsx
        └── AuthLayout.styles.ts
```

## 3. Theme System

### 3.1 Theme Configuration
```typescript
// styles/theme.ts
import { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
  colors: {
    primary: {
      main: '#007bff',
      light: '#3399ff',
      dark: '#0056b3',
      contrast: '#ffffff',
    },
    secondary: {
      main: '#6c757d',
      light: '#8c959d',
      dark: '#4c545c',
      contrast: '#ffffff',
    },
    error: {
      main: '#dc3545',
      light: '#e4606d',
      dark: '#a71d2a',
      contrast: '#ffffff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#212529',
      secondary: '#6c757d',
      disabled: '#adb5bd',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    circle: '50%',
  },
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 8px rgba(0,0,0,0.1)',
    lg: '0 8px 16px rgba(0,0,0,0.1)',
  },
  breakpoints: {
    xs: '0px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1920px',
  },
  zIndex: {
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
};
```

### 3.2 Theme Provider
```typescript
// App.tsx
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* App content */}
    </ThemeProvider>
  );
}
```

## 4. Styled Components

### 4.1 Base Components
```typescript
// components/Button/Button.styles.ts
import styled from 'styled-components';

export const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.9;
  }
`;
```

### 4.2 Themed Components
```typescript
// components/Card/Card.styles.ts
import styled from 'styled-components';

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.lg};
`;
```

## 5. Responsive Design

### 5.1 Media Queries
```typescript
// components/Grid/Grid.styles.ts
import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
```

## 6. Animations

### 6.1 Keyframes
```typescript
// styles/animations.ts
import { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;
```

### 6.2 Animated Components
```typescript
// components/Modal/Modal.styles.ts
import styled from 'styled-components';
import { fadeIn } from '../../styles/animations';

export const Modal = styled.div`
  animation: ${fadeIn} 0.3s ease-in-out;
`;
``` 