'use client';

import React from 'react';
import { Flame, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

export default function HeritageSection() {
  return (
    <section id="dum-heritage" className="py-20 bg-[#282017] text-[#FFFAF2] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#B82F22]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E7AA45]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E7AA45]">
            <Flame className="w-3.5 h-3.5 text-[#E7AA45]" />
            <span>The Dum Pukht Philosophy</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FFFAF2] [text-wrap:balance]">
            Why we seal every single handi with whole wheat dough.
          </h2>

          <p className="text-sm sm:text-base text-[#FFFAF2]/70 leading-relaxed font-light">
            In Persian, <em>Dum</em> means &lsquo;to breathe&rsquo; and <em>Pukht</em> means &lsquo;to cook&rsquo;. We refuse industrial steel vats. Here is the ancestral science behind our culinary craft.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-[#E7AA45]/40 transition-colors">
            <span className="font-serif text-2xl font-bold text-[#E7AA45]">01.</span>
            <h3 className="font-serif text-lg font-bold text-white">Raw-to-Pot Marination</h3>
            <p className="text-xs text-[#FFFAF2]/70 leading-relaxed">
              We practice the authentic <em>Kachchi Biryani</em> method. Meat is marinated in raw stone-ground spices, yogurt, and brown onions for 12 hours before entering the handi uncooked.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-[#E7AA45]/40 transition-colors">
            <span className="font-serif text-2xl font-bold text-[#E7AA45]">02.</span>
            <h3 className="font-serif text-lg font-bold text-white">Artisanal Earthenware</h3>
            <p className="text-xs text-[#FFFAF2]/70 leading-relaxed">
              Each pot is custom-thrown by traditional potters from alluvial clay. Porous terracotta diffuses heat uniformly, avoiding burning and imparting a subtle earthiness.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-[#E7AA45]/40 transition-colors">
            <span className="font-serif text-2xl font-bold text-[#E7AA45]">03.</span>
            <h3 className="font-serif text-lg font-bold text-white">Wheat Dough Purdah</h3>
            <p className="text-xs text-[#FFFAF2]/70 leading-relaxed">
              A thick ribbon of whole-wheat dough seals the earthen lid. As internal steam builds, the seal hardens, creating natural gentle pressure that cooks meat until tender.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-[#E7AA45]/40 transition-colors">
            <span className="font-serif text-2xl font-bold text-[#E7AA45]">04.</span>
            <h3 className="font-serif text-lg font-bold text-white">Delivered Sealed & Intact</h3>
            <p className="text-xs text-[#FFFAF2]/70 leading-relaxed">
              Our riders transport the handis in custom thermal cases. The seal stays intact throughout transit. The first aroma of saffron steam escapes only when you cut the dough at home.
            </p>
          </div>
        </div>

        {/* Quality Commitment Box */}
        <div className="p-8 rounded-3xl bg-[#B82F22] text-[#FFFAF2] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h4 className="font-serif text-2xl font-bold text-white">The Zero-Reheat Promise</h4>
            <p className="text-xs sm:text-sm text-[#FFFAF2]/90 leading-relaxed">
              If your handi arrives with a broken dough seal or below 65°C, we dispatch a fresh handi immediately at zero charge. No questions asked.
            </p>
          </div>

          <a
            href="#menu-section"
            className="px-6 py-3 rounded-full bg-[#E7AA45] text-[#282017] font-semibold text-xs sm:text-sm hover:bg-white transition-colors whitespace-nowrap shrink-0 shadow-md"
          >
            Taste the Dum Difference
          </a>
        </div>
      </div>
    </section>
  );
}
