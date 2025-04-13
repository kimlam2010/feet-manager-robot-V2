import { prisma } from './prisma';
import { getSession } from 'next-auth/react';
import { headers } from 'next/headers';

export type AuditAction =
  | 'login'
  | 'logout'
  | 'register'
  | 'reset_password'
  | 'create'
  | 'update'
  | 'delete'
  | 'view';

export type AuditResource =
  | 'user'
  | 'robot'
  | 'workset'
  | 'settings';

export type AuditStatus = 'success' | 'failure';

export interface AuditLogParams {
  userId: string;
  action: AuditAction;
  resource: AuditResource;
  details?: string;
  status: AuditStatus;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(params: AuditLogParams) {
  try {
    const log = await prisma.auditLog.create({
      data: {
        ...params,
      },
    });
    return log;
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw error to prevent disrupting the main flow
    return null;
  }
}

export async function getAuditLogs(options?: {
  userId?: string;
  action?: AuditAction;
  resource?: AuditResource;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) {
  try {
    const where: any = {};
    if (options?.userId) where.userId = options.userId;
    if (options?.action) where.action = options.action;
    if (options?.resource) where.resource = options.resource;
    if (options?.startDate || options?.endDate) {
      where.createdAt = {};
      if (options?.startDate) where.createdAt.gte = options.startDate;
      if (options?.endDate) where.createdAt.lte = options.endDate;
    }

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: options?.limit || 50,
        skip: options?.offset || 0,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return { total, logs };
  } catch (error) {
    console.error('Failed to get audit logs:', error);
    throw error;
  }
}

export function getClientInfo() {
  const headersList = headers();
  return {
    ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip'),
    userAgent: headersList.get('user-agent'),
  };
} 