import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Robot, RobotStatus, HealthStatus } from '@/types/robot';

interface RobotStatusUpdate {
  robotId: string;
  batteryLevel: number;
  status: RobotStatus;
  healthStatus: HealthStatus;
}

let socket: Socket | null = null;

export function useRobotStatus(robotId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number>(0);
  const [status, setStatus] = useState<RobotStatus>(RobotStatus.OFFLINE);
  const [healthStatus, setHealthStatus] = useState<HealthStatus>(HealthStatus.GOOD);

  useEffect(() => {
    if (!socket) {
      socket = io({
        path: '/api/ws',
        addTrailingSlash: false,
      });
    }

    function onConnect() {
      setIsConnected(true);
      socket?.emit('subscribe', robotId);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onRobotStatus(update: RobotStatusUpdate) {
      if (update.robotId === robotId) {
        setBatteryLevel(update.batteryLevel);
        setStatus(update.status);
        setHealthStatus(update.healthStatus);
      }
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('robot:status', onRobotStatus);

    return () => {
      socket?.emit('unsubscribe', robotId);
      socket?.off('connect', onConnect);
      socket?.off('disconnect', onDisconnect);
      socket?.off('robot:status', onRobotStatus);
    };
  }, [robotId]);

  return {
    isConnected,
    batteryLevel,
    status,
    healthStatus,
  };
} 