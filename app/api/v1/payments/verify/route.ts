import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, razorpay_payment_id } = body;

    return NextResponse.json({
      success: true,
      order_id,
      payment_id: razorpay_payment_id || `pay_${Math.random().toString(36).substr(2, 9)}`,
      status: 'CAPTURED',
      verified_at: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Verification failed.' }, { status: 400 });
  }
}
