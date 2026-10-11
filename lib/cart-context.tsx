'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, PortionVariant, AccompanimentOption, CartItem, Coupon, PriceQuote } from '@/types/catalog';
import { POPULAR_COUPONS } from './mock-catalog';

interface CartContextType {
  items: CartItem[];
  addItem: (
    product: Product,
    variant: PortionVariant,
    accompaniments?: AccompanimentOption[],
    specialInstructions?: string
  ) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  coupon: Coupon | null;
  couponError: string | null;
  couponSuccess: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  quote: PriceQuote;
  totalItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'dum_and_co_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore cart on mount asynchronously
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItems(parsed);
          }
        }
      } catch {
        // Ignore storage errors
      } finally {
        setIsHydrated(true);
      }
    });

    return () => cancelAnimationFrame(handle);
  }, []);

  // Save cart on changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, [items, isHydrated]);

  const addItem = (
    product: Product,
    variant: PortionVariant,
    accompaniments: AccompanimentOption[] = [],
    specialInstructions?: string
  ) => {
    setItems((prev) => {
      // Create a unique composite key for the item with exact variant & selected accompaniment IDs
      const sortedAccIds = accompaniments.map((a) => a.id).sort().join('_');
      const compositeId = `${product.id}-${variant.id}-${sortedAccIds}`;

      const existingIndex = prev.findIndex((item) => item.cartItemId === compositeId);

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
        };
        return next;
      }

      const newItem: CartItem = {
        cartItemId: compositeId,
        productId: product.id,
        productName: product.name,
        category: product.category,
        dietary: product.dietary,
        variantId: variant.id,
        variantName: variant.name,
        variantServes: variant.serves,
        unitPrice: variant.price,
        packingFee: variant.packingFee,
        quantity: 1,
        selectedAccompaniments: accompaniments,
        specialInstructions,
      };

      return [...prev, newItem];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setCouponError(null);
    setCouponSuccess(null);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Apply Coupon with business logic
  const applyCoupon = (code: string): boolean => {
    setCouponError(null);
    setCouponSuccess(null);
    const cleanCode = code.trim().toUpperCase();

    const found = POPULAR_COUPONS.find((c) => c.code === cleanCode);
    if (!found) {
      setCouponError(`Coupon code "${cleanCode}" is invalid.`);
      return false;
    }

    // Check minimum order value against subtotal
    const currentSubtotal = items.reduce((acc, item) => {
      const accSum = item.selectedAccompaniments.reduce((s, a) => s + a.price, 0);
      return acc + (item.unitPrice + accSum) * item.quantity;
    }, 0);

    if (currentSubtotal < found.minOrderValue) {
      setCouponError(`Coupon "${cleanCode}" requires a minimum order value of ₹${found.minOrderValue}.`);
      return false;
    }

    setCoupon(found);
    setCouponSuccess(`Coupon "${cleanCode}" applied successfully!`);
    return true;
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError(null);
    setCouponSuccess(null);
  };

  // Calculate pricing quote
  const itemSubtotal = items.reduce((acc, item) => {
    const accSum = item.selectedAccompaniments.reduce((s, a) => s + a.price, 0);
    return acc + (item.unitPrice + accSum) * item.quantity;
  }, 0);

  const packingSubtotal = items.reduce((acc, item) => {
    return acc + item.packingFee * item.quantity;
  }, 0);

  const freeDeliveryThreshold = 799;
  const deliveryFee = itemSubtotal === 0 ? 0 : itemSubtotal >= freeDeliveryThreshold ? 0 : 60;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - itemSubtotal);

  // 5% GST on food and packing
  const taxAmount = Math.round((itemSubtotal + packingSubtotal) * 0.05);

  // Compute discount
  let discountAmount = 0;
  if (coupon && itemSubtotal >= coupon.minOrderValue) {
    if (coupon.discountPercent) {
      const rawDiscount = (itemSubtotal * coupon.discountPercent) / 100;
      discountAmount = Math.round(
        coupon.maxDiscount ? Math.min(rawDiscount, coupon.maxDiscount) : rawDiscount
      );
    } else if (coupon.flatDiscount) {
      discountAmount = coupon.flatDiscount;
    }
  }

  const finalTotal = Math.max(0, itemSubtotal + packingSubtotal + deliveryFee + taxAmount - discountAmount);

  const quote: PriceQuote = {
    itemSubtotal,
    packingSubtotal,
    deliveryFee,
    taxAmount,
    discountAmount,
    finalTotal,
    freeDeliveryThreshold,
    amountNeededForFreeDelivery,
    appliedCoupon: coupon,
  };

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        coupon,
        couponError,
        couponSuccess,
        applyCoupon,
        removeCoupon,
        quote,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
