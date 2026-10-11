import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderNumber = `DUM-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderRecord = {
      id: `ord_${Math.random().toString(36).substr(2, 9)}`,
      order_number: orderNumber,
      status: 'CONFIRMED',
      customer_name: body.customer_name || 'Guest Connoisseur',
      customer_phone: body.customer_phone || '',
      delivery_address_line: body.address_line || '',
      delivery_locality: body.locality || '',
      delivery_postal_code: body.postal_code || '',
      subtotal: body.subtotal || '0.00',
      total_amount: body.total_amount || '0.00',
      coupon_code_applied: body.coupon_code || '',
      created_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
    };

    return NextResponse.json(orderRecord, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create order.' }, { status: 400 });
  }
}
