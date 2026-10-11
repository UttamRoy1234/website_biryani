'use client';

import React from 'react';
import { ArrowDown, Clock, ShieldCheck, Award, Sparkles } from 'lucide-react';
import BiryaniVisual from '@/components/catalog/BiryaniVisual';

export default function Hero() {
  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHeritage = () => {
    const el = document.getElementById('dum-heritage');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-[#282017]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Hero: 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Brand Headline & Mission */}
          <div className="lg:col-span-7 space-y-6 lg:pr-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B82F22]">
              <span>Royal Awadhi & Hyderabadi Heritage</span>
              <span aria-hidden="true">·</span>
              <span>Clay Handi Delivery</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#282017] leading-[1.12] [text-wrap:balance]">
              Artisanal Dum Biryani, sealed in clay and slow-cooked over embers.
            </h1>

            <p className="text-base sm:text-lg text-[#282017]/80 leading-relaxed font-normal max-w-xl">
              We never reheat in microwave trays. Each portion is cooked from raw in its own handcrafted terracotta handi, sealed with a wheat dough purdah to trap fragrant saffron steam, and delivered untouched to your dining table.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={scrollToMenu}
                className="px-7 py-3.5 rounded-full bg-[#B82F22] hover:bg-[#9B2418] text-[#FFFAF2] font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 group whitespace-nowrap shrink-0"
              >
                <span>Order Fresh Dum Handi</span>
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              </button>

              <button
                onClick={scrollToHeritage}
                className="px-6 py-3.5 rounded-full bg-transparent hover:bg-[#282017]/5 text-[#282017] border border-[#282017]/20 font-medium text-sm transition-colors whitespace-nowrap shrink-0"
              >
                Our Dum Technique
              </button>
            </div>

            {/* Quick Micro Proof Markers (Unboxed text with typographic separators) */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#282017]/70 font-medium">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#B82F22]" />
                4.9/5 from 14,000+ handis
              </span>
              <span aria-hidden="true" className="text-[#282017]/30">·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#B82F22]" />
                45-Min piping hot promise
              </span>
              <span aria-hidden="true" className="text-[#282017]/30">·</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#B82F22]" />
                100% Recyclable terracotta
              </span>
            </div>
          </div>

          {/* Right Column: Hero Handi Presentation Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden p-6 bg-[#282017] shadow-2xl border border-[#E7AA45]/20 group">
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden relative">
                <BiryaniVisual
                  slug="hero-nizami-handi"
                  name="Signature Nizami Gosht Mutton Dum Biryani"
                  category="mutton"
                  dietary="non-veg"
                  className="w-full h-full"
                  size="hero"
                />
              </div>

              {/* Product Hero Ribbon */}
              <div className="mt-5 space-y-2 text-[#FFFAF2]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#E7AA45] uppercase tracking-wider font-semibold">Today&apos;s Signature Handi</span>
                  <span className="text-[#FFFAF2]/60">Batch 14 of 25 Remaining</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-white">Nizami Gosht Mutton Dum Biryani</h3>
                <p className="text-xs text-[#FFFAF2]/70 line-clamp-2">
                  Prime tender goat slow-cooked for 4 hours with Grade-A Kashmiri saffron and aged basmati inside a dough-sealed earthen pot.
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-white/10">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs text-[#FFFAF2]/60">From</span>
                    <span className="font-serif text-lg font-bold text-[#E7AA45] tabular-nums">₹499</span>
                    <span className="text-xs text-[#FFFAF2]/50">/ 550g Regular Handi</span>
                  </div>
                  <button
                    onClick={scrollToMenu}
                    className="px-3 py-1.5 rounded-lg bg-[#E7AA45] text-[#282017] text-xs font-semibold hover:bg-white transition-colors"
                  >
                    View Portions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
