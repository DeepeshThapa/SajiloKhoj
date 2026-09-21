import { NextRequest, NextResponse } from 'next/server';
import { updateRequestStatus } from '@/lib/actions/requests';
import { updateRequestStatusSchema } from '@/lib/validations/request';
import { proxyAction } from '@/lib/proxy';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await req.json();
    const payload = { ...body, requestId: resolvedParams.id };

    const result = await proxyAction(
      async (data) => updateRequestStatus(data.requestId, data.status, data.cancelReason),
      payload,
      { schema: updateRequestStatusSchema }
    );

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
