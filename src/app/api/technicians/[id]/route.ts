import { NextRequest, NextResponse } from 'next/server';
import { getTechnicianById } from '@/lib/actions/technicians';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const result = await getTechnicianById(resolvedParams.id);
  return NextResponse.json(result, { status: result.success ? 200 : 404 });
}
