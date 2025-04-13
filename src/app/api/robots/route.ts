import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { RobotStatus, HealthStatus } from '@/types/robot';

export async function GET(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const health = searchParams.get('health');
    const search = searchParams.get('search');

    // Build filter conditions
    const where: any = {};
    if (status) where.status = status as RobotStatus;
    if (health) where.healthStatus = health as HealthStatus;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { serialNumber: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    const robots = await prisma.robot.findMany({
      where,
      orderBy: { lastActive: 'desc' },
    });

    return NextResponse.json(robots);
  } catch (error) {
    console.error('[ROBOTS_GET]', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { name, serialNumber, firmware, location } = body;

    // Validate required fields
    if (!name || !serialNumber || !firmware) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Check if serial number is unique
    const existingRobot = await prisma.robot.findUnique({
      where: { serialNumber },
    });

    if (existingRobot) {
      return new NextResponse('Serial number already exists', { status: 400 });
    }

    // Create new robot
    const robot = await prisma.robot.create({
      data: {
        name,
        serialNumber,
        firmware,
        location,
        status: RobotStatus.OFFLINE,
        healthStatus: HealthStatus.GOOD,
        batteryLevel: 100,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        resource: 'ROBOT',
        details: `Created robot ${robot.name} (${robot.serialNumber})`,
        status: 'SUCCESS',
        userId: session.user.id as string,
        robotId: robot.id,
      },
    });

    return NextResponse.json(robot);
  } catch (error) {
    console.error('[ROBOTS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 