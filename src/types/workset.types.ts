export interface Workset {
  id: string;
  name: string;
  description?: string;
  status: WorksetStatus;
  priority: WorksetPriority;
  taskIds: string[];
  assignedRobotIds: string[];
  startTime?: Date;
  endTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type WorksetStatus = 'pending' | 'in-progress' | 'completed' | 'failed' | 'cancelled';
export type WorksetPriority = 'low' | 'medium' | 'high' | 'critical';

export interface WorksetTask {
  id: string;
  sequence: number;
  type: string;
  parameters: Record<string, any>;
  status: 'pending' | 'in-progress' | 'completed';
  result?: any;
} 