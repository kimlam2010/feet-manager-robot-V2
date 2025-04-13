import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

interface RoleGuardProps {
  children: React.ReactNode;
  roles: string[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, roles }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user || !roles.includes(user.role)) {
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}; 