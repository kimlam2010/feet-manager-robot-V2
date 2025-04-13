import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { RobotStatus, HealthStatus } from '@/types/robot';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const robot = await prisma.robot.findUnique({
      where: { id: params.id },
    });

    if (!robot) {
      return new NextResponse('Robot not found', { status: 404 });
    }

    return NextResponse.json(robot);
  } catch (error) {
    console.error('[ROBOT_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    const { name, serialNumber, firmware, location } = data;

    // Validate required fields
    if (!name || !serialNumber || !firmware) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Check if robot exists
    const existingRobot = await prisma.robot.findUnique({
      where: { id: params.id },
    });

    if (!existingRobot) {
      return new NextResponse('Robot not found', { status: 404 });
    }

    // Update robot
    const updatedRobot = await prisma.robot.update({
      where: { id: params.id },
      data: {
        name,
        serialNumber,
        firmware,
        location,
        updatedAt: new Date(),
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        resource: 'ROBOT',
        details: `Robot ${updatedRobot.name} (${updatedRobot.serialNumber}) was updated`,
        status: 'SUCCESS',
        userId: session.user.id,
        robotId: updatedRobot.id,
      },
    });

    return NextResponse.json(updatedRobot);
  } catch (error) {
    console.error('[ROBOT_UPDATE_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const robot = await prisma.robot.findUnique({
      where: { id: params.id },
    });

    if (!robot) {
      return new NextResponse('Robot not found', { status: 404 });
    }

    // Create audit log before deletion
    await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        resource: 'ROBOT',
        details: `Deleted robot ${robot.name} (${robot.serialNumber})`,
        status: 'SUCCESS',
        userId: session.user.id as string,
        robotId: robot.id,
      },
    });

    // Delete the robot
    await prisma.robot.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ROBOT_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 