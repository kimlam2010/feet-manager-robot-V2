import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatBatteryLevel(level: number): string {
  return `${Math.round(level)}%`;
}

export function getRobotStatusColor(status: string): string {
  switch (status) {
    case 'idle':
      return 'bg-green-500';
    case 'working':
      return 'bg-blue-500';
    case 'error':
      return 'bg-red-500';
    case 'offline':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
} 