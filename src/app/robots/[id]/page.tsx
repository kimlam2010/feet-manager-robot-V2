'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { Button } from '@/components/ui/buttons/Button';
import { LoadingSpinner } from '@/components/ui/feedback/LoadingSpinner';
import { Alert } from '@/components/ui/feedback/Alert';
import { 
  WrenchScrewdriverIcon, 
  TrashIcon, 
  PencilIcon,
  Battery50Icon,
  SignalIcon,
  MapPinIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { RobotStatus, HealthStatus, Robot } from '@/types/robot';
import { useRobotStatus } from '@/hooks/useRobotStatus';

async function fetchRobot(id: string) {
  const response = await fetch(`/api/robots/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch robot');
  }
  return response.json();
}

async function deleteRobot(id: string) {
  const response = await fetch(`/api/robots/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete robot');
  }
  return response.json();
}

async function updateRobot(id: string, data: Partial<Robot>) {
  const response = await fetch(`/api/robots/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update robot');
  }
  return response.json();
}

export default function RobotDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [robot, setRobot] = useState<Robot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { isConnected, batteryLevel, status, healthStatus } = useRobotStatus(params.id as string);

  useEffect(() => {
    async function fetchRobot() {
      try {
        const response = await fetch(`/api/robots/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch robot details');
        }
        const data = await response.json();
        setRobot(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchRobot();
  }, [params.id]);

  const deleteMutation = useMutation({
    mutationFn: deleteRobot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['robots'] });
      router.push('/robots');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Robot>) => updateRobot(params.id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['robot', params.id] });
    },
  });

  const handleUpdate = async (data: Partial<Robot>) => {
    try {
      await updateMutation.mutateAsync(data);
    } catch (error) {
      console.error('Failed to update robot:', error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  if (!robot) {
    return <Alert variant="warning">Robot not found</Alert>;
  }

  const getStatusColor = (status: RobotStatus) => {
    const colors: Record<RobotStatus, string> = {
      ONLINE: 'bg-green-500',
      OFFLINE: 'bg-gray-500',
      BUSY: 'bg-yellow-500',
      ERROR: 'bg-red-500',
      MAINTENANCE: 'bg-blue-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getHealthColor = (health: HealthStatus) => {
    const colors: Record<HealthStatus, string> = {
      GOOD: 'text-green-500',
      WARNING: 'text-yellow-500',
      CRITICAL: 'text-red-500',
    };
    return colors[health] || 'text-gray-500';
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title={robot.name}
        description="Robot details and management"
        action={
          <div className="flex gap-2">
            <Button
              onClick={() => handleUpdate({
                name: robot.name,
                serialNumber: robot.serialNumber,
                firmware: robot.firmware,
                location: robot.location,
              })}
              variant="outline"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <LoadingSpinner />
              ) : (
                <PencilIcon className="w-4 h-4 mr-2" />
              )}
              Update
            </Button>
            <Button
              onClick={() => router.push(`/robots/${params.id}/maintenance`)}
              variant="outline"
            >
              <WrenchScrewdriverIcon className="w-4 h-4 mr-2" />
              Maintenance
            </Button>
            <Button
              onClick={() => {
                if (confirm('Are you sure you want to delete this robot?')) {
                  deleteMutation.mutate(params.id as string);
                }
              }}
              variant="danger"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <LoadingSpinner />
              ) : (
                <TrashIcon className="w-4 h-4 mr-2" />
              )}
              Delete
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Status Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-500">Connection Status</p>
              <p className={`font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Current Status</p>
              <p className="font-medium">{status}</p>
            </div>
            <div>
              <p className="text-gray-500">Health Status</p>
              <p className="font-medium">{healthStatus}</p>
            </div>
            <div>
              <p className="text-gray-500">Battery Level</p>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      batteryLevel > 20 ? 'bg-green-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${batteryLevel}%` }}
                  ></div>
                </div>
                <span className="ml-2 font-medium">{batteryLevel}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Details</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-500">Location</p>
              <p className="font-medium">{robot.location || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-gray-500">Firmware Version</p>
              <p className="font-medium">{robot.firmware}</p>
            </div>
            <div>
              <p className="text-gray-500">Last Active</p>
              <p className="font-medium">
                {robot.lastActive
                  ? new Date(robot.lastActive).toLocaleString()
                  : 'Never'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 