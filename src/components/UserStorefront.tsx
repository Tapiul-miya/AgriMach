import React, { useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { PartCard } from './PartCard';
import { PartCategory } from '../types';
import * as LucideIcons from 'lucide-react';
import { Search, PackageX, Filter, HelpCircle } from 'lucide-react';

const getIconComponent = (iconName: string): any => {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || LucideIcons.Layers;
};

export const UserStorefront: React.FC = () => {
  const {
    parts,
    activeVehicle,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    onlyInStock,
    setOnlyInStock,
    onlyFitActiveVehicle,
    setOnlyFitActiveVehicle,
    sortBy,
    setSortBy,
    setIsSpecialRequestOpen,
    categories,
  } = useShop();

  const renderedCategories = useMemo(() => {
    return [
      { id: 'all', label: 'সব পার্টস ও স্পেয়ার্স', iconName: 'Layers' },
      ...categories
    ];
  }, [categories]);

  // Extract unique brands from parts catalog
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    parts.forEach((p) => {
      if (p.brand) {
        set.add(p.brand);
      }
    });
    return Array.from(set).sort();
  }, [parts]);

  // Filter and Sort logic
  const filteredParts = useMemo(() => {
    return parts
      .filter((part) => {
        // Category filter
        if (selectedCategory !== 'all' && part.category !== selectedCategory) {
          return false;
        }

        // Brand filter
        if (selectedBrand !== 'all' && part.brand !== selectedBrand) {
          return false;
        }

        // In-stock only filter
        if (onlyInStock && part.stockQuantity <= 0) {
          return false;
        }

        // Fit active vehicle filter
        if (onlyFitActiveVehicle && activeVehicle && !part.isUniversal) {
          const fits = part.compatibleVehicles.some((c) => {
            const makeMatch = c.make.toLowerCase() === activeVehicle.make.toLowerCase();
            const modelMatch = c.model.toLowerCase() === activeVehicle.model.toLowerCase();
            const yearMatch = activeVehicle.year >= c.yearStart && activeVehicle.year <= c.yearEnd;
            return makeMatch && modelMatch && yearMatch;
          });
          if (!fits) return false;
        }

        // Search Query filter (matches name, oem, brand, description, category)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = part.name.toLowerCase().includes(q);
          const matchOem = part.oemNumber.toLowerCase().includes(q);
          const matchBrand = part.brand ? part.brand.toLowerCase().includes(q) : false;
          const matchDesc = part.description.toLowerCase().includes(q);
          const matchCat = part.category.toLowerCase().includes(q);
          return matchName || matchOem || matchBrand || matchDesc || matchCat;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'stock') return b.stockQuantity - a.stockQuantity;
        // Default recommended / in-demand
        return (b.inDemandScore || 50) - (a.inDemandScore || 50);
      });
  }, [
    parts,
    selectedCategory,
    selectedBrand,
    onlyInStock,
    onlyFitActiveVehicle,
    activeVehicle,
    searchQuery,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setOnlyInStock(false);
    setOnlyFitActiveVehicle(false);
    setSortBy('recommended');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Category Pills Bar */}
      <div className="overflow-x-auto pb-1.5 w-full scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {renderedCategories.map((cat) => {
            const Icon = getIconComponent(cat.iconName);
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Elegant, Focused Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-100 shadow-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ট্র্যাক্টর, জেসিবি ও হার্ভেস্টার পার্টস, OEM নম্বর (যেমন: 332/C4388, AZ58904), ব্র্যান্ড খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Parts Grid */}
      {filteredParts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredParts.map((part) => (
            <PartCard key={part.id} part={part} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <PackageX className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">কোনো স্পেয়ার পার্টস পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-400">
              আপনার ফিল্টার বা নির্বাচিত মেশিনের সাথে মিল রয়েছে এমন কোনো পার্টস পাওয়া যায়নি।
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-semibold transition"
            >
              সব ফিল্টার মুছে ফেলুন
            </button>
            <button
              onClick={() => setIsSpecialRequestOpen(true)}
              className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>বিশেষ বা দুর্লভ পার্টের অনুরোধ করুন</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
