import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { RobotStatus } from '@/types/robot';
import { Session } from 'next-auth';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const session = await getAuthSession() as Session;
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (!['START', 'END'].includes(action)) {
      return new NextResponse('Invalid action', { status: 400 });
    }

    const robot = await prisma.robot.findUnique({
      where: { id: params.id },
    });

    if (!robot) {
      return new NextResponse('Robot not found', { status: 404 });
    }

    // Check if the action is valid for the current status
    if (
      (action === 'START' && robot.status === RobotStatus.MAINTENANCE) ||
      (action === 'END' && robot.status !== RobotStatus.MAINTENANCE)
    ) {
      return new NextResponse('Invalid status transition', { status: 400 });
    }

    // Update robot status
    const updatedRobot = await prisma.robot.update({
      where: { id: params.id },
      data: {
        status: action === 'START' ? RobotStatus.MAINTENANCE : RobotStatus.OFFLINE,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: action === 'START' ? 'START_MAINTENANCE' : 'END_MAINTENANCE',
        resource: 'ROBOT',
        details: `${action === 'START' ? 'Started' : 'Ended'} maintenance for robot ${robot.name} (${robot.serialNumber})`,
        status: 'SUCCESS',
        userId: session.user.id,
        robotId: robot.id,
      },
    });

    return NextResponse.json(updatedRobot);
  } catch (error) {
    console.error('[ROBOT_MAINTENANCE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 