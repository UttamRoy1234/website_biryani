'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  ShoppingBag,
  MapPin,
  Clock,
  RotateCcw,
  CheckCircle2,
  Flame,
  ChevronRight,
  Receipt,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { PRODUCTS } from '@/lib/mock-catalog';

interface CustomerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder: (order: any) => void;
}

interface HistoricalOrder {
  orderNumber: string;
  date: string;
  status: 'CONFIRMED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  totalAmount: number;
  items: {
    productId: string;
    productName: string;
    variantName: string;
    quantity: number;
    unitPrice: number;
  }[];
  deliveryAddress: string;
}

const MOCK_ORDER_HISTORY: HistoricalOrder[] = [
  {
    orderNumber: 'DUM-782194',
    date: 'Yesterday at 8:15 PM',
    status: 'DELIVERED',
    totalAmount: 1048,
    items: [
      {
        productId: 'dum-01',
        productName: 'Nizami Gosht Mutton Dum Biryani',
        variantName: 'Grand Celebration Handi (1100g)',
        quantity: 1,
        unitPrice: 899,
      },
      {
        productId: 'dum-09',
        productName: 'Old Delhi Shahi Tukda with Rabri',
        variantName: 'Portion of 2 (200g)',
        quantity: 1,
        unitPrice: 149,
      },
    ],
    deliveryAddress: 'Flat 402, Royal Palms, 12th Main Road, Indiranagar',
  },
  {
    orderNumber: 'DUM-619283',
    date: '3 days ago at 1:30 PM',
    status: 'DELIVERED',
    totalAmount: 824,
    items: [
      {
        productId: 'dum-02',
        productName: 'Royal Awadhi Murgh Chicken Dum Biryani',
        variantName: 'Grand Celebration Handi (1100g)',
        quantity: 1,
        unitPrice: 749,
      },
    ],
    deliveryAddress: 'Flat 402, Royal Palms, 12th Main Road, Indiranagar',
  },
];

