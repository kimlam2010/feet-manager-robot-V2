import { useState, useCallback } from 'react';
import { api } from '@/utils/api';
import { Robot } from '@/types';

export const useRobot = () => {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRobots = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/robots');
      setRobots(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch robots');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRobotStatus = useCallback(async (robotId: string, status: string) => {
    try {
      await api.put(`/robots/${robotId}/status`, { status });
      fetchRobots(); // Refresh list after update
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update robot status');
    }
  }, [fetchRobots]);

  return { robots, loading, error, fetchRobots, updateRobotStatus };
}; 