import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  POPULAR_VEHICLE_MAKES, 
  VEHICLE_MODELS_BY_MAKE 
} from '../data/mockData';
import { 
  Plus, 
  Check, 
  Trash2, 
  X, 
  ShieldCheck, 
  Truck,
  Wrench
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MachineryType } from '../types';

export const VehicleGarageSelector: React.FC = () => {
  const {
    isGarageModalOpen,
    setIsGarageModalOpen,
    userVehicles,
    activeVehicle,
    setActiveVehicle,
    addUserVehicle,
    removeUserVehicle,
    onlyFitActiveVehicle,
    setOnlyFitActiveVehicle,
  } = useShop();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [machineryType, setMachineryType] = useState<MachineryType>('Tractor');
  const [make, setMake] = useState('Mahindra');
  const [model, setModel] = useState('575 DI XP Plus');
  const [year, setYear] = useState(2022);
  const [engine, setEngine] = useState('47 HP 4-Cylinder DI Engine');
  const [nickname, setNickname] = useState('');
  const [vin, setVin] = useState('');

  if (!isGarageModalOpen) return null;

  const currentYear = 2026;
  const yearsList = Array.from({ length: 30 }, (_, i) => currentYear - i);
  const availableModels = VEHICLE_MODELS_BY_MAKE[make] || ['Standard Model'];

  const handleMakeChange = (newMake: string) => {
    setMake(newMake);
    const models = VEHICLE_MODELS_BY_MAKE[newMake] || [];
    setModel(models[0] || 'Standard Model');
  };

  const handleAddNewVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    addUserVehicle({
      machineryType,
      make,
      model,
      year: Number(year),
      engine: engine || 'Standard Engine Rating',
      vin: vin.trim() || undefined,
      nickname: nickname.trim() || `${year} ${make} ${model}`,
      isDefault: false,
    });
    setIsAddingNew(false);
    setNickname('');
    setVin('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">মেশিনারি ও ইক্যুইপমেন্ট গ্যারেজ</h3>
              <p className="text-xs text-slate-400">
                ১০০% নিশ্চিত স্পেয়ার পার্টস ফিটমেন্টের জন্য আপনার ট্র্যাক্টর, জেসিবি বা হার্ভেস্টার সিলেক্ট করুন
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsGarageModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Fitment Toggle Alert */}
          <div className="bg-amber-950/30 border border-amber-800/50 rounded-xl p-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-amber-200">
                  নিশ্চিত মেশিনারি ফিটমেন্ট ফিল্টার
                </div>
                <div className="text-[11px] text-slate-300">
                  শুধুমাত্র আপনার সক্রিয় ট্র্যাক্টর, জেসিবি বা হার্ভেস্টারে ফিট হওয়া স্পেয়ার পার্টসগুলো দেখান
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={onlyFitActiveVehicle}
                onChange={(e) => setOnlyFitActiveVehicle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          {/* Vehicle List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                সংরক্ষিত মেশিনারি গ্যারেজ ({userVehicles.length})
              </span>
              {!isAddingNew && (
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>মেশিন যুক্ত করুন</span>
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {userVehicles.map((veh) => {
                const isActive = activeVehicle?.id === veh.id;
                return (
                  <div
                    key={veh.id}
                    className={`p-3.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-amber-900/20 border-amber-500/60 shadow-sm'
                        : 'bg-slate-800/60 border-slate-750 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <button
                      onClick={() => {
                        setActiveVehicle(veh);
                      }}
                      className="flex items-center gap-3 text-left flex-1"
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          isActive
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white">
                            {veh.year} {veh.make} {veh.model}
                          </span>
                          {isActive && (
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-2.5 h-2.5" /> সক্রিয় ফিটমেন্ট
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400">
                          {veh.engine || 'Standard Diesel'} {veh.nickname && `• "${veh.nickname}"`}
                        </div>
                      </div>
                    </button>

                    {userVehicles.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeUserVehicle(veh.id);
                        }}
                        className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-700/50 transition"
                        title="সরিয়ে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add New Vehicle Form Accordion */}
          <AnimatePresence>
            {isAddingNew && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddNewVehicle}
                className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-amber-400" /> গ্যারেজে নতুন মেশিন যুক্ত করুন
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="text-slate-400 hover:text-slate-200 text-xs"
                  >
                    বাতিল
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      মেশিনারি ক্যাটাগরি
                    </label>
                    <select
                      value={machineryType}
                      onChange={(e) => setMachineryType(e.target.value as MachineryType)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Tractor">Tractor (কৃষি / মালামাল পরিবহন)</option>
                      <option value="JCB / Backhoe">JCB / ব্যাকহো / এক্সকাভেটর</option>
                      <option value="Harvester">কম্বাইন হার্ভেস্টার / রিপার</option>
                      <option value="Heavy Equipment">ভারী মাটি কাটার যন্ত্রপাতি</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      প্রস্তুতকারক / ব্র্যান্ড
                    </label>
                    <select
                      value={make}
                      onChange={(e) => handleMakeChange(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      {POPULAR_VEHICLE_MAKES.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      মডেল / সিরিজ
                    </label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      {availableModels.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      তৈরির বছর
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      {yearsList.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      হর্সপাওয়ার / ইঞ্জিনের তথ্য
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: 50 HP DI, 76 HP Turbocharged"
                      value={engine}
                      onChange={(e) => setEngine(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      মেশিনের ডাকনাম / সিরিয়াল নম্বর
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: Field Unit 1, Farm JCB 3DX"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition shadow-sm"
                >
                  গ্যারেজে মেশিন সংরক্ষণ করুন
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            onClick={() => setIsGarageModalOpen(false)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold transition"
          >
            সম্পন্ন
          </button>
        </div>
      </motion.div>
    </div>
  );
};
