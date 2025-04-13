'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface AlertProps {
  children: ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
}

const variants = {
  info: {
    container: 'bg-blue-50 text-blue-800',
    icon: InformationCircleIcon,
    iconColor: 'text-blue-400',
  },
  success: {
    container: 'bg-green-50 text-green-800',
    icon: CheckCircleIcon,
    iconColor: 'text-green-400',
  },
  warning: {
    container: 'bg-yellow-50 text-yellow-800',
    icon: ExclamationCircleIcon,
    iconColor: 'text-yellow-400',
  },
  error: {
    container: 'bg-red-50 text-red-800',
    icon: XCircleIcon,
    iconColor: 'text-red-400',
  },
};

export function Alert({
  children,
  variant = 'info',
  className,
}: AlertProps) {
  const { container, icon: Icon, iconColor } = variants[variant];

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg px-4 py-3',
        container,
        className
      )}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0', iconColor)} />
      <div>{children}</div>
    </div>
  );
} 