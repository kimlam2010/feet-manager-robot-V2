'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { Button } from '@/components/ui/buttons/Button';
import { LoadingSpinner } from '@/components/ui/loading/LoadingSpinner';
import { Alert } from '@/components/ui/feedback/Alert';
import { useState } from 'react';
import { Robot } from '@/types/robot';

async function fetchRobot(id: string) {
  const response = await fetch(`/api/robots/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch robot');
  }
  return response.json();
}

async function updateRobot(data: { id: string; robot: Partial<Robot> }) {
  const response = await fetch(`/api/robots/${data.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data.robot),
  });
  if (!response.ok) {
    throw new Error('Failed to update robot');
  }
  return response.json();
}

export default function EditRobotPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const { data: robot, isLoading, error } = useQuery({
    queryKey: ['robot', id],
    queryFn: () => fetchRobot(id),
  });

  const [formData, setFormData] = useState<Partial<Robot>>({
    name: '',
    serialNumber: '',
    firmware: '',
    location: '',
  });

  const updateMutation = useMutation({
    mutationFn: updateRobot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['robot', id] });
      queryClient.invalidateQueries({ queryKey: ['robots'] });
      router.push(`/robots/${id}`);
    },
  });

  // Initialize form data when robot data is loaded
  useState(() => {
    if (robot) {
      setFormData({
        name: robot.name,
        serialNumber: robot.serialNumber,
        firmware: robot.firmware,
        location: robot.location,
      });
    }
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Alert variant="error">Failed to load robot details</Alert>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ id, robot: formData });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Edit Robot"
        description="Update robot information"
        action={
          <Button
            variant="outline"
            onClick={() => router.push(`/robots/${id}`)}
          >
            Cancel
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Robot Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">
                Serial Number
              </label>
              <input
                type="text"
                id="serialNumber"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="firmware" className="block text-sm font-medium text-gray-700">
                Firmware Version
              </label>
              <input
                type="text"
                id="firmware"
                name="firmware"
                value={formData.firmware}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/robots/${id}`)}
          >
            Cancel
          </Button>
        </div>

        {updateMutation.isError && (
          <Alert variant="error">
            Failed to update robot. Please try again.
          </Alert>
        )}
      </form>
    </div>
  );
} 