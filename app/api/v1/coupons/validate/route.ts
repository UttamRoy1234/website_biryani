import { NextRequest, NextResponse } from 'next/server';
import { POPULAR_COUPONS } from '@/lib/mock-catalog';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code')?.trim().toUpperCase();
  const subtotal = parseFloat(searchParams.get('subtotal') || '0');

  if (!code) {
    return NextResponse.json({ error: 'Code is required.' }, { status: 400 });
  }

  const coupon = POPULAR_COUPONS.find((c) => c.code === code);
  if (!coupon) {
    return NextResponse.json({ is_valid: false, error: `Coupon "${code}" not found.` }, { status: 404 });
  }

  if (subtotal < coupon.minOrderValue) {
    return NextResponse.json({
      is_valid: false,
      error: `Requires a minimum order value of ₹${coupon.minOrderValue}.`,
    }, { status: 400 });
  }

  let discount = 0;
  if (coupon.discountPercent) {
    const raw = (subtotal * coupon.discountPercent) / 100;
    discount = coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
  } else if (coupon.flatDiscount) {
    discount = coupon.flatDiscount;
  }

  return NextResponse.json({
    is_valid: true,
    code: coupon.code,
    description: coupon.description,
    discount_amount: Math.round(discount),
  });
}
