'use client';

import React, { useState } from 'react';
import { Flame, Mail, ShieldCheck, Heart, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
  };

  return (
    <footer id="about-section" className="bg-[#282017] text-[#FFFAF2] border-t border-[#282017]/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#B82F22] text-[#E7AA45] flex items-center justify-center">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#FFFAF2]">
                DUM & CO.
              </span>
            </div>

            <p className="font-serif italic text-sm text-[#E7AA45]">
              Slow-cooked. Soul-approved.
            </p>

            <p className="text-xs text-[#FFFAF2]/70 leading-relaxed max-w-sm">
              We specialize exclusively in authentic Awadhi and Hyderabadi handi biryani. Cooked in certified food-grade clay pots with dough seals, delivered straight from the charcoal pit to your doorstep.
            </p>

            <div className="pt-2 text-xs text-[#FFFAF2]/60 space-y-1">
              <p>Kitchen Hours: 11:30 AM – 11:30 PM (All 7 Days)</p>
              <p>FSSAI License: 11224333000912</p>
            </div>
          </div>

          {/* Quick Menu Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#E7AA45] uppercase tracking-wider">
              Handi Catalog
            </h4>
            <ul className="space-y-2 text-xs text-[#FFFAF2]/70">
              <li><a href="#menu-section" className="hover:text-white transition-colors">Nizami Mutton Handi</a></li>
              <li><a href="#menu-section" className="hover:text-white transition-colors">Royal Awadhi Murgh</a></li>
              <li><a href="#menu-section" className="hover:text-white transition-colors">Shahi Malai Paneer Dum</a></li>
              <li><a href="#menu-section" className="hover:text-white transition-colors">Kolkata Aloo Biryani</a></li>
              <li><a href="#feasts-combos" className="hover:text-white transition-colors">Daawat-e-Khaas Combos</a></li>
              <li><a href="#menu-section" className="hover:text-white transition-colors">Mirchi Ka Salan & Raita</a></li>
            </ul>
          </div>

          {/* Service & Policies */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#E7AA45] uppercase tracking-wider">
              Trust & Support
            </h4>
            <ul className="space-y-2 text-xs text-[#FFFAF2]/70">
              <li><a href="#dum-heritage" className="hover:text-white transition-colors">Clay Pot Dum Heritage</a></li>
              <li><a href="#reviews-section" className="hover:text-white transition-colors">Verified Customer Reviews</a></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Hot Delivery Guarantee</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Food Safety & Hygiene</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Cancellation & Refund Policy</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Terms & Privacy Policy</span></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#E7AA45] uppercase tracking-wider">
              The Royal Dispatch
            </h4>
            <p className="text-xs text-[#FFFAF2]/70 leading-relaxed">
              Receive notifications when seasonal batches (Nalli Nihari, Dum Biryani special releases) go live.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You are subscribed to the royal guest list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 bg-white/10 rounded-l-lg text-xs text-white placeholder-white/40 border border-white/15 focus:outline-none focus:border-[#E7AA45]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#B82F22] hover:bg-[#9B2418] text-white rounded-r-lg text-xs font-semibold transition-colors"
                  >
                    Join
                  </button>
                </div>
                <label className="text-[10px] text-[#FFFAF2]/50 flex items-start gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked required className="mt-0.5" />
                  <span>I agree to receive occasional biryani offers and seasonal menu previews.</span>
                </label>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFFAF2]/50">
          <p>© {new Date().getFullYear()} Dum & Co. All rights reserved. Earthen pots are 100% biodegradable alluvial clay.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Bengaluru</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Hyderabad</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Mumbai</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Delhi NCR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
