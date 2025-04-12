import { RobotCapability } from './robot.types';

export interface Task {
  id: string;
  name: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  requiredCapabilities: RobotCapability[];
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
export type TaskStatus = 'pending' | 'assigned' | 'in-progress' | 'completed' | 'failed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'; 