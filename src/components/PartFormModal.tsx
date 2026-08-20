import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { SparePart, PartCategory, VehicleCompatibility } from '../types';
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  Package, 
  Wrench, 
  Truck, 
  ShieldCheck,
  DollarSign,
  Upload,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { POPULAR_VEHICLE_MAKES } from '../data/mockData';

export const PartFormModal: React.FC = () => {
  const { isPartFormOpen, setIsPartFormOpen, editingPart, setEditingPart, addPart, updatePart, categories } = useShop();

  const [name, setName] = useState('');
  const [oemNumber, setOemNumber] = useState('');
  const [brand, setBrand] = useState('Mahindra Genuine');
  const [category, setCategory] = useState<PartCategory>('tractor');
  const [price, setPrice] = useState('185.00');
  const [costPrice, setCostPrice] = useState('120.00');
  const [stockQuantity, setStockQuantity] = useState('12');
  const [minStockThreshold, setMinStockThreshold] = useState('4');
  const [warehouseLocation, setWarehouseLocation] = useState('Rack H-04 - Bin 2');
  const [supplier, setSupplier] = useState('AgriMach Industrial Supply');
  const [condition, setCondition] = useState<'New - OEM Genuine' | 'New - Aftermarket Premium' | 'Remanufactured OEM'>('New - OEM Genuine');
  const [weightKg, setWeightKg] = useState('6.5');
  const [imageUrls, setImageUrls] = useState<string[]>(['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80']);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "আপলোড করতে সমস্যা হয়েছে");
      }

      if (data.url) {
        setImageUrls((prev) => {
          // If the only element is a placeholder or empty, replace it
          if (prev.length === 1 && (prev[0] === "" || prev[0].includes("unsplash.com"))) {
            return [data.url];
          }
          return [...prev, data.url];
        });
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "ছবি আপলোড করতে ব্যর্থ হয়েছে");
    } finally {
      setUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => {
    setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  const [isUniversal, setIsUniversal] = useState(false);

  // Compatible Vehicles Matrix
  const [compatibleVehicles, setCompatibleVehicles] = useState<VehicleCompatibility[]>([
    { make: 'Mahindra', model: '575 DI XP Plus', yearStart: 2015, yearEnd: 2026 }
  ]);

  // Specs
  const [specs, setSpecs] = useState<Array<{ key: string; val: string }>>([
    { key: 'Displacement', val: '22 GPM @ 210 Bar' },
    { key: 'Warranty', val: '18 Months Field Service' }
  ]);

  useEffect(() => {
    if (editingPart) {
      setName(editingPart.name);
      setOemNumber(editingPart.oemNumber);
      setBrand(editingPart.brand || '');
      setCategory(editingPart.category);
      setPrice(editingPart.price.toString());
      setCostPrice(editingPart.costPrice.toString());
      setStockQuantity(editingPart.stockQuantity.toString());
      setMinStockThreshold(editingPart.minStockThreshold.toString());
      setWarehouseLocation(editingPart.warehouseLocation);
      setSupplier(editingPart.supplier);
      setCondition(editingPart.condition);
      setWeightKg(editingPart.weightKg !== null && editingPart.weightKg !== undefined ? editingPart.weightKg.toString() : '');
      setImageUrls(editingPart.imageUrls && editingPart.imageUrls.length > 0 ? editingPart.imageUrls : [editingPart.imageUrl]);
      setDescription(editingPart.description);
      setIsUniversal(!!editingPart.isUniversal);
      setCompatibleVehicles(editingPart.compatibleVehicles || []);
      setSpecs(
        Object.entries(editingPart.specs || {}).map(([key, val]) => ({ key, val }))
      );
    } else {
      // Reset defaults for new part
      setName('');
      setOemNumber('');
      setBrand('Mahindra Genuine');
      setCategory(categories[0]?.id || 'tractor');
      setPrice('185.00');
      setCostPrice('120.00');
      setStockQuantity('12');
      setMinStockThreshold('4');
      setWarehouseLocation('Rack H-04 - Bin 2');
      setSupplier('AgriMach Industrial Supply');
      setCondition('New - OEM Genuine');
      setWeightKg('6.5');
      setImageUrls(['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80']);
      setDescription('Heavy-duty machinery replacement component engineered to endure intense agricultural and construction field stress.');
      setIsUniversal(false);
      setCompatibleVehicles([{ make: 'Mahindra', model: '575 DI XP Plus', yearStart: 2015, yearEnd: 2026 }]);
      setSpecs([
        { key: 'Max Working Pressure', val: '210 Bar / 3000 PSI' },
        { key: 'Warranty', val: '18 Months Heavy-Duty' }
      ]);
    }
  }, [editingPart, isPartFormOpen]);

  if (!isPartFormOpen) return null;

  const handleAddVehicleRow = () => {
    setCompatibleVehicles((prev) => [
      ...prev,
      { make: 'JCB', model: '3DX Super EcoXcellence', yearStart: 2016, yearEnd: 2026 }
    ]);
  };

  const handleRemoveVehicleRow = (idx: number) => {
    setCompatibleVehicles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddSpecRow = () => {
    setSpecs((prev) => [...prev, { key: '', val: '' }]);
  };

  const handleRemoveSpecRow = (idx: number) => {
    setSpecs((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedSpecs: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim()) {
        formattedSpecs[s.key.trim()] = s.val.trim();
      }
    });

    const cleanImageUrls = imageUrls.map(url => url.trim()).filter(url => url !== '');
    const mainImage = cleanImageUrls[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80';

    const brandValue = brand.trim() === '' ? null : brand.trim();
    const weightParsed = parseFloat(weightKg);
    const weightValue = (weightKg.trim() === '' || isNaN(weightParsed)) ? null : weightParsed;

    const partData = {
      name: name.trim(),
      oemNumber: oemNumber.trim().toUpperCase(),
      brand: brandValue,
      category,
      price: parseFloat(price) || 0,
      costPrice: parseFloat(costPrice) || 0,
      stockQuantity: parseInt(stockQuantity, 10) || 0,
      minStockThreshold: parseInt(minStockThreshold, 10) || 0,
      warehouseLocation: warehouseLocation.trim(),
      supplier: supplier.trim(),
      condition,
      weightKg: weightValue,
      imageUrl: mainImage,
      imageUrls: cleanImageUrls,
      description: description.trim(),
      isUniversal,
      compatibleVehicles,
      specs: formattedSpecs,
      inDemandScore: 88
    };

    if (editingPart) {
      updatePart(editingPart.id, partData);
    } else {
      addPart(partData);
    }

    setIsPartFormOpen(false);
    setEditingPart(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {editingPart ? `মেশিনারি পার্টস এডিট করুন: ${editingPart.name}` : 'মেশিনারি স্পেয়ার পার্টস SKU যুক্ত করুন'}
              </h3>
              <p className="text-xs text-slate-400">
                OEM স্পেসিফিকেশন, গুদামের অবস্থান, খরচ এবং ট্র্যাক্টর/জেসিবি/হার্ভেস্টার ফিটমেন্ট পরিচালনা করুন
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsPartFormOpen(false);
              setEditingPart(null);
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form id="part-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Row 1: Name, OEM #, Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                পার্টস এর নাম / মেশিনারি টাইটেল *
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: Hydraulic Main Gear Pump - 22 GPM High Flow"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                OEM পার্ট নম্বর *
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: 005558123R91"
                value={oemNumber}
                onChange={(e) => setOemNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                প্রস্তুতকারক / ব্র্যান্ড (ঐচ্ছিক)
              </label>
              <input
                type="text"
                placeholder="যেমন: Mahindra Genuine, Bosch Rexroth, JCB"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Row 2: Category, Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                মেশিনারি ক্যাটাগরি
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PartCategory)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                কন্ডিশন স্ট্যান্ডার্ড
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="New - OEM Genuine">New - OEM Genuine</option>
                <option value="New - Aftermarket Premium">New - Aftermarket Premium</option>
                <option value="Remanufactured OEM">Remanufactured Heavy-Duty</option>
              </select>
            </div>
          </div>

          {/* Row 3: Pricing & Inventory Control */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              মূল্য নির্ধারণ, ইনভেন্টরি ও ওয়্যারহাউস ট্র্যাকিং
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">খুচরা মূল্য (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">কেনা দাম (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">স্টক পরিমাণ</label>
                <input
                  type="number"
                  required
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">সর্বনিম্ন স্টক সীমা</label>
                <input
                  type="number"
                  required
                  value={minStockThreshold}
                  onChange={(e) => setMinStockThreshold(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[11px] text-slate-400 mb-1">ওয়্যারহাউস বিন / অবস্থান</label>
                <input
                  type="text"
                  required
                  placeholder="Rack H-04"
                  value={warehouseLocation}
                  onChange={(e) => setWarehouseLocation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Description & Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                পার্টস বিবরণ ও মন্তব্য
              </label>
              <textarea
                placeholder="পার্টসটির বৈশিষ্ট্য, কন্ডিশন বা যেকোনো বিশেষ মন্তব্য..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 h-28 resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ওজন (Kg) (ঐচ্ছিক)
              </label>
              <input
                type="number"
                step="0.01"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500 h-10"
              />
            </div>
          </div>

          {/* Multiple Image Link Builder & Drag-and-Drop Uploader */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-amber-400" />
                পার্টস এর ছবিসমূহ (একাধিক ছবির লিঙ্ক)
              </span>
              <button
                type="button"
                onClick={() => setImageUrls((prev) => [...prev, ''])}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন ছবির লিঙ্ক যোগ করুন</span>
              </button>
            </div>

            {/* Drag and Drop Upload Area */}
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition cursor-pointer text-center group ${
                dragActive 
                  ? 'border-amber-500 bg-amber-500/5' 
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={uploading}
              />
              
              {uploading ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                  <span className="text-xs text-amber-300 font-medium">ছবি আপলোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 py-1">
                  <Upload className="w-6 h-6 text-slate-500 group-hover:text-amber-400 transition" />
                  <div className="text-xs text-slate-300 font-medium">
                    <span className="text-amber-400 font-bold">এখানে ড্র্যাগ অ্যান্ড ড্রপ করুন</span> অথবা ফাইল সিলেক্ট করতে ক্লিক করুন
                  </div>
                  <span className="text-[10px] text-slate-500">PostImage API-তে স্বয়ংক্রিয়ভাবে আপলোড হবে</span>
                </div>
              )}
            </div>

            {uploadError && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-400 font-medium">
                {uploadError}
              </div>
            )}

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-500 font-bold px-1.5 font-mono">#{idx + 1}</span>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... (ছবির লিঙ্ক)"
                    value={url}
                    onChange={(e) => {
                      const val = e.target.value;
                      setImageUrls((prev) => prev.map((item, i) => (i === idx ? val : item)));
                    }}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    required={idx === 0}
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setImageUrls((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-red-400 p-1.5 rounded hover:bg-slate-800 transition"
                      title="ছবি মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>




        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setIsPartFormOpen(false);
              setEditingPart(null);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            বাতিল করুন
          </button>
          <button
            type="submit"
            form="part-form"
            className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-900/40"
          >
            <Save className="w-4 h-4" />
            <span>{editingPart ? 'পরিবর্তন সংরক্ষণ করুন' : 'মেশিনারি পার্ট SKU তৈরি করুন'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
