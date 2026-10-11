'use client';

import React from 'react';
import { Users, Sparkles, Plus, ArrowRight } from 'lucide-react';
import { Product } from '@/types/catalog';
import { PRODUCTS } from '@/lib/mock-catalog';
import { useCart } from '@/lib/cart-context';
import BiryaniVisual from '@/components/catalog/BiryaniVisual';

interface CombosSectionProps {
  onOpenDetails: (product: Product) => void;
}

export default function CombosSection({ onOpenDetails }: CombosSectionProps) {
  const { addItem } = useCart();
  const comboProduct = PRODUCTS.find((p) => p.category === 'combos');

  if (!comboProduct) return null;

  const handleQuickAddCombo = () => {
    addItem(comboProduct, comboProduct.variants[0]);
  };

  return (
    <section id="feasts-combos" className="py-16 bg-[#FFFAF2] border-b border-[#282017]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B82F22]">
              <Sparkles className="w-3.5 h-3.5 text-[#E7AA45]" />
              <span>Royal Gatherings & Celebrations</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#282017]">
              The Daawat Feast Combos
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#282017]/70 max-w-md">
            Complete banquet packages packed in twin earthen handis with accompaniments, signature gravies, and heritage desserts.
          </p>
        </div>

        {/* Featured Large Combo Showcase */}
        <div className="rounded-3xl bg-white border border-[#282017]/15 overflow-hidden shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12">
          {/* Visual Left */}
          <div className="lg:col-span-5 relative aspect-[4/3] lg:aspect-auto bg-[#241A14]">
            <BiryaniVisual
              slug={comboProduct.slug}
              name={comboProduct.name}
              category={comboProduct.category}
              dietary={comboProduct.dietary}
              className="w-full h-full"
              size="lg"
            />
            <div className="absolute top-4 left-4 bg-[#B82F22] text-[#FFFAF2] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-md">
              Save ₹350 on Combo
            </div>
          </div>

          {/* Details Right */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#282017]/60">
                <Users className="w-4 h-4 text-[#B82F22]" />
                <span>Serves 4 - 6 Connoisseurs (2.6 kg Total Weight)</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#282017]">
                {comboProduct.name}
              </h3>

              <p className="text-xs sm:text-sm text-[#282017]/80 leading-relaxed">
                {comboProduct.description}
              </p>

              {/* Inclusions Box */}
              <div className="p-4 rounded-2xl bg-[#FFFAF2] border border-[#282017]/10 space-y-2 text-xs">
                <span className="font-bold text-[#282017] block">What&apos;s inside the royal hamper:</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#282017]/80 text-[11px]">
                  {comboProduct.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B82F22]" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Price & Add to Cart */}
            <div className="pt-4 border-t border-[#282017]/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-bold text-[#B82F22] tabular-nums">
                    ₹{comboProduct.variants[0].price}
                  </span>
                  <span className="text-xs text-[#282017]/50 line-through tabular-nums">
                    ₹1,949
                  </span>
                </div>
                <span className="text-[11px] text-[#282017]/60 block">
                  Includes 2 Sealed Clay Handis + Accompaniments
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onOpenDetails(comboProduct)}
                  className="px-4 py-2.5 rounded-xl border border-[#282017]/20 text-[#282017] hover:bg-[#282017]/5 text-xs font-semibold transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={handleQuickAddCombo}
                  className="px-6 py-2.5 rounded-xl bg-[#B82F22] hover:bg-[#9B2418] text-[#FFFAF2] text-xs font-bold transition-colors flex items-center gap-2 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Order Feast</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
