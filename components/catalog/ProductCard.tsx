'use client';

import React, { useState } from 'react';
import { Flame, Plus, Minus, Check, Info } from 'lucide-react';
import { Product, PortionVariant } from '@/types/catalog';
import { useCart } from '@/lib/cart-context';
import BiryaniVisual from './BiryaniVisual';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export default function ProductCard({ product, onOpenDetails }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<PortionVariant>(product.variants[0]);

  // Find if this specific product and variant is currently in the cart
  const cartItem = items.find(
    (item) => item.productId === product.id && item.variantId === selectedVariant.id
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, selectedVariant, product.recommendedPairings.slice(0, 2));
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.cartItemId, 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.cartItemId, -1);
    }
  };

  return (
    <article
      onClick={() => onOpenDetails(product)}
      className="group rounded-2xl bg-white border border-[#282017]/10 hover:border-[#E7AA45]/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      {/* 1. Imagery: 65% - 70% focal area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#241A14]">
        <BiryaniVisual
          slug={product.slug}
          name={product.name}
          category={product.category}
          dietary={product.dietary}
          className="w-full h-full"
        />

        {/* Dietary Marker (Top Left) */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {product.dietary === 'veg' && (
            <span
              className="w-4 h-4 rounded-sm border border-emerald-600 bg-white flex items-center justify-center p-0.5"
              title="Vegetarian"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
            </span>
          )}
          {product.dietary === 'non-veg' && (
            <span
              className="w-4 h-4 rounded-sm border border-[#B82F22] bg-white flex items-center justify-center p-0.5"
              title="Non-Vegetarian"
            >
              <span className="w-2 h-2 rounded-full bg-[#B82F22]" />
            </span>
          )}
          {product.dietary === 'egg' && (
            <span
              className="w-4 h-4 rounded-sm border border-amber-600 bg-white flex items-center justify-center p-0.5"
              title="Contains Egg"
            >
              <span className="w-2 h-2 rounded-full bg-amber-600" />
            </span>
          )}

          {/* Dum Time indicator */}
          <span className="text-[10px] font-medium bg-[#282017]/80 text-[#FFFAF2] px-2 py-0.5 rounded backdrop-blur-sm">
            {product.dumCookingHours}h Dum
          </span>
        </div>

        {/* Bestseller / Chef's Special subtle text indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {product.isBestseller && (
            <span className="text-[11px] font-semibold text-[#E7AA45] bg-[#282017]/90 px-2 py-0.5 rounded backdrop-blur-sm">
              Bestseller
            </span>
          )}
          {product.isChefSpecial && !product.isBestseller && (
            <span className="text-[11px] font-semibold text-rose-300 bg-[#282017]/90 px-2 py-0.5 rounded backdrop-blur-sm">
              Royal Heritage
            </span>
          )}
        </div>
      </div>

      {/* 2. Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          {/* Metadata Row: Category & Spice */}
          <div className="flex items-center justify-between text-xs text-[#282017]/60">
            <span className="uppercase tracking-wider font-semibold text-[#B82F22]">
              {product.category}
            </span>
            <div className="flex items-center gap-1" title={`Spice level: ${product.spiceLevel} of 5`}>
              <Flame className="w-3.5 h-3.5 text-[#B82F22]" />
              <span className="font-medium text-[#282017]/80 text-[11px]">
                {product.spiceLevel <= 2 ? 'Mild Spice' : product.spiceLevel === 3 ? 'Medium Spice' : 'Fiery Spiced'}
              </span>
            </div>
          </div>

          <h3 className="font-serif text-lg font-bold text-[#282017] group-hover:text-[#B82F22] transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-[#282017]/70 line-clamp-2 leading-relaxed">
            {product.subtitle}
          </p>
        </div>

        {/* 3. Portion Size Selector */}
        <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between text-[11px] text-[#282017]/70">
            <span>Select Portion:</span>
            <span className="font-medium text-[#282017]">{selectedVariant.serves}</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 bg-[#FFFAF2] p-1 rounded-lg border border-[#282017]/10">
            {product.variants.slice(0, 2).map((variant) => {
              const isSelected = selectedVariant.id === variant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariant(variant)}
                  className={`text-[11px] font-medium py-1.5 px-2 rounded-md transition-all whitespace-nowrap truncate ${
                    isSelected
                      ? 'bg-white text-[#282017] shadow-sm font-semibold border border-[#282017]/10'
                      : 'text-[#282017]/60 hover:text-[#282017]'
                  }`}
                >
                  {variant.name.replace(' Handi', '')} ({variant.weightGrams}g)
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Price & Action Bar */}
        <div className="pt-2 border-t border-[#282017]/10 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-xl font-bold text-[#282017] tabular-nums">
                ₹{selectedVariant.price}
              </span>
            </div>
            <span className="text-[10px] text-[#282017]/60 block -mt-0.5">
              + ₹{selectedVariant.packingFee} Handi Matka
            </span>
          </div>

          {/* Add / Stepper Button */}
          {cartItem ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center bg-[#282017] text-[#FFFAF2] rounded-lg p-1 shadow-sm"
            >
              <button
                type="button"
                onClick={handleDecrement}
                className="w-7 h-7 flex items-center justify-center hover:bg-[#B82F22] rounded transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center text-xs font-bold tabular-nums">
                {cartItem.quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                className="w-7 h-7 flex items-center justify-center hover:bg-[#B82F22] rounded transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className="px-4 py-2 rounded-lg bg-[#B82F22] hover:bg-[#9B2418] text-[#FFFAF2] text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Handi</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
