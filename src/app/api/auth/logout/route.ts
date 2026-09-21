import { NextResponse } from 'next/server';
import { logoutUser } from '@/lib/actions/auth';

export async function POST() {
  const result = await logoutUser();
  return NextResponse.json(result, { status: 200 });
}
