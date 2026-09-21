import { NextRequest, NextResponse } from 'next/server';
import { registerCustomer } from '@/lib/actions/auth';
import { customerRegisterSchema } from '@/lib/validations/auth';
import { proxyAction } from '@/lib/proxy';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await proxyAction(registerCustomer, body, { schema: customerRegisterSchema });

    if (!result.success) {
      return NextResponse.json(result, { status: result.status || 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
