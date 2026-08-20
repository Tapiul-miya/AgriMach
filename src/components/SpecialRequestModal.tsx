import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, HelpCircle, Send, CheckCircle2, Truck } from 'lucide-react';
import { motion } from 'motion/react';

export const SpecialRequestModal: React.FC = () => {
  const { isSpecialRequestOpen, setIsSpecialRequestOpen, activeVehicle, showToast } = useShop();

  const [partName, setPartName] = useState('');
  const [vinNumber, setVinNumber] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isSpecialRequestOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('বিশেষ পার্টস খোঁজার অনুরোধ জমা দেওয়া হয়েছে! আমাদের হেভি ইকুইপমেন্ট সোর্সিং টিম আগামী ২ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবে।');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100 flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">হেভি মেশিনারি পার্টস সোর্স করুন</h3>
              <p className="text-xs text-slate-400">
                আপনার ট্র্যাক্টর, জেসিবি বা হার্ভেস্টারের পার্টস পাচ্ছেন না? আমাদের ইন্ডাস্ট্রিয়াল সোর্সিং নেটওয়ার্ক তা খুঁজে দেবে
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsSpecialRequestOpen(false);
              setSubmitted(false);
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-base">অনুরোধটি সোর্সিং বিভাগে পাঠানো হয়েছে</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  আমরা "{partName}" এর জন্য ২০+ অনুমোদিত OEM মেশিনারি পরিবেশক এবং প্রস্তুতকারকের কাছে অনুসন্ধান পাঠিয়েছি। আপনি শীঘ্রই মূল্য এবং ডেলিভারির সময় জানতে পারবেন।
                </p>
              </div>
              <button
                onClick={() => {
                  setIsSpecialRequestOpen(false);
                  setSubmitted(false);
                }}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition"
              >
                সম্পন্ন
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>নির্বাচিত মেশিন: <strong>{activeVehicle ? `${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}` : 'নির্দিষ্ট করা হয়নি (যেকোনো ট্র্যাক্টর / জেসিবি / হার্ভেস্টার)'}</strong></span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  প্রয়োজনীয় পার্টস এর নাম, কাস্টিং নম্বর বা OEM নম্বর *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: হাইড্রোলিক বুম সিলিন্ডার সিল কিট বা OEM # 005558123R91"
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    চ্যাসিস নম্বর / সিরিয়াল নম্বর
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: MAH575XP991283"
                    value={vinNumber}
                    onChange={(e) => setVinNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    আপনার নাম / খামার / ব্যবসা প্রতিষ্ঠানের নাম *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: রাজেশ কুমার (কিশান অ্যাগ্রো ফার্মস)"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  যোগাযোগের ফোন নম্বর / ইমেইল *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: +91 98765 43210 / contact@agrifarm.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  অতিরিক্ত তথ্য (ইঞ্জিন হর্সপাওয়ার, পিটিও স্প্লাইনস, কাটিং প্রস্থ ইত্যাদি)
                </label>
                <textarea
                  rows={2}
                  placeholder="যেমন: কঠিন চাষের কাজের জন্য ১৩ স্প্লাইন ড্রাইভ শ্যাফ্ট সহ ৪ডব্লিউডি হাইড্রোলিক পাম্প প্রয়োজন।"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-amber-900/30"
              >
                <Send className="w-4 h-4" />
                <span>পার্টস খোঁজার বিশেষ অনুরোধ পাঠান</span>
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
