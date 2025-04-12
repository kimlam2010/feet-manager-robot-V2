# Prototype Documentation

## 1. Interactive Elements

### 1.1 Buttons

```typescript
// Button States
const buttonStates = {
  default: {
    backgroundColor: '#1976d2',
    color: '#ffffff',
    boxShadow: 'none'
  },
  hover: {
    backgroundColor: '#1565c0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
  active: {
    backgroundColor: '#0d47a1',
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
  },
  disabled: {
    backgroundColor: '#e0e0e0',
    color: '#9e9e9e',
    cursor: 'not-allowed'
  }
};

// Button Types
const buttonTypes = {
  primary: {
    backgroundColor: '#1976d2',
    color: '#ffffff'
  },
  secondary: {
    backgroundColor: '#9c27b0',
    color: '#ffffff'
  },
  success: {
    backgroundColor: '#2e7d32',
    color: '#ffffff'
  },
  warning: {
    backgroundColor: '#ed6c02',
    color: '#ffffff'
  },
  error: {
    backgroundColor: '#d32f2f',
    color: '#ffffff'
  }
};
```

### 1.2 Forms

```typescript
// Form States
const formStates = {
  default: {
    border: '1px solid #e0e0e0',
    backgroundColor: '#ffffff'
  },
  focus: {
    border: '2px solid #1976d2',
    boxShadow: '0 0 0 2px rgba(25,118,210,0.2)'
  },
  error: {
    border: '2px solid #d32f2f',
    boxShadow: '0 0 0 2px rgba(211,47,47,0.2)'
  },
  success: {
    border: '2px solid #2e7d32',
    boxShadow: '0 0 0 2px rgba(46,125,50,0.2)'
  }
};

// Form Validation
const formValidation = {
  required: {
    message: 'This field is required',
    pattern: /^.+$/
  },
  email: {
    message: 'Please enter a valid email',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    message: 'Password must be at least 8 characters',
    pattern: /^.{8,}$/
  }
};
```

### 1.3 Navigation

```typescript
// Navigation States
const navigationStates = {
  default: {
    color: '#757575',
    backgroundColor: 'transparent'
  },
  hover: {
    color: '#1976d2',
    backgroundColor: 'rgba(25,118,210,0.04)'
  },
  active: {
    color: '#1976d2',
    backgroundColor: 'rgba(25,118,210,0.08)'
  },
  selected: {
    color: '#1976d2',
    backgroundColor: 'rgba(25,118,210,0.12)'
  }
};

// Navigation Types
const navigationTypes = {
  header: {
    height: '64px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  sidebar: {
    width: '240px',
    backgroundColor: '#ffffff',
    boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
  },
  footer: {
    height: '80px',
    backgroundColor: '#f5f5f5',
    boxShadow: '0 -2px 4px rgba(0,0,0,0.1)'
  }
};
```

## 2. Animations

### 2.1 Transitions

```typescript
// Page Transitions
const pageTransitions = {
  fade: {
    enter: {
      opacity: 0,
      transform: 'translateY(20px)'
    },
    enterActive: {
      opacity: 1,
      transform: 'translateY(0)',
      transition: 'all 0.3s ease-in-out'
    },
    exit: {
      opacity: 1,
      transform: 'translateY(0)'
    },
    exitActive: {
      opacity: 0,
      transform: 'translateY(20px)',
      transition: 'all 0.3s ease-in-out'
    }
  },
  
  slide: {
    enter: {
      transform: 'translateX(100%)'
    },
    enterActive: {
      transform: 'translateX(0)',
      transition: 'all 0.3s ease-in-out'
    },
    exit: {
      transform: 'translateX(0)'
    },
    exitActive: {
      transform: 'translateX(-100%)',
      transition: 'all 0.3s ease-in-out'
    }
  }
};
```

### 2.2 Micro-interactions

```typescript
// Loading States
const loadingStates = {
  spinner: {
    animation: 'spin 1s linear infinite',
    keyframes: `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
  },
  
  pulse: {
    animation: 'pulse 1.5s ease-in-out infinite',
    keyframes: `
      @keyframes pulse {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
      }
    `
  },
  
  shimmer: {
    animation: 'shimmer 2s infinite',
    keyframes: `
      @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      }
    `
  }
};
```

## 3. Responsive Behavior

### 3.1 Breakpoints

```typescript
const breakpoints = {
  xs: {
    min: 0,
    max: 575,
    columns: 4,
    gutter: 12
  },
  sm: {
    min: 576,
    max: 767,
    columns: 8,
    gutter: 16
  },
  md: {
    min: 768,
    max: 991,
    columns: 8,
    gutter: 20
  },
  lg: {
    min: 992,
    max: 1199,
    columns: 12,
    gutter: 24
  },
  xl: {
    min: 1200,
    max: Infinity,
    columns: 12,
    gutter: 24
  }
};
```

### 3.2 Layout Adjustments

```typescript
const layoutAdjustments = {
  header: {
    xs: {
      height: '48px',
      padding: '0 12px'
    },
    sm: {
      height: '56px',
      padding: '0 16px'
    },
    md: {
      height: '64px',
      padding: '0 24px'
    }
  },
  
  sidebar: {
    xs: {
      width: '100%',
      position: 'bottom'
    },
    sm: {
      width: '200px',
      position: 'side'
    },
    md: {
      width: '240px',
      position: 'side'
    }
  },
  
  content: {
    xs: {
      padding: '12px'
    },
    sm: {
      padding: '16px'
    },
    md: {
      padding: '24px'
    }
  }
};
```

## 4. Performance Guidelines

### 4.1 Animation Performance

```typescript
const animationPerformance = {
  // Use transform and opacity for animations
  recommended: {
    properties: ['transform', 'opacity'],
    timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    duration: '300ms'
  },
  
  // Avoid animating these properties
  avoid: [
    'width',
    'height',
    'margin',
    'padding',
    'top',
    'left',
    'right',
    'bottom'
  ],
  
  // Hardware acceleration
  hardwareAcceleration: {
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    perspective: '1000px'
  }
};
```

### 4.2 Image Optimization

```typescript
const imageOptimization = {
  // Responsive images
  responsive: {
    sizes: [
      { width: 320, suffix: '-xs' },
      { width: 576, suffix: '-sm' },
      { width: 768, suffix: '-md' },
      { width: 992, suffix: '-lg' },
      { width: 1200, suffix: '-xl' }
    ],
    formats: ['webp', 'jpg'],
    quality: 80
  },
  
  // Lazy loading
  lazyLoading: {
    threshold: 0.5,
    placeholder: 'data:image/svg+xml;base64,...'
  }
};
``` 