export default function CustomerDashboardModal({
  isOpen,
  onClose,
  onTrackOrder,
}: CustomerDashboardModalProps) {
  const { user, logout } = useAuth();
  const { addItem, openCart } = useCart();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');
  const [selectedReceipt, setSelectedReceipt] = useState<HistoricalOrder | null>(null);

  if (!isOpen) return null;

  const handleReorder = (order: HistoricalOrder) => {
    order.items.forEach((item) => {
      const prod = PRODUCTS.find((p) => p.id === item.productId) || PRODUCTS[0];
      const variant = prod.variants[0];
      addItem(prod, variant);
    });
    onClose();
    openCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-[#FFFAF2] rounded-3xl shadow-2xl overflow-hidden border border-[#282017]/15 my-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#282017] text-[#FFFAF2] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#B82F22] text-[#E7AA45] flex items-center justify-center font-serif font-bold text-lg">
              {user?.first_name ? user.first_name[0] : 'C'}
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-white">
                {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Aditya Sharma'}
              </h2>
              <span className="text-xs text-[#E7AA45] font-medium flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-current" />
                Royal Connoisseur Member · 450 Dum Points
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Close dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#282017]/10 bg-white text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('orders');
              setSelectedReceipt(null);
            }}
            className={`flex-1 py-3.5 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'orders'
                ? 'text-[#B82F22] border-b-2 border-[#B82F22] bg-[#FFFAF2]'
                : 'text-[#282017]/60 hover:text-[#282017]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order History ({MOCK_ORDER_HISTORY.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3.5 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'profile'
                ? 'text-[#B82F22] border-b-2 border-[#B82F22] bg-[#FFFAF2]'
                : 'text-[#282017]/60 hover:text-[#282017]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Loyalty</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex-1 py-3.5 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'addresses'
                ? 'text-[#B82F22] border-b-2 border-[#B82F22] bg-[#FFFAF2]'
                : 'text-[#282017]/60 hover:text-[#282017]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Saved Addresses</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {MOCK_ORDER_HISTORY.map((order) => (
                <div
                  key={order.orderNumber}
                  className="p-5 rounded-2xl bg-white border border-[#282017]/10 space-y-3 shadow-xs hover:border-[#E7AA45]/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-[#282017]">
                          Order #{order.orderNumber}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {order.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#282017]/60 block mt-0.5">
                        {order.date} · Delivered to Indiranagar
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-serif text-base font-bold text-[#282017] tabular-nums block">
                        ₹{order.totalAmount}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-medium">Paid via Razorpay</span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="p-3 rounded-xl bg-[#FFFAF2] border border-[#282017]/5 space-y-1.5">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] text-[#282017]/80">
                        <span>
                          {it.quantity}x {it.productName} ({it.variantName})
                        </span>
                        <span className="font-medium tabular-nums">₹{it.unitPrice * it.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        onTrackOrder({
                          orderNumber: order.orderNumber,
                          estimatedDeliveryTime: 'Delivered Hot & Intact',
                          customer: {
                            fullName: user?.first_name || 'Aditya Sharma',
                            phone: user?.phone || '9876543210',
                            addressLine: order.deliveryAddress,
                            locality: 'Indiranagar',
                            pinCode: '560038',
                          },
                          items: order.items.map((i) => ({
                            cartItemId: i.productId,
                            productName: i.productName,
                            variantName: i.variantName,
                            unitPrice: i.unitPrice,
                            quantity: i.quantity,
                          })),
                          quote: { finalTotal: order.totalAmount },
                        });
                        onClose();
                      }}
                      className="text-xs font-semibold text-[#B82F22] hover:underline flex items-center gap-1"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>View Handi Timeline</span>
                    </button>

                    <button
                      onClick={() => handleReorder(order)}
                      className="px-4 py-2 rounded-xl bg-[#282017] hover:bg-[#B82F22] text-[#FFFAF2] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder This Feast</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-[#282017]/10 space-y-3">
                <span className="font-bold uppercase tracking-wider text-[#282017] block">
                  Connoisseur Credentials
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#FFFAF2] border border-[#282017]/10">
                    <span className="text-[10px] text-[#282017]/60 block">Full Name</span>
                    <strong className="text-[#282017] block mt-0.5">
                      {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Aditya Sharma'}
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FFFAF2] border border-[#282017]/10">
                    <span className="text-[10px] text-[#282017]/60 block">Email Address</span>
                    <strong className="text-[#282017] block mt-0.5">
                      {user?.email || 'aditya.sharma@example.com'}
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FFFAF2] border border-[#282017]/10">
                    <span className="text-[10px] text-[#282017]/60 block">Contact Mobile</span>
                    <strong className="text-[#282017] block mt-0.5">
                      {user?.phone || '+91 98765 43210'}
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FFFAF2] border border-[#282017]/10">
                    <span className="text-[10px] text-[#282017]/60 block">Member Tier</span>
                    <strong className="text-[#B82F22] block mt-0.5">Nawabi Gold Club</strong>
                  </div>
                </div>
              </div>

              {/* Loyalty Club Perks */}
              <div className="p-5 rounded-2xl bg-[#E7AA45]/15 border border-[#E7AA45]/30 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#282017]">
                  <ShieldCheck className="w-4 h-4 text-[#B82F22]" />
                  <span>Royal Privileges Active</span>
                </div>
                <p className="text-[11px] text-[#282017]/80 leading-relaxed">
                  Earn 10 Dum Points for every ₹100 spent. Redeem points for complimentary earthen handis and chef special seasonal biryanis.
                </p>
              </div>

              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
              >
                Sign Out of Account
              </button>
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white border border-[#282017]/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#282017] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#B82F22]" />
                    Home (Default)
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Serviceable Radius
                  </span>
                </div>
                <p className="text-[11px] text-[#282017]/70">
                  Flat 402, Royal Palms, 12th Main Road, Indiranagar Stage 2, Bengaluru - 560038
                </p>
                <span className="text-[10px] text-[#282017]/50 block">Instructions: Ring bell twice</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#282017]/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#282017] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#B82F22]" />
                    Office / Tech Park
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Serviceable Radius
                  </span>
                </div>
                <p className="text-[11px] text-[#282017]/70">
                  Level 5, Embassy Golf Links Business Park, Domlur, Bengaluru - 560071
                </p>
                <span className="text-[10px] text-[#282017]/50 block">Instructions: Leave with reception security</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
