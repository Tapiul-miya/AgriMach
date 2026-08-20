import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Store, 
  Truck, 
  Sparkles, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  PlusCircle,
  Wrench,
  Check
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    mode,
    activeVehicle,
    setIsGarageModalOpen,
    setIsDiagnosticOpen,
    setIsOrdersModalOpen,
    setIsCartOpen,
    setIsPartFormOpen,
    cartTotalCount,
    orders,
    adminTab,
    setAdminTab,
    setSelectedCategory,
    setSearchQuery
  } = useShop();

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'processing'
  ).length;

  const handleGoToStore = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] px-2 py-1 pb-[max(0.35rem,env(safe-area-inset-bottom))]"
    >
      {mode === 'user' ? (
        <div className="grid grid-cols-3 gap-1 items-center max-w-lg mx-auto">
          {/* 1. Store / Catalog */}
          <button
            onClick={handleGoToStore}
            className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 active:scale-95 transition min-h-[50px]"
          >
            <Store className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-semibold tracking-tight mt-0.5">ক্যাটালগ</span>
          </button>

          {/* 2. Orders */}
          <button
            onClick={() => setIsOrdersModalOpen(true)}
            className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 active:scale-95 transition min-h-[50px] relative"
          >
            <div className="relative">
              <Package className="w-5 h-5 text-amber-400" />
              {orders.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 text-[9px] font-black px-1 rounded-full min-w-[14px] text-center leading-tight">
                  {orders.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold tracking-tight mt-0.5">অর্ডার</span>
          </button>

          {/* 3. Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 active:scale-95 transition min-h-[50px] relative"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-amber-400" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 rounded-full min-w-[16px] text-center leading-tight shadow-sm">
                  {cartTotalCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold tracking-tight mt-0.5">কার্ট</span>
          </button>
        </div>
      ) : (
        /* Admin Mode Bottom Nav */
        <div className="grid grid-cols-5 gap-1 items-center max-w-lg mx-auto">
          {/* Inventory */}
          <button
            onClick={() => setAdminTab('inventory')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition min-h-[50px] ${
              adminTab === 'inventory'
                ? 'text-amber-400 bg-amber-950/50 font-bold border border-amber-800/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">স্টক</span>
          </button>

          {/* Orders */}
          <button
            onClick={() => setAdminTab('orders')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition min-h-[50px] relative ${
              adminTab === 'orders'
                ? 'text-amber-400 bg-amber-950/50 font-bold border border-amber-800/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {pendingOrdersCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 text-[9px] font-black px-1 rounded-full min-w-[14px] text-center">
                  {pendingOrdersCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">অর্ডার</span>
          </button>

          {/* AI Forecast (Center Action) */}
          <button
            onClick={() => setAdminTab('ai-forecaster')}
            className={`flex flex-col items-center justify-center -mt-2 group active:scale-95 transition min-h-[54px]`}
          >
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition shadow-md ${
                adminTab === 'ai-forecaster'
                  ? 'bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-amber-600/40 ring-2 ring-amber-400'
                  : 'bg-slate-800 text-amber-400 border border-slate-700'
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-300 mt-0.5">AI ফোরকাস্ট</span>
          </button>

          {/* Suppliers */}
          <button
            onClick={() => setAdminTab('suppliers')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition min-h-[50px] ${
              adminTab === 'suppliers'
                ? 'text-amber-400 bg-amber-950/50 font-bold border border-amber-800/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Truck className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">সরবরাহকারী</span>
          </button>

          {/* Add SKU */}
          <button
            onClick={() => setIsPartFormOpen(true)}
            className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/60 active:scale-95 transition min-h-[50px]"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-[10px] font-bold tracking-tight mt-0.5">SKU যুক্ত করুন</span>
          </button>
        </div>
      )}
    </nav>
  );
};
