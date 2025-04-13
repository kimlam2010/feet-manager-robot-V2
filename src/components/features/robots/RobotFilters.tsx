import { useState } from 'react';
import { RobotStatus, HealthStatus } from '@/types/robot';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/inputs/Input';
import { Select } from '@/components/ui/inputs/Select';

export function RobotFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [status, setStatus] = useState(searchParams.get('status') || 'ALL');
  const [health, setHealth] = useState(searchParams.get('health') || 'ALL');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'ALL') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`/robots?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex gap-4 flex-wrap">
      <Select
        label="Status"
        value={status}
        onChange={(value) => {
          setStatus(value);
          updateFilters({ status: value });
        }}
        options={[
          { value: 'ALL', label: 'All Status' },
          ...Object.values(RobotStatus).map((status) => ({
            value: status,
            label: status,
          })),
        ]}
      />

      <Select
        label="Health"
        value={health}
        onChange={(value) => {
          setHealth(value);
          updateFilters({ health: value });
        }}
        options={[
          { value: 'ALL', label: 'All Health' },
          ...Object.values(HealthStatus).map((health) => ({
            value: health,
            label: health,
          })),
        ]}
      />

      <Input
        label="Search"
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          updateFilters({ search: e.target.value });
        }}
        placeholder="Search robots..."
        className="w-64"
      />
    </div>
  );
} 