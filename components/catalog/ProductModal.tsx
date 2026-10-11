'use client';

import React, { useState } from 'react';
import { X, Flame, Plus, Check, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { Product, PortionVariant, AccompanimentOption } from '@/types/catalog';
import { useCart } from '@/lib/cart-context';
import BiryaniVisual from './BiryaniVisual';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<PortionVariant | null>(
    product ? product.variants[0] : null
  );
  const [selectedAccompaniments, setSelectedAccompaniments] = useState<AccompanimentOption[]>(
    product ? product.recommendedPairings.slice(0, 2) : []
  );
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (!product) return null;

  const currentVariant = selectedVariant || product.variants[0];

  const toggleAccompaniment = (item: AccompanimentOption) => {
    setSelectedAccompaniments((prev) => {
      const exists = prev.some((a) => a.id === item.id);
      if (exists) {
        return prev.filter((a) => a.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const accompanimentsCost = selectedAccompaniments.reduce((sum, a) => sum + a.price, 0);
  const totalItemPrice = currentVariant.price + accompanimentsCost;

  const handleAdd = () => {
    addItem(product, currentVariant, selectedAccompaniments, specialInstructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#FFFAF2] rounded-3xl shadow-2xl overflow-hidden border border-[#282017]/15 my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#282017]/80 text-white hover:bg-[#B82F22] flex items-center justify-center transition-colors shadow-md"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Visual */}
        <div className="relative aspect-[16/9] w-full bg-[#241A14] shrink-0">
          <BiryaniVisual
            slug={product.slug}
            name={product.name}
            category={product.category}
            dietary={product.dietary}
            className="w-full h-full"
            size="lg"
          />

          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <span className="text-xs font-semibold bg-[#282017]/90 text-[#FFFAF2] px-2.5 py-1 rounded backdrop-blur-sm flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#E7AA45]" />
              {product.dumCookingHours} Hours Dum Cooking
            </span>
            <span className="text-xs font-semibold bg-[#282017]/90 text-[#E7AA45] px-2.5 py-1 rounded backdrop-blur-sm">
              {product.clayHandiType}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Header Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B82F22]">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>
                {product.dietary === 'veg' ? '100% Vegetarian' : product.dietary === 'non-veg' ? 'Authentic Non-Veg' : 'Egg Special'}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#282017]">
              {product.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#282017]/70 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Portion Sizing Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#282017] block">
              1. Choose Handi Portion Size
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {product.variants.map((v) => {
                const isSelected = currentVariant.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#B82F22] bg-[#B82F22]/5 shadow-sm'
                        : 'border-[#282017]/15 bg-white hover:border-[#282017]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-[#282017]">{v.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#B82F22]" />}
                    </div>
                    <span className="text-[11px] text-[#282017]/60 block mt-0.5">{v.serves}</span>
                    <span className="text-[11px] text-[#282017]/60 block">Weight: {v.weightGrams}g</span>
                    <div className="mt-2 font-serif font-bold text-sm text-[#282017] tabular-nums">
                      ₹{v.price}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recommended Accompaniments */}
          {product.recommendedPairings.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#282017] block">
                2. Artisanal Pairings & Sides
              </label>
              <div className="space-y-2">
                {product.recommendedPairings.map((acc) => {
                  const isChecked = selectedAccompaniments.some((a) => a.id === acc.id);
                  return (
                    <div
                      key={acc.id}
                      onClick={() => toggleAccompaniment(acc)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? 'border-[#E7AA45] bg-[#E7AA45]/10'
                          : 'border-[#282017]/10 bg-white hover:bg-[#FFFAF2]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isChecked
                              ? 'bg-[#E7AA45] border-[#E7AA45] text-white'
                              : 'border-[#282017]/30 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 text-[#282017]" />}
                        </div>
                        <span className="font-medium text-[#282017]">{acc.name}</span>
                      </div>
                      <span className="font-semibold text-[#282017] tabular-nums">+₹{acc.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Preparation Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#282017] block">
              3. Chef Cooking Notes (Optional)
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Please add extra fried onions (birista) or separate raita"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#282017]/15 text-xs text-[#282017] focus:outline-none focus:ring-2 focus:ring-[#B82F22]/20"
            />
          </div>

          {/* Ingredient Transparency & Allergens */}
          <div className="p-4 rounded-xl bg-[#282017]/5 space-y-2 text-xs">
            <div className="font-semibold text-[#282017] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#B82F22]" />
              Purity & Ingredient Transparency
            </div>
            <p className="text-[#282017]/70 text-[11px] leading-relaxed">
              <strong>Key Spices & Cuts:</strong> {product.ingredients.join(', ')}.
            </p>
            {product.allergens.length > 0 && (
              <p className="text-[#282017]/70 text-[11px] flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 inline shrink-0" />
                <span>Allergens: {product.allergens.join(', ')}</span>
              </p>
            )}
          </div>
        </div>

        {/* Modal Bottom Sticky CTA */}
        <div className="p-4 sm:p-5 border-t border-[#282017]/10 bg-white flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[11px] text-[#282017]/60 block">Total for Selected Portion</span>
            <div className="font-serif text-2xl font-bold text-[#282017] tabular-nums">
              ₹{totalItemPrice}
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="px-6 py-3 rounded-xl bg-[#B82F22] hover:bg-[#9B2418] text-[#FFFAF2] font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-md whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Handi Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
