export enum RobotStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  BUSY = 'BUSY',
  ERROR = 'ERROR',
  MAINTENANCE = 'MAINTENANCE',
}

export enum HealthStatus {
  GOOD = 'GOOD',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

export interface Robot {
  id: string;
  name: string;
  serialNumber: string;
  status: RobotStatus;
  batteryLevel: number;
  location: string | null;
  firmware: string;
  lastActive: string | null;
  configuration: any;
  healthStatus: HealthStatus;
  worksetId: string | null;
  createdAt: string;
  updatedAt: string;
} 