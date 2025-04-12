export interface Robot {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  status: RobotStatus;
  capabilities: RobotCapability[];
  currentLocation?: RobotLocation;
  currentTaskId?: string;
  currentWorksetId?: string;
  batteryLevel: number; // percentage
  batteryStatus: BatteryStatus;
  lastMaintenance?: Date;
  nextMaintenanceDue?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RobotLocation {
  x: number;
  y: number;
  z: number;
  orientation: number; // in degrees
  zone?: string;
  timestamp: Date;
}

export type RobotStatus = 'available' | 'busy' | 'charging' | 'maintenance' | 'error' | 'offline';
export type BatteryStatus = 'charging' | 'discharging' | 'full' | 'low' | 'critical';
export type RobotCapability = 
  | 'move'
  | 'lift'
  | 'grab'
  | 'rotate'
  | 'scan'
  | 'communicate'
  | 'navigate'
  | 'avoid_obstacles'
  | 'handle_fragile'
  | 'handle_heavy'
  | 'precise_positioning';

export interface RobotCommand {
  type: 'move' | 'stop' | 'charge' | 'execute';
  parameters?: Record<string, any>;
  timestamp: Date;
} 