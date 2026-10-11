'use client';

import React from 'react';
import { DietaryPreference } from '@/types/catalog';

interface BiryaniVisualProps {
  slug: string;
  name: string;
  category: string;
  dietary: DietaryPreference;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export default function BiryaniVisual({
  slug,
  name,
  category,
  dietary,
  className = '',
  size = 'md',
}: BiryaniVisualProps) {
  // Determine color themes based on category & dish
  const isMutton = category === 'mutton';
  const isChicken = category === 'chicken';
  const isVeg = dietary === 'veg';
  const isEgg = category === 'egg';
  const isCombo = category === 'combos';
  const isDessert = category === 'accompaniments';

  // Saffron gold accents
  const primaryPotColor = isVeg ? '#3E2723' : '#2D1F18';
  const accentGold = '#E7AA45';
  const chilliRed = '#B82F22';

  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center select-none bg-gradient-to-br from-[#241A14] via-[#2F1E16] to-[#1C1410] ${className}`}
      role="img"
      aria-label={`${name} - Artisanal clay handi presentation`}
    >
      {/* Warm ambient radial glow */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 55%, ${isVeg ? '#10B981' : isMutton ? '#B82F22' : '#E7AA45'} 0%, transparent 65%)`
        }} 
      />

      {/* Subtle fine concentric earthen rings */}
      <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
        <div className="w-56 h-56 rounded-full border border-[#E7AA45]/30" />
        <div className="absolute w-72 h-72 rounded-full border border-[#E7AA45]/20" />
      </div>

      {/* Handcrafted Artisanal Handi & Biryani Presentation Graphic */}
      <svg
        viewBox="0 0 240 200"
        className="w-full h-full max-h-56 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)] transition-transform duration-500 hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Earthen Clay Handi Gradient */}
          <radialGradient id={`pot-grad-${slug}`} cx="50%" cy="60%" r="55%">
            <stop offset="0%" stopColor="#8C4A28" />
            <stop offset="60%" stopColor="#5A2E17" />
            <stop offset="100%" stopColor="#30150A" />
          </radialGradient>

          {/* Golden Saffron Basmati Gradient */}
          <linearGradient id={`rice-grad-${slug}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF8E7" />
            <stop offset="40%" stopColor="#F5D061" />
            <stop offset="80%" stopColor="#E59929" />
            <stop offset="100%" stopColor="#C45A18" />
          </linearGradient>

          {/* Dough Purdah Seal Gradient */}
          <linearGradient id={`purdah-grad-${slug}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EAD7B2" />
            <stop offset="50%" stopColor="#D2B48C" />
            <stop offset="100%" stopColor="#B38F60" />
          </linearGradient>

          {/* Charcoal smoke filter */}
          <filter id={`smoke-blur-${slug}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Shadow under clay handi */}
        <ellipse cx="120" cy="178" rx="64" ry="12" fill="#000000" fillOpacity="0.6" />

        {/* Clay Pot Base Bowl */}
        <path
          d="M60 115 C58 155 75 174 120 174 C165 174 182 155 180 115 C178 98 174 92 120 92 C66 92 62 98 60 115 Z"
          fill={`url(#pot-grad-${slug})`}
          stroke="#421B0A"
          strokeWidth="2"
        />

        {/* Earthen Handi Handles */}
        <path
          d="M58 118 C46 122 45 136 57 142"
          stroke="#5A2E17"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M182 118 C194 122 195 136 183 142"
          stroke="#5A2E17"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Clay Pot Rim Ring */}
        <ellipse
          cx="120"
          cy="92"
          rx="58"
          ry="15"
          fill="#421B0A"
          stroke="#8C4A28"
          strokeWidth="1.5"
        />

        {/* Steaming Dum Saffron Basmati Rice Mound */}
        <ellipse
          cx="120"
          cy="88"
          rx="53"
          ry="17"
          fill={`url(#rice-grad-${slug})`}
        />

        {/* Texture: Long-grain Basmati Rice Details */}
        <g stroke="#FFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.85">
          <line x1="90" y1="84" x2="100" y2="87" />
          <line x1="105" y1="80" x2="115" y2="82" />
          <line x1="125" y1="82" x2="135" y2="80" />
          <line x1="140" y1="86" x2="150" y2="84" />
          <line x1="82" y1="90" x2="92" y2="92" />
          <line x1="110" y1="90" x2="122" y2="88" />
          <line x1="130" y1="92" x2="142" y2="89" />
          <line x1="96" y1="94" x2="108" y2="92" />
          <line x1="120" y1="96" x2="132" y2="95" />
        </g>

        {/* Fried Browned Onions (Birista) Threads */}
        <g stroke="#612808" strokeWidth="1.4" strokeLinecap="round">
          <path d="M88 88 Q94 85 99 89" />
          <path d="M112 85 Q118 82 124 86" />
          <path d="M136 84 Q142 88 147 83" />
          <path d="M102 92 Q108 96 114 91" />
          <path d="M125 93 Q132 90 138 94" />
        </g>

        {/* Special Dish Element (Meat, Paneer, Egg or Dessert) */}
        {isMutton && (
          <g>
            {/* Tender braised succulent mutton cutlet */}
            <path
              d="M105 82 C102 75 116 70 126 74 C132 77 135 84 125 87 C115 89 107 86 105 82 Z"
              fill="#5B1E16"
              stroke="#8B2A1E"
              strokeWidth="1.5"
            />
            {/* Bone marrow hint with glaze */}
            <circle cx="118" cy="78" r="3.5" fill="#E6D3B3" />
            <circle cx="118" cy="78" r="1.5" fill="#3D120B" />
          </g>
        )}

        {isChicken && (
          <g>
            {/* Roasted juicy chicken drumstick cut */}
            <path
              d="M102 85 C98 76 112 72 128 75 C136 78 134 85 124 88 C112 90 104 89 102 85 Z"
              fill="#A24A1E"
              stroke="#D97706"
              strokeWidth="1.5"
            />
            {/* Glazed spice crackle */}
            <circle cx="115" cy="80" r="2" fill="#E7AA45" />
            <circle cx="123" cy="82" r="1.5" fill="#E7AA45" />
          </g>
        )}

        {isVeg && (
          <g>
            {/* Golden charred paneer cubes & green sweet peas */}
            <rect x="104" y="76" width="13" height="11" rx="2" fill="#FFF9E6" stroke="#D97706" strokeWidth="1" />
            <rect x="122" y="78" width="12" height="10" rx="2" fill="#FFF3CD" stroke="#B45309" strokeWidth="1" />
            <circle cx="98" cy="87" r="3" fill="#10B981" />
            <circle cx="138" cy="85" r="2.8" fill="#10B981" />
            <circle cx="118" cy="90" r="2.5" fill="#10B981" />
          </g>
        )}

        {isEgg && (
          <g>
            {/* Golden pan-seared half farm egg */}
            <ellipse cx="120" cy="81" rx="11" ry="8" fill="#FFFBEB" stroke="#D97706" strokeWidth="1" />
            <ellipse cx="120" cy="81" rx="6.5" ry="5" fill="#F59E0B" />
          </g>
        )}

        {isDessert && (
          <g>
            {/* Ghee-fried shahi bread & silver varq */}
            <polygon points="106,75 130,73 124,88 100,86" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
            <circle cx="116" cy="80" r="2.5" fill="#F3F4F6" />
          </g>
        )}

        {/* Saffron Strands (Grade-A Kesar) */}
        <g stroke="#DC2626" strokeWidth="1.2" strokeLinecap="round">
          <line x1="110" y1="84" x2="114" y2="80" />
          <line x1="124" y1="85" x2="128" y2="82" />
          <line x1="117" y1="89" x2="122" y2="87" />
        </g>

        {/* Fresh Garden Mint Sprig Garnish */}
        <g fill="#15803D" stroke="#14532D" strokeWidth="0.5">
          <ellipse cx="120" cy="72" rx="4" ry="7" transform="rotate(-25 120 72)" />
          <ellipse cx="126" cy="73" rx="4" ry="7" transform="rotate(30 126 73)" />
          <ellipse cx="123" cy="69" rx="3.5" ry="6" />
        </g>

        {/* Wheat Dough "Purdah" (Dum Seal) along the edge */}
        <path
          d="M62 93 Q120 101 178 93"
          stroke={`url(#purdah-grad-${slug})`}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray="1 1"
        />

        {/* Aromatic Dum Steam Vapor rising from seal */}
        <g stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" filter={`url(#smoke-blur-${slug})`}>
          <path d="M100 70 Q92 50 102 32 Q108 20 102 12" />
          <path d="M122 66 Q128 45 120 30 Q115 18 124 10" />
          <path d="M142 70 Q148 52 140 35 Q135 22 142 14" />
        </g>

        {/* Subtle Clay Handi Royal Seal Motif */}
        <circle cx="120" cy="138" r="9" fill="#1C1410" stroke="#E7AA45" strokeWidth="0.8" />
        <path d="M120 133 L120 143 M115 138 L125 138" stroke="#E7AA45" strokeWidth="0.8" />
      </svg>

      {/* Dum Cooking Hours Badge in corner */}
      <div className="absolute bottom-2.5 left-3 text-[11px] font-medium tracking-wider text-[#E7AA45] flex items-center gap-1 bg-[#282017]/85 backdrop-blur-sm px-2.5 py-1 rounded-md border border-[#E7AA45]/20">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E7AA45]" />
        <span>Authentic Earthen Matka</span>
      </div>
    </div>
  );
}
