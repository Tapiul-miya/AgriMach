import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { UserStorefront } from './components/UserStorefront';
import { AdminDashboard } from './components/AdminDashboard';
import { VehicleGarageSelector } from './components/VehicleGarageSelector';
import { PartDetailModal } from './components/PartDetailModal';
import { AIDiagnosticModal } from './components/AIDiagnosticModal';
import { CartAndCheckoutModal } from './components/CartAndCheckoutModal';
import { UserOrdersModal } from './components/UserOrdersModal';
import { SpecialRequestModal } from './components/SpecialRequestModal';
import { PartFormModal } from './components/PartFormModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { 
  ShieldCheck, 
  Truck, 
  Headphones, 
  RotateCcw, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Car,
  Wrench,
  CheckCircle2
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const MainContent: React.FC = () => {
  const { mode, toastMessage, setToastMessage, setIsDiagnosticOpen, setIsGarageModalOpen } = useShop();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white pb-14 md:pb-0">
      {/* Top Global Navigation Bar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-20 md:pb-10">
        <AnimatePresence mode="wait">
          {mode === 'user' ? (
            <motion.div
              key="storefront"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <UserStorefront />
            </motion.div>
          ) : (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <AdminDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Value Proposition Bar (visible on user storefront) */}
      {mode === 'user' && (
        <section className="border-t border-slate-900 bg-slate-950/80 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">100% সঠিক ফিটিং</h4>
                  <p className="text-[11px] text-slate-400">সরাসরি OEM স্পেসিফিকেশন এবং বোল্ট ডিজাইন</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">দ্রুত ডেলিভারি এবং পিকআপ</h4>
                  <p className="text-[11px] text-slate-400">ডিপো থেকে একই দিনে পিকআপের সুবিধা</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-400 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">ঝামেলামুক্ত 30 দিনের রিটার্ন</h4>
                  <p className="text-[11px] text-slate-400">কোনো অতিরিক্ত চার্জ ছাড়া রিটার্ন সুবিধা</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                <div className="w-10 h-10 rounded-xl bg-amber-600/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">সার্টিফাইড পার্টস বিশেষজ্ঞ</h4>
                  <p className="text-[11px] text-slate-400">AI মেকানিকের 24/7 মেকানিক্যাল পরামর্শ</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Professional Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 text-xs py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-500 flex items-center justify-center text-white font-black text-sm shadow-md">
                  AP
                </div>
                <span className="font-extrabold text-base text-white tracking-tight">
                  Agri<span className="text-amber-500">Mach</span> Spares
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                নির্ভুল OEM এবং আফটারমার্কেট হেভি মেশিনারী খুচরা যন্ত্রাংশ সরবরাহ। আধুনিক মেরামত দোকান, নিজস্ব মালিকানাধীন ট্র্যাক্টর ও ক্রেন এবং ফ্লিট অপারেটরদের জন্য তৈরি।
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[11px] tracking-wider">
                শোরুম এবং ক্যাটালগ
              </h5>
              <ul className="space-y-1.5 text-slate-400">
                <li><button onClick={() => setIsGarageModalOpen(true)} className="hover:text-blue-400 transition">আমার গ্যারেজ সিলেক্টর</button></li>
                <li><button onClick={() => setIsDiagnosticOpen(true)} className="hover:text-blue-400 transition">AI মেকানিক্যাল রোগ নির্ণয়</button></li>
                <li><span className="text-slate-500">ব্রেকিং এবং চ্যাসিস</span></li>
                <li><span className="text-slate-500">ইঞ্জিন এবং হাইড্রোলিক টিউন-আপ</span></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[11px] tracking-wider">
                অফিসের সময়সূচী
              </h5>
              <div className="space-y-1 text-slate-400 text-[11px]">
                <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-400" /> সোম - শুক্র: 7:00 AM - 7:00 PM</div>
                <div>শনি: 8:00 AM - 5:00 PM</div>
                <div>রবি: 10:00 AM - 3:00 PM (শুধুমাত্র পিকআপ)</div>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[11px] tracking-wider">
                বিতরণ ডিপো
              </h5>
              <div className="space-y-1 text-slate-400 text-[11px]">
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> 1040 অটোমোটিভ পার্কওয়ে, কলকাতা, পশ্চিমবঙ্গ</div>
                <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-blue-400" /> +91 98765 43210</div>
                <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-purple-400" /> support@agrimachhub.in</div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © {new Date().getFullYear()} AgriMach Spare Parts Hub. সর্বস্বত্ব সংরক্ষিত।
            </div>
            <div className="flex items-center gap-4">
              <span>ISO 9001 সার্টিফাইড সরবরাহকারী</span>
              <span>•</span>
              <span>OEM ডিরেক্ট ওয়ারেন্টি</span>
              <span>•</span>
              <span>নিরাপদ পেমেন্ট গেটওয়ে</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs max-w-md"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="flex-1">{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Interactive Global Modals */}
      <VehicleGarageSelector />
      <PartDetailModal />
      <AIDiagnosticModal />
      <CartAndCheckoutModal />
      <UserOrdersModal />
      <SpecialRequestModal />
      <PartFormModal />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}
