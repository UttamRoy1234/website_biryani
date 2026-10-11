export type DietaryPreference = 'veg' | 'non-veg' | 'egg';

export type CategoryId = 'all' | 'chicken' | 'mutton' | 'veg' | 'egg' | 'combos' | 'accompaniments';

export interface PortionVariant {
  id: string;
  name: string;
  serves: string;
  weightGrams: number;
  price: number;
  packingFee: number;
  isAvailable: boolean;
}

export interface AccompanimentOption {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  category: Exclude<CategoryId, 'all'>;
  dietary: DietaryPreference;
  spiceLevel: 1 | 2 | 3 | 4 | 5;
  dumCookingHours: number;
  isBestseller?: boolean;
  isChefSpecial?: boolean;
  isSoldOut?: boolean;
  clayHandiType: string;
  ingredients: string[];
  allergens: string[];
  variants: PortionVariant[];
  recommendedPairings: AccompanimentOption[];
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  productName: string;
  category: string;
  dietary: DietaryPreference;
  variantId: string;
  variantName: string;
  variantServes: string;
  unitPrice: number;
  packingFee: number;
  quantity: number;
  selectedAccompaniments: AccompanimentOption[];
  specialInstructions?: string;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  flatDiscount?: number;
  maxDiscount?: number;
  minOrderValue: number;
  description: string;
}

export interface PriceQuote {
  itemSubtotal: number;
  packingSubtotal: number;
  deliveryFee: number;
  taxAmount: number; // 5% GST on food
  discountAmount: number;
  finalTotal: number;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
  appliedCoupon: Coupon | null;
}
