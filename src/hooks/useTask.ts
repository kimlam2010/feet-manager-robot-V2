import { useState, useCallback } from 'react';
import { api } from '@/utils/api';
import { Task } from '@/types';

export const useTask = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData: Partial<Task>) => {
    try {
      await api.post('/tasks', taskData);
      fetchTasks(); // Refresh list after creation
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  }, [fetchTasks]);

  const updateTask = useCallback(async (taskId: string, taskData: Partial<Task>) => {
    try {
      await api.put(`/tasks/${taskId}`, taskData);
      fetchTasks(); // Refresh list after update
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  }, [fetchTasks]);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks(); // Refresh list after deletion
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  }, [fetchTasks]);

  return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask };
}; 