# Development Environment Guide

## 1. Development Tools

### 1.1 Required Tools
```bash
# Node.js and npm
node --version  # >= 16.0.0
npm --version   # >= 7.0.0

# Git
git --version   # >= 2.30.0

# IDE/Editor
- VS Code
- WebStorm
- IntelliJ IDEA

# Browser
- Chrome >= 90
- Firefox >= 88
- Edge >= 90
```

### 1.2 VS Code Extensions
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "christian-kohler.path-intellisense",
    "christian-kohler.npm-intellisense",
    "ms-azuretools.vscode-docker",
    "eamodio.gitlens",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

## 2. Project Setup

### 2.1 Repository Structure
```
App_Frontend/
├── src/                # Source code
│   ├── components/     # React components
│   ├── hooks/         # Custom hooks
│   ├── services/      # API services
│   ├── store/         # Redux store
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript types
│   ├── styles/        # Global styles
│   └── tests/         # Test files
├── public/            # Static files
├── build/             # Build output
├── node_modules/      # Dependencies
├── .github/           # GitHub config
├── scripts/           # Build scripts
└── config/            # Configuration
```

### 2.2 Package.json
```json
{
  "name": "feet-robot-manager-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@emotion/react": "^11.10.0",
    "@emotion/styled": "^11.10.0",
    "@mui/material": "^5.10.0",
    "@reduxjs/toolkit": "^1.8.0",
    "axios": "^1.0.0",
    "mqtt": "^4.3.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.0",
    "react-router-dom": "^6.3.0",
    "socket.io-client": "^4.5.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.0",
    "@testing-library/react": "^13.0.0",
    "@testing-library/user-event": "^14.0.0",
    "@types/jest": "^28.0.0",
    "@types/node": "^16.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "eslint": "^8.0.0",
    "eslint-config-prettier": "^8.0.0",
    "eslint-plugin-react": "^7.0.0",
    "eslint-plugin-react-hooks": "^4.0.0",
    "jest": "^28.0.0",
    "prettier": "^2.0.0",
    "typescript": "^4.5.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "type-check": "tsc --noEmit"
  }
}
```

### 2.3 TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "@components/*": ["components/*"],
      "@hooks/*": ["hooks/*"],
      "@services/*": ["services/*"],
      "@store/*": ["store/*"],
      "@utils/*": ["utils/*"],
      "@types/*": ["types/*"],
      "@styles/*": ["styles/*"],
      "@tests/*": ["tests/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### 2.4 ESLint Configuration
```json
{
  "extends": [
    "react-app",
    "react-app/jest",
    "prettier"
  ],
  "plugins": [
    "react",
    "react-hooks",
    "prettier"
  ],
  "rules": {
    "prettier/prettier": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-unused-vars": "warn",
    "no-console": "warn"
  }
}
```

## 3. Development Workflow

### 3.1 Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes
git add .
git commit -m "feat: your feature description"

# Push changes
git push origin feature/your-feature

# Create pull request
# Wait for review and approval
# Merge to main
```

### 3.2 Code Review Process
1. Create pull request
2. Assign reviewers
3. Wait for review comments
4. Address review comments
5. Get approval
6. Merge to main

### 3.3 Testing Process
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run all tests
npm run test:all
```

## 4. Development Guidelines

### 4.1 Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier rules
- Use functional components with hooks
- Follow Atomic Design principles
- Use CSS-in-JS for styling
- Write unit tests for all components

### 4.2 Git Commit Messages
```
feat: add new feature
fix: fix bug
docs: update documentation
style: format code
refactor: refactor code
test: add tests
chore: update build process
```

### 4.3 Pull Request Template
```markdown
## Description
[Description of changes]

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Code refactor
- [ ] Test addition
- [ ] Build process update

## Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests

## Screenshots
[If applicable]

## Related Issues
[Link to related issues]
```

## 5. Related Documents
- [System Overview](./1-System_Overview.md)
- [Backend Integration](./2-Backend_Integration.md)
- [Development Guide](../Development/0-Development_Guide.md)
- [Coding Standards](../Development/1-Coding_Standards.md)
- [Component Development](../Development/2-Component_Development.md) 