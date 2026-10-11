'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Flame,
  Bike,
  PackageCheck,
  Clock,
  ShieldCheck,
  MapPin,
  Phone,
  Thermometer,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { PRODUCTS } from '@/lib/mock-catalog';

interface OrderTrackerModalProps {
  orderData: any;
  onClose: () => void;
}

const STAGES = [
  { id: 'CONFIRMED', label: 'Order Confirmed', desc: 'Handi ticket dispatched to Master Chef' },
  { id: 'PREPARING', label: 'Dum Simmering', desc: 'Sealed with whole wheat dough over charcoal embers' },
  { id: 'PACKED', label: 'Purdah Inspected & Packed', desc: 'Earthen pot placed in insulated thermal carrier' },
  { id: 'OUT_FOR_DELIVERY', label: 'Rider on the Way', desc: 'Express hot-delivery partner en route' },
  { id: 'DELIVERED', label: 'Delivered Hot & Intact', desc: 'Crack open the seal and enjoy your feast' },
];

export default function OrderTrackerModal({ orderData, onClose }: OrderTrackerModalProps) {
  const [currentStageIdx, setCurrentStageIdx] = useState(1); // Default at 'Dum Simmering'
  const [isCancelled, setIsCancelled] = useState(false);
  const { addItem, openCart } = useCart();

  if (!orderData) return null;

  const advanceStage = () => {
    if (currentStageIdx < STAGES.length - 1) {
      setCurrentStageIdx((prev) => prev + 1);
    }
  };

  const handleCancelOrder = () => {
    if (currentStageIdx <= 1) {
      setIsCancelled(true);
    }
  };

  const handleReorder = () => {
    orderData.items?.forEach((it: any) => {
      const prod = PRODUCTS.find((p) => p.name === it.productName) || PRODUCTS[0];
      const variant = prod.variants[0];
      addItem(prod, variant);
    });
    onClose();
    openCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-lg bg-[#FFFAF2] rounded-3xl shadow-2xl overflow-hidden border border-[#282017]/15 my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Banner */}
        <div className={`p-6 text-center relative space-y-2 text-[#FFFAF2] ${isCancelled ? 'bg-stone-800' : 'bg-[#B82F22]'}`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-full bg-white/10 text-[#E7AA45] mx-auto flex items-center justify-center">
            <Flame className="w-6 h-6 fill-current" />
          </div>

          <h2 className="font-serif text-2xl font-bold">
            {isCancelled ? 'Order Cancelled' : currentStageIdx === 4 ? 'Handi Feast Delivered!' : 'Handi In The Dum Pit'}
          </h2>
          <p className="text-xs text-white/80">
            Order #{orderData.orderNumber} · {isCancelled ? 'Refund initiated' : `Estimated Arrival: ${orderData.estimatedDeliveryTime}`}
          </p>
        </div>

        {/* Timeline Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Rider & Thermal Carrier Live Card */}
          {!isCancelled && (
            <div className="p-4 rounded-2xl bg-white border border-[#282017]/10 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#E7AA45]/20 text-[#B82F22] flex items-center justify-center">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#282017] block">Rider: Ramesh Kumar</span>
                    <span className="text-[11px] text-[#282017]/60">Assigned Delivery Partner</span>
                  </div>
                </div>

                <a
                  href="tel:+919845122910"
                  className="px-3 py-1.5 rounded-lg bg-[#282017]/5 text-[#282017] font-semibold text-[11px] flex items-center gap-1 hover:bg-[#282017]/10"
                >
                  <Phone className="w-3 h-3 text-[#B82F22]" />
                  <span>Call Rider</span>
                </a>
              </div>

              {/* Temperature Live Gauge */}
              <div className="pt-2 border-t border-[#282017]/5 flex items-center justify-between text-[11px] text-[#282017]/70">
                <span className="flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-[#B82F22]" />
                  <span>Thermal Case Temp: <strong>68°C Hot</strong></span>
                </span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Dough Seal Intact</span>
                </span>
              </div>
            </div>
          )}

          {/* Live Timeline Stepper */}
          {!isCancelled && (
            <div className="space-y-3">
              <span className="font-bold uppercase tracking-wider text-[#282017] block">
                Clay Pot Preparation Progress
              </span>

              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#282017]/15">
                {STAGES.map((stage, idx) => {
                  const isPassed = idx <= currentStageIdx;
                  const isCurrent = idx === currentStageIdx;

                  return (
                    <div key={stage.id} className="relative flex items-start gap-4">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 font-bold transition-all ${
                          isCurrent
                            ? 'bg-[#B82F22] text-white ring-4 ring-[#B82F22]/20'
                            : isPassed
                            ? 'bg-[#E7AA45] text-[#282017]'
                            : 'bg-white border border-[#282017]/20 text-[#282017]/40'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      <div className="pt-0.5">
                        <div className={`font-bold ${isCurrent ? 'text-[#B82F22]' : 'text-[#282017]'}`}>
                          {stage.label}
                        </div>
                        <div className="text-[11px] text-[#282017]/60">{stage.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Delivery Coordinates */}
          <div className="p-4 rounded-2xl bg-white border border-[#282017]/10 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#282017]">
              <MapPin className="w-4 h-4 text-[#B82F22]" />
              <span>Delivering To:</span>
            </div>
            <p className="text-[#282017]/80">
              {orderData.customer?.addressLine}, {orderData.customer?.locality} ({orderData.customer?.pinCode})
            </p>
            <p className="text-[#282017]/60 text-[11px]">
              Recipient: {orderData.customer?.fullName} ({orderData.customer?.phone})
            </p>
          </div>

          {/* Items Summary */}
          <div className="p-4 rounded-2xl bg-white border border-[#282017]/10 space-y-2">
            <span className="font-bold text-[#282017] block">Ordered Items:</span>
            {orderData.items?.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-[#282017]/80">
                <span>{item.quantity}x {item.productName} ({item.variantName || 'Regular Handi'})</span>
                <span className="font-medium tabular-nums">₹{item.unitPrice * item.quantity}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-[#282017]/10 flex justify-between font-bold text-sm text-[#282017]">
              <span>Amount Paid:</span>
              <span className="font-serif text-[#B82F22] tabular-nums">
                ₹{orderData.quote?.finalTotal || '0'}
              </span>
            </div>
          </div>

          {/* Simulate Action for Testing/Demonstrations */}
          {!isCancelled && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={advanceStage}
                  disabled={currentStageIdx >= STAGES.length - 1}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#282017] hover:bg-[#B82F22] text-[#FFFAF2] font-semibold transition-colors disabled:opacity-40"
                >
                  Simulate Next Kitchen Stage
                </button>
                <button
                  onClick={handleReorder}
                  className="py-2.5 px-3 rounded-xl bg-[#E7AA45] text-[#282017] font-semibold hover:bg-white transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reorder Feast</span>
                </button>
              </div>

              {currentStageIdx <= 1 && (
                <button
                  onClick={handleCancelOrder}
                  className="w-full py-2 text-rose-600 hover:text-rose-800 text-[11px] font-semibold transition-colors"
                >
                  Cancel Order
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
