'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Sparkles, X, Flame, User, LogOut, ChefHat, Receipt } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

interface HeaderProps {
  onSearchClick?: () => void;
  onOpenDashboard?: () => void;
  onOpenKDS?: () => void;
}

export default function Header({ onSearchClick, onOpenDashboard, onOpenKDS }: HeaderProps) {
  const { totalItemsCount, openCart } = useCart();
  const { user, openAuthModal, logout } = useAuth();
  const [showPromoBar, setShowPromoBar] = useState(true);

  return (
    <div className="sticky top-0 z-40 w-full bg-[#FFFAF2]/95 backdrop-blur-md border-b border-[#282017]/10 transition-all">
      {/* 1. Promotional Announcement Bar */}
      {showPromoBar && (
        <aside aria-label="Special Offers" className="bg-[#B82F22] text-[#FFFAF2] text-xs font-medium py-1.5 px-4 tracking-wide relative">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center pr-6">
            <Sparkles className="w-3.5 h-3.5 text-[#E7AA45] shrink-0" />
            <span>
              Authentic Dum Handis sealed in clay. Use code <strong className="text-[#E7AA45] underline decoration-[#E7AA45]/50 font-bold">FIRSTDUM</strong> for 20% off. Complimentary delivery above ₹799.
            </span>
          </div>
          <button
            onClick={() => setShowPromoBar(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FFFAF2]/80 hover:text-white p-1"
            aria-label="Dismiss promotion banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* 2. Top Bar Contract: Zone 1 (Brand) — Zone 2 (4–5 Nav links) — Zone 3 (Primary Action / Cart) */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <Link 
          href="/" 
          className="font-serif text-2xl font-bold tracking-tight text-[#282017] whitespace-nowrap shrink-0 flex items-center gap-2 group"
        >
          <span className="w-8 h-8 rounded-full bg-[#B82F22] text-[#E7AA45] flex items-center justify-center transition-transform group-hover:scale-105">
            <Flame className="w-4 h-4 fill-current" />
          </span>
          <span>DUM & CO.</span>
        </Link>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#282017]/80">
          <a
            href="#menu-section"
            className="hover:text-[#B82F22] transition-colors whitespace-nowrap shrink-0"
          >
            Menu
          </a>
          <a
            href="#dum-heritage"
            className="hover:text-[#B82F22] transition-colors whitespace-nowrap shrink-0"
          >
            Dum Heritage
          </a>
          <a
            href="#feasts-combos"
            className="hover:text-[#B82F22] transition-colors whitespace-nowrap shrink-0"
          >
            Handi Feasts
          </a>
          <a
            href="#reviews-section"
            className="hover:text-[#B82F22] transition-colors whitespace-nowrap shrink-0"
          >
            Reviews
          </a>
          {onOpenKDS && (
            <button
              onClick={onOpenKDS}
              className="text-[#B82F22] hover:text-[#9B2418] font-semibold flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <ChefHat className="w-4 h-4" />
              <span>Kitchen (KDS)</span>
            </button>
          )}
        </nav>

        {/* Zone 3: 1 primary action / Cart Trigger */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {onSearchClick && (
            <button
              onClick={onSearchClick}
              className="text-[#282017]/70 hover:text-[#B82F22] p-1.5 transition-colors"
              aria-label="Search dishes"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          {/* Account / Dashboard Trigger */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenDashboard}
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#282017] hover:text-[#B82F22] px-2.5 py-1.5 rounded-lg bg-[#282017]/5 transition-colors"
                title="Customer Account Dashboard"
              >
                <User className="w-3.5 h-3.5" />
                <span>{user.first_name || user.email.split('@')[0]}</span>
              </button>
              <button
                onClick={logout}
                className="text-[#282017]/60 hover:text-[#B82F22] p-1.5 transition-colors"
                title="Sign Out"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#282017] hover:text-[#B82F22] transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile KDS Icon Button */}
          {onOpenKDS && (
            <button
              onClick={onOpenKDS}
              className="md:hidden text-[#B82F22] p-1.5 transition-colors"
              title="Kitchen Display System"
              aria-label="Open KDS"
            >
              <ChefHat className="w-5 h-5" />
            </button>
          )}

          {/* Handi Cart Action Button */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#282017] text-[#FFFAF2] hover:bg-[#B82F22] transition-colors text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 shadow-sm"
            aria-label={`View shopping cart with ${totalItemsCount} items`}
          >
            <ShoppingBag className="w-4 h-4 text-[#E7AA45]" />
            <span className="hidden md:inline">Handi Cart</span>
            {totalItemsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#B82F22] text-[#FFFAF2] text-xs font-bold flex items-center justify-center border-2 border-[#282017]">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </header>
    </div>
  );
}
