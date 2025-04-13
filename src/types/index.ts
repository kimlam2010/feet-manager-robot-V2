export interface Robot {
  id: string;
  name: string;
  status: 'idle' | 'working' | 'error' | 'offline';
  battery: number;
  location: {
    x: number;
    y: number;
  };
  lastSeen: Date;
}

export interface Workset {
  id: string;
  name: string;
  robots: string[];
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  createdAt: Date;
  updatedAt: Date;
} 