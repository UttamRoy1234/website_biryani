'use client';

import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

interface ReviewItem {
  id: string;
  name: string;
  location: string;
  dishOrdered: string;
  rating: number;
  date: string;
  comment: string;
}

const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-01',
    name: 'Kavita Sundaram',
    location: 'Indiranagar',
    dishOrdered: 'Nizami Gosht Mutton Dum Biryani (Grand Handi)',
    rating: 5,
    date: 'Yesterday',
    comment:
      'Cracking open the dough seal at our dining table filled the entire room with real saffron and cardamom aroma. The mutton was so tender it slipped off the bone without effort. The clay pot kept it steaming hot.',
  },
  {
    id: 'rev-02',
    name: 'Zubair Farooqui',
    location: 'Koramangala',
    dishOrdered: 'Royal Awadhi Murgh Chicken Dum Biryani',
    rating: 5,
    date: '3 days ago',
    comment:
      'Reminded me of the wedding feasts in Lucknow. The long-grain rice is separate, aromatic, and not drenched in excess oil. Mirchi ka salan is legitimately authentic.',
  },
  {
    id: 'rev-03',
    name: 'Rohit Shenoy',
    location: 'HSR Layout',
    dishOrdered: 'Shahi Subz & Malai Paneer Dum Biryani',
    rating: 5,
    date: '5 days ago',
    comment:
      'Most places treat veg biryani as an afterthought. Dum & Co uses fresh malai paneer with real saffron milk. Even my die-hard non-veg friends took seconds.',
  },
];

export default function ReviewsSection() {
  return (
    <section id="reviews-section" className="py-16 bg-white border-b border-[#282017]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B82F22]">
            <span>Guest Experiences</span>
            <span aria-hidden="true">·</span>
            <span>Verified Orders</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#282017]">
            Soul-approved by biryani connoisseurs.
          </h2>

          <p className="text-xs sm:text-sm text-[#282017]/70">
            Real feedback from diners who tore open our clay handi purdah seals this week.
          </p>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-[#FFFAF2] border border-[#282017]/10 flex flex-col justify-between space-y-4 shadow-xs hover:border-[#E7AA45]/50 transition-colors"
            >
              <div className="space-y-3">
                {/* Rating & Verified Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#E7AA45]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Verified Order
                  </span>
                </div>

                {/* Dish Ordered Tag */}
                <div className="text-[11px] font-medium text-[#B82F22] italic">
                  Ordered: {rev.dishOrdered}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-[#282017]/80 leading-relaxed font-normal">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* Author & Timestamp */}
              <div className="pt-3 border-t border-[#282017]/10 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#282017] block">{rev.name}</span>
                  <span className="text-[11px] text-[#282017]/60">{rev.location}</span>
                </div>
                <span className="text-[11px] text-[#282017]/50">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
