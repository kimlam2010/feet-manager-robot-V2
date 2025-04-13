import { useQuery } from '@tanstack/react-query';
import { Robot } from '@/types/robot';

interface UseRobotsFilters {
  status?: string;
  health?: string;
  search?: string;
}

async function fetchRobots(filters: UseRobotsFilters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.health) params.append('health', filters.health);
  if (filters.search) params.append('search', filters.search);

  const response = await fetch(`/api/robots?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch robots');
  }
  return response.json();
}

export function useRobots(filters: UseRobotsFilters = {}) {
  return useQuery<Robot[]>({
    queryKey: ['robots', filters],
    queryFn: () => fetchRobots(filters),
  });
} 