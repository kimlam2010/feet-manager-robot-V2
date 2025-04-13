import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { ROLE_PERMISSIONS } from '@/lib/permissions';

const ROUTE_PERMISSIONS = {
  '/robots': ['view_robots'],
  '/robots/manage': ['manage_robots'],
  '/worksets': ['view_worksets'],
  '/worksets/manage': ['manage_worksets'],
  '/settings': ['manage_settings'],
};

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const requiredPermissions = ROUTE_PERMISSIONS[path as keyof typeof ROUTE_PERMISSIONS];

    if (requiredPermissions) {
      const userRole = token?.role as keyof typeof ROLE_PERMISSIONS || 'viewer';
      const userPermissions = ROLE_PERMISSIONS[userRole] || [];
      const hasAccess = requiredPermissions.every(permission => 
        userPermissions.includes(permission)
      );

      if (!hasAccess) {
        return NextResponse.redirect(new URL('/auth/error?error=AccessDenied', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/robots/:path*',
    '/worksets/:path*',
    '/settings/:path*',
  ],
}; 