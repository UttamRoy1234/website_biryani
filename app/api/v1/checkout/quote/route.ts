import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS, POPULAR_COUPONS } from '@/lib/mock-catalog';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items = [], coupon_code = '' } = body;

    let itemSubtotal = 0;
    let packingSubtotal = 0;

    for (const entry of items) {
      const { variant_id, quantity = 1 } = entry;
      // find variant in products
      let foundVariant = null;
      for (const prod of PRODUCTS) {
        const v = prod.variants.find((v) => v.id === variant_id);
        if (v) {
          foundVariant = v;
          break;
        }
      }

      if (foundVariant) {
        itemSubtotal += foundVariant.price * quantity;
        packingSubtotal += foundVariant.packingFee * quantity;
      }
    }

    const freeDeliveryThreshold = 799;
    const deliveryFee = itemSubtotal === 0 ? 0 : itemSubtotal >= freeDeliveryThreshold ? 0 : 60;
    const taxAmount = Math.round((itemSubtotal + packingSubtotal) * 0.05);

    let discountAmount = 0;
    let appliedCoupon = null;

    if (coupon_code) {
      const codeClean = coupon_code.trim().toUpperCase();
      const foundCoupon = POPULAR_COUPONS.find((c) => c.code === codeClean);
      if (foundCoupon && itemSubtotal >= foundCoupon.minOrderValue) {
        if (foundCoupon.discountPercent) {
          const raw = (itemSubtotal * foundCoupon.discountPercent) / 100;
          discountAmount = foundCoupon.maxDiscount ? Math.min(raw, foundCoupon.maxDiscount) : raw;
        } else if (foundCoupon.flatDiscount) {
          discountAmount = foundCoupon.flatDiscount;
        }
        appliedCoupon = {
          code: foundCoupon.code,
          description: foundCoupon.description,
          discount: Math.round(discountAmount),
        };
      }
    }

    const finalTotal = Math.max(0, Math.round(itemSubtotal + packingSubtotal + deliveryFee + taxAmount - discountAmount));

    return NextResponse.json({
      item_subtotal: itemSubtotal,
      packing_subtotal: packingSubtotal,
      delivery_fee: deliveryFee,
      tax_amount: taxAmount,
      discount_amount: Math.round(discountAmount),
      final_total: finalTotal,
      free_delivery_threshold: freeDeliveryThreshold,
      applied_coupon: appliedCoupon,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
  }
}
