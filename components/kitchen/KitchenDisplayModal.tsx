'use client';

import React, { useState } from 'react';
import {
  X,
  Flame,
  Clock,
  CheckCircle2,
  Bike,
  PackageCheck,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Filter,
  RefreshCw,
  ChefHat
} from 'lucide-react';

interface KitchenDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface KitchenTicket {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  items: {
    name: string;
    variant: string;
    quantity: number;
    notes?: string;
  }[];
  status: 'CONFIRMED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  prepTimeMinutes: number;
}

const INITIAL_TICKETS: KitchenTicket[] = [
  {
    id: 'k-101',
    orderNumber: 'DUM-849102',
    createdAt: '12 mins ago',
    customerName: 'Pooja Iyer',
    items: [
      {
        name: 'Nizami Gosht Mutton Dum Biryani',
        variant: 'Regular Handi (550g)',
        quantity: 2,
        notes: 'Extra crispy browned onions (birista)',
      },
      {
        name: 'Burani Garlic Raita',
        variant: 'Portion',
        quantity: 2,
      },
    ],
    status: 'CONFIRMED',
    prepTimeMinutes: 25,
  },
  {
    id: 'k-102',
    orderNumber: 'DUM-912845',
    createdAt: '28 mins ago',
    customerName: 'Karthik Raja',
    items: [
      {
        name: 'Royal Awadhi Murgh Chicken Dum Biryani',
        variant: 'Grand Celebration Handi (1100g)',
        quantity: 1,
      },
      {
        name: 'Mirchi Ka Salan',
        variant: 'Portion',
        quantity: 2,
      },
    ],
    status: 'PREPARING',
    prepTimeMinutes: 30,
  },
  {
    id: 'k-103',
    orderNumber: 'DUM-731920',
    createdAt: '42 mins ago',
    customerName: 'Shreya Sengupta',
    items: [
      {
        name: 'Shahi Subz & Malai Paneer Dum Biryani',
        variant: 'Regular Handi (550g)',
        quantity: 1,
        notes: 'Pack salan in separate earthenware',
      },
    ],
    status: 'READY_FOR_PICKUP',
    prepTimeMinutes: 15,
  },
  {
    id: 'k-104',
    orderNumber: 'DUM-654812',
    createdAt: '55 mins ago',
    customerName: 'Farhan Akhtar',
    items: [
      {
        name: 'Daawat-e-Khaas Imperial Feast (Combo)',
        variant: 'Serves 4 - 6',
        quantity: 1,
      },
    ],
    status: 'OUT_FOR_DELIVERY',
    prepTimeMinutes: 40,
  },
];

