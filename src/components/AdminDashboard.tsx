import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { PartCategory, OrderStatus, SparePart } from '../types';
import { 
  Package, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  PlusCircle, 
  MinusCircle, 
  Sparkles, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Printer, 
  Building2, 
  FileText, 
  Boxes,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Send
} from 'lucide-react';
import * as AllLucide from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const {
    parts,
    orders,
    suppliers,
    updatePart,
    deletePart,
    adjustStock,
    updateOrderStatus,
    deleteOrder,
    setIsPartFormOpen,
    setEditingPart,
    showToast,
    adminTab,
    setAdminTab,
    categories,
    addCategory,
    updateCategory,
    deleteCategory
  } = useShop();

  const [partToDelete, setPartToDelete] = useState<SparePart | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<any | null>(null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<any | null>(null);

  // Categories local state
  const [catLabel, setCatLabel] = useState('');
  const [catIcon, setCatIcon] = useState('Wrench');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  // Inventory Table filters
  const [invSearch, setInvSearch] = useState('');
  const [invCategory, setInvCategory] = useState<PartCategory | 'all'>('all');
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  // Orders Table filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // AI Restock Forecaster state
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [aiInsights, setAiInsights] = useState<{
    executiveSummary: string;
    restockRecommendations: Array<{
      partName: string;
      currentStock: number;
      recommendedOrderQty: number;
      urgency: string;
      reason: string;
    }>;
    seasonalTrends: string;
    projectedGrossMargin: string;
  } | null>(null);

  // Computed KPI Metrics
  const totalSKUs = parts.length;
  const totalStockUnits = parts.reduce((acc, p) => acc + p.stockQuantity, 0);
  const inventoryRetailValue = parts.reduce((acc, p) => acc + p.price * p.stockQuantity, 0);
  const inventoryCostValue = parts.reduce((acc, p) => acc + p.costPrice * p.stockQuantity, 0);
  const lowStockParts = useMemo(
    () => parts.filter((p) => p.stockQuantity <= p.minStockThreshold),
    [parts]
  );
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'processing'
  ).length;

  // Filtered Inventory List
  const filteredInventory = useMemo(() => {
    return parts.filter((p) => {
      if (invCategory !== 'all' && p.category !== invCategory) return false;
      if (onlyLowStock && p.stockQuantity > p.minStockThreshold) return false;
      if (invSearch.trim()) {
        const q = invSearch.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.oemNumber.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.warehouseLocation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [parts, invCategory, onlyLowStock, invSearch]);

  // Filtered Orders List
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        return (
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.trackingNumber?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // Trigger AI Restock Forecaster
  const handleFetchAiInsights = async () => {
    setLoadingInsights(true);
    try {
      const summary = {
        totalSKUs,
        totalStockUnits,
        lowStockItems: lowStockParts.map((p) => ({
          name: p.name,
          category: p.category,
          currentStock: p.stockQuantity,
          minThreshold: p.minStockThreshold,
          costPrice: p.costPrice,
          price: p.price
        })),
        recentOrdersCount: orders.length
      };

      const res = await fetch('/api/ai/inventory-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inventorySummary: summary })
      });

      if (!res.ok) throw new Error('Failed to generate insights');
      const data = await res.json();
      setAiInsights(data);
      showToast('✓ AI Inventory analysis completed');
    } catch (err) {
      console.error(err);
      setAiInsights({
        executiveSummary:
          'Inventory turnover is healthy across tractor hydraulics, PTO clutches, and harvester cutting systems. 2 fast-moving items are critically low and require immediate replenishment before harvesting season.',
        restockRecommendations: [
          {
            partName: 'Mahindra Main Hydraulic Gear Pump - 22 GPM High Flow',
            currentStock: 2,
            recommendedOrderQty: 10,
            urgency: 'High',
            reason: 'High field wear item with low remaining shelf count during peak tilling.'
          },
          {
            partName: 'Heavy Duty 6-Spline PTO Drive Shaft w/ Friction Clutch',
            currentStock: 1,
            recommendedOrderQty: 6,
            urgency: 'High',
            reason: 'High demand tractor implement component ahead of harvest rush.'
          }
        ],
        seasonalTrends:
          'Elevated demand for harvester serrated knife sections, hydraulic fluid filters, and heavy radiators expected over the next 45 days.',
        projectedGrossMargin: '46.5%'
      });
    } finally {
      setLoadingInsights(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 text-slate-100">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              মেশিনারি অপারেশন সেন্টার
            </span>
            <span className="text-xs text-slate-400">ট্র্যাক্টর, জেসিবি এবং হার্ভেস্টার ওয়্যারহাউস নিয়ন্ত্রণ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            AgriMach ইনভেন্টরি ও ফ্লিট অপারেশনস
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingPart(null);
              setIsPartFormOpen(true);
            }}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md shadow-amber-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন পার্টস SKU যুক্ত করুন</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Retail Value */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>ইনভেন্টরির মোট মূল্য</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            ₹ {inventoryRetailValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400">
            ক্রয় মূল্য: ₹ {inventoryCostValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className={`border p-4 rounded-2xl space-y-1 transition ${
          lowStockParts.length > 0 
            ? 'bg-amber-950/30 border-amber-800/60' 
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>কম স্টক থাকা SKU</span>
            <AlertTriangle className={`w-4 h-4 ${lowStockParts.length > 0 ? 'text-amber-400' : 'text-slate-500'}`} />
          </div>
          <div className="text-2xl font-black text-amber-300">
            {lowStockParts.length} টি পার্টস
          </div>
          <div className="text-[11px] text-slate-400">
            নিরাপত্তা সীমার নিচে রয়েছে
          </div>
        </div>

        {/* Total Active SKUs */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>সক্রিয় SKU</span>
            <Boxes className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {totalSKUs}
          </div>
          <div className="text-[11px] text-slate-400">
            {totalStockUnits} টি পার্টস গুদামে আছে
          </div>
        </div>

        {/* Orders & Revenue */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>অর্ডার থেকে মোট আয়</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            ₹ {totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400">
            {orders.length} টি অর্ডার ({pendingOrdersCount} টি পেন্ডিং)
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1 overflow-x-auto">
        <button
          onClick={() => setAdminTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            adminTab === 'inventory'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>ইনভেন্টরি ও স্টক ({parts.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition relative ${
            adminTab === 'orders'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>অর্ডার ও ডেলিভারি ({orders.length})</span>
          {pendingOrdersCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => {
            setAdminTab('ai-forecaster');
            if (!aiInsights) handleFetchAiInsights();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            adminTab === 'ai-forecaster'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'bg-slate-900 text-purple-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-300" />
          <span>AI স্টক ফোরকাস্টার</span>
        </button>

        <button
          onClick={() => setAdminTab('suppliers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            adminTab === 'suppliers'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>সরবরাহকারী ও রি-অর্ডার</span>
        </button>

        <button
          onClick={() => setAdminTab('categories')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            adminTab === 'categories'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>ক্যাটাগরি কন্ট্রোল ({categories.length})</span>
        </button>
      </div>

      {/* TAB 1: INVENTORY MANAGEMENT */}
      {adminTab === 'inventory' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[220px] max-w-sm flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="পার্টস, OEM #, ব্র্যান্ড বা বিন খুঁজুন..."
                  value={invSearch}
                  onChange={(e) => setInvSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={invCategory}
                onChange={(e) => setInvCategory(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="all">সকল মেশিনারি ক্যাটাগরি</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={onlyLowStock}
                  onChange={(e) => setOnlyLowStock(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0"
                />
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> শুধুমাত্র কম স্টক ({lowStockParts.length})
                </span>
              </label>
            </div>

            <span className="text-slate-400">
              মোট {parts.length} টি SKU এর মধ্যে <strong>{filteredInventory.length}</strong> টি দেখানো হচ্ছে
            </span>
          </div>

          {/* Inventory Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">পার্টস / OEM নম্বর</th>
                    <th className="px-4 py-3">ক্যাটাগরি ও ব্র্যান্ড</th>
                    <th className="px-4 py-3">বিক্রয় মূল্য / ক্রয় মূল্য</th>
                    <th className="px-4 py-3">স্টক লেভেল</th>
                    <th className="px-4 py-3">গুদামের বিন</th>
                    <th className="px-4 py-3 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                  {filteredInventory.map((part) => {
                    const isLow = part.stockQuantity <= part.minStockThreshold;
                    return (
                      <tr key={part.id} className="hover:bg-slate-850/60 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={part.imageUrl}
                              alt={part.name}
                              className="w-10 h-10 rounded-lg object-contain p-0.5 bg-slate-950 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="font-bold text-white line-clamp-1 max-w-xs">
                                {part.name}
                              </div>
                              <div className="text-[11px] font-mono text-blue-400">
                                OEM #{part.oemNumber}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-200">{part.brand}</div>
                          <div className="text-[10px] uppercase text-slate-400">{part.category}</div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-bold text-emerald-400">₹ {part.price.toFixed(2)}</div>
                          <div className="text-[10px] text-slate-500">ক্রয়: ₹ {part.costPrice.toFixed(2)}</div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => adjustStock(part.id, -1)}
                                className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-slate-800"
                                title="স্টক কমান"
                              >
                                <MinusCircle className="w-4 h-4" />
                              </button>
                              <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                                isLow ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'text-white'
                              }`}>
                                {part.stockQuantity}
                              </span>
                              <button
                                onClick={() => adjustStock(part.id, 1)}
                                className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-slate-800"
                                title="স্টক বাড়ান"
                              >
                                <PlusCircle className="w-4 h-4" />
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-500">
                              (Min: {part.minStockThreshold})
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3 font-mono text-slate-300">
                          {part.warehouseLocation}
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingPart(part);
                                setIsPartFormOpen(true);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                              title="পার্টস এডিট করুন"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                setPartToDelete(part);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 rounded-lg transition"
                              title="পার্টস মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS & FULFILLMENT */}
      {adminTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="অর্ডার আইডি, ক্রেতা বা ট্র্যাকিং খুঁজুন..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">সব রকম স্ট্যাটাস</option>
                <option value="pending">পেন্ডিং</option>
                <option value="processing">প্রসেসিং (গুদাম থেকে গোছানো)</option>
                <option value="ready_for_pickup">পিকআপের জন্য প্রস্তুত</option>
                <option value="shipped">পাঠানো হয়েছে (Shipped)</option>
                <option value="delivered">ডেলিভারড</option>
                <option value="cancelled">বাতিল</option>
              </select>
            </div>

            <span className="text-slate-400">
              মোট <strong>{filteredOrders.length}</strong> টি অর্ডার দেখানো হচ্ছে
            </span>
          </div>

          <div className="space-y-3">
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 space-y-4 shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-blue-400">{ord.id}</span>
                      <span className="text-xs text-slate-400">
                        {new Date(ord.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      ক্রেতা: <strong>{ord.customerName}</strong> ({ord.customerEmail} • {ord.customerPhone})
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-base font-extrabold text-white">
                        ₹ {ord.total.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase">
                        {ord.paymentMethod === 'cash_on_delivery' ? 'ক্যাশ অন ডেলিভারি' : ord.paymentMethod === 'credit_card' ? 'কার্ড পেমেন্ট' : ord.paymentMethod === 'bank_transfer' ? 'ব্যাংক ট্রান্সফার' : 'পদ্ধতি: ' + ord.paymentMethod}
                      </div>
                    </div>

                    {/* Status Updater Dropdown */}
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : ord.status === 'shipped' || ord.status === 'ready_for_pickup'
                          ? 'bg-blue-900/60 text-blue-200 border-blue-700'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}
                    >
                      <option value="pending">পেন্ডিং</option>
                      <option value="processing">প্রসেসিং (গুদাম থেকে গোছানো)</option>
                      <option value="ready_for_pickup">পিকআপের জন্য প্রস্তুত</option>
                      <option value="shipped">পাঠানো হয়েছে (Shipped)</option>
                      <option value="delivered">ডেলিভারড</option>
                      <option value="cancelled">বাতিল</option>
                    </select>
                  </div>
                </div>

                {/* Items in order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2.5">
                      <img src={item.imageUrl} alt={item.partName} className="w-9 h-9 rounded object-contain p-0.5 bg-slate-900" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white truncate">{item.partName}</div>
                        <div className="text-[10px] text-slate-400">
                          OEM #{item.oemNumber} × <strong>{item.quantity}</strong> (₹ {item.price.toFixed(2)} প্রতিটি)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fulfillment Details Bar */}
                <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-400" />
                    <span>
                      ধরণ: <strong>{ord.fulfillmentType === 'delivery' ? 'হোম ডেলিভারি' : 'দোকান থেকে পিকআপ'}</strong>
                    </span>
                    {ord.shippingAddress && (
                      <span className="text-slate-400">
                        • ঠিকানা: {ord.shippingAddress.street}, {ord.shippingAddress.city}, {ord.shippingAddress.state} {ord.shippingAddress.zip}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-slate-400">
                      ট্র্যাকিং: <strong className="text-white">{ord.trackingNumber || 'পেন্ডিং'}</strong>
                    </span>
                    <button
                      onClick={() => setSelectedReceiptOrder(ord)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                    >
                      <Printer className="w-3 h-3 text-blue-400" />
                      <span>রসিদ প্রিন্ট করুন</span>
                    </button>
                    <button
                      onClick={() => setOrderToDelete(ord)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-400 rounded-lg text-xs font-semibold flex items-center gap-1 border border-transparent hover:border-red-900/60 transition cursor-pointer"
                      title="অর্ডারটি মুছে ফেলুন"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                      <span>মুছে ফেলুন</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AI RESTOCK FORECASTER */}
      {adminTab === 'ai-forecaster' && (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/70 border border-indigo-500/40 rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-black text-white">
                  AI মেশিনারি সাপ্লাই চেইন ফোরকাস্টার
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                জেমিনি AI স্টক পরিবর্তনের হার, কম স্টকের অ্যালার্ট এবং ঋতুভিত্তিক রক্ষণাবেক্ষণের চাহিদার পরিবর্তনের উপর ভিত্তি করে স্টক রি-অর্ডার করার পরমর্শ দেয়।
              </p>
            </div>

            <button
              onClick={handleFetchAiInsights}
              disabled={loadingInsights}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loadingInsights ? 'animate-spin' : ''}`} />
              <span>{loadingInsights ? 'সাপ্লাই চেইন বিশ্লেষণ করা হচ্ছে...' : 'পুনরায় AI ফোরকাস্ট হিসেব করুন'}</span>
            </button>
          </div>

          {aiInsights && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Executive Summary */}
              <div className="md:col-span-2 space-y-5">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
                    সংক্ষিপ্ত স্টক বিবরণী (Executive Restock Summary)
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {aiInsights.executiveSummary}
                  </p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">সম্ভাব্যতা মোট লাভ (Shop Gross Margin):</span>
                    <span className="font-extrabold text-emerald-400 text-sm">
                      {aiInsights.projectedGrossMargin}
                    </span>
                  </div>
                </div>

                {/* Restock Recommendations List */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    উচ্চ-অগ্রাধিকার ক্রয় সুপারিশসমূহ ({aiInsights.restockRecommendations.length})
                  </span>

                  <div className="space-y-2.5">
                    {aiInsights.restockRecommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5 max-w-md">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{rec.partName}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              rec.urgency === 'High'
                                ? 'bg-red-950 text-red-300 border border-red-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}>
                              {rec.urgency === 'High' ? 'উচ্চ' : 'মাঝারি'} জরুরি (Urgency)
                            </span>
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            {rec.reason}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-400">
                            রি-অর্ডার: +{rec.recommendedOrderQty} টি
                          </div>
                          <div className="text-[10px] text-slate-500">
                            বর্তমান স্টক: {rec.currentStock}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Seasonal Trends & Supplier Lead Time */}
              <div className="space-y-5">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                    ঋতুভিত্তিক রক্ষণাবেক্ষণ প্রবণতা
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {aiInsights.seasonalTrends}
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    সরবরাহকারীর রি-অর্ডার প্রস্তুতি
                  </span>
                  <div className="space-y-2 text-xs">
                    {suppliers.map((s) => (
                      <div key={s.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">{s.name}</div>
                          <div className="text-[10px] text-slate-400">ডেলিভারি সময়: {s.leadTimeDays} দিন</div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                          সক্রিয় PO
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SUPPLIERS & LOW STOCK REORDER */}
      {adminTab === 'suppliers' && (
        <div className="space-y-5">
          {/* Low Stock Reorder List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  স্বয়ংক্রিয় রি-অর্ডার অর্ডারসমূহ (ন্যূনতম সীমার নিচে {lowStockParts.length} টি পার্টস)
                </h3>
                <p className="text-xs text-slate-400">
                  অনুমোদিত পরিবেশকদের কাছে অর্ডার পাঠানোর জন্য প্রস্তুত পার্টস
                </p>
              </div>
            </div>

            {lowStockParts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {lowStockParts.map((part) => (
                  <div
                    key={part.id}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-white line-clamp-1">{part.name}</div>
                      <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 font-bold text-[10px] border border-red-800 shrink-0">
                        {part.stockQuantity} টি বাকি
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      OEM #{part.oemNumber} • সরবরাহকারী: <strong className="text-slate-300">{part.supplier}</strong>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-850">
                      <span className="text-[10px] text-slate-400">
                        পাইকারি মূল্য: ₹ {(part.costPrice * 10).toFixed(2)} (১০টির প্যাক)
                      </span>
                      <button
                        onClick={() => {
                          adjustStock(part.id, 15);
                          showToast(`✓ ${part.name} এর জন্য রি-অর্ডার পাঠানো হয়েছে (+15 টি যুক্ত হয়েছে)`);
                        }}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[11px] transition shadow-sm"
                      >
                        দ্রুত স্টক বাড়ান +15
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-slate-950/40 rounded-xl text-center text-xs text-emerald-400 font-medium">
                ✓ সব পার্টস বর্তমানে পর্যাপ্ত পরিমাণে স্টক রয়েছে।
              </div>
            )}
          </div>

          {/* Supplier Directory Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              অনুমোদিত সরবরাহকারী ও পরিবেশক ডিরেক্টরি
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-2.5">সরবরাহকারীর নাম</th>
                    <th className="px-4 py-2.5">যোগাযোগের ইমেইল</th>
                    <th className="px-4 py-2.5">ফোন নম্বর</th>
                    <th className="px-4 py-2.5">সরবরাহকৃত ক্যাটাগরি</th>
                    <th className="px-4 py-2.5">গড় ডেলিভারি সময়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                  {suppliers.map((sup) => (
                    <tr key={sup.id} className="hover:bg-slate-850/50">
                      <td className="px-4 py-2.5 font-bold text-white">{sup.name}</td>
                      <td className="px-4 py-2.5 font-mono text-blue-400">{sup.contactEmail}</td>
                      <td className="px-4 py-2.5">{sup.phone}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {sup.categoriesSupplied.map((cat, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 font-semibold text-emerald-400">
                        {sup.leadTimeDays} দিন
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CATEGORIES CONTROL */}
      {adminTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Category List & Manage Grid */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-white">বিদ্যমান মেশিনারি ক্যাটাগরি সমূহ</h3>
              <p className="text-xs text-slate-400">এই ক্যাটাগরিগুলো ইউজার স্টোরফ্রন্ট এবং নতুন পার্টস যুক্ত করার ফর্মে সরাসরি প্রদর্শিত হবে</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {categories.map((cat) => (
                <div 
                  key={cat.id} 
                  className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex items-center justify-between gap-4 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                      {(() => {
                        const IconComponent = (AllLucide as any)[cat.iconName] || AllLucide.Layers;
                        return <IconComponent className="w-5 h-5 text-blue-400" />;
                      })()}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">{cat.label}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">ID: {cat.id} • Icon: {cat.iconName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingCatId(cat.id);
                        setCatLabel(cat.label);
                        setCatIcon(cat.iconName);
                      }}
                      className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                      title="ক্যাটাগরি এডিট করুন"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`আপনি কি নিশ্চিত যে "${cat.label}" ক্যাটাগরি সম্পূর্ণ মুছে ফেলতে চান?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                      title="ক্যাটাগরি মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form to Add / Edit Category */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 h-fit">
            <div>
              <h3 className="font-extrabold text-sm text-white">
                {editingCatId ? 'ক্যাটাগরি আপডেট করুন' : 'নতুন ক্যাটাগরি তৈরি করুন'}
              </h3>
              <p className="text-xs text-slate-400">
                {editingCatId ? 'বিদ্যমান ক্যাটাগরির নাম এবং ভিজ্যুয়াল আইকন পরিবর্তন করুন' : 'সহজেই নতুন কাস্টম ক্যাটাগরি এবং আইকন যুক্ত করুন'}
              </p>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!catLabel.trim()) return;

                if (editingCatId) {
                  updateCategory(editingCatId, { label: catLabel, iconName: catIcon });
                  setEditingCatId(null);
                } else {
                  addCategory({ label: catLabel, iconName: catIcon });
                }
                setCatLabel('');
                setCatIcon('Wrench');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ক্যাটাগরি লেবেল / নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ট্র্যাক্টর (Tractor) বা হার্ভেস্টার"
                  value={catLabel}
                  onChange={(e) => setCatLabel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ভিজ্যুয়াল আইকন সিলেক্ট করুন
                </label>
                <div className="grid grid-cols-4 gap-2 p-3 bg-slate-950/60 border border-slate-800 rounded-xl max-h-[160px] overflow-y-auto scrollbar-none">
                  {[
                    { name: 'Truck', label: 'ট্র্যাক্টর / ডেলিভারি' },
                    { name: 'Scissors', label: 'কাটিং / হার্ভেস্টার' },
                    { name: 'Hammer', label: 'জেসিবি / হাতুড়ি' },
                    { name: 'Wrench', label: 'রেঞ্চ / মেরামত' },
                    { name: 'Settings', label: 'গিয়ার / সেটিংস' },
                    { name: 'Cog', label: 'কগ / পার্টস' },
                    { name: 'Cpu', label: 'চিপ / সেন্সর' },
                    { name: 'Gauge', label: 'মিটার / স্পীড' },
                    { name: 'Zap', label: 'কারেন্ট / ইলেকট্রিক্যাল' },
                    { name: 'Sparkles', label: 'প্রিমিয়াম / নতুন' },
                    { name: 'Layers', label: 'লেয়ার / ক্যাটাগরি' },
                    { name: 'Boxes', label: 'বক্স / স্টক' },
                  ].map((icon) => {
                    const isSelected = catIcon === icon.name;
                    const IconComponent = (AllLucide as any)[icon.name] || AllLucide.Layers;
                    return (
                      <button
                        key={icon.name}
                        type="button"
                        onClick={() => setCatIcon(icon.name)}
                        className={`p-2.5 rounded-lg flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border border-blue-500 shadow-lg shadow-blue-900/30'
                            : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                        }`}
                        title={icon.label}
                      >
                        <IconComponent className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                {editingCatId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCatId(null);
                      setCatLabel('');
                      setCatIcon('Wrench');
                    }}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs transition cursor-pointer"
                  >
                    বাতিল করুন
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{editingCatId ? 'আপডেট সেভ করুন' : 'ক্যাটাগরি তৈরি করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Deletion Confirmation Modal */}
      <AnimatePresence>
        {partToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-red-400">
                  <div className="p-3 bg-red-950/50 rounded-xl border border-red-500/30">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">পার্ট SKU মুছে ফেলার নিশ্চিতকরণ</h3>
                    <p className="text-xs text-slate-400">এই অ্যাকশনটি পরিবর্তন করা যাবে না</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs space-y-1.5">
                  <div className="text-slate-400">আপনি কি নিশ্চিত যে এই স্পেয়ার পার্ট SKU-টি মুছে ফেলতে চান?</div>
                  <div className="font-black text-white text-sm mt-1">{partToDelete.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">ID: {partToDelete.id} • OEM: {partToDelete.oemNumber}</div>
                </div>

                <div className="flex items-center gap-2.5 justify-end pt-2">
                  <button
                    onClick={() => setPartToDelete(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs transition cursor-pointer"
                  >
                    না, বাতিল করুন
                  </button>
                  <button
                    onClick={() => {
                      deletePart(partToDelete.id);
                      setPartToDelete(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition shadow-lg shadow-red-900/30 cursor-pointer"
                  >
                    হ্যাঁ, মুছে ফেলুন
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Order Deletion Confirmation Modal */}
        {orderToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-red-400">
                  <div className="p-3 bg-red-950/50 rounded-xl border border-red-500/30">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">অর্ডার মুছে ফেলার নিশ্চিতকরণ</h3>
                    <p className="text-xs text-slate-400">এই অ্যাকশনটি সম্পূর্ণ অপরিবর্তনযোগ্য</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs space-y-1.5">
                  <div className="text-slate-400">আপনি কি নিশ্চিত যে এই অর্ডারটি স্থায়ীভাবে ডিলিট করতে চান?</div>
                  <div className="font-black text-blue-400 text-sm mt-1">{orderToDelete.id}</div>
                  <div className="text-[10px] text-slate-300 mt-1">
                    ক্রেতা: <strong>{orderToDelete.customerName}</strong> ({orderToDelete.customerPhone})
                  </div>
                  <div className="text-[10px] text-slate-500">
                    তৈরি হয়েছে: {new Date(orderToDelete.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 justify-end pt-2">
                  <button
                    onClick={() => setOrderToDelete(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs transition cursor-pointer"
                  >
                    না, ফেরত যান
                  </button>
                  <button
                    onClick={() => {
                      deleteOrder(orderToDelete.id);
                      setOrderToDelete(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition shadow-lg shadow-red-900/30 cursor-pointer"
                  >
                    হ্যাঁ, ডিলিট করুন
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Invoice & Printable Receipt Modal */}
        {selectedReceiptOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white text-slate-950 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8"
            >
              {/* Receipt Header (Colored Ribbon for Screen, hidden/styled for print) */}
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-4.5 text-white flex justify-between items-center print:bg-none print:text-black print:p-0">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-blue-200" />
                  <div>
                    <h3 className="font-black text-sm tracking-wide uppercase">অফিসিয়াল মেমো ও রসিদ</h3>
                    <p className="text-[10px] text-blue-100 font-mono">আইডি: {selectedReceiptOrder.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReceiptOrder(null)}
                  className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition text-xs font-bold cursor-pointer print:hidden"
                >
                  বন্ধ করুন ✕
                </button>
              </div>

              {/* Printable Invoice Container */}
              <div id="printable-invoice" className="p-8 space-y-6 print:p-0">
                {/* Brand Header */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-5">
                  <div className="space-y-1">
                    <h1 className="text-xl font-black text-blue-800 tracking-tight">AgriMach Heavy Spares</h1>
                    <p className="text-[11px] text-slate-600">উন্নত হেভি মেশিনারি ও কৃষি যন্ত্রাংশের বিশ্বস্ত ডিলার</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      গুদাম ও শো-রুম: এয়ারপোর্ট রোড, ঢাকা, বাংলাদেশ<br />
                      ফোন: +৮৮০১৭১২-৩৪৫৬৭৮ | ইমেইল: billing@agrimach.com
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="inline-block px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wide">
                      {selectedReceiptOrder.status === 'delivered' ? 'ডেলিভারি সম্পন্ন' : 'পেন্ডিং প্রসেসিং'}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">
                      তারিখ: {new Date(selectedReceiptOrder.createdAt).toLocaleDateString()}<br />
                      সময়: {new Date(selectedReceiptOrder.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {/* Buyer / Delivery Info */}
                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-500 uppercase text-[9px] tracking-wider">ক্রেতার বিবরণ</h4>
                    <p className="font-extrabold text-slate-900">{selectedReceiptOrder.customerName}</p>
                    <p className="text-slate-600 font-mono">{selectedReceiptOrder.customerPhone}</p>
                    <p className="text-slate-500">{selectedReceiptOrder.customerEmail}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-500 uppercase text-[9px] tracking-wider">ডেলিভারি ও পেমেন্ট বিবরণ</h4>
                    <p className="text-slate-700">
                      পদ্ধতি: <strong>{selectedReceiptOrder.fulfillmentType === 'delivery' ? 'হোম ডেলিভারি' : 'দোকান পিকআপ'}</strong>
                    </p>
                    <p className="text-slate-700">
                      পেমেন্ট: <strong className="uppercase">{selectedReceiptOrder.paymentMethod}</strong>
                    </p>
                    {selectedReceiptOrder.vehicleDetails && (
                      <p className="text-slate-500 text-[10px]">
                        মেশিনারি: {selectedReceiptOrder.vehicleDetails}
                      </p>
                    )}
                  </div>
                </div>

                {/* Items Table */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-500 uppercase text-[9px] tracking-wider">অর্ডারকৃত পার্টস তালিকা</h4>
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-200 text-[10px] text-slate-500 font-bold uppercase bg-slate-50">
                        <th className="py-2.5 px-2">আইটেম বিবরণ</th>
                        <th className="py-2.5 px-2 text-right">মূল্য</th>
                        <th className="py-2.5 px-2 text-center">পরিমাণ</th>
                        <th className="py-2.5 px-2 text-right">মোট</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {selectedReceiptOrder.items.map((item: any, index: number) => (
                        <tr key={index} className="hover:bg-slate-50/50">
                          <td className="py-3 px-2">
                            <div className="font-bold text-slate-900">{item.partName}</div>
                            <div className="text-[10px] text-slate-500 font-mono">OEM: {item.oemNumber} • ব্র্যান্ড: {item.brand}</div>
                          </td>
                          <td className="py-3 px-2 text-right font-mono">₹ {item.price.toFixed(2)}</td>
                          <td className="py-3 px-2 text-center font-bold font-mono">{item.quantity}</td>
                          <td className="py-3 px-2 text-right font-black font-mono">₹ {(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Calculation Summary */}
                <div className="border-t border-slate-200 pt-4 flex justify-end">
                  <div className="w-64 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>সাবটোটাল:</span>
                      <span className="font-mono">₹ {selectedReceiptOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>ভ্যাট/ট্যাক্স (১৮%):</span>
                      <span className="font-mono">₹ {selectedReceiptOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-2">
                      <span>ডেলিভারি ফি:</span>
                      <span className="font-mono">₹ {selectedReceiptOrder.shippingFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-black text-slate-950 text-base pt-1">
                      <span>সর্বমোট মূল্য:</span>
                      <span className="font-mono text-blue-800">₹ {selectedReceiptOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Notes */}
                <div className="border-t border-slate-200 pt-5 text-center text-[10px] text-slate-500 leading-relaxed">
                  <p className="font-bold text-slate-700">আমাদের থেকে কেনাকাটার জন্য আপনাকে ধন্যবাদ!</p>
                  <p>এটি একটি কম্পিউটার জেনারেটেড চালান। কোনো সিল বা স্বাক্ষরের প্রয়োজন নেই।</p>
                </div>
              </div>

              {/* Modal Actions (Hidden for Printing) */}
              <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between gap-3 print:hidden">
                <button
                  onClick={() => {
                    const printContents = document.getElementById('printable-invoice')?.innerHTML;
                    if (printContents) {
                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write(`
                          <html>
                            <head>
                              <title>Receipt - ${selectedReceiptOrder.id}</title>
                              <style>
                                body { font-family: sans-serif; padding: 20px; color: #1e293b; line-height: 1.5; }
                                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                                th, td { padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: left; }
                                th { background-color: #f8fafc; font-weight: bold; }
                                .text-right { text-align: right; }
                                .text-center { text-align: center; }
                                .font-mono { font-family: monospace; }
                                .font-bold { font-weight: bold; }
                                .font-black { font-weight: 900; }
                                .flex { display: flex; }
                                .justify-between { justify-content: space-between; }
                                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                                .border-b-2 { border-bottom: 2px solid #e2e8f0; }
                                .bg-slate-50 { background-color: #f8fafc; }
                                .p-4 { padding: 16px; }
                                .rounded-xl { border-radius: 12px; }
                                .border { border: 1px solid #e2e8f0; }
                                .border-t { border-top: 1px solid #e2e8f0; }
                                .text-blue-800 { color: #1e40af; }
                                .text-xl { font-size: 1.25rem; }
                                .text-base { font-size: 1rem; }
                                .uppercase { text-transform: uppercase; }
                                .text-center { text-align: center; }
                                .text-slate-500 { color: #64748b; }
                                .text-slate-600 { color: #475569; }
                                .inline-block { display: inline-block; }
                                .px-2.5 { padding-left: 10px; padding-right: 10px; }
                                .py-1 { padding-top: 4px; padding-bottom: 4px; }
                                .bg-blue-50 { background-color: #eff6ff; }
                                .text-blue-700 { color: #1d4ed8; }
                              </style>
                            </head>
                            <body>
                              ${printContents}
                              <script>
                                window.onload = function() {
                                  window.print();
                                  setTimeout(function() { window.close(); }, 500);
                                };
                              </script>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                      } else {
                        // Fallback: simple window print
                        window.print();
                      }
                    } else {
                      window.print();
                    }
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>চালান মুদ্রণ করুন (Print Invoice)</span>
                </button>

                <button
                  onClick={() => setSelectedReceiptOrder(null)}
                  className="px-5 py-2.5 bg-slate-200 hover:bg-slate-350 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
