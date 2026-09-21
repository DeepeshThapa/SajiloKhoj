import { NextRequest, NextResponse } from 'next/server';
import { getTechnicians, updateTechnicianProfile } from '@/lib/actions/technicians';
import { updateTechnicianProfileSchema } from '@/lib/validations/technician';
import { proxyAction } from '@/lib/proxy';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get('query') || undefined;
  const category = searchParams.get('category') || undefined;
  const location = searchParams.get('location') || undefined;
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const minRating = searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined;
  const minExperience = searchParams.get('minExp') ? Number(searchParams.get('minExp')) : undefined;
  const availability = searchParams.get('availability') || undefined;
  const sortBy = (searchParams.get('sortBy') as any) || 'recommended';
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

  const result = await getTechnicians({
    query,
    category,
    location,
    minPrice,
    maxPrice,
    minRating,
    minExperience,
    availability,
    sortBy,
    page,
    limit: 9,
  });

  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await proxyAction(updateTechnicianProfile, body, {
      schema: updateTechnicianProfileSchema,
    });
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
