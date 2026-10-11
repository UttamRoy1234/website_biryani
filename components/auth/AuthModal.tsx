'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Flame, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    if (tab === 'login') {
      const ok = await login(email, password);
      if (!ok) setErrorMsg('Invalid email or password.');
    } else {
      if (!firstName.trim() || !phone.trim()) {
        setErrorMsg('Please provide your name and mobile number.');
        setIsSubmitting(false);
        return;
      }
      const ok = await register(email, password, firstName, lastName, phone);
      if (!ok) setErrorMsg('Failed to create account. Please check your details.');
    }

    setIsSubmitting(false);
  };

  const handleDemoSignIn = async (role: 'customer' | 'staff') => {
    if (role === 'customer') {
      await login('aditya.sharma@example.com', 'BiryaniPass123!');
    } else {
      await login('chef.imran@dumandco.in', 'KitchenChef2026!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={closeAuthModal} />

      <div
        className="relative w-full max-w-md bg-[#FFFAF2] rounded-3xl shadow-2xl overflow-hidden border border-[#282017]/15 z-10 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#B82F22] text-[#FFFAF2] p-6 text-center relative space-y-1.5">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-10 h-10 rounded-full bg-white/10 text-[#E7AA45] mx-auto flex items-center justify-center">
            <Flame className="w-5 h-5 fill-current" />
          </div>

          <h2 className="font-serif text-2xl font-bold">Dum & Co. Connoisseurs</h2>
          <p className="text-xs text-white/80">
            Slow-cooked. Soul-approved.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-[#282017]/10 bg-white">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-3 text-xs font-semibold transition-colors ${
              tab === 'login'
                ? 'text-[#B82F22] border-b-2 border-[#B82F22] bg-[#FFFAF2]'
                : 'text-[#282017]/60 hover:text-[#282017]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-3 text-xs font-semibold transition-colors ${
              tab === 'register'
                ? 'text-[#B82F22] border-b-2 border-[#B82F22] bg-[#FFFAF2]'
                : 'text-[#282017]/60 hover:text-[#282017]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
              {errorMsg}
            </div>
          )}

          {tab === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#282017]/70 block mb-1">
                  First Name *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-[#282017]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Aditya"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#282017]/15 text-[#282017] focus:outline-none focus:ring-1 focus:ring-[#B82F22]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#282017]/70 block mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Sharma"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#282017]/15 text-[#282017] focus:outline-none focus:ring-1 focus:ring-[#B82F22]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-[#282017]/70 block mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-[#282017]/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aditya@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#282017]/15 text-[#282017] focus:outline-none focus:ring-1 focus:ring-[#B82F22]"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div>
              <label className="text-[11px] font-semibold text-[#282017]/70 block mb-1">
                Mobile Number (for Order SMS) *
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-[#282017]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#282017]/15 text-[#282017] focus:outline-none focus:ring-1 focus:ring-[#B82F22]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-[#282017]/70 block mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-[#282017]/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#282017]/15 text-[#282017] focus:outline-none focus:ring-1 focus:ring-[#B82F22]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[#B82F22] hover:bg-[#9B2418] text-[#FFFAF2] font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50 mt-2"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{tab === 'login' ? 'Sign In to Handi Portal' : 'Register Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {/* Quick Demo Shortcuts for Evaluators */}
          <div className="pt-3 border-t border-[#282017]/10 space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#282017]/50 block text-center">
              One-Click Evaluator Access
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDemoSignIn('customer')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-[#282017]/5 hover:bg-[#282017]/10 text-[11px] font-medium text-[#282017] transition-colors"
              >
                Sign In as Customer
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn('staff')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-[#E7AA45]/20 hover:bg-[#E7AA45]/30 text-[11px] font-medium text-[#282017] transition-colors"
              >
                Sign In as Kitchen Staff
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
