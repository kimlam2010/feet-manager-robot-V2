import { Task } from './task.types';
import { Robot } from './robot.types';

export interface WorksetStatus {
  isActive: boolean;
  progress: number;
  startTime?: string;
  endTime?: string;
  errors: WorksetError[];
}

export interface WorksetError {
  code: string;
  message: string;
  timestamp: string;
  severity: 'warning' | 'error' | 'critical';
}

export interface WorksetConfiguration {
  maxConcurrentTasks: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  allowedZones: string[];
  requiredCapabilities: string[];
}

export interface Workset {
  id: string;
  name: string;
  description: string;
  status: WorksetStatus;
  configuration: WorksetConfiguration;
  tasks: Task[];
  assignedRobots: Robot[];
  metadata: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}

export type WorksetPriority = 'low' | 'medium' | 'high' | 'critical';

export interface WorksetTask {
  id: string;
  sequence: number;
  type: string;
  parameters: Record<string, any>;
  status: 'pending' | 'in-progress' | 'completed';
  result?: any;
}
