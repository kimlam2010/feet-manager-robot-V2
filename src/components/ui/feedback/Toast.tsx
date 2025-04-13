'use client';

import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  variant?: 'default' | 'success' | 'warning' | 'error';
  title?: string;
}

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  ToastProps
>(({ className, variant = 'default', title, children, ...props }, ref) => {
  const Icon = {
    default: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle,
  }[variant];

  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(
        'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
        {
          'border-gray-200 bg-white text-gray-900': variant === 'default',
          'border-green-200 bg-white text-green-900': variant === 'success',
          'border-yellow-200 bg-white text-yellow-900': variant === 'warning',
          'border-red-200 bg-white text-red-900': variant === 'error',
        },
        className
      )}
      {...props}
    >
      <div className="flex items-start">
        <Icon
          className={cn('h-5 w-5', {
            'text-gray-500': variant === 'default',
            'text-green-500': variant === 'success',
            'text-yellow-500': variant === 'warning',
            'text-red-500': variant === 'error',
          })}
        />
        <div className="ml-3 flex-1">
          {title && (
            <ToastPrimitive.Title
              className={cn('text-sm font-medium', {
                'text-gray-900': variant === 'default',
                'text-green-900': variant === 'success',
                'text-yellow-900': variant === 'warning',
                'text-red-900': variant === 'error',
              })}
            >
              {title}
            </ToastPrimitive.Title>
          )}
          <ToastPrimitive.Description
            className={cn('mt-1 text-sm', {
              'text-gray-500': variant === 'default',
              'text-green-700': variant === 'success',
              'text-yellow-700': variant === 'warning',
              'text-red-700': variant === 'error',
            })}
          >
            {children}
          </ToastPrimitive.Description>
        </div>
      </div>
      <ToastPrimitive.Close className="absolute right-2 top-2 rounded-md p-1 text-gray-400 opacity-0 transition-opacity hover:text-gray-500 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 group-hover:opacity-100">
        <XCircle className="h-4 w-4" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
});
Toast.displayName = ToastPrimitive.Root.displayName;

const ToastProvider = ToastPrimitive.Provider;
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

export { Toast, ToastProvider, ToastViewport }; 