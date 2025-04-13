import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connect = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  return socket;
};

export const disconnect = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  return socket;
}; 