import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Calendar, 
  Copy, 
  Check, 
  Printer,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { OrderStatus } from '../types';

const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'pending', label: 'অর্ডার গৃহীত' },
  { key: 'processing', label: 'গুদামে গোছানো হচ্ছে' },
  { key: 'shipped', label: 'পরিবহনে / প্রস্তুত' },
  { key: 'delivered', label: 'ডেলিভারড' }
];

export const UserOrdersModal: React.FC = () => {
  const { isOrdersModalOpen, setIsOrdersModalOpen, orders, showToast } = useShop();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOrdersModalOpen) return null;

  const handleCopyTracking = (tracking: string, id: string) => {
    navigator.clipboard.writeText(tracking);
    setCopiedId(id);
    showToast(`ট্র্যাকিং কোড #${tracking} কপি করা হয়েছে`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusIndex = (status: OrderStatus) => {
    if (status === 'pending') return 0;
    if (status === 'processing') return 1;
    if (status === 'shipped' || status === 'ready_for_pickup') return 2;
    if (status === 'delivered') return 3;
    return -1;
  };

  const getStatusBadgeLabel = (status: OrderStatus) => {
    if (status === 'pending') return 'পেন্ডিং';
    if (status === 'processing') return 'প্রসেসিং';
    if (status === 'shipped') return 'পাঠানো হয়েছে (Shipped)';
    if (status === 'ready_for_pickup') return 'পিকআপের জন্য প্রস্তুত';
    if (status === 'delivered') return 'ডেলিভারড';
    return status;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">মেশিনারি অর্ডার ও শিপমেন্ট ট্র্যাকিং</h3>
              <p className="text-xs text-slate-400">
                ভারী যন্ত্রাংশের শিপমেন্ট ট্র্যাকিং, অর্ডার প্রসেসিং ও রসিদ দেখুন
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOrdersModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((ord) => {
                const currentStepIdx = getStatusIndex(ord.status);
                const isSelected = selectedOrderId === ord.id;

                return (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-750 transition space-y-4"
                  >
                    {/* Order Top Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-extrabold text-sm text-blue-400">
                          {ord.id}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : ord.status === 'shipped' || ord.status === 'ready_for_pickup'
                              ? 'bg-blue-950 text-blue-300 border border-blue-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {getStatusBadgeLabel(ord.status)}
                        </span>

                        <span className="text-sm font-extrabold text-white">
                          ₹ {ord.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Tracking Progress Timeline */}
                    <div className="py-2">
                      <div className="grid grid-cols-4 gap-1 relative">
                        {STATUS_STEPS.map((step, idx) => {
                          const isDone = currentStepIdx >= idx;
                          const isCurrent = currentStepIdx === idx;
                          return (
                            <div key={step.key} className="text-center space-y-1 relative">
                              <div
                                className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] font-bold transition ${
                                  isDone
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-slate-800 text-slate-500'
                                }`}
                              >
                                {isDone ? '✓' : idx + 1}
                              </div>
                              <span
                                className={`block text-[10px] font-semibold ${
                                  isCurrent ? 'text-blue-400' : isDone ? 'text-slate-300' : 'text-slate-500'
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tracking Info / Address */}
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Truck className="w-4 h-4 text-blue-400" />
                        <span>
                          ট্র্যাকিং নম্বর:{' '}
                          <strong className="font-mono text-white">{ord.trackingNumber || 'পেন্ডিং'}</strong>
                        </span>
                        {ord.trackingNumber && (
                          <button
                            onClick={() => handleCopyTracking(ord.trackingNumber!, ord.id)}
                            className="text-slate-400 hover:text-white p-1"
                            title="কোড কপি করুন"
                          >
                            {copiedId === ord.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400">
                        ডেলিভারি পদ্ধতি: <strong className="text-slate-200 capitalize">{ord.fulfillmentType === 'delivery' ? 'হোম ডেলিভারি' : 'দোকান থেকে পিকআপ'}</strong>
                      </div>
                    </div>

                    {/* Items Purchased List */}
                    <div className="space-y-1.5 pt-1">
                      {ord.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/40 p-2 rounded-lg"
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={item.imageUrl}
                              alt={item.partName}
                              className="w-8 h-8 rounded object-contain p-0.5 bg-slate-950"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="font-medium text-white line-clamp-1">{item.partName}</div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                OEM #{item.oemNumber} • পরিমাণ: {item.quantity} টি
                              </div>
                            </div>
                          </div>
                          <span className="font-bold text-white">
                            ₹ {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                <Package className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-sm">কোনো অর্ডার পাওয়া যায়নি</h4>
              <p className="text-xs text-slate-400">
                আপনি এখনও কোনো স্পেয়ার পার্টস অর্ডার করেননি।
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={() => setIsOrdersModalOpen(false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            বন্ধ করুন
          </button>
        </div>
      </motion.div>
    </div>
  );
};
