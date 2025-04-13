import React from 'react';
import { RouteObject, useRoutes, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import Layout from '../components/Layout';

// Pages
import Dashboard from '../pages/Dashboard';
import RobotManagement from '../pages/RobotManagement';
import Settings from '../pages/Settings';

// Route Guards
import { AuthGuard } from './guards/AuthGuard';
import { RoleGuard } from './guards/RoleGuard';

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  title?: string;
  requireAuth?: boolean;
  roles?: string[];
  children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      {
        path: '',
        element: (
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        ),
        title: 'Dashboard',
      },
      {
        path: 'robots',
        element: (
          <AuthGuard>
            <RoleGuard roles={['admin', 'operator']}>
              <RobotManagement />
            </RoleGuard>
          </AuthGuard>
        ),
        title: 'Robot Management',
      },
      {
        path: 'settings',
        element: (
          <AuthGuard>
            <RoleGuard roles={['admin']}>
              <Settings />
            </RoleGuard>
          </AuthGuard>
        ),
        title: 'Settings',
      },
      {
        path: '*',
        element: <div>404 - Page Not Found</div>,
        title: 'Not Found',
      },
    ],
  },
];

export const RouterConfig: React.FC = () => {
  const element = useRoutes(routes);
  return <AnimatePresence mode="wait">{element}</AnimatePresence>;
}; 