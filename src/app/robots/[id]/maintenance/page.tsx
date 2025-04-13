'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { Button } from '@/components/ui/buttons/Button';
import { Alert } from '@/components/ui/feedback/Alert';
import { LoadingSpinner } from '@/components/ui/loading/LoadingSpinner';
import { Robot } from '@/types/robot';

export default function RobotMaintenancePage() {
  const params = useParams();
  const router = useRouter();
  const [robot, setRobot] = useState<Robot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRobot = async () => {
      try {
        const response = await fetch(`/api/robots/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch robot details');
        }
        const data = await response.json();
        setRobot(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRobot();
  }, [params.id]);

  const handleStartMaintenance = async () => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/robots/${params.id}/maintenance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'START' }),
      });

      if (!response.ok) {
        throw new Error('Failed to start maintenance');
      }

      const updatedRobot = await response.json();
      setRobot(updatedRobot);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEndMaintenance = async () => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/robots/${params.id}/maintenance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'END' }),
      });

      if (!response.ok) {
        throw new Error('Failed to end maintenance');
      }

      const updatedRobot = await response.json();
      setRobot(updatedRobot);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !robot) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="error">{error || 'Robot not found'}</Alert>
        <Button
          variant="outline"
          onClick={() => router.push('/robots')}
          className="mt-4"
        >
          Back to Robots
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={`Maintenance - ${robot.name}`}
        description={`Serial Number: ${robot.serialNumber}`}
      />

      {error && (
        <Alert variant="error" className="mt-4">
          {error}
        </Alert>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Maintenance Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Current Status</span>
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  robot.status === 'MAINTENANCE'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {robot.status}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Health Status</span>
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  robot.healthStatus === 'GOOD'
                    ? 'bg-green-100 text-green-800'
                    : robot.healthStatus === 'WARNING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {robot.healthStatus}
              </span>
            </div>
          </div>

          <div className="mt-6">
            {robot.status === 'MAINTENANCE' ? (
              <Button
                variant="primary"
                onClick={handleEndMaintenance}
                disabled={isUpdating}
                className="w-full"
              >
                {isUpdating ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'End Maintenance'
                )}
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleStartMaintenance}
                disabled={isUpdating}
                className="w-full"
              >
                {isUpdating ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Start Maintenance'
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Maintenance History */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Maintenance History</h2>
          <div className="space-y-4">
            <p className="text-gray-500">
              Maintenance history will be implemented soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 