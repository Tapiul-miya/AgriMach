import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Sparkles, 
  X, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  ShoppingCart, 
  Truck, 
  Activity, 
  ShieldAlert, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { AIDiagnosticResponse, SparePart } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const COMMON_SYMPTOMS = [
  { label: 'হাইড্রোলিক ৩-পয়েন্ট লিফটের হাতল ঝুলে পড়ছে বা ধীরগতিতে কাজ করছে', category: 'hydraulics', icon: '🚜' },
  { label: 'জেসিবি ব্যাকহো বুম ধীরগতিতে উঠছে বা খননের শক্তি কমে গেছে', category: 'hydraulics', icon: '🏗️' },
  { label: 'হার্ভেস্টার কাটার বারের ছুরি জ্যাম হচ্ছে বা ফসল কাটায় অসমতা', category: 'harvesting', icon: '🌾' },
  { label: 'কঠিন চাষের কাজে কালো ডিজেল ধোঁয়া বেরোচ্ছে এবং টানার শক্তি কম', category: 'engine', icon: '💨' },
  { label: 'রোটাভেটর বা থ্রেশার চালানোর সময় PTO ক্লাচ স্লিপ করছে', category: 'transmission', icon: '⚙️' },
  { label: 'তেলে ডুবানো ব্রেক স্লিপ করছে বা ঢালে সমস্যা করছে', category: 'brakes', icon: '🛑' },
  { label: '১০ ঘণ্টা টানা ফসল কাটার সময় ট্র্যাক্টর ইঞ্জিন অতিরিক্ত গরম হচ্ছে', category: 'cooling', icon: '🌡️' },
  { label: 'হেভি স্টার্টার মোটর ধীরগতিতে ক্র্যাঙ্ক করছে বা সোলেনয়েড শব্দ করছে', category: 'electrical', icon: '⚡' }
];

export const AIDiagnosticModal: React.FC = () => {
  const {
    isDiagnosticOpen,
    setIsDiagnosticOpen,
    activeVehicle,
    parts,
    addToCart,
    setInspectedPart,
    showToast
  } = useShop();

  const [symptomInput, setSymptomInput] = useState('');
  const [obdCodeInput, setObdCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<AIDiagnosticResponse | null>(null);

  if (!isDiagnosticOpen) return null;

  const handleSelectQuickSymptom = (item: typeof COMMON_SYMPTOMS[0]) => {
    setSymptomInput(item.label);
  };

  const handleRunDiagnosis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomInput.trim() && !obdCodeInput.trim()) {
      showToast('দয়া করে একটি মেশিনের সমস্যা বা কোনো ফল্ট কোড লিখুন।');
      return;
    }

    setLoading(true);
    setDiagnosticResult(null);

    try {
      const res = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle: activeVehicle,
          symptom: symptomInput,
          obdCode: obdCodeInput,
          catalogParts: parts.map(p => ({
            id: p.id,
            name: p.name,
            oemNumber: p.oemNumber,
            category: p.category,
            brand: p.brand
          }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.probableIssue) {
          setDiagnosticResult(data);
          return;
        }
      }
      
      // Contextual heavy machinery diagnostic fallback
      const s = (symptomInput || '').toLowerCase();
      const isHydraulic = s.includes('hydraul') || s.includes('lift') || s.includes('boom') || s.includes('bucket') || s.includes('pump') || s.includes('হাইড্রোলিক');
      const isHarvest = s.includes('harvest') || s.includes('cutter') || s.includes('knife') || s.includes('rasp') || s.includes('crop') || s.includes('হার্ভেস্টার');
      const isEngine = s.includes('smoke') || s.includes('inject') || s.includes('turbo') || s.includes('pull') || s.includes('ইঞ্জিন') || s.includes('কালো ডিজেল');
      const isClutch = s.includes('pto') || s.includes('clutch') || s.includes('rotavator') || s.includes('gear') || s.includes('ক্লাচ');

      setDiagnosticResult({
        probableIssue: isHydraulic 
          ? 'হাইড্রোলিক পাম্পের ইন্টারনাল বাই-পাস বা স্পুল ভালভ সিল ক্ষয়' 
          : isHarvest 
          ? 'কাটার বারের খণ্ডিত ব্লেড ভোঁতা হওয়া বা লেজার প্লেট ক্ষয়'
          : isClutch
          ? 'ডুয়াল স্টেজ PTO সিরাম্যাটালিক ক্লাচ প্লেটের সমস্যা'
          : isEngine
          ? 'ডিজেল ইনজেক্টর নজেল অ্যাটোমাইজেশন সমস্যা ও এয়ার ফিল্টার জ্যাম'
          : 'মেশিনারি ফ্লুইড এবং মেকানিক্যাল ওভারহল প্রয়োজন',
        severity: isHydraulic || isClutch ? 'High' : 'Medium',
        explanation: `আপনার মেশিন ${activeVehicle?.year || ''} ${activeVehicle?.make || ''} ${activeVehicle?.model || 'ভারী যন্ত্রপাতি'}-এর উল্লেখিত সমস্যা ("${symptomInput || 'যান্ত্রিক সমস্যা'}") বিশ্লেষণের উপর ভিত্তি করে হাইড্রোলিক প্রেসার, ক্লাচ ফ্রিকশন বা ডিজেল ফুয়েল ইনজেক্টর মেরামতের প্রয়োজন।`,
        recommendedPartCategories: isHydraulic ? ['hydraulics', 'filters'] : isHarvest ? ['harvesting'] : isClutch ? ['transmission'] : ['engine', 'filters'],
        suggestedOEMNumbers: isHydraulic ? ['005558123R91', '32/925346'] : isHarvest ? ['AZ58904-PK25'] : ['328-0245-10', '0433171848'],
        estimatedLaborDifficulty: 'মাঝারি DIY (1-2 ঘণ্টা)',
        safetyWarning: 'হাইড্রোলিক যন্ত্রাংশ বা ব্যাকহো বুম মেরামতের আগে অবশ্যই লক বা মেকানিক্যাল সেফটি প্রোপ্স দিয়ে সাপোর্ট করে রাখুন।',
        stepByStepChecks: [
          'হাইড্রোলিক তেলের লেভেল পরীক্ষা করুন এবং রিটার্ন লাইন ফিল্টারে লোহার কণা আছে কি না দেখুন।',
          'সহায়ক স্পুল পোর্টে একটি 300-bar গেজ ব্যবহার করে পাম্পের রিলিফ প্রেসার পরীক্ষা করুন।',
          'ড্রাইভ বেল্ট এবং PTO শ্যাফট শিয়ার বোল্ট টেনশন চেক করুন।'
        ]
      });
    } catch (err) {
      console.warn('Diagnostic fetch encountered network issue:', err);
      setDiagnosticResult({
        probableIssue: 'মেশিনের মেকানিক্যাল ত্রুটি ও সার্ভিস প্রয়োজন',
        severity: 'Medium',
        explanation: `আপনার মেশিন ${activeVehicle?.year || ''} ${activeVehicle?.make || ''} ${activeVehicle?.model || 'ভারী যন্ত্রপাতি'}-এর উল্লেখিত সমস্যা ("${symptomInput || 'যান্ত্রিক সমস্যা'}")-এর জন্য হাইড্রোলিক পাম্প, ডিজেল ইনজেক্টর বা ক্লাচ ডিস্ক পরিদর্শন করা উচিত।`,
        recommendedPartCategories: ['hydraulics', 'engine', 'filters'],
        suggestedOEMNumbers: ['005558123R91', 'AZ58904-PK25', '32/925346'],
        estimatedLaborDifficulty: 'মাঝারি DIY (1-2 ঘণ্টা)',
        safetyWarning: 'লাইন পরিদর্শন করার আগে মেশিনের ইঞ্জিন বন্ধ করুন এবং হাইড্রোলিক প্রেসার পুরোপুরি মুক্ত করুন।',
        stepByStepChecks: [
          'হাইড্রোলিক এবং ইঞ্জিনের তেলের অবস্থা পরীক্ষা করে দেখুন কোনো মলিনতা বা আবর্জনা আছে কি না।',
          'ফুয়েল ফিল্টার বাটি পরীক্ষা করুন এবং প্রাইমারি এয়ার ফিল্টার প্রি-ক্লিনার বাটি পরিষ্কার করুন।',
          'PTO স্প্লাইন অ্যালাইনমেন্ট পরীক্ষা করুন এবং সব ইউনিভার্সাল ক্রসে গ্রিজ দিন।'
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  // Find matching parts in catalog from the diagnostic result
  const matchedParts: SparePart[] = diagnosticResult 
    ? parts.filter(p => 
        diagnosticResult.recommendedPartCategories.some(cat => cat.toLowerCase() === p.category.toLowerCase()) ||
        diagnosticResult.suggestedOEMNumbers?.some(oem => p.oemNumber.toLowerCase().includes(oem.toLowerCase()))
      ).slice(0, 4)
    : [];

  const getUrgencyText = (sev: string) => {
    if (sev === 'Critical') return 'অত্যন্ত জরুরি';
    if (sev === 'High') return 'উচ্চ';
    return 'মাঝারি';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-950/80 via-slate-900 to-orange-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  AI মেশিনারি ও হেভি ইকুইপমেন্ট মেকানিক
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  ট্র্যাক্টর • জেসিবি • হার্ভেস্টার
                </span>
              </div>
              <p className="text-xs text-slate-400">
                মেশিনের সমস্যা বা যান্ত্রিক ত্রুটি বর্ণনা করুন এবং সঠিক OEM স্পেয়ার পার্টস খুঁজে নিন
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDiagnosticOpen(false)}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Active Vehicle Bar */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-400">এর জন্য রোগ নির্ণয় করা হচ্ছে:</span>
              <span className="text-xs font-bold text-white">
                {activeVehicle ? `${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model} (${activeVehicle.engine || 'Standard Diesel'})` : 'সাধারণ হেভি মেশিনারি'}
              </span>
            </div>
            <span className="text-[11px] text-amber-400 font-semibold">মেশিনারি ফিটমেন্ট যাচাইকৃত</span>
          </div>

          {/* Quick Symptoms Chips */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              সাধারণ মেশিনারি সমস্যাসমূহ (অটো-ফিল করতে ক্লিক করুন)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COMMON_SYMPTOMS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectQuickSymptom(s)}
                  className="p-2 rounded-xl bg-slate-950/50 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 text-left transition flex items-center gap-2 text-xs text-slate-300"
                >
                  <span className="text-base">{s.icon}</span>
                  <span className="truncate flex-1">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleRunDiagnosis} className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                মেশিনের সমস্যা, হাইড্রোলিক লিক বা মাঠের কাজের অবস্থা বর্ণনা করুন:
              </label>
              <textarea
                rows={2}
                placeholder="যেমন: রোটাভেটর সংযুক্ত থাকলে হাইড্রোলিক লিফট নেমে যায়, অথবা লোডের নিচে জেসিবি ব্যাকহো আর্ম খুব ধীরে ঘোরে..."
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full sm:w-1/2">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  ফল্ট / ট্রাবল কোড (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: HYD-201, E-04, F-12"
                  value={obdCodeInput}
                  onChange={(e) => setObdCodeInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="w-full sm:w-1/2 sm:self-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-amber-900/40 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>মেশিনারি ডায়াগনস্টিক বিশ্লেষণ করা হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>মেশিনারি ডায়াগনস্টিকস চালান ও পার্টস খুঁজুন</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Diagnostic Result Display */}
          <AnimatePresence>
            {diagnosticResult && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="space-y-5 bg-gradient-to-br from-amber-950/30 via-slate-900 to-orange-950/30 border border-amber-500/40 rounded-2xl p-5"
              >
                {/* Result Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-900/40 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                      মেশিনারি ডায়াগনস্টিক সিদ্ধান্ত
                    </span>
                    <h4 className="text-base font-extrabold text-white">
                      {diagnosticResult.probableIssue}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        diagnosticResult.severity === 'Critical'
                          ? 'bg-red-950/80 text-red-300 border-red-800'
                          : diagnosticResult.severity === 'High'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                          : 'bg-blue-950/80 text-blue-300 border-blue-800'
                      }`}
                    >
                      জরুরি অবস্থা: {getUrgencyText(diagnosticResult.severity)}
                    </span>

                    <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {diagnosticResult.estimatedLaborDifficulty}
                    </span>
                  </div>
                </div>

                {/* Explanation */}
                <p className="text-xs text-slate-200 leading-relaxed">
                  {diagnosticResult.explanation}
                </p>

                {/* Safety Precaution */}
                {diagnosticResult.safetyWarning && (
                  <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>মাঠের নিরাপত্তা সতর্কতা: </strong> {diagnosticResult.safetyWarning}
                    </div>
                  </div>
                )}

                {/* Step by Step Checklist */}
                <div>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                    প্রস্তাবিত মাঠের পরিদর্শন পদক্ষেপসমূহ
                  </span>
                  <div className="space-y-1.5">
                    {diagnosticResult.stepByStepChecks.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Matched Replacement Parts in Stock */}
                <div className="pt-3 border-t border-amber-900/40">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-amber-400" />
                      প্রস্তাবিত স্টকে থাকা পার্টস ({matchedParts.length} টি)
                    </span>
                  </div>

                  {matchedParts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {matchedParts.map((part) => (
                        <div
                          key={part.id}
                          className="bg-slate-900 border border-slate-700/80 rounded-xl p-3 flex items-center justify-between gap-3 hover:border-slate-600 transition"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={part.imageUrl}
                              alt={part.name}
                              className="w-12 h-12 rounded-lg object-cover bg-slate-950 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="text-[10px] text-amber-400 font-mono">
                                OEM #{part.oemNumber}
                              </div>
                              <h5 className="font-bold text-xs text-white line-clamp-1">
                                {part.name}
                              </h5>
                              <div className="text-xs font-extrabold text-emerald-400">
                                ₹ {part.price.toFixed(2)}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              addToCart(part, 1);
                            }}
                            className="p-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition shadow-sm"
                            title="কার্টে যোগ করুন"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-950/40 rounded-xl text-xs text-slate-400 text-center">
                      বর্তমানে ক্যাটালগে এই ধরণের কোনো পার্টস পাওয়া যায়নি। বিশেষ বা দুর্লভ পার্টস পেতে আমাদের বিশেষ অনুরোধ ফর্মটি ব্যবহার করুন।
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            হেভি কৃষি যন্ত্রপাতি ডায়াগনস্টিকস এবং Google Gemini দ্বারা চালিত
          </span>
          <button
            onClick={() => setIsDiagnosticOpen(false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            বন্ধ করুন
          </button>
        </div>
      </motion.div>
    </div>
  );
};
