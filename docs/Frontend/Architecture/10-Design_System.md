# 7. Design System Architecture

## 1. Tổng quan

Tài liệu này mô tả kiến trúc và implementation của Design System cho Feet Robot Manager V2.

### 1.1 Mục tiêu

- Cung cấp hệ thống thiết kế nhất quán
- Tăng tốc độ phát triển
- Đảm bảo tính nhất quán của UI/UX
- Hỗ trợ theming và dark mode
- Tối ưu hóa performance
- Type safety với TypeScript

### 1.2 Phạm vi

- Design Tokens
- Component Library
- Theme System
- Typography
- Color System
- Spacing System
- Icon System
- Animation System

## 2. Design Tokens

### 2.1 Token Structure

```typescript
// design-tokens.ts
interface DesignTokens {
  colors: {
    primary: {
      main: string;
      light: string;
      dark: string;
      contrast: string;
    };
    secondary: {
      main: string;
      light: string;
      dark: string;
      contrast: string;
    };
    // ... other colors
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    fontWeight: {
      regular: number;
      medium: number;
      bold: number;
    };
    lineHeight: {
      tight: string;
      normal: string;
      relaxed: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
    wide: string;
  };
  zIndex: {
    dropdown: number;
    modal: number;
    tooltip: number;
    toast: number;
  };
}
```

### 2.2 Token Implementation

```typescript
// tokens/light.ts
export const lightTokens: DesignTokens = {
  colors: {
    primary: {
      main: '#007bff',
      light: '#3393ff',
      dark: '#0056b3',
      contrast: '#ffffff',
    },
    secondary: {
      main: '#6c757d',
      light: '#8e959c',
      dark: '#4e555b',
      contrast: '#ffffff',
    },
    // ... other colors
  },
  // ... other tokens
};

// tokens/dark.ts
export const darkTokens: DesignTokens = {
  colors: {
    primary: {
      main: '#3393ff',
      light: '#66b0ff',
      dark: '#007bff',
      contrast: '#ffffff',
    },
    secondary: {
      main: '#8e959c',
      light: '#a6acb2',
      dark: '#6c757d',
      contrast: '#ffffff',
    },
    // ... other colors
  },
  // ... other tokens
};
```

## 3. Component Library

### 3.1 Base Components

```typescript
// components/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme, size = 'md' }) => theme.typography.fontSize[size]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  padding: ${({ theme, size = 'md' }) => theme.spacing[size]};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

  ${({ theme, variant = 'primary' }) => {
    switch (variant) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary.main};
          color: ${theme.colors.primary.contrast};
          &:hover {
            background-color: ${theme.colors.primary.dark};
          }
        `;
      case 'secondary':
        return `
          background-color: ${theme.colors.secondary.main};
          color: ${theme.colors.secondary.contrast};
          &:hover {
            background-color: ${theme.colors.secondary.dark};
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          border: 1px solid ${theme.colors.primary.main};
          color: ${theme.colors.primary.main};
          &:hover {
            background-color: ${theme.colors.primary.main};
            color: ${theme.colors.primary.contrast};
          }
        `;
      case 'text':
        return `
          background-color: transparent;
          color: ${theme.colors.primary.main};
          &:hover {
            background-color: ${theme.colors.primary.light}20;
          }
        `;
    }
  }}

  ${({ disabled }) =>
    disabled &&
    `
    opacity: 0.5;
    cursor: not-allowed;
  `}

  ${({ loading }) =>
    loading &&
    `
    cursor: wait;
  `}
`;
```

### 3.2 Form Components

```typescript
// components/Input.tsx
interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  // ... other props
}

const Input = styled.input<InputProps>`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme, error }) => (error ? theme.colors.error.main : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabled};
    cursor: not-allowed;
  }
`;
```

## 4. Theme System

### 4.1 Theme Provider

```typescript
// theme/ThemeProvider.tsx
interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: 'light' | 'dark';
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme = 'light',
}) => {
  const [currentTheme, setCurrentTheme] = useState(theme);
  const tokens = currentTheme === 'light' ? lightTokens : darkTokens;

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      <StyledComponentsThemeProvider theme={tokens}>
        {children}
      </StyledComponentsThemeProvider>
    </ThemeContext.Provider>
  );
};
```

### 4.2 Theme Hooks

```typescript
// theme/useTheme.ts
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const useThemeTokens = () => {
  const { theme } = useTheme();
  return theme === 'light' ? lightTokens : darkTokens;
};
```

## 5. Typography System

### 5.1 Typography Components

```typescript
// typography/Text.tsx
interface TextProps {
  variant?: 'body' | 'caption' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  color?: string;
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

const Text = styled.p<TextProps>`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme, variant = 'body' }) => {
    switch (variant) {
      case 'h1':
        return theme.typography.fontSize.xl;
      case 'h2':
        return theme.typography.fontSize.lg;
      case 'h3':
        return theme.typography.fontSize.md;
      case 'body':
        return theme.typography.fontSize.md;
      case 'caption':
        return theme.typography.fontSize.sm;
      default:
        return theme.typography.fontSize.md;
    }
  }};
  font-weight: ${({ variant = 'body' }) => {
    switch (variant) {
      case 'h1':
      case 'h2':
      case 'h3':
        return 700;
      default:
        return 400;
    }
  }};
  color: ${({ theme, color }) => color || theme.colors.text.primary};
  text-align: ${({ align = 'left' }) => align};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  margin: 0;
`;
```

## 6. Icon System

### 6.1 Icon Components

```typescript
// icons/Icon.tsx
interface IconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const Icon = styled.i<IconProps>`
  display: inline-block;
  font-size: ${({ theme, size = 'md' }) => {
    switch (size) {
      case 'sm':
        return theme.typography.fontSize.sm;
      case 'md':
        return theme.typography.fontSize.md;
      case 'lg':
        return theme.typography.fontSize.lg;
    }
  }};
  color: ${({ theme, color }) => color || theme.colors.text.primary};
  line-height: 1;
`;
```

## 7. Animation System

### 7.1 Animation Tokens

```typescript
// animations/tokens.ts
export const animationTokens = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
};
```

### 7.2 Animation Components

```typescript
// animations/Fade.tsx
interface FadeProps {
  in: boolean;
  children: React.ReactNode;
  duration?: string;
}

const Fade = styled.div<FadeProps>`
  opacity: ${({ in: isIn }) => (isIn ? 1 : 0)};
  transition: opacity ${{ duration = animationTokens.duration.normal }} ${animationTokens.easing
      .easeInOut};
`;
```

## 8. Best Practices

### 8.1 Design System Guidelines

- Use consistent naming conventions
- Follow atomic design principles
- Implement proper TypeScript types
- Use CSS-in-JS for styling
- Follow accessibility guidelines
- Implement proper error handling
- Use proper documentation
- Follow performance best practices

### 8.2 Component Guidelines

- Keep components small and focused
- Use proper prop types
- Implement proper error states
- Use proper loading states
- Follow accessibility guidelines
- Use proper documentation
- Follow performance best practices

## 9. Tools và Resources

### 9.1 Design Tools

- [Figma](https://www.figma.com/)
- [Storybook](https://storybook.js.org/)
- [Styled Components](https://styled-components.com/)
- [TypeScript](https://www.typescriptlang.org/)

### 9.2 Testing Tools

- [Jest](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Cypress](https://www.cypress.io/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### 9.3 Documentation

- [Material Design](https://material.io/design)
- [IBM Design Language](https://www.ibm.com/design/language/)
- [Atlassian Design System](https://atlassian.design/)
- [Shopify Polaris](https://polaris.shopify.com/)
