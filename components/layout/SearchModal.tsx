'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Flame, Plus, Clock } from 'lucide-react';
import { Product } from '@/types/catalog';
import { PRODUCTS } from '@/lib/mock-catalog';
import { useCart } from '@/lib/cart-context';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDetails: (product: Product) => void;
}

export default function SearchModal({ isOpen, onClose, onOpenDetails }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const { addItem } = useCart();

  const results = useMemo(() => {
    if (!query.trim()) return PRODUCTS.slice(0, 4);
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.ingredients.some((i) => i.toLowerCase().includes(q))
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-xl bg-[#FFFAF2] rounded-2xl shadow-2xl overflow-hidden border border-[#282017]/15 flex flex-col z-10 max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 bg-white border-b border-[#282017]/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#B82F22] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mutton, chicken, saffron, or paneer..."
            className="w-full bg-transparent text-sm text-[#282017] placeholder-[#282017]/40 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-xs text-[#282017]/50 hover:text-[#282017]">
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#282017]/60 hover:text-[#282017] hover:bg-[#282017]/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#282017]/50">
            {query.trim() ? `Search Results (${results.length})` : 'Popular Recommendations'}
          </div>

          {results.length > 0 ? (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onClose();
                  onOpenDetails(product);
                }}
                className="p-3 rounded-xl bg-white border border-[#282017]/10 hover:border-[#E7AA45] flex items-center justify-between gap-3 cursor-pointer transition-all hover:shadow-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        product.dietary === 'veg' ? 'bg-emerald-600' : 'bg-[#B82F22]'
                      }`}
                    />
                    <h4 className="font-serif font-bold text-sm text-[#282017]">
                      {product.name}
                    </h4>
                  </div>
                  <span className="text-xs text-[#282017]/60 block line-clamp-1">
                    {product.subtitle}
                  </span>
                  <div className="flex items-center gap-3 text-[11px] text-[#282017]/50">
                    <span>{product.dumCookingHours}h Dum</span>
                    <span>·</span>
                    <span>Starts at ₹{product.variants[0].price}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem(product, product.variants[0]);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#282017] hover:bg-[#B82F22] text-[#FFFAF2] text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-[#282017]/60">
              No biryanis found matching &quot;{query}&quot;. Try searching for &ldquo;mutton&rdquo; or &ldquo;chicken&rdquo;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
