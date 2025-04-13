import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-current border-t-transparent text-primary',
          sizeClasses[size],
          className
        )}
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
} 