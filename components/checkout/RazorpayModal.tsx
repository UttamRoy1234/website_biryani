'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Smartphone, Building, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface RazorpayModalProps {
  isOpen: boolean;
  orderNumber: string;
  amount: number;
  customerName: string;
  customerPhone: string;
  onSuccess: (paymentId: string, signature: string) => void;
  onDismiss: () => void;
}

export default function RazorpayModal({
  isOpen,
  orderNumber,
  amount,
  customerName,
  customerPhone,
  onSuccess,
  onDismiss,
}: RazorpayModalProps) {
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiVpa, setUpiVpa] = useState('aditya@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [expiry, setExpiry] = useState('08/28');
  const [cvv, setCvv] = useState('•••');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const mockPaymentId = `pay_${Math.random().toString(36).substring(2, 11)}`;
      const mockSignature = `mock_sig_${Math.random().toString(36).substring(2, 14)}`;
      setIsProcessing(false);
      onSuccess(mockPaymentId, mockSignature);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#282017]/20 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Razorpay Brand Header */}
        <div className="bg-[#0C2340] text-white p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-wide text-white">Razorpay</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono uppercase">
                Sandbox Mode
              </span>
            </div>
            <div className="text-xs text-white/70 mt-0.5">
              Paying <strong className="text-white">DUM & CO.</strong> · Order #{orderNumber}
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10"
            aria-label="Cancel payment"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Bar */}
        <div className="bg-[#0A1A2E] text-white px-5 py-3 flex items-center justify-between border-t border-white/10 text-xs">
          <span className="text-white/70">Amount Payable</span>
          <span className="font-serif text-lg font-bold text-[#E7AA45] tabular-nums">
            ₹{amount.toFixed(2)}
          </span>
        </div>

        {/* Payment Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMethod('upi')}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 transition-colors ${
              method === 'upi' ? 'bg-white text-blue-700 border-b-2 border-blue-700' : 'text-stone-600'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>UPI Apps</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod('card')}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 transition-colors ${
              method === 'card' ? 'bg-white text-blue-700 border-b-2 border-blue-700' : 'text-stone-600'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod('netbanking')}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 transition-colors ${
              method === 'netbanking' ? 'bg-white text-blue-700 border-b-2 border-blue-700' : 'text-stone-600'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>NetBanking</span>
          </button>
        </div>

        {/* Method Inputs */}
        <div className="p-6 space-y-4 text-xs">
          {method === 'upi' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block">Instant UPI Sandbox Verification</strong>
                  <span>Supports Google Pay, PhonePe, Paytm, and BHIM mock handles.</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                  UPI ID (VPA)
                </label>
                <input
                  type="text"
                  value={upiVpa}
                  onChange={(e) => setUpiVpa(e.target.value)}
                  placeholder="username@okhdfcbank"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          )}

          {method === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                  Card Number (Test Cards)
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                    Valid Thru
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {method === 'netbanking' && (
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-stone-700 block">
                Select Test Bank
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      selectedBank === bank
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                        : 'border-stone-200 hover:border-stone-400 text-stone-700'
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customer Snapshot */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Customer: {customerName}</span>
            <span>{customerPhone}</span>
          </div>

          {/* Pay Button */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={handlePay}
            className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Authorizing with Bank...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Simulate Pay ₹{amount.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
