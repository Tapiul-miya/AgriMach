import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Wrench, 
  ShoppingCart, 
  Sparkles, 
  Package, 
  ShieldCheck, 
  Store, 
  PlusCircle,
  HelpCircle,
  Share2,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppIcon } from './AppIcon';

export const Navbar: React.FC = () => {
  const {
    mode,
    setMode,
    setIsCartOpen,
    cartTotalCount,
    cartSubtotal,
    setIsDiagnosticOpen,
    setIsOrdersModalOpen,
    orders,
    setIsPartFormOpen,
    setEditingPart,
    setIsSpecialRequestOpen,
    setIsShareModalOpen,
  } = useShop();

  const handleOpenShare = () => {
    setIsShareModalOpen(true);
  };

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'processing' || o.status === 'ready_for_pickup' || o.status === 'shipped'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg relative">
      {/* Top Utility Bar */}
      <div className="hidden sm:flex bg-slate-950 px-4 py-1.5 text-xs text-slate-400 border-b border-slate-800/80 items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            ট্র্যাক্টর, জেসিবি এবং হার্ভেস্টার স্পেয়ার্স হাব • একই দিনে ডিপো থেকে এক্সপ্রেস ডেলিভারি
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden lg:inline text-slate-400">
            OEM হেভি মেশিনারী এবং কৃষি যন্ত্রাংশ
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            id="top-share-app-btn"
            onClick={handleOpenShare}
            className="text-slate-300 hover:text-amber-300 transition flex items-center gap-1.5 text-xs group"
            title="অ্যাপটি বন্ধুদের সাথে শেয়ার করুন"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition" />
            <span>অ্যাপ শেয়ার করুন</span>
          </button>
          <span className="text-slate-600">•</span>
          <button 
            onClick={() => setIsSpecialRequestOpen(true)}
            className="text-slate-300 hover:text-white transition flex items-center gap-1 text-xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>বিশেষ পার্টস সোর্সিং</span>
          </button>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">সহায়তা: 1-800-AGRI-PARTS</span>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-md shadow-amber-500/20 border border-amber-500/30 flex items-center justify-center bg-slate-950">
            <AppIcon className="w-full h-full" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-black text-sm sm:text-lg tracking-tight bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent">
                AgriMach
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hidden sm:inline-block">
                HEAVY SPARES
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 hidden md:block">
              ট্র্যাক্টর, জেসিবি এবং হার্ভেস্টার পার্টস
            </p>
          </div>
        </div>

        {/* Center: Vehicle Fitment Selector & Diagnostic Shortcut (Desktop/Tablet) */}
        <div className="hidden md:flex items-center gap-2 flex-1 justify-center max-w-md">
          {mode === 'user' ? null : (
            /* Admin quick action */
            <div className="flex items-center gap-2">
              <button
                id="admin-add-part-nav-btn"
                onClick={() => {
                  setEditingPart(null);
                  setIsPartFormOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-900/40 transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>নতুন পার্ট SKU যোগ করুন</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Section: Share + Mode Toggle + Cart / Orders */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Share Button on AppBar */}
          <button
            id="appbar-share-btn"
            onClick={handleOpenShare}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-750 hover:border-amber-500/40 bg-slate-800/90 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-semibold transition shadow-sm group"
            title="অ্যাপটি বন্ধুদের সাথে শেয়ার করুন"
            aria-label="Share App"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 group-hover:scale-110 transition" />
            <span className="hidden sm:inline text-[11px] sm:text-xs">শেয়ার করুন</span>
          </button>

          {/* Mode Switcher Pill */}
          <div className="bg-slate-950 p-0.5 sm:p-1 rounded-xl border border-slate-800 flex items-center text-xs shrink-0">
            <button
              id="mode-user-btn"
              onClick={() => setMode('user')}
              className={`flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                mode === 'user'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">স্টোর</span>
            </button>
            <button
              id="mode-admin-btn"
              onClick={() => setMode('admin')}
              className={`flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                mode === 'admin'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">অ্যাডমিন</span>
            </button>
          </div>

          {/* User Orders modal trigger (Desktop) */}
          {mode === 'user' && (
            <button
              id="user-orders-btn"
              onClick={() => setIsOrdersModalOpen(true)}
              className="hidden sm:flex relative p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white transition"
              title="আমার অর্ডার এবং ট্র্যাকিং"
            >
              <Package className="w-4 h-4" />
              {activeOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  {activeOrdersCount}
                </span>
              )}
            </button>
          )}

          {/* Cart Drawer Trigger */}
          {mode === 'user' && (
            <button
              id="cart-drawer-trigger-btn"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition min-h-[36px]"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartTotalCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-emerald-800 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {cartTotalCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                ₹ {cartSubtotal.toFixed(2)}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
