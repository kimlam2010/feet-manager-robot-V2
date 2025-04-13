'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'spinner' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, variant = 'spinner', size = 'md', ...props }, ref) => {
    if (variant === 'spinner') {
      return (
        <div
          ref={ref}
          className={cn(
            'animate-spin rounded-full border-2 border-gray-200 border-t-gray-600',
            {
              'h-4 w-4': size === 'sm',
              'h-6 w-6': size === 'md',
              'h-8 w-8': size === 'lg',
            },
            className
          )}
          {...props}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse rounded-md bg-gray-200',
          {
            'h-4': size === 'sm',
            'h-6': size === 'md',
            'h-8': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Loading.displayName = 'Loading';

export { Loading }; 