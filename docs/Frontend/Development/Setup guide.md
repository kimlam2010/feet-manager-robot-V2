# Frontend Setup Guide

## Prerequisites

- Node.js >= 18.x
- pnpm >= 8.x
- Git

## Installation

1. **Create Next.js Project**
```bash
pnpm create next-app@latest robot-fleet-manager --typescript --tailwind --eslint
cd robot-fleet-manager
```

2. **Install Dependencies**
```bash
# Core dependencies
pnpm add @tanstack/react-query zustand @hookform/resolvers zod react-hook-form
pnpm add @radix-ui/react-* @headlessui/react class-variance-authority clsx tailwind-merge

# Dev dependencies
pnpm add -D @types/node @types/react @types/react-dom
pnpm add -D prettier prettier-plugin-tailwindcss
pnpm add -D husky lint-staged
```

3. **Configure ESLint**
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

4. **Configure Prettier**
```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

5. **Configure Git Hooks**
```json
// package.json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "next lint",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## Project Structure

```
src/
├── app/                    # Next.js 13+ App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # UI components
│   ├── features/          # Feature components
│   └── shared/            # Shared components
├── lib/                   # Utilities and config
├── hooks/                 # Custom hooks
├── types/                 # TypeScript types
├── styles/                # Global styles
└── public/                # Static assets
```

## Development Workflow

1. **Create Feature Branch**
```bash
git checkout -b feature/feature-name
```

2. **Install Dependencies**
```bash
pnpm install
```

3. **Start Development Server**
```bash
pnpm dev
```

4. **Run Tests**
```bash
pnpm test
```

5. **Build for Production**
```bash
pnpm build
```

## Best Practices

### 1. Code Organization
- Follow project structure
- Use absolute imports
- Group related files
- Keep files small

### 2. TypeScript
- Enable strict mode
- Use proper types
- Avoid any
- Document types

### 3. Styling
- Use Tailwind CSS
- Follow design system
- Keep styles modular
- Use CSS variables

### 4. State Management
- Use Zustand for global state
- Use React Query for server state
- Keep state minimal
- Document state

### 5. Performance
- Use React.memo
- Implement code splitting
- Optimize images
- Monitor performance

### 6. Testing
- Write unit tests
- Test components
- Test hooks
- Test utilities

### 7. Documentation
- Document components
- Document hooks
- Document utilities
- Keep docs updated

## Common Issues

### 1. TypeScript Errors
- Check type definitions
- Use proper types
- Update types
- Document types

### 2. Styling Issues
- Check Tailwind config
- Use proper classes
- Follow design system
- Test responsiveness

### 3. Performance Issues
- Check bundle size
- Optimize images
- Use code splitting
- Monitor performance

### 4. Testing Issues
- Check test setup
- Use proper mocks
- Test edge cases
- Update snapshots

## Deployment

### 1. Production Build
```bash
pnpm build
```

### 2. Start Production Server
```bash
pnpm start
```

### 3. Deploy to Vercel
```bash
vercel
```

## Maintenance

### 1. Regular Tasks
- Update dependencies
- Run tests
- Check performance
- Update documentation

### 2. Security
- Check vulnerabilities
- Update security patches
- Review access control
- Monitor logs

### 3. Performance
- Monitor metrics
- Optimize code
- Update dependencies
- Check bundle size

### 4. Documentation
- Update docs
- Add examples
- Fix typos
- Add new features 