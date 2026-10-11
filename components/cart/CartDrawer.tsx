'use client';

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { POPULAR_COUPONS } from '@/lib/mock-catalog';

interface CartDrawerProps {
  onProceedToCheckout?: () => void;
}

export default function CartDrawer({ onProceedToCheckout }: CartDrawerProps) {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    isCartOpen,
    closeCart,
    coupon,
    couponError,
    couponSuccess,
    applyCoupon,
    removeCoupon,
    quote,
    totalItemsCount,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput);
    if (success) {
      setCouponInput('');
    }
  };

  const handleSelectCouponShortcut = (code: string) => {
    applyCoupon(code);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-0" onClick={closeCart} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside
          aria-label="Handi shopping cart"
          className="w-screen max-w-md bg-[#FFFAF2] shadow-2xl flex flex-col border-l border-[#282017]/15"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-[#282017]/10 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#B82F22] text-[#FFFAF2] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-[#282017]">Your Handi Cart</h2>
                <span className="text-xs text-[#282017]/60">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in order
                </span>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 text-[#282017]/60 hover:text-[#282017] rounded-full hover:bg-[#282017]/5 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Incentive Progress Bar */}
          <div className="px-5 py-3 bg-[#E7AA45]/15 border-b border-[#E7AA45]/30 text-xs">
            {quote.amountNeededForFreeDelivery > 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-medium text-[#282017]">
                  <span>Add ₹{quote.amountNeededForFreeDelivery} more for Free Delivery</span>
                  <span>₹{quote.itemSubtotal} / ₹{quote.freeDeliveryThreshold}</span>
                </div>
                <div className="w-full h-1.5 bg-[#282017]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#B82F22] rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (quote.itemSubtotal / quote.freeDeliveryThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 font-semibold text-[#B82F22]">
                <Sparkles className="w-4 h-4 text-[#E7AA45]" />
                <span>You have unlocked Free Royal Express Delivery!</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          {items.length > 0 ? (
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.map((item) => {
                const accompanimentsSum = item.selectedAccompaniments.reduce((s, a) => s + a.price, 0);
                const linePrice = (item.unitPrice + accompanimentsSum) * item.quantity;

                return (
                  <div
                    key={item.cartItemId}
                    className="p-4 rounded-2xl bg-white border border-[#282017]/10 space-y-3 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              item.dietary === 'veg' ? 'bg-emerald-600' : 'bg-[#B82F22]'
                            }`}
                          />
                          <h4 className="font-serif font-bold text-sm text-[#282017] leading-snug">
                            {item.productName}
                          </h4>
                        </div>
                        <span className="text-[11px] text-[#282017]/60 block mt-0.5">
                          {item.variantName} ({item.variantServes})
                        </span>
                      </div>

                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        className="text-[#282017]/40 hover:text-[#B82F22] p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Selected accompaniments */}
                    {item.selectedAccompaniments.length > 0 && (
                      <div className="text-[11px] text-[#282017]/70 bg-[#FFFAF2] p-2 rounded-lg border border-[#282017]/5 space-y-1">
                        <span className="font-medium block text-[#282017]/60">Included Pairings:</span>
                        {item.selectedAccompaniments.map((acc) => (
                          <div key={acc.id} className="flex justify-between">
                            <span>+ {acc.name}</span>
                            <span className="tabular-nums">₹{acc.price}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {item.specialInstructions && (
                      <div className="text-[10px] text-[#282017]/60 italic">
                        Note: &quot;{item.specialInstructions}&quot;
                      </div>
                    )}

                    {/* Price and Stepper Row */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#282017]/5">
                      <div>
                        <span className="font-serif text-base font-bold text-[#282017] tabular-nums">
                          ₹{linePrice}
                        </span>
                        <span className="text-[10px] text-[#282017]/50 block">
                          + ₹{item.packingFee * item.quantity} Clay Pot Fee
                        </span>
                      </div>

                      <div className="flex items-center bg-[#FFFAF2] border border-[#282017]/15 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-[#282017]/10 rounded text-[#282017]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold tabular-nums text-[#282017]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-[#282017]/10 rounded text-[#282017]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Coupon Section */}
              <div className="p-4 rounded-2xl bg-white border border-[#282017]/10 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#282017]">
                  <Tag className="w-3.5 h-3.5 text-[#B82F22]" />
                  <span>Promo Coupons & Royal Offers</span>
                </div>

                {coupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <strong className="block">{coupon.code}</strong>
                        <span className="text-[11px] text-emerald-700">{coupon.description}</span>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-semibold underline hover:text-emerald-950"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Enter promo code"
                      className="flex-1 px-3 py-2 rounded-lg bg-[#FFFAF2] border border-[#282017]/15 text-xs text-[#282017] uppercase placeholder-[#282017]/40 focus:outline-none focus:ring-1 focus:ring-[#B82F22]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-[#282017] hover:bg-[#B82F22] text-[#FFFAF2] text-xs font-semibold transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponError && (
                  <div className="text-[11px] text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{couponError}</span>
                  </div>
                )}

                {/* Quick Coupon Shortcuts */}
                {!coupon && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {POPULAR_COUPONS.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleSelectCouponShortcut(c.code)}
                        className="text-[10px] font-semibold px-2 py-1 rounded bg-[#FFFAF2] border border-[#282017]/10 hover:border-[#B82F22] text-[#282017] transition-colors"
                      >
                        {c.code}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bill Details */}
              <div className="p-4 rounded-2xl bg-white border border-[#282017]/10 space-y-2 text-xs">
                <span className="font-bold text-[#282017] block">Order Breakdown</span>
                <div className="flex justify-between text-[#282017]/70">
                  <span>Biryani & Food Subtotal</span>
                  <span className="tabular-nums font-medium text-[#282017]">₹{quote.itemSubtotal}</span>
                </div>
                <div className="flex justify-between text-[#282017]/70">
                  <span>Clay Handi Matka Packaging</span>
                  <span className="tabular-nums font-medium text-[#282017]">₹{quote.packingSubtotal}</span>
                </div>
                <div className="flex justify-between text-[#282017]/70">
                  <span>Delivery Fee</span>
                  <span className="tabular-nums font-medium text-[#282017]">
                    {quote.deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-semibold">FREE</span>
                    ) : (
                      `₹${quote.deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-[#282017]/70">
                  <span>Restaurant GST (5%)</span>
                  <span className="tabular-nums font-medium text-[#282017]">₹{quote.taxAmount}</span>
                </div>

                {quote.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-[#282017]/5">
                    <span>Coupon Discount</span>
                    <span className="tabular-nums">-₹{quote.discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold text-[#282017] pt-2 border-t border-[#282017]/10">
                  <span>To Pay</span>
                  <span className="font-serif text-lg text-[#B82F22] tabular-nums">
                    ₹{quote.finalTotal}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#E7AA45]/20 text-[#B82F22] flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#282017]">Your Handi Cart is Empty</h3>
              <p className="text-xs text-[#282017]/60 max-w-xs">
                Slow-simmered handi biryanis are waiting. Pick a succulent mutton, chicken, or vegetarian creation to get started.
              </p>
              <button
                onClick={closeCart}
                className="px-5 py-2.5 rounded-full bg-[#B82F22] text-[#FFFAF2] text-xs font-semibold hover:bg-[#9B2418] transition-colors"
              >
                Browse Menu Handis
              </button>
            </div>
          )}

          {/* Bottom Action Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#282017]/10 bg-white space-y-3">
              <div className="flex items-center justify-between text-xs text-[#282017]/70">
                <span>Total Amount:</span>
                <span className="font-serif text-xl font-bold text-[#282017] tabular-nums">
                  ₹{quote.finalTotal}
                </span>
              </div>

              <button
                onClick={() => {
                  closeCart();
                  if (onProceedToCheckout) {
                    onProceedToCheckout();
                  }
                }}
                className="w-full py-3.5 rounded-xl bg-[#B82F22] hover:bg-[#9B2418] text-[#FFFAF2] font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
