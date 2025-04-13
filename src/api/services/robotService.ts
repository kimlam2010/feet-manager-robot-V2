import { apiClient } from '../client';
import { Robot } from '../../store/slices/robotSlice';

interface RobotCreateData {
  name: string;
  model: string;
  serialNumber: string;
}

interface RobotUpdateData {
  name?: string;
  model?: string;
  serialNumber?: string;
  status?: {
    battery?: number;
    isOnline?: boolean;
    currentTask?: string | null;
  };
}

export const robotService = {
  async getAllRobots(): Promise<Robot[]> {
    return apiClient.get<Robot[]>('/robots');
  },

  async getRobotById(id: string): Promise<Robot> {
    return apiClient.get<Robot>(`/robots/${id}`);
  },

  async createRobot(data: RobotCreateData): Promise<Robot> {
    return apiClient.post<Robot>('/robots', data);
  },

  async updateRobot(id: string, data: RobotUpdateData): Promise<Robot> {
    return apiClient.patch<Robot>(`/robots/${id}`, data);
  },

  async deleteRobot(id: string): Promise<void> {
    return apiClient.delete(`/robots/${id}`);
  },

  async assignToWorkset(robotId: string, worksetId: string): Promise<Robot> {
    return apiClient.post<Robot>(`/robots/${robotId}/assign`, { worksetId });
  },

  async unassignFromWorkset(robotId: string): Promise<Robot> {
    return apiClient.post<Robot>(`/robots/${robotId}/unassign`);
  },

  async updateStatus(robotId: string, status: RobotUpdateData['status']): Promise<Robot> {
    return apiClient.patch<Robot>(`/robots/${robotId}/status`, { status });
  },

  async startTask(robotId: string, taskId: string): Promise<Robot> {
    return apiClient.post<Robot>(`/robots/${robotId}/tasks/${taskId}/start`);
  },

  async stopTask(robotId: string, taskId: string): Promise<Robot> {
    return apiClient.post<Robot>(`/robots/${robotId}/tasks/${taskId}/stop`);
  },

  async pauseTask(robotId: string, taskId: string): Promise<Robot> {
    return apiClient.post<Robot>(`/robots/${robotId}/tasks/${taskId}/pause`);
  },

  async resumeTask(robotId: string, taskId: string): Promise<Robot> {
    return apiClient.post<Robot>(`/robots/${robotId}/tasks/${taskId}/resume`);
  },
};