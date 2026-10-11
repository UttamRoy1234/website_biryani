import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS } from '@/lib/mock-catalog';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return NextResponse.json(
      { error: `Product with slug "${slug}" not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}
