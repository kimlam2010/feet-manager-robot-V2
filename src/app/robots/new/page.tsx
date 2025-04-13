'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { Input } from '@/components/ui/inputs/Input';
import { Button } from '@/components/ui/buttons/Button';
import { Alert } from '@/components/ui/feedback/Alert';
import { LoadingSpinner } from '@/components/ui/loading/LoadingSpinner';

export default function NewRobotPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      serialNumber: formData.get('serialNumber'),
      firmware: formData.get('firmware'),
      location: formData.get('location'),
    };

    try {
      const response = await fetch('/api/robots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create robot');
      }

      router.push('/robots');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Add New Robot"
        description="Register a new robot in the system"
      />

      {error && (
        <Alert variant="error" className="mt-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
        <Input
          label="Robot Name"
          name="name"
          required
          placeholder="Enter robot name"
        />

        <Input
          label="Serial Number"
          name="serialNumber"
          required
          placeholder="Enter serial number"
        />

        <Input
          label="Firmware Version"
          name="firmware"
          required
          placeholder="Enter firmware version"
        />

        <Input
          label="Location"
          name="location"
          placeholder="Enter initial location (optional)"
        />

        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Create Robot'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
} 