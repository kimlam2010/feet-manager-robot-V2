import { apiClient } from '../client';
import { Workset } from '../../store/slices/worksetSlice';

interface WorksetCreateData {
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed';
}

interface WorksetUpdateData {
  name?: string;
  description?: string;
  status?: 'active' | 'paused' | 'completed';
}

export const worksetService = {
  async getAllWorksets(): Promise<Workset[]> {
    return apiClient.get<Workset[]>('/worksets');
  },

  async getWorksetById(id: string): Promise<Workset> {
    return apiClient.get<Workset>(`/worksets/${id}`);
  },

  async createWorkset(data: WorksetCreateData): Promise<Workset> {
    return apiClient.post<Workset>('/worksets', data);
  },

  async updateWorkset(id: string, data: WorksetUpdateData): Promise<Workset> {
    return apiClient.patch<Workset>(`/worksets/${id}`, data);
  },

  async deleteWorkset(id: string): Promise<void> {
    return apiClient.delete(`/worksets/${id}`);
  },

  async addRobot(worksetId: string, robotId: string): Promise<Workset> {
    return apiClient.post<Workset>(`/worksets/${worksetId}/robots`, { robotId });
  },

  async removeRobot(worksetId: string, robotId: string): Promise<Workset> {
    return apiClient.delete<Workset>(`/worksets/${worksetId}/robots/${robotId}`);
  },

  async startWorkset(id: string): Promise<Workset> {
    return apiClient.post<Workset>(`/worksets/${id}/start`);
  },

  async stopWorkset(id: string): Promise<Workset> {
    return apiClient.post<Workset>(`/worksets/${id}/stop`);
  },

  async pauseWorkset(id: string): Promise<Workset> {
    return apiClient.post<Workset>(`/worksets/${id}/pause`);
  },

  async resumeWorkset(id: string): Promise<Workset> {
    return apiClient.post<Workset>(`/worksets/${id}/resume`);
  },

  async getWorksetStats(id: string): Promise<{
    totalRobots: number;
    activeRobots: number;
    completedTasks: number;
    failedTasks: number;
  }> {
    return apiClient.get(`/worksets/${id}/stats`);
  },
}; 