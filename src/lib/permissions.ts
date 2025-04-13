export type Permission =
  | 'manage_robots'
  | 'view_robots'
  | 'manage_worksets'
  | 'view_worksets'
  | 'manage_users'
  | 'view_users'
  | 'manage_settings';

export type Role = 'admin' | 'operator' | 'viewer';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'manage_robots',
    'view_robots',
    'manage_worksets',
    'view_worksets',
    'manage_users',
    'view_users',
    'manage_settings',
  ],
  operator: [
    'view_robots',
    'manage_worksets',
    'view_worksets',
    'view_users',
  ],
  viewer: [
    'view_robots',
    'view_worksets',
    'view_users',
  ],
};

export function hasPermission(userRole: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
}

export function checkPermissions(userRole: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
} 