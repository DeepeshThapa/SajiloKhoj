import { NextRequest, NextResponse } from 'next/server';
import { createReview, replyToReview } from '@/lib/actions/reviews';
import { createReviewSchema, replyReviewSchema } from '@/lib/validations/review';
import { proxyAction } from '@/lib/proxy';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await proxyAction(createReview, body, {
      schema: createReviewSchema,
    });
    return NextResponse.json(result, { status: result.success ? 201 : 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await proxyAction(
      (data) => replyToReview(data.reviewId, data.reply),
      body,
      { schema: replyReviewSchema }
    );
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
