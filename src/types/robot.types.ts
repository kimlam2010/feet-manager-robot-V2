export interface RobotPosition {
  x: number;
  y: number;
  orientation: 'north' | 'south' | 'east' | 'west';
}

export interface RobotStatus {
  batteryLevel: number;
  isOnline: boolean;
  isCharging: boolean;
  lastSeen: string;
  currentTask?: string;
}

export interface RobotCapabilities {
  maxSpeed: number;
  maxPayload: number;
  sensors: string[];
  supportedTasks: string[];
}

export interface RobotConfiguration {
  name: string;
  model: string;
  serialNumber: string;
  firmwareVersion: string;
  capabilities: RobotCapabilities;
}

export interface Robot {
  id: string;
  name: string;
  status: RobotStatus;
  position: RobotPosition;
  configuration: RobotConfiguration;
  metadata: Record<string, string | number | boolean>;
}

export type RobotCommand = {
  type: 'move' | 'stop' | 'charge' | 'executeTask';
  parameters: Record<string, string | number | boolean>;
};
