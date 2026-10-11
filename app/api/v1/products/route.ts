import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS } from '@/lib/mock-catalog';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const dietary = searchParams.get('dietary');
  const spice = searchParams.get('spice');
  const search = searchParams.get('search')?.toLowerCase();

  let filtered = [...PRODUCTS];

  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (dietary && dietary !== 'all') {
    filtered = filtered.filter((p) => p.dietary === dietary);
  }

  if (spice) {
    const level = parseInt(spice);
    if (!isNaN(level)) {
      filtered = filtered.filter((p) => p.spiceLevel === level);
    }
  }

  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.subtitle.toLowerCase().includes(search) ||
        p.ingredients.some((i) => i.toLowerCase().includes(search))
    );
  }

  return NextResponse.json({
    count: filtered.length,
    results: filtered,
  });
}
