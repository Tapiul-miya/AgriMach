import React, { useState } from 'react';
import { SparePart } from '../types';
import { useShop } from '../context/ShopContext';
import { 
  Check, 
  ShoppingCart, 
  Copy, 
  Info, 
  Star, 
  MapPin, 
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PartCardProps {
  part: SparePart;
}

export const PartCard: React.FC<PartCardProps> = ({ part }) => {
  const { 
    addToCart, 
    setInspectedPart, 
    showToast 
  } = useShop();

  const [copied, setCopied] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const hasMultipleImages = part.imageUrls && part.imageUrls.length > 1;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null || !part.imageUrls || part.imageUrls.length <= 1) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Check if primarily horizontal swipe
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (e.cancelable) {
        e.preventDefault();
      }
      e.stopPropagation();
      if (diffX > 0) {
        // Swipe left -> Next
        setCurrentImgIdx((prev) => (prev + 1) % part.imageUrls!.length);
      } else {
        // Swipe right -> Prev
        setCurrentImgIdx((prev) => (prev - 1 + part.imageUrls!.length) % part.imageUrls!.length);
      }
    }
    
    setTouchStartX(null);
    setTouchStartY(null);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!part.imageUrls) return;
    setCurrentImgIdx((prev) => (prev + 1) % part.imageUrls!.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!part.imageUrls) return;
    setCurrentImgIdx((prev) => (prev - 1 + part.imageUrls!.length) % part.imageUrls!.length);
  };

  const handleCopyOEM = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(part.oemNumber);
    setCopied(true);
    showToast(`OEM #${part.oemNumber} ক্লিপবোর্ডে কপি করা হয়েছে`);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLowStock = part.stockQuantity > 0 && part.stockQuantity <= part.minStockThreshold;
  const isOutOfStock = part.stockQuantity <= 0;

  const getConditionLabel = (cond: string) => {
    if (cond.includes('OEM Genuine')) return 'নতুন - OEM আসল';
    if (cond.includes('Aftermarket')) return 'নতুন - প্রিমিয়াম আফটারমার্কেট';
    if (cond.includes('Remanufactured')) return 'রিম্যানুফ্যাকচার্ড OEM';
    return cond;
  };

  const getCategoryLabel = (cat: string) => {
    const mapping: Record<string, string> = {
      all: 'সব পার্টস ও স্পেয়ার্স',
      tractor: 'ট্র্যাক্টর (Tractor)',
      harvester: 'হার্ভেস্টার (Harvester)',
      jcb: 'জেসিবি (JCB)'
    };
    return mapping[cat] || cat;
  };

  return (
    <div 
      onClick={() => setInspectedPart(part)}
      className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 flex flex-col group cursor-pointer text-slate-100"
    >
      {/* Top Image & Badges */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative h-44 bg-slate-950 overflow-hidden select-none touch-pan-y"
      >
        {/* Blurred background image for full bleed aesthetic (no cropping, full width) */}
        <img
          src={
            part.imageUrls && part.imageUrls.length > 0
              ? part.imageUrls[currentImgIdx] || part.imageUrl
              : part.imageUrl
          }
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-105 pointer-events-none"
          referrerPolicy="no-referrer"
        />

        <AnimatePresence mode="wait">
          <motion.img
            key={currentImgIdx}
            src={
              part.imageUrls && part.imageUrls.length > 0
                ? part.imageUrls[currentImgIdx] || part.imageUrl
                : part.imageUrl
            }
            alt={part.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 group-hover:opacity-100"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40 pointer-events-none"></div>

        {/* Arrow Overlays for Multiple Images on Hover */}
        {hasMultipleImages && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/60 hover:bg-black/80 border border-slate-700 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
              title="পূর্ববর্তী ছবি"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/60 hover:bg-black/80 border border-slate-700 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
              title="পরবর্তী ছবি"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-2 right-2.5 flex gap-1 z-10 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-full border border-slate-800">
              {part.imageUrls!.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    currentImgIdx === idx ? 'bg-amber-400 scale-110' : 'bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Brand Tag Top Left */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          {part.brand && (
            <span className="px-2 py-0.5 rounded-md bg-slate-900/90 backdrop-blur-md text-[11px] font-bold text-white border border-slate-700 shadow">
              {part.brand}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md bg-amber-950/80 backdrop-blur-md text-[10px] uppercase font-semibold text-amber-300 border border-amber-700/50">
            {getCategoryLabel(part.category)}
          </span>
        </div>

        {/* Condition Tag Bottom Left */}
        <div className="absolute bottom-2 left-2.5 z-10">
          <span className="text-[10px] text-slate-300 font-medium px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
            {getConditionLabel(part.condition)}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* OEM Number Row */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 font-mono text-[11px]">
              OEM: <strong className="text-slate-200">{part.oemNumber}</strong>
            </span>
            <button
              onClick={handleCopyOEM}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px] p-1 rounded hover:bg-slate-800 transition"
              title="OEM পার্ট নম্বর কপি করুন"
            >
              {copied ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
            </button>
          </div>

          {/* Part Name */}
          <h4 className="font-bold text-sm text-white group-hover:text-amber-400 transition line-clamp-2 leading-snug">
            {part.name}
          </h4>

          {/* Warehouse Location & Ratings */}
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{part.rating.toFixed(1)}</span>
              <span className="text-slate-500 font-normal">({part.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <MapPin className="w-3 h-3 text-slate-500" />
              <span>{part.warehouseLocation.split('-')[0]}</span>
            </div>
          </div>
        </div>

        {/* Stock & Pricing Footer */}
        <div className="pt-3 border-t border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            {/* Stock status */}
            <div>
              {isOutOfStock ? (
                <span className="text-[11px] font-bold text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-800/40">
                  স্টকে নেই
                </span>
              ) : isLowStock ? (
                <span className="text-[11px] font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                  মাত্র {part.stockQuantity} টি বাকি আছে
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  স্টকে আছে ({part.stockQuantity} টি)
                </span>
              )}
            </div>

            {/* Price */}
            <div className="text-right">
              <span className="text-lg font-extrabold text-white">
                ₹ {part.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setInspectedPart(part);
              }}
              className="py-1.5 px-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border border-slate-700 transition"
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>টেকনিক্যাল স্পেক্স</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(part, 1);
              }}
              disabled={isOutOfStock}
              className={`py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition shadow-sm ${
                isOutOfStock
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>কার্টে যোগ করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
