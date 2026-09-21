import { NextRequest, NextResponse } from 'next/server';
import { createServiceRequest, getCustomerRequests, getTechnicianRequests } from '@/lib/actions/requests';
import { createServiceRequestSchema } from '@/lib/validations/request';
import { getSession } from '@/lib/auth/session';
import { proxyAction } from '@/lib/proxy';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get('status') || undefined;

  let result;
  if (session.role === 'TECHNICIAN') {
    result = await getTechnicianRequests(statusFilter);
  } else {
    result = await getCustomerRequests(statusFilter);
  }

  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await proxyAction(createServiceRequest, body, {
      schema: createServiceRequestSchema,
    });
    return NextResponse.json(result, { status: result.success ? 201 : 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
