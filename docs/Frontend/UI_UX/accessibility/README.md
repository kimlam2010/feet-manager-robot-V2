# Accessibility Guidelines

## 1. Color and Contrast

### 1.1 Color Contrast Ratios

```typescript
const colorContrast = {
  // WCAG 2.1 Level AA requirements
  requirements: {
    normalText: {
      ratio: 4.5,
      fontSize: '16px',
      fontWeight: 'normal'
    },
    largeText: {
      ratio: 3,
      fontSize: '18px',
      fontWeight: 'bold'
    },
    uiComponents: {
      ratio: 3,
      fontSize: '14px',
      fontWeight: 'normal'
    }
  },

  // Color combinations
  combinations: {
    primary: {
      text: '#ffffff',
      background: '#1976d2',
      ratio: 7.0
    },
    secondary: {
      text: '#ffffff',
      background: '#9c27b0',
      ratio: 6.5
    },
    error: {
      text: '#ffffff',
      background: '#d32f2f',
      ratio: 7.0
    }
  }
};
```

### 1.2 Color Blindness Considerations

```typescript
const colorBlindness = {
  // Avoid color-only indicators
  indicators: {
    success: {
      color: '#2e7d32',
      icon: '✓',
      text: 'Success'
    },
    error: {
      color: '#d32f2f',
      icon: '✗',
      text: 'Error'
    },
    warning: {
      color: '#ed6c02',
      icon: '!',
      text: 'Warning'
    }
  },

  // Alternative patterns
  patterns: {
    striped: {
      pattern: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%)',
      size: '4px 4px'
    },
    dotted: {
      pattern: 'radial-gradient(#000 2px, transparent 2px)',
      size: '4px 4px'
    }
  }
};
```

## 2. Keyboard Navigation

### 2.1 Focus Management

```typescript
const focusManagement = {
  // Focus order
  order: [
    'header',
    'main-nav',
    'search',
    'main-content',
    'sidebar',
    'footer'
  ],

  // Focus styles
  styles: {
    default: {
      outline: '2px solid #1976d2',
      outlineOffset: '2px'
    },
    keyboard: {
      outline: '2px solid #1976d2',
      outlineOffset: '2px'
    },
    mouse: {
      outline: 'none'
    }
  },

  // Focus traps
  traps: {
    modal: {
      firstFocusable: 'close-button',
      lastFocusable: 'submit-button',
      returnFocus: true
    },
    dropdown: {
      firstFocusable: 'trigger',
      lastFocusable: 'last-item',
      returnFocus: true
    }
  }
};
```

### 2.2 Keyboard Shortcuts

```typescript
const keyboardShortcuts = {
  // Global shortcuts
  global: {
    search: {
      key: '/',
      description: 'Focus search input'
    },
    navigation: {
      key: 'g + h',
      description: 'Go to home'
    },
    help: {
      key: '?',
      description: 'Show keyboard shortcuts'
    }
  },

  // Component-specific shortcuts
  components: {
    table: {
      nextRow: '↓',
      previousRow: '↑',
      firstRow: 'Home',
      lastRow: 'End'
    },
    dropdown: {
      open: 'Enter',
      close: 'Escape',
      nextItem: '↓',
      previousItem: '↑'
    }
  }
};
```

## 3. Screen Reader Support

### 3.1 ARIA Attributes

```typescript
const ariaAttributes = {
  // Common roles
  roles: {
    button: {
      role: 'button',
      tabindex: '0'
    },
    link: {
      role: 'link',
      tabindex: '0'
    },
    list: {
      role: 'list',
      'aria-label': 'Navigation menu'
    }
  },

  // States and properties
  states: {
    expanded: {
      'aria-expanded': 'true|false'
    },
    selected: {
      'aria-selected': 'true|false'
    },
    disabled: {
      'aria-disabled': 'true'
    }
  },

  // Live regions
  liveRegions: {
    alert: {
      role: 'alert',
      'aria-live': 'assertive'
    },
    status: {
      role: 'status',
      'aria-live': 'polite'
    }
  }
};
```

### 3.2 Alternative Text

```typescript
const alternativeText = {
  // Image alt text guidelines
  images: {
    decorative: {
      alt: '',
      role: 'presentation'
    },
    informative: {
      alt: 'Description of image content',
      role: 'img'
    },
    functional: {
      alt: 'Description of function',
      role: 'button|link'
    }
  },

  // Icon guidelines
  icons: {
    standalone: {
      'aria-label': 'Icon purpose',
      role: 'img'
    },
    withText: {
      'aria-hidden': 'true'
    }
  }
};
```

## 4. Responsive Design

### 4.1 Text Scaling

```typescript
const textScaling = {
  // Base font size
  base: {
    fontSize: '16px',
    lineHeight: 1.5
  },

  // Responsive text sizes
  responsive: {
    h1: {
      xs: '24px',
      sm: '32px',
      md: '40px'
    },
    body: {
      xs: '14px',
      sm: '16px',
      md: '16px'
    }
  },

  // Zoom support
  zoom: {
    minScale: 1,
    maxScale: 2,
    step: 0.1
  }
};
```

### 4.2 Touch Targets

```typescript
const touchTargets = {
  // Minimum touch target size
  size: {
    minimum: '44px',
    recommended: '48px'
  },

  // Spacing between touch targets
  spacing: {
    minimum: '8px',
    recommended: '12px'
  },

  // Component-specific sizes
  components: {
    button: {
      minWidth: '44px',
      minHeight: '44px',
      padding: '12px 24px'
    },
    icon: {
      minWidth: '44px',
      minHeight: '44px',
      padding: '12px'
    }
  }
};
```

## 5. Testing Guidelines

### 5.1 Automated Testing

```typescript
const automatedTesting = {
  // Tools
  tools: {
    axe: {
      rules: [
        'color-contrast',
        'heading-order',
        'image-alt',
        'label',
        'link-name'
      ]
    },
    jest: {
      tests: [
        'keyboard-navigation',
        'focus-management',
        'aria-attributes'
      ]
    }
  },

  // Continuous Integration
  ci: {
    preCommit: [
      'npm run test:a11y',
      'npm run lint:a11y'
    ],
    prePush: [
      'npm run test:a11y:ci',
      'npm run build:a11y'
    ]
  }
};
```

### 5.2 Manual Testing

```typescript
const manualTesting = {
  // Screen reader testing
  screenReaders: {
    tools: [
      'NVDA',
      'VoiceOver',
      'JAWS'
    ],
    scenarios: [
      'navigation',
      'forms',
      'interactive-elements'
    ]
  },

  // Keyboard testing
  keyboard: {
    scenarios: [
      'tab-order',
      'focus-traps',
      'shortcuts'
    ],
    browsers: [
      'Chrome',
      'Firefox',
      'Safari',
      'Edge'
    ]
  }
};
``` 