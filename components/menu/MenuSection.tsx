'use client';

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, RotateCcw, Flame } from 'lucide-react';
import { CategoryId, DietaryPreference, Product } from '@/types/catalog';
import { PRODUCTS } from '@/lib/mock-catalog';
import ProductCard from '@/components/catalog/ProductCard';

interface MenuSectionProps {
  onOpenDetails: (product: Product) => void;
}

const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'all', label: 'All Handis' },
  { id: 'mutton', label: 'Mutton Handi' },
  { id: 'chicken', label: 'Chicken Handi' },
  { id: 'veg', label: 'Vegetarian Dum' },
  { id: 'egg', label: 'Egg Biryani' },
  { id: 'combos', label: 'Royal Feasts' },
  { id: 'accompaniments', label: 'Sides & Desserts' },
];

export default function MenuSection({ onOpenDetails }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | DietaryPreference>('all');
  const [spiceFilter, setSpiceFilter] = useState<'all' | 'mild' | 'medium' | 'spicy'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'dum-time'>('recommended');

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // Dietary filter
      if (dietaryFilter !== 'all' && item.dietary !== dietaryFilter) {
        return false;
      }

      // Spice filter
      if (spiceFilter === 'mild' && item.spiceLevel > 2) return false;
      if (spiceFilter === 'medium' && item.spiceLevel !== 3) return false;
      if (spiceFilter === 'spicy' && item.spiceLevel < 4) return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchSubtitle = item.subtitle.toLowerCase().includes(query);
        const matchIngredients = item.ingredients.some((i) => i.toLowerCase().includes(query));
        if (!matchName && !matchSubtitle && !matchIngredients) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.variants[0].price - b.variants[0].price;
      }
      if (sortBy === 'price-desc') {
        return b.variants[0].price - a.variants[0].price;
      }
      if (sortBy === 'dum-time') {
        return b.dumCookingHours - a.dumCookingHours;
      }
      // Recommended default
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      return 0;
    });
  }, [activeCategory, dietaryFilter, spiceFilter, searchQuery, sortBy]);

  const resetFilters = () => {
    setActiveCategory('all');
    setDietaryFilter('all');
    setSpiceFilter('all');
    setSearchQuery('');
    setSortBy('recommended');
  };

  return (
    <section id="menu-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B82F22]">
            <span>Freshly Baked Today</span>
            <span aria-hidden="true">·</span>
            <span>Artisanal Handis</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#282017]">
            The Dum & Co. Menu
          </h2>
          <p className="text-sm text-[#282017]/70 max-w-xl">
            Each handi is sealed with dough and cooked in natural earthenware over gentle charcoal embers. Served with complimentary gravy and raita.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#282017]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search biryani or spices..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#282017]/15 text-sm text-[#282017] placeholder-[#282017]/40 focus:outline-none focus:ring-2 focus:ring-[#B82F22]/20 focus:border-[#B82F22]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#282017]/50 hover:text-[#282017]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Segmented Control Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#282017]/10">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#282017] text-[#FFFAF2] shadow-sm'
                  : 'text-[#282017]/70 hover:text-[#282017] hover:bg-[#282017]/5'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Secondary Controls: Dietary, Spice, and Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#282017]/10 text-xs">
        {/* Dietary Filters */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#282017]/60">Dietary:</span>
          <button
            onClick={() => setDietaryFilter('all')}
            className={`px-3 py-1 rounded-md transition-colors ${
              dietaryFilter === 'all'
                ? 'bg-[#282017]/10 font-bold text-[#282017]'
                : 'text-[#282017]/60 hover:text-[#282017]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setDietaryFilter('veg')}
            className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
              dietaryFilter === 'veg'
                ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300'
                : 'text-[#282017]/60 hover:text-[#282017]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            Pure Veg
          </button>
          <button
            onClick={() => setDietaryFilter('non-veg')}
            className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
              dietaryFilter === 'non-veg'
                ? 'bg-rose-50 text-rose-800 font-bold border border-rose-300'
                : 'text-[#282017]/60 hover:text-[#282017]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#B82F22]" />
            Non-Veg
          </button>
        </div>

        {/* Spice Level Filter */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#282017]/60">Spice:</span>
          <select
            value={spiceFilter}
            onChange={(e) => setSpiceFilter(e.target.value as any)}
            className="bg-[#FFFAF2] border border-[#282017]/15 rounded-md px-2.5 py-1 text-xs text-[#282017] focus:outline-none"
          >
            <option value="all">Any Spice</option>
            <option value="mild">Mild & Royal</option>
            <option value="medium">Medium Spiced</option>
            <option value="spicy">Fiery Andhra</option>
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#282017]/60">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#FFFAF2] border border-[#282017]/15 rounded-md px-2.5 py-1 text-xs text-[#282017] focus:outline-none"
          >
            <option value="recommended">Chef&apos;s Recommendation</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="dum-time">Dum Cooking Duration</option>
          </select>
        </div>
      </div>

      {/* Product Grid: 3 columns desktop, 2 tablet, 1 mobile */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white border border-[#282017]/10 space-y-4">
          <p className="font-serif text-lg text-[#282017]">No biryani dishes match your selected filters.</p>
          <p className="text-xs text-[#282017]/60">
            Try resetting your search query or adjusting your dietary preferences.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#282017] text-[#FFFAF2] text-xs font-semibold hover:bg-[#B82F22] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
}
