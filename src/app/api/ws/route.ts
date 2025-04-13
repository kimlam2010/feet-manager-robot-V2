import { Server } from 'socket.io';
import { NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { RobotStatus, HealthStatus } from '@/types/robot';

const io = new Server({
  path: '/api/ws',
  addTrailingSlash: false,
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('subscribe', (robotId: string) => {
    console.log(`Subscribing to robot ${robotId}`);
    socket.join(`robot:${robotId}`);
  });

  socket.on('unsubscribe', (robotId: string) => {
    console.log(`Unsubscribing from robot ${robotId}`);
    socket.leave(`robot:${robotId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Giả lập cập nhật trạng thái robot mỗi 5 giây
setInterval(async () => {
  try {
    const robots = await prisma.robot.findMany();
    
    for (const robot of robots) {
      // Giả lập thay đổi pin (giảm 1%)
      const batteryLevel = Math.max(0, (robot.batteryLevel || 100) - 1);
      
      // Giả lập thay đổi trạng thái dựa vào pin
      let status = robot.status as RobotStatus;
      let healthStatus = robot.healthStatus as HealthStatus;
      
      if (batteryLevel < 20) {
        status = RobotStatus.ERROR;
        healthStatus = HealthStatus.CRITICAL;
      } else if (batteryLevel < 50) {
        healthStatus = HealthStatus.WARNING;
      }

      // Cập nhật trong database
      const updatedRobot = await prisma.robot.update({
        where: { id: robot.id },
        data: {
          batteryLevel,
          status,
          healthStatus,
          lastActive: new Date(),
        },
      });

      // Gửi cập nhật qua WebSocket
      io.to(`robot:${robot.id}`).emit('robot:status', {
        robotId: robot.id,
        batteryLevel,
        status,
        healthStatus,
      });
    }
  } catch (error) {
    console.error('Error updating robots:', error);
  }
}, 5000);

export function GET(req: Request, res: NextApiResponse) {
  // @ts-ignore - io.attach() expects a different type
  io.attach(res.socket?.server);
  return new Response('WebSocket server is running');
} 