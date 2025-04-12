import { RobotCapabilities } from './robot.types';

export interface Task {
  id: string;
  name: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  requiredCapabilities: RobotCapabilities[];
  assignedRobotId?: string;
  worksetId?: string;
  startLocation: TaskLocation;
  endLocation: TaskLocation;
  payload?: TaskPayload;
  estimatedDuration: number; // in seconds
  actualDuration?: number; // in seconds
  startTime?: Date;
  endTime?: Date;
  createdAt: Date;
  updatedAt: Date;
  requirements: TaskRequirements;
  progress: TaskProgress;
  metadata: Record<string, string | number | boolean>;
}

export interface TaskLocation {
  x: number;
  y: number;
  z: number;
  orientation?: number; // in degrees
  zone?: string;
}

export interface TaskPayload {
  type: string;
  weight?: number; // in kg
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  metadata?: Record<string, any>;
}

export type TaskType = 'transport' | 'pickup' | 'place' | 'charge' | 'maintenance' | 'custom';
export type TaskStatus = 'pending' | 'assigned' | 'in-progress' | 'completed' | 'failed';

export interface TaskPriority {
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number;
}

export interface TaskRequirements {
  minBatteryLevel: number;
  capabilities: RobotCapabilities[];
  payload?: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
  };
}

export interface TaskProgress {
  status: TaskStatus;
  completedSteps: number;
  totalSteps: number;
  startTime?: string;
  endTime?: string;
  errors: TaskError[];
}

export interface TaskError {
  code: string;
  message: string;
  timestamp: string;
  severity: 'warning' | 'error' | 'critical';
}
