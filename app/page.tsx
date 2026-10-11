'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Hero from '@/components/home/Hero';
import MenuSection from '@/components/menu/MenuSection';
import CombosSection from '@/components/home/CombosSection';
import HeritageSection from '@/components/home/HeritageSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import Footer from '@/components/layout/Footer';
import ProductModal from '@/components/catalog/ProductModal';
import CartDrawer from '@/components/cart/CartDrawer';
import SearchModal from '@/components/layout/SearchModal';
import FastCheckoutModal from '@/components/checkout/FastCheckoutModal';
import OrderTrackerModal from '@/components/orders/OrderTrackerModal';
import AuthModal from '@/components/auth/AuthModal';
import CustomerDashboardModal from '@/components/account/CustomerDashboardModal';
import KitchenDisplayModal from '@/components/kitchen/KitchenDisplayModal';
import { Product } from '@/types/catalog';

export default function StorefrontHomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<any | null>(null);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isKDSOpen, setIsKDSOpen] = useState(false);

  const handleOpenDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  const handleProceedToCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (orderData: any) => {
    setActiveOrder(orderData);
  };

  const handleTrackHistoricalOrder = (orderData: any) => {
    setActiveOrder(orderData);
  };

  return (
    <div className="min-h-screen bg-[#FFFAF2] text-[#282017] flex flex-col font-sans selection:bg-[#B82F22] selection:text-white">
      {/* 1. Header with Top Bar Contract */}
      <Header
        onSearchClick={() => setIsSearchOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenKDS={() => setIsKDSOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Featured Menu & Portions */}
        <MenuSection onOpenDetails={handleOpenDetails} />

        {/* 4. Imperial Feasts & Combos */}
        <CombosSection onOpenDetails={handleOpenDetails} />

        {/* 5. The Dum Heritage & Craftsmanship */}
        <HeritageSection />

        {/* 6. Verified Customer Reviews */}
        <ReviewsSection />
      </main>

      {/* 7. Complete Editorial Footer */}
      <Footer />

      {/* Interactive Overlays */}
      {/* Slide-over Cart Drawer */}
      <CartDrawer onProceedToCheckout={handleProceedToCheckout} />

      {/* Product Detail Modal */}
      <ProductModal product={selectedProduct} onClose={handleCloseDetails} />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpenDetails={handleOpenDetails}
      />

      {/* Authentication Modal */}
      <AuthModal />

      {/* Customer Account Dashboard Modal */}
      <CustomerDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        onTrackOrder={handleTrackHistoricalOrder}
      />

      {/* Kitchen Display Operations (KDS) Modal */}
      <KitchenDisplayModal
        isOpen={isKDSOpen}
        onClose={() => setIsKDSOpen(false)}
      />

      {/* Checkout Modal */}
      <FastCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Live Order Tracker Modal */}
      {activeOrder && (
        <OrderTrackerModal
          orderData={activeOrder}
          onClose={() => setActiveOrder(null)}
        />
      )}
    </div>
  );
}
