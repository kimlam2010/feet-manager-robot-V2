import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { Robot } from '@/types/robot';

export function useRobotMonitoring(robotId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001', {
      path: '/api/ws',
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      if (robotId) {
        socket.emit('subscribe', robotId);
      }
    });

    socket.on('robot:update', (updatedRobot: Robot) => {
      // Update single robot data
      if (robotId && updatedRobot.id === robotId) {
        queryClient.setQueryData(['robot', robotId], updatedRobot);
      }
      
      // Update robot in list
      queryClient.setQueryData(['robots'], (oldData: Robot[] | undefined) => {
        if (!oldData) return [updatedRobot];
        return oldData.map(robot => 
          robot.id === updatedRobot.id ? updatedRobot : robot
        );
      });
    });

    socket.on('robot:status', ({ robotId, status, batteryLevel, healthStatus }) => {
      queryClient.setQueryData(['robots'], (oldData: Robot[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(robot => 
          robot.id === robotId 
            ? { ...robot, status, batteryLevel, healthStatus }
            : robot
        );
      });
    });

    socket.on('robot:error', ({ robotId, error }) => {
      console.error(`Robot ${robotId} error:`, error);
      // You can handle errors here, e.g., show a notification
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    return () => {
      if (robotId) {
        socket.emit('unsubscribe', robotId);
      }
      socket.disconnect();
    };
  }, [robotId, queryClient]);
} 