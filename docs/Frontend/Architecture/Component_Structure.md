# Component Structure

## Layout Architecture

### Main Layout Structure
```
src/
├── components/
│   └── layouts/
│       └── MainLayout/
│           ├── Header/
│           │   ├── UserMenu.tsx
│           │   ├── Notifications.tsx
│           │   └── SearchBar.tsx
│           ├── Sidebar/
│           │   ├── Navigation.tsx
│           │   └── WorksetSelector.tsx
│           ├── Footer/
│           │   └── StatusBar.tsx
│           └── MainContent/
│               └── Outlet.tsx (from react-router-dom)
```

### Layout Components
- **MainLayout**: Wrapper component for protected routes
  - Handles authentication state
  - Manages layout structure
  - Provides context for child components
  - Uses Outlet for dynamic content

- **Header**: Top navigation bar
  - User menu
  - Notifications
  - Search functionality
  - Breadcrumbs

- **Sidebar**: Left navigation
  - Main navigation menu
  - Workset selector
  - Collapsible state

- **Footer**: Bottom status bar
  - System status
  - Connection status
  - Version info

## Routing Architecture

### Route Structure
```
src/
├── routes/
│   ├── public.tsx
│   │   ├── /login
│   │   ├── /register
│   │   └── /forgot-password
│   └── protected.tsx
│       ├── /dashboard
│       ├── /robots
│       ├── /worksets
│       └── /settings
```

### Route Protection
- **Public Routes**: Accessible without authentication
  - Login
  - Register
  - Password reset
  - Email verification

- **Protected Routes**: Require authentication
  - Wrapped in ProtectedRoute component
  - Rendered within MainLayout
  - Access controlled by RBAC

### Authentication Flow
1. User accesses application
2. ProtectedRoute checks authentication
   - If not authenticated -> redirect to login
   - If authenticated -> render MainLayout
3. MainLayout renders with Outlet
4. Protected route content renders in Outlet

## Component Organization

### Page Components
- Located in `src/pages/`
- Use MainLayout through routing
- Focus on business logic
- Minimal styling

### Feature Components
- Located in `src/components/features/`
- Reusable across pages
- Business logic specific
- State management

### UI Components
- Located in `src/components/ui/`
- Pure presentational
- No business logic
- Highly reusable

### Shared Components
- Located in `src/components/shared/`
- Used across features
- Common functionality
- Utility components

## State Management

### Global State
- Authentication state
- User preferences
- System settings
- Workset context

### Local State
- Form state
- UI state
- Component-specific data

### Context Usage
- AuthContext: Authentication state
- ThemeContext: UI theming
- WorksetContext: Current workset
- NotificationContext: System messages

## Best Practices

### Layout Components
- Use Outlet for dynamic content
- Keep layout structure consistent
- Handle loading states
- Implement error boundaries

### Routing
- Use nested routes for protected content
- Implement route guards
- Handle 404 and error routes
- Use lazy loading for routes

### State Management
- Use context for global state
- Keep local state minimal
- Implement proper error handling
- Use loading states appropriately

### Performance
- Implement code splitting
- Use lazy loading
- Optimize re-renders
- Cache API responses 