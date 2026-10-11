'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Phone,
  User,
  Clock,
  CreditCard,
  Banknote,
  ArrowRight,
  AlertCircle,
  Home,
  Briefcase,
  Sparkles
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import RazorpayModal from './RazorpayModal';

interface FastCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderData: any) => void;
}

const SERVICEABLE_PINCODES = ['560038', '560001', '560034', '560066', '560095', '560078', '560102'];

export default function FastCheckoutModal({ isOpen, onClose, onOrderSuccess }: FastCheckoutModalProps) {
  const { items, quote, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2>(1); // Step 1: Address & Slot, Step 2: Review & Payment
  const [addressType, setAddressType] = useState<'home' | 'work' | 'other'>('home');
  const [fullName, setFullName] = useState(user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Aditya Sharma');
  const [phone, setPhone] = useState(user?.phone || '9876543210');
  const [addressLine, setAddressLine] = useState('Flat 402, Royal Palms, 12th Main Road');
  const [locality, setLocality] = useState('Indiranagar Stage 2');
  const [pinCode, setPinCode] = useState('560038');
  const [slot, setSlot] = useState<'asap' | 'lunch' | 'dinner'>('asap');
  const [instructions, setInstructions] = useState('Ring bell twice, keep dough seal unbroken');
  const [isContactless, setIsContactless] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState<any | null>(null);

  // Validate serviceability on pin code change (derived state)
  const serviceableNotice = React.useMemo(() => {
    if (pinCode.length === 6) {
      if (SERVICEABLE_PINCODES.includes(pinCode)) {
        return 'Verified: Within our 8km Hot-Clay Delivery Radius (~38 mins ETA).';
      }
      return 'Standard Delivery Area: Estimated arrival 45 - 55 mins.';
    }
    return null;
  }, [pinCode]);

  if (!isOpen) return null;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !phone.trim() || !addressLine.trim() || !locality.trim() || !pinCode.trim()) {
      setErrorMsg('Please complete all delivery address fields.');
      return;
    }

    if (phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number for order delivery coordination.');
      return;
    }

    if (pinCode.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit postal PIN code.');
      return;
    }

    setStep(2);
  };

  const handleConfirmOrder = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer_name: fullName,
        customer_phone: phone,
        address_line: addressLine,
        locality: locality,
        postal_code: pinCode,
        instructions: `${instructions}${isContactless ? ' [Contactless Delivery]' : ''}`,
        coupon_code: quote.appliedCoupon?.code || '',
        items: items.map((it) => ({
          variant_id: it.variantId,
          quantity: it.quantity,
          accompaniment_ids: it.selectedAccompaniments.map((a) => a.id),
          special_instructions: it.specialInstructions || '',
        })),
        subtotal: String(quote.itemSubtotal),
        total_amount: String(quote.finalTotal),
      };

      const serverOrder = await api.createOrder(orderPayload);

      const stagedOrder = {
        id: serverOrder.id,
        orderNumber: serverOrder.order_number,
        createdAt: serverOrder.created_at,
        customer: {
          fullName,
          phone,
          addressLine,
          locality,
          pinCode,
          instructions,
        },
        items: [...items],
        quote: { ...quote },
        paymentMethod,
        slotChoice: slot === 'asap' ? 'Express Hot Dum (~38 Mins)' : slot === 'lunch' ? 'Lunch Slot (1:00 PM)' : 'Dinner Slot (8:00 PM)',
        estimatedDeliveryTime: '35 - 45 Minutes',
        initialStatus: serverOrder.status || 'CONFIRMED',
      };

      if (paymentMethod === 'razorpay') {
        // Open Razorpay Sandbox modal for interactive verification
        setPendingOrderData(stagedOrder);
        setIsRazorpayOpen(true);
        setIsSubmitting(false);
      } else {
        // Cash on Delivery
        clearCart();
        setIsSubmitting(false);
        onOrderSuccess(stagedOrder);
        onClose();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit order. Please try again.';
      setErrorMsg(message);
      setIsSubmitting(false);
    }
  };

  const handleRazorpaySuccess = async (paymentId: string, signature: string) => {
    try {
      if (pendingOrderData) {
        await api.verifyPayment(pendingOrderData.id, paymentId, signature);
        clearCart();
        setIsRazorpayOpen(false);
        onOrderSuccess({
          ...pendingOrderData,
          paymentId,
          paymentStatus: 'CAPTURED',
        });
        onClose();
      }
    } catch {
      setErrorMsg('Payment verification failed. Please try again.');
      setIsRazorpayOpen(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div
          className="relative w-full max-w-xl bg-[#FFFAF2] rounded-3xl shadow-2xl overflow-hidden border border-[#282017]/15 my-6 max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 bg-white border-b border-[#282017]/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#B82F22] text-[#FFFAF2] flex items-center justify-center font-serif font-bold text-sm">
                D
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-[#282017]">
                  {step === 1 ? 'Step 1: Delivery Details & Slot' : 'Step 2: Review & Payment'}
                </h2>
                <span className="text-xs text-[#282017]/60">
                  {step === 1 ? 'Dispatch coordinates for clay handi transport' : 'Secure payment & order confirmation'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#282017]/60 hover:text-[#282017] hover:bg-[#282017]/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Multi-step Content */}
          {step === 1 ? (
            /* STEP 1: Address, Slot, Customer Details */
            <form onSubmit={handleProceedToPayment} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* Address Category Tag */}
              <div className="space-y-2">
                <span className="font-bold uppercase tracking-wider text-[#282017] block">
                  Delivery Location Label
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAddressType('home')}
                    className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-colors ${
                      addressType === 'home'
                        ? 'border-[#B82F22] bg-[#B82F22]/5 text-[#B82F22] font-bold'
                        : 'border-[#282017]/15 bg-white text-[#282017]/70'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Home</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddressType('work')}
                    className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-colors ${
                      addressType === 'work'
                        ? 'border-[#B82F22] bg-[#B82F22]/5 text-[#B82F22] font-bold'
                        : 'border-[#282017]/15 bg-white text-[#282017]/70'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Office / Work</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddressType('other')}
                    className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-colors ${
                      addressType === 'other'
                        ? 'border-[#B82F22] bg-[#B82F22]/5 text-[#B82F22] font-bold'
                        : 'border-[#282017]/15 bg-white text-[#282017]/70'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Other</span>
                  </button>
                </div>
              </div>

              {/* Customer Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#282017]/70 block mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-[#282017]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Aditya Sharma"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#282017]/15 text-[#282017] focus:outline-none focus:ring-1 focus:ring-[#B82F22]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#282017]/70 block mb-1">
                    Phone (10-digit mobile) *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-[#282017]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#282017]/15 text-[#282017] focus:outline-none focus:ring-1 focus:ring-[#B82F22]"
                    />
                  </div>
                </div>
              </div>

              {/* Street & Postal Code */}
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#282017]/70 block mb-1">
                    House / Flat No., Apartment / Street *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="Flat 402, Royal Palms, 12th Main Road"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#282017]/15 text-[#282017] focus:outline-none focus:ring-1 focus:ring-[#B82F22]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#282017]/70 block mb-1">
                      Locality / Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder="Indiranagar Stage 2"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#282017]/15 text-[#282017] focus:outline-none focus:ring-1 focus:ring-[#B82F22]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#282017]/70 block mb-1">
                      PIN Code (6 digits) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      placeholder="560038"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#282017]/15 text-[#282017] focus:outline-none focus:ring-1 focus:ring-[#B82F22]"
                    />
                  </div>
                </div>

                {/* Serviceability badge */}
                {serviceableNotice && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{serviceableNotice}</span>
                  </div>
                )}
              </div>

              {/* Delivery Timing Slot */}
              <div className="space-y-2 pt-2 border-t border-[#282017]/10">
                <span className="font-bold uppercase tracking-wider text-[#282017] block">
                  Select Preparation & Delivery Timing
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSlot('asap')}
                    className={`p-2.5 rounded-xl border text-left transition-colors ${
                      slot === 'asap'
                        ? 'border-[#B82F22] bg-[#B82F22]/5 font-bold text-[#B82F22]'
                        : 'border-[#282017]/15 bg-white text-[#282017]/70'
                    }`}
                  >
                    <span className="block text-[11px]">Express Dum</span>
                    <span className="text-[10px] text-[#282017]/50">~38 Mins Hot</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSlot('lunch')}
                    className={`p-2.5 rounded-xl border text-left transition-colors ${
                      slot === 'lunch'
                        ? 'border-[#B82F22] bg-[#B82F22]/5 font-bold text-[#B82F22]'
                        : 'border-[#282017]/15 bg-white text-[#282017]/70'
                    }`}
                  >
                    <span className="block text-[11px]">Lunch Feast</span>
                    <span className="text-[10px] text-[#282017]/50">1:00 PM Slot</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSlot('dinner')}
                    className={`p-2.5 rounded-xl border text-left transition-colors ${
                      slot === 'dinner'
                        ? 'border-[#B82F22] bg-[#B82F22]/5 font-bold text-[#B82F22]'
                        : 'border-[#282017]/15 bg-white text-[#282017]/70'
                    }`}
                  >
                    <span className="block text-[11px]">Dinner Gathering</span>
                    <span className="text-[10px] text-[#282017]/50">8:00 PM Slot</span>
                  </button>
                </div>
              </div>

              {/* Delivery Instructions */}
              <div>
                <label className="text-[11px] font-semibold text-[#282017]/70 block mb-1">
                  Delivery Notes & Instructions
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Ring bell twice, leave with security"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#282017]/15 text-[#282017] focus:outline-none"
                />
              </div>

              {/* Contactless option */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isContactless}
                  onChange={(e) => setIsContactless(e.target.checked)}
                  className="rounded text-[#B82F22]"
                />
                <span className="text-[11px] text-[#282017]/70">
                  Opt for Contactless Drop-off (Rider leaves thermal bag on doorstep)
                </span>
              </label>

              {/* Proceed Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#B82F22] hover:bg-[#9B2418] text-[#FFFAF2] font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md mt-2"
              >
                <span>Continue to Review & Payment (₹{quote.finalTotal})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* STEP 2: Review & Payment Selection */
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* Destination Summary */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#282017]/10 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-[#282017]">
                    <MapPin className="w-4 h-4 text-[#B82F22]" />
                    <span>Delivering to: {fullName}</span>
                  </div>
                  <p className="text-[11px] text-[#282017]/70 mt-0.5">
                    {addressLine}, {locality} ({pinCode}) · {phone}
                  </p>
                  <span className="text-[10px] text-[#B82F22] font-medium block mt-1">
                    Slot: {slot === 'asap' ? 'Express Hot Dum (~38 Mins)' : slot === 'lunch' ? 'Lunch (1:00 PM)' : 'Dinner (8:00 PM)'}
                  </span>
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-[#B82F22] underline shrink-0 ml-2"
                >
                  Edit
                </button>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <span className="font-bold uppercase tracking-wider text-[#282017] block">
                  Select Payment Gateway
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === 'razorpay'
                        ? 'border-[#B82F22] bg-[#B82F22]/5 shadow-sm'
                        : 'border-[#282017]/15 bg-white'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#B82F22] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#282017]">Razorpay Sandbox Gateway</strong>
                      <span className="text-[11px] text-[#282017]/60 block mt-0.5">
                        UPI Apps, Debit/Credit Cards & NetBanking
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#B82F22] bg-[#B82F22]/5 shadow-sm'
                        : 'border-[#282017]/15 bg-white'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#282017]">Cash on Delivery (COD)</strong>
                      <span className="text-[11px] text-[#282017]/60 block mt-0.5">
                        Hand over cash upon arrival of sealed clay handis
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Server-Calculated Bill Details */}
              <div className="p-4 rounded-2xl bg-white border border-[#282017]/10 space-y-2">
                <span className="font-bold text-[#282017] block">Certified Server Totals</span>

                <div className="flex justify-between text-[#282017]/70">
                  <span>Food Subtotal:</span>
                  <span className="font-medium text-[#282017] tabular-nums">₹{quote.itemSubtotal}</span>
                </div>

                <div className="flex justify-between text-[#282017]/70">
                  <span>Clay Pot Matka Packaging:</span>
                  <span className="tabular-nums">₹{quote.packingSubtotal}</span>
                </div>

                <div className="flex justify-between text-[#282017]/70">
                  <span>Express Delivery Fee:</span>
                  <span className="tabular-nums font-medium">
                    {quote.deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${quote.deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-[#282017]/70">
                  <span>Restaurant GST (5%):</span>
                  <span className="tabular-nums">₹{quote.taxAmount}</span>
                </div>

                {quote.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-[#282017]/5">
                    <span>Coupon Discount ({quote.appliedCoupon?.code}):</span>
                    <span className="tabular-nums">-₹{quote.discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold text-[#282017] pt-2 border-t border-[#282017]/10">
                  <span>Total Amount Payable:</span>
                  <span className="font-serif text-lg text-[#B82F22] tabular-nums">
                    ₹{quote.finalTotal}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl border border-[#282017]/20 text-[#282017] font-semibold hover:bg-[#282017]/5 transition-colors"
                >
                  Back
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmOrder}
                  className="flex-1 py-3.5 rounded-xl bg-[#B82F22] hover:bg-[#9B2418] text-[#FFFAF2] font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registering Order & Reserving Handis...</span>
                  ) : paymentMethod === 'razorpay' ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-[#E7AA45]" />
                      <span>Proceed to Razorpay (₹{quote.finalTotal})</span>
                    </>
                  ) : (
                    <>
                      <span>Place Cash on Delivery Order (₹{quote.finalTotal})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Razorpay Interactive Sandbox Modal */}
      {pendingOrderData && (
        <RazorpayModal
          isOpen={isRazorpayOpen}
          orderNumber={pendingOrderData.orderNumber}
          amount={pendingOrderData.quote.finalTotal}
          customerName={pendingOrderData.customer.fullName}
          customerPhone={pendingOrderData.customer.phone}
          onSuccess={handleRazorpaySuccess}
          onDismiss={() => {
            setIsRazorpayOpen(false);
            setErrorMsg('Payment cancelled. Your handi cart remains preserved.');
          }}
        />
      )}
    </>
  );
}
