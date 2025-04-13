'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Robot, RobotStatus, HealthStatus } from '@/types/robot';
import { Alert } from '@/components/ui/feedback/Alert';
import { RobotGrid } from '@/components/features/robots/RobotGrid';
import { RobotFilters } from '@/components/features/robots/RobotFilters';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { Button } from '@/components/ui/buttons/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '@/components/ui/loading/LoadingSpinner';

export default function RobotsPage() {
  const router = useRouter();
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<RobotStatus | 'ALL'>('ALL');
  const [healthFilter, setHealthFilter] = useState<HealthStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRobots();
  }, [statusFilter, healthFilter, searchTerm]);

  const fetchRobots = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (healthFilter !== 'ALL') params.append('health', healthFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/robots?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch robots');
      
      const data = await response.json();
      setRobots(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 70) return 'bg-green-500';
    if (level > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusColor = (status: RobotStatus) => {
    const colors: Record<RobotStatus, string> = {
      [RobotStatus.ONLINE]: 'bg-green-100 text-green-800',
      [RobotStatus.OFFLINE]: 'bg-gray-100 text-gray-800',
      [RobotStatus.BUSY]: 'bg-yellow-100 text-yellow-800',
      [RobotStatus.ERROR]: 'bg-red-100 text-red-800',
      [RobotStatus.MAINTENANCE]: 'bg-blue-100 text-blue-800',
    };
    return colors[status];
  };

  const getHealthColor = (health: HealthStatus) => {
    const colors: Record<HealthStatus, string> = {
      [HealthStatus.GOOD]: 'bg-green-100 text-green-800',
      [HealthStatus.WARNING]: 'bg-yellow-100 text-yellow-800',
      [HealthStatus.CRITICAL]: 'bg-red-100 text-red-800',
    };
    return colors[health];
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  if (error) {
    return <Alert variant="error" title="Error">{error}</Alert>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Robot Fleet"
        description="Manage and monitor your robot fleet"
        action={
          <Button href="/robots/new" variant="primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Robot
          </Button>
        }
      />
      
      <div className="mt-8">
        <RobotFilters />
        
        <Suspense fallback={<LoadingSpinner />}>
          <RobotGrid />
        </Suspense>
      </div>
    </div>
  );
} 