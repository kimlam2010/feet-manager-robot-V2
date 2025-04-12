# Style Guide Documentation

## 1. Colors

```typescript
const colors = {
  // Primary Colors
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    contrast: '#ffffff'
  },
  
  // Secondary Colors
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2',
    contrast: '#ffffff'
  },
  
  // Status Colors
  success: {
    main: '#2e7d32',
    light: '#4caf50',
    dark: '#1b5e20',
    contrast: '#ffffff'
  },
  
  warning: {
    main: '#ed6c02',
    light: '#ff9800',
    dark: '#e65100',
    contrast: '#ffffff'
  },
  
  error: {
    main: '#d32f2f',
    light: '#ef5350',
    dark: '#c62828',
    contrast: '#ffffff'
  },
  
  // Neutral Colors
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121'
  },
  
  // Background Colors
  background: {
    default: '#ffffff',
    paper: '#f5f5f5',
    dark: '#121212'
  },
  
  // Text Colors
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)'
  }
};
```

## 2. Typography

```typescript
const typography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  
  // Font Sizes
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    md: '1rem',       // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    xxl: '1.5rem',    // 24px
    xxxl: '2rem'      // 32px
  },
  
  // Font Weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75
  },
  
  // Headings
  h1: {
    fontSize: '2.5rem',
    fontWeight: 500,
    lineHeight: 1.2
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 500,
    lineHeight: 1.2
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 500,
    lineHeight: 1.2
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 500,
    lineHeight: 1.2
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: 1.2
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.2
  }
};
```

## 3. Components

```typescript
const components = {
  // Buttons
  button: {
    padding: {
      small: '4px 8px',
      medium: '8px 16px',
      large: '12px 24px'
    },
    borderRadius: '4px',
    fontSize: {
      small: '0.875rem',
      medium: '1rem',
      large: '1.125rem'
    }
  },
  
  // Input Fields
  input: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
    fontSize: '1rem',
    height: {
      small: '32px',
      medium: '40px',
      large: '48px'
    }
  },
  
  // Cards
  card: {
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundColor: '#ffffff'
  },
  
  // Tables
  table: {
    header: {
      backgroundColor: '#f5f5f5',
      padding: '12px 16px',
      fontWeight: 500
    },
    cell: {
      padding: '12px 16px',
      borderBottom: '1px solid #e0e0e0'
    }
  },
  
  // Navigation
  navigation: {
    height: {
      header: '64px',
      sidebar: '100%',
      footer: '80px'
    },
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }
};
```

## 4. Spacing

```typescript
const spacing = {
  // Base Unit: 8px
  base: 8,
  
  // Spacing Scale
  xs: '4px',    // 0.5 * base
  sm: '8px',    // 1 * base
  md: '16px',   // 2 * base
  lg: '24px',   // 3 * base
  xl: '32px',   // 4 * base
  xxl: '48px',  // 6 * base
  xxxl: '64px'  // 8 * base
};
```

## 5. Shadows

```typescript
const shadows = {
  // Elevation Levels
  level1: '0 2px 4px rgba(0,0,0,0.1)',
  level2: '0 4px 8px rgba(0,0,0,0.1)',
  level3: '0 8px 16px rgba(0,0,0,0.1)',
  level4: '0 16px 24px rgba(0,0,0,0.1)',
  level5: '0 24px 32px rgba(0,0,0,0.1)'
};
```

## 6. Animations

```typescript
const animations = {
  // Durations
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms'
  },
  
  // Timing Functions
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
  },
  
  // Transitions
  transitions: {
    default: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
  }
};
```

## 7. Z-Index

```typescript
const zIndex = {
  // Base Layers
  base: 0,
  above: 1,
  below: -1,
  
  // Component Layers
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500
};
``` 