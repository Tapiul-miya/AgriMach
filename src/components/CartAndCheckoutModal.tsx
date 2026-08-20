import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Trash2, 
  ShoppingCart, 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  Store, 
  CreditCard, 
  Banknote, 
  Building2, 
  ShieldCheck, 
  Printer,
  ChevronLeft,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Order } from '../types';

export const CartAndCheckoutModal: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    cartTotalCount,
    activeVehicle,
    createOrder,
    showToast
  } = useShop();

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>('delivery');
  const [customerName, setCustomerName] = useState('Rahul Sharma');
  const [customerEmail, setCustomerEmail] = useState('rahul.sharma@example.com');
  const [customerPhone, setCustomerPhone] = useState('+91 9876543210');
  const [street, setStreet] = useState('12, গ্রিন পার্ক অ্যাভিনিউ');
  const [city, setCity] = useState('কলকাতা');
  const [state, setState] = useState('পশ্চিমবঙ্গ');
  const [zip, setZip] = useState('700001');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'cash_on_delivery' | 'bank_transfer'>('credit_card');
  const [orderNotes, setOrderNotes] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isCartOpen) return null;

  const shippingFee = fulfillmentType === 'delivery' ? (cartSubtotal > 10000 ? 0 : 250) : 0;
  const tax = cartSubtotal * 0.18; // 18% GST standard in India
  const grandTotal = cartSubtotal + shippingFee + tax;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !customerEmail || !customerPhone) {
      showToast('দয়া করে আপনার যোগাযোগের তথ্য পূরণ করুন।');
      return;
    }

    if (fulfillmentType === 'delivery' && (!street || !city || !state || !zip)) {
      showToast('দয়া করে আপনার সম্পূর্ণ ডেলিভারি ঠিকানা পূরণ করুন।');
      return;
    }

    const newOrder = createOrder({
      customerName,
      customerEmail,
      customerPhone,
      items: cart.map(item => ({
        partId: item.part.id,
        partName: item.part.name,
        oemNumber: item.part.oemNumber,
        brand: item.part.brand,
        price: item.part.price,
        quantity: item.quantity,
        imageUrl: item.part.imageUrl
      })),
      subtotal: cartSubtotal,
      shippingFee,
      tax,
      total: grandTotal,
      fulfillmentType,
      shippingAddress: fulfillmentType === 'delivery' ? { street, city, state, zip } : undefined,
      paymentMethod,
      notes: orderNotes || undefined,
      vehicleDetails: activeVehicle ? `${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}` : undefined
    });

    setCompletedOrder(newOrder);
    setStep('success');

    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-lg bg-slate-900 border-l border-slate-800 text-slate-100 h-full flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                onClick={() => setStep('cart')}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white mr-1 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {step === 'cart' && `শপিং কার্ট (${cartTotalCount} টি পার্টস)`}
                {step === 'checkout' && 'মেশিনারি পার্টস চেকআউট'}
                {step === 'success' && 'অর্ডার নিশ্চিত হয়েছে!'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {step === 'cart' && 'যন্ত্রাংশ এবং ফিটমেন্ট রিভিউ করুন'}
                {step === 'checkout' && 'ডেলিভারি এবং পেমেন্ট সিলেক্ট করুন'}
                {step === 'success' && `রসিদ নম্বর #${completedOrder?.id}`}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsCartOpen(false);
              setStep('cart');
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: CART ITEMS */}
          {step === 'cart' && (
            <>
              {cart.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {cart.map((item) => {
                      const part = item.part;
                      const fitsActive = !activeVehicle || part.isUniversal || part.compatibleVehicles.some(
                        (c) =>
                          c.make.toLowerCase() === activeVehicle.make.toLowerCase() &&
                          c.model.toLowerCase() === activeVehicle.model.toLowerCase() &&
                          activeVehicle.year >= c.yearStart &&
                          activeVehicle.year <= c.yearEnd
                      );

                      return (
                        <div
                          key={part.id}
                          className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex gap-3 relative group"
                        >
                          <img
                            src={part.imageUrl}
                            alt={part.name}
                            className="w-16 h-16 rounded-xl object-contain bg-slate-900 shrink-0"
                            referrerPolicy="no-referrer"
                          />

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-mono text-blue-400">
                                OEM #{part.oemNumber}
                              </span>
                              <button
                                onClick={() => removeFromCart(part.id)}
                                className="text-slate-500 hover:text-red-400 p-1 transition"
                                title="সরান"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <h4 className="font-bold text-xs text-white truncate">
                              {part.name}
                            </h4>

                            {/* Fitment Indicator */}
                            <div className="text-[10px]">
                              {fitsActive ? (
                                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                                  <ShieldCheck className="w-3 h-3" /> নিশ্চিত ফিটমেন্ট
                                </span>
                              ) : (
                                <span className="text-amber-400 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" /> ফিটমেন্ট চেক করুন
                                </span>
                              )}
                            </div>

                            {/* Quantity & Line Total */}
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center border border-slate-700 rounded-lg bg-slate-900 overflow-hidden">
                                <button
                                  onClick={() => updateCartQuantity(part.id, item.quantity - 1)}
                                  className="px-2 py-0.5 text-slate-400 hover:text-white text-xs"
                                >
                                  -
                                </button>
                                <span className="px-2 py-0.5 text-xs font-bold text-white min-w-[20px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateCartQuantity(part.id, item.quantity + 1)}
                                  className="px-2 py-0.5 text-slate-400 hover:text-white text-xs"
                                >
                                  +
                                </button>
                              </div>

                              <div className="text-right">
                                <div className="text-xs font-extrabold text-white">
                                  ₹ {(part.price * item.quantity).toFixed(2)}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  ₹ {part.price.toFixed(2)} প্রতি টি
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Free shipping progress */}
                  <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                    {cartSubtotal >= 10000 ? (
                      <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>অভিনন্দন! আপনি বিনামূল্যে ফ্রি ডেলিভারি (FREE Shipping) পেয়েছেন।</span>
                      </div>
                    ) : (
                      <div>
                        <span>ফ্রি ডেলিভারি পেতে আরও <strong>₹ {(10000 - cartSubtotal).toFixed(2)}</strong> যোগ করুন!</span>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="bg-blue-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, (cartSubtotal / 10000) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white text-sm">আপনার কার্ট খালি</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    আমাদের স্পেয়ার পার্টস ক্যাটালগ দেখুন অথবা পার্টস খুঁজতে আমাদের AI ডায়াগনস্টিক স্ক্যানার ব্যবহার করুন।
                  </p>
                </div>
              )}
            </>
          )}

          {/* STEP 2: CHECKOUT FORM */}
          {step === 'checkout' && (
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-5">
              {/* Fulfillment Switcher */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  ডেলিভারি মাধ্যম
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('delivery')}
                    className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                      fulfillmentType === 'delivery'
                        ? 'bg-blue-900/30 border-blue-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">হোম ডেলিভারি</div>
                      <div className="text-[10px] text-slate-400">১-৩ কার্যদিবস</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillmentType('pickup')}
                    className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                      fulfillmentType === 'pickup'
                        ? 'bg-blue-900/30 border-blue-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Store className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">দোকান থেকে পিকআপ</div>
                      <div className="text-[10px] text-slate-400">৩০ মিনিটে প্রস্তুত (ফ্রি)</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-3 bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-white block">
                  গ্রাহকের তথ্য
                </span>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">পূর্ণ নাম</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">ইমেইল</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">ফোন নম্বর</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address (if delivery) */}
              {fulfillmentType === 'delivery' && (
                <div className="space-y-3 bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-white block">
                    ডেলিভারি ঠিকানা
                  </span>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">রাস্তা / এলাকা / গ্রাম</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">শহর</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">রাজ্য</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">পিন কোড</label>
                      <input
                        type="text"
                        required
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  পেমেন্ট পদ্ধতি
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                      paymentMethod === 'credit_card'
                        ? 'bg-blue-900/30 border-blue-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-400" />
                    <span className="text-[11px] font-semibold">কার্ড / ইউপিআই</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                      paymentMethod === 'cash_on_delivery'
                        ? 'bg-blue-900/30 border-blue-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px] font-semibold">ক্যাশ অন ডেলিভারি</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                      paymentMethod === 'bank_transfer'
                        ? 'bg-blue-900/30 border-blue-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-purple-400" />
                    <span className="text-[11px] font-semibold">ব্যাংক ট্রান্সফার</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS INVOICE */}
          {step === 'success' && completedOrder && (
            <div className="space-y-5 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-xs">
              <div className="text-center space-y-1 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-base text-white">
                  অর্ডার সফলভাবে সম্পন্ন হয়েছে!
                </h4>
                <p className="text-slate-400">
                  অর্ডার আইডি: <strong className="font-mono text-blue-400">{completedOrder.id}</strong>
                </p>
                <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                  ট্র্যাকিং নম্বর: {completedOrder.trackingNumber}
                </div>
              </div>

              {/* Order Summary Table */}
              <div className="space-y-2">
                <div className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                  অর্ডারকৃত পার্টস:
                </div>
                {completedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-slate-300 py-1 border-b border-slate-850">
                    <div>
                      <div className="font-semibold text-white">{item.partName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">OEM #{item.oemNumber} × {item.quantity}</div>
                    </div>
                    <div className="font-bold text-white">
                      ₹ {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-slate-400">
                <div className="flex justify-between">
                  <span>সাবটোটাল</span>
                  <span>₹ {completedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ডেলিভারি ({completedOrder.fulfillmentType === 'delivery' ? 'হোম ডেলিভারি' : 'দোকান থেকে পিকআপ'})</span>
                  <span>{completedOrder.shippingFee === 0 ? 'ফ্রি (FREE)' : `₹ ${completedOrder.shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>জিএসটি ও ট্যাক্স (18% GST)</span>
                  <span>₹ {completedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-white pt-1 border-t border-slate-800">
                  <span>সর্বমোট মূল্য</span>
                  <span className="text-emerald-400">₹ {completedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={handlePrintInvoice}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>রসিদ প্রিন্ট করুন</span>
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setStep('cart');
                  }}
                  className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition shadow-sm"
                >
                  দোকানে ফিরে যান
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary & Action */}
        {cart.length > 0 && step !== 'success' && (
          <div className="p-5 border-t border-slate-800 bg-slate-950/90 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span>সাবটোটাল ({cartTotalCount} টি পার্টস)</span>
                <span className="font-semibold text-white">₹ {cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>শিপিং খরচ</span>
                <span className="font-semibold text-emerald-400">
                  {shippingFee === 0 ? 'ফ্রি (FREE)' : `₹ ${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>আনুমানিক ট্যাক্স (18% GST)</span>
                <span className="font-semibold text-white">₹ {tax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-sm font-extrabold text-white">
                <span>সর্বমোট মূল্য</span>
                <span className="text-emerald-400 text-base">₹ {grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-amber-900/40"
              >
                <span>চেকআউট করতে এগিয়ে যান</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                form="checkout-form"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>নিশ্চিত করুন এবং অর্ডার দিন (₹ {grandTotal.toFixed(2)})</span>
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