export default function KitchenDisplayModal({ isOpen, onClose }: KitchenDisplayModalProps) {
  const [tickets, setTickets] = useState<KitchenTicket[]>(INITIAL_TICKETS);
  const [isKitchenAccepting, setIsKitchenAccepting] = useState(true);
  const [filterCategory, setFilterCategory] = useState<'all' | 'mutton' | 'chicken' | 'veg'>('all');

  if (!isOpen) return null;

  const advanceTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          if (t.status === 'CONFIRMED') return { ...t, status: 'PREPARING' };
          if (t.status === 'PREPARING') return { ...t, status: 'READY_FOR_PICKUP' };
          if (t.status === 'READY_FOR_PICKUP') return { ...t, status: 'OUT_FOR_DELIVERY' };
          if (t.status === 'OUT_FOR_DELIVERY') return { ...t, status: 'DELIVERED' };
        }
        return t;
      })
    );
  };

  const getStatusBadge = (status: KitchenTicket['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">New Ticket</span>;
      case 'PREPARING':
        return <span className="bg-orange-100 text-orange-900 px-2 py-0.5 rounded font-bold">In Dum Pit</span>;
      case 'READY_FOR_PICKUP':
        return <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-bold">Sealed & Packed</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="bg-purple-100 text-purple-900 px-2 py-0.5 rounded font-bold">With Rider</span>;
      case 'DELIVERED':
        return <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">Delivered Hot</span>;
    }
  };

  const columns = [
    { title: '1. New Orders', status: 'CONFIRMED', buttonLabel: 'Place on Charcoal' },
    { title: '2. In Dum Pit', status: 'PREPARING', buttonLabel: 'Inspect & Pack Purdah' },
    { title: '3. Sealed & Packed', status: 'READY_FOR_PICKUP', buttonLabel: 'Hand to Rider' },
    { title: '4. Out for Delivery', status: 'OUT_FOR_DELIVERY', buttonLabel: 'Mark Delivered' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-hidden">
      <div
        className="relative w-full max-w-6xl h-[92vh] bg-[#1C1410] text-[#FFFAF2] rounded-3xl shadow-2xl overflow-hidden border border-[#E7AA45]/20 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top KDS Control Bar */}
        <div className="p-4 sm:p-5 bg-[#282017] border-b border-white/10 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#B82F22] text-[#E7AA45] flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-white">Dum & Co. Kitchen Operations (KDS)</h2>
                <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-mono uppercase">
                  Live Dispatch
                </span>
              </div>
              <span className="text-xs text-[#FFFAF2]/60">
                Clay Pot Queue & Dough Seal Inspector
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Kitchen Active Toggle */}
            <button
              onClick={() => setIsKitchenAccepting(!isKitchenAccepting)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                isKitchenAccepting
                  ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300'
                  : 'border-rose-500/40 bg-rose-950/60 text-rose-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isKitchenAccepting ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              <span>{isKitchenAccepting ? 'Kitchen Accepting Orders' : 'Kitchen Paused'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10"
              aria-label="Close KDS"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-Time Kanban Board Grid */}
        <div className="flex-1 p-4 sm:p-6 overflow-x-auto grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#140D0A]">
          {columns.map((col) => {
            const colTickets = tickets.filter((t) => t.status === col.status);

            return (
              <div
                key={col.status}
                className="flex flex-col bg-[#241A14] rounded-2xl border border-white/5 overflow-hidden"
              >
                {/* Column Header */}
                <div className="p-3 bg-[#2D211A] border-b border-white/10 flex items-center justify-between text-xs font-bold text-[#E7AA45]">
                  <span>{col.title}</span>
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white">
                    {colTickets.length}
                  </span>
                </div>

                {/* Tickets Container */}
                <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                  {colTickets.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 rounded-xl bg-[#2F221A] border border-white/10 space-y-3 shadow-md hover:border-[#E7AA45]/40 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-serif font-bold text-sm text-white block">
                            #{t.orderNumber}
                          </span>
                          <span className="text-[10px] text-[#FFFAF2]/50">{t.createdAt}</span>
                        </div>
                        <span className="text-[10px] text-[#E7AA45] font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {t.prepTimeMinutes}m
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-white/80">
                        Guest: {t.customerName}
                      </div>

                      {/* Items */}
                      <div className="p-2.5 rounded-lg bg-black/25 space-y-1.5 text-[11px]">
                        {t.items.map((it, idx) => (
                          <div key={idx} className="space-y-0.5">
                            <div className="flex justify-between font-medium text-white/90">
                              <span>{it.quantity}x {it.name}</span>
                            </div>
                            <span className="text-[10px] text-[#E7AA45]/80 block">{it.variant}</span>
                            {it.notes && (
                              <span className="text-[10px] text-amber-300/80 italic block">
                                Note: &quot;{it.notes}&quot;
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Advance Button */}
                      <button
                        onClick={() => advanceTicket(t.id)}
                        className="w-full py-2 rounded-lg bg-[#B82F22] hover:bg-[#9B2418] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E7AA45]" />
                        <span>{col.buttonLabel}</span>
                      </button>
                    </div>
                  ))}

                  {colTickets.length === 0 && (
                    <div className="p-8 text-center text-xs text-white/30 italic">
                      No tickets currently in this stage.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Audit Bar */}
        <div className="p-3 bg-[#1C1410] border-t border-white/10 flex items-center justify-between text-xs text-white/50 px-6">
          <span>Active Kitchen Dispatch: 4 Stations Connected</span>
          <span>Today&apos;s Dum Handi Count: 38 Baked · 14 Remaining</span>
        </div>
      </div>
    </div>
  );
}
