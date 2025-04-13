'use client';

import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/lib/permissions';
import { Alert } from '@/components/ui/feedback/Alert';

export function withPermission(
  WrappedComponent: React.ComponentType<any>,
  requiredPermission: Permission
) {
  return function PermissionWrapper(props: any) {
    const { can } = usePermissions();

    if (!can(requiredPermission)) {
      return (
        <Alert variant="error" title="Access Denied">
          You do not have permission to access this resource.
        </Alert>
      );
    }

    return <WrappedComponent {...props} />;
  };
} 