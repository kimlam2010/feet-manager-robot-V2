import { useSession } from 'next-auth/react';

export function usePermissions() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;

  const can = (permission: string) => {
    if (!userRole) return false;

    const rolePermissions: Record<string, string[]> = {
      admin: ['manage_settings', 'manage_users', 'manage_robots', 'manage_worksets'],
      operator: ['manage_robots', 'manage_worksets'],
      user: ['view_robots', 'view_worksets'],
    };

    return rolePermissions[userRole]?.includes(permission) || false;
  };

  return { can };
} 