import { NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/audit';
import { getAuthSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    const resource = searchParams.get('resource');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;

    const logs = await getAuditLogs({
      userId: userId || undefined,
      action: action || undefined,
      resource: resource || undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit,
      offset,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('[AUDIT_LOGS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 