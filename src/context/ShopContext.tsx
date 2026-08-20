import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SparePart, 
  Order, 
  Supplier, 
  UserVehicle, 
  CartItem, 
  PartCategory, 
  OrderStatus,
  CategoryConfig
} from '../types';
import { 
  INITIAL_PARTS, 
  INITIAL_ORDERS, 
  INITIAL_SUPPLIERS, 
  DEFAULT_VEHICLES 
} from '../data/mockData';
import {
  getCollectionWithSeeding,
  savePartToDb,
  deletePartFromDb,
  saveOrderToDb,
  deleteOrderFromDb,
  saveSupplierToDb,
  deleteSupplierFromDb,
  saveCategoryToDb,
  deleteCategoryFromDb,
  saveVehicleToDb,
  deleteVehicleFromDb
} from '../lib/firebase';

interface ShopContextType {
  // Mode
  mode: 'user' | 'admin';
  setMode: (mode: 'user' | 'admin') => void;

  // Parts
  parts: SparePart[];
  addPart: (part: Omit<SparePart, 'id' | 'rating' | 'reviewCount'>) => void;
  updatePart: (id: string, updated: Partial<SparePart>) => void;
  deletePart: (id: string) => void;
  adjustStock: (id: string, delta: number) => void;

  // Active Vehicle & Garage
  userVehicles: UserVehicle[];
  activeVehicle: UserVehicle | null;
  setActiveVehicle: (vehicle: UserVehicle | null) => void;
  addUserVehicle: (vehicle: Omit<UserVehicle, 'id'>) => void;
  removeUserVehicle: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (part: SparePart, quantity?: number) => void;
  removeFromCart: (partId: string) => void;
  updateCartQuantity: (partId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  deleteOrder: (orderId: string) => void;

  // Suppliers
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;

  // Categories CRUD
  categories: CategoryConfig[];
  addCategory: (category: Omit<CategoryConfig, 'id'>) => void;
  updateCategory: (id: string, updated: Partial<CategoryConfig>) => void;
  deleteCategory: (id: string) => void;

  // Filter & Search state for storefront
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: PartCategory | 'all';
  setSelectedCategory: (category: PartCategory | 'all') => void;
  selectedBrand: string | 'all';
  setSelectedBrand: (brand: string | 'all') => void;
  onlyInStock: boolean;
  setOnlyInStock: (only: boolean) => void;
  onlyFitActiveVehicle: boolean;
  setOnlyFitActiveVehicle: (only: boolean) => void;
  sortBy: 'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'stock';
  setSortBy: (sort: 'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'stock') => void;

  // Selected Part for Detail View
  inspectedPart: SparePart | null;
  setInspectedPart: (part: SparePart | null) => void;

  // Active UI Dialogs
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isDiagnosticOpen: boolean;
  setIsDiagnosticOpen: (open: boolean) => void;
  isGarageModalOpen: boolean;
  setIsGarageModalOpen: (open: boolean) => void;
  isOrdersModalOpen: boolean;
  setIsOrdersModalOpen: (open: boolean) => void;
  isPartFormOpen: boolean;
  setIsPartFormOpen: (open: boolean) => void;
  editingPart: SparePart | null;
  setEditingPart: (part: SparePart | null) => void;
  isSpecialRequestOpen: boolean;
  setIsSpecialRequestOpen: (open: boolean) => void;

  // Admin Tab
  adminTab: 'inventory' | 'orders' | 'ai-forecaster' | 'suppliers' | 'categories';
  setAdminTab: (tab: 'inventory' | 'orders' | 'ai-forecaster' | 'suppliers' | 'categories') => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persisted state or fallback to initial data
  const [mode, setMode] = useState<'user' | 'admin'>(() => {
    return (localStorage.getItem('autopulse_mode') as 'user' | 'admin') || 'user';
  });

  const [parts, setParts] = useState<SparePart[]>(() => {
    const saved = localStorage.getItem('autopulse_parts');
    if (saved) {
      try {
        const parsed: SparePart[] = JSON.parse(saved);
        // If there are parts with old IDs (e.g. part-001, part-002, etc.), or containing the old Starter Motor, clear and return INITIAL_PARTS
        const hasOldParts = parsed.some(p => 
          !p.id.startsWith('part-tractor-') && !p.id.startsWith('part-harvester-') && !p.id.startsWith('part-jcb-') ||
          p.brand === 'Lucas-TVS Heavy Electricals' ||
          p.name.includes('Starter Motor')
        );
        if (hasOldParts) {
          localStorage.removeItem('autopulse_parts');
          return INITIAL_PARTS;
        }
        return parsed;
      } catch (e) {
        return INITIAL_PARTS;
      }
    }
    return INITIAL_PARTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('autopulse_orders');
    if (saved) {
      try {
        const parsed: Order[] = JSON.parse(saved);
        // If there are orders referencing old parts, reset to INITIAL_ORDERS
        const hasOldOrders = parsed.some(ord => 
          ord.items.some(item => 
            !item.partId.startsWith('part-tractor-') && !item.partId.startsWith('part-harvester-') && !item.partId.startsWith('part-jcb-') ||
            item.brand === 'Lucas-TVS Heavy Electricals' ||
            item.partName.includes('Starter Motor')
          )
        );
        if (hasOldOrders) {
          localStorage.removeItem('autopulse_orders');
          return INITIAL_ORDERS;
        }
        return parsed.filter(ord => ord.id !== 'ORD-AGRI-501');
      } catch (e) {
        return INITIAL_ORDERS;
      }
    }
    return INITIAL_ORDERS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('autopulse_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [userVehicles, setUserVehicles] = useState<UserVehicle[]>(() => {
    const saved = localStorage.getItem('autopulse_vehicles');
    if (saved) {
      try {
        const parsed: UserVehicle[] = JSON.parse(saved);
        const hasOldVehicles = parsed.some(v => v.machineryType !== 'Tractor' && v.machineryType !== 'JCB / Backhoe' && v.machineryType !== 'Harvester');
        if (hasOldVehicles) {
          localStorage.removeItem('autopulse_vehicles');
          return DEFAULT_VEHICLES;
        }
        return parsed;
      } catch (e) {
        return DEFAULT_VEHICLES;
      }
    }
    return DEFAULT_VEHICLES;
  });

  const [activeVehicle, setActiveVehicle] = useState<UserVehicle | null>(() => {
    const saved = localStorage.getItem('autopulse_vehicles');
    let vehList = DEFAULT_VEHICLES;
    if (saved) {
      try {
        const parsed: UserVehicle[] = JSON.parse(saved);
        const hasOldVehicles = parsed.some(v => v.machineryType !== 'Tractor' && v.machineryType !== 'JCB / Backhoe' && v.machineryType !== 'Harvester');
        if (!hasOldVehicles) {
          vehList = parsed;
        }
      } catch (e) {
        // ignore
      }
    }
    return vehList.find((v: UserVehicle) => v.isDefault) || vehList[0] || null;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('autopulse_cart');
    if (saved) {
      try {
        const parsed: CartItem[] = JSON.parse(saved);
        const hasOldCart = parsed.some(item => 
          !item.part.id.startsWith('part-tractor-') && !item.part.id.startsWith('part-harvester-') && !item.part.id.startsWith('part-jcb-') ||
          item.part.brand === 'Lucas-TVS Heavy Electricals' ||
          item.part.name.includes('Starter Motor')
        );
        if (hasOldCart) {
          localStorage.removeItem('autopulse_cart');
          return [];
        }
        return parsed;
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Categories State & CRUD
  const INITIAL_CATEGORIES: CategoryConfig[] = [
    { id: 'tractor', label: 'ট্র্যাক্টর (Tractor)', iconName: 'Truck' },
    { id: 'harvester', label: 'হার্ভেস্টার (Harvester)', iconName: 'Scissors' },
    { id: 'jcb', label: 'জেসিবি (JCB)', iconName: 'Hammer' },
  ];

  const [categories, setCategories] = useState<CategoryConfig[]>(() => {
    const saved = localStorage.getItem('autopulse_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_CATEGORIES;
      }
    }
    return INITIAL_CATEGORIES;
  });

  // Sync data from Firestore on mount
  useEffect(() => {
    async function syncFirestore() {
      try {
        const [dbParts, dbOrders, dbSuppliers, dbCategories, dbVehicles] = await Promise.all([
          getCollectionWithSeeding<SparePart>('parts', INITIAL_PARTS),
          getCollectionWithSeeding<Order>('orders', INITIAL_ORDERS),
          getCollectionWithSeeding<Supplier>('suppliers', INITIAL_SUPPLIERS),
          getCollectionWithSeeding<CategoryConfig>('categories', INITIAL_CATEGORIES),
          getCollectionWithSeeding<UserVehicle>('vehicles', DEFAULT_VEHICLES)
        ]);
        
        // Filter out any leftover ORD-AGRI-501 mock order
        const filteredOrders = dbOrders.filter(ord => ord.id !== 'ORD-AGRI-501');
        
        setParts(dbParts);
        setOrders(filteredOrders);
        setSuppliers(dbSuppliers);
        setCategories(dbCategories);
        setUserVehicles(dbVehicles);

        const active = dbVehicles.find(v => v.isDefault) || dbVehicles[0] || null;
        setActiveVehicle(active);

        // Permanently delete ORD-AGRI-501 from Firestore if it exists
        try {
          await deleteOrderFromDb('ORD-AGRI-501');
        } catch (dbErr) {
          // ignore if already deleted or doesn't exist
        }
      } catch (err) {
        console.error('Error syncing with Firestore:', err);
      }
    }
    syncFirestore();
  }, []);

  const addCategory = (cat: Omit<CategoryConfig, 'id'>) => {
    const newId = cat.label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const finalId = newId || `cat-${Date.now()}`;
    const newCat: CategoryConfig = {
      id: finalId,
      ...cat
    };
    setCategories(prev => [...prev, newCat]);
    saveCategoryToDb(newCat).catch(err => console.error(err));
    showToast(`✓ ক্যাটাগরি "${cat.label}" সফলভাবে যুক্ত হয়েছে`);
  };

  const updateCategory = (id: string, updated: Partial<CategoryConfig>) => {
    setCategories(prev => prev.map(c => {
      if (c.id === id) {
        const u = { ...c, ...updated };
        saveCategoryToDb(u).catch(err => console.error(err));
        return u;
      }
      return c;
    }));
    showToast(`✓ ক্যাটাগরি তথ্য আপডেট করা হয়েছে`);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => {
      const filtered = prev.filter(c => c.id !== id);
      return filtered;
    });
    deleteCategoryFromDb(id).catch(err => console.error(err));
    showToast(`✓ ক্যাটাগরি ডিলিট করা হয়েছে`);
  };

  useEffect(() => {
    localStorage.setItem('autopulse_categories', JSON.stringify(categories));
  }, [categories]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PartCategory | 'all'>('all');
  const [selectedBrand, setSelectedBrand] = useState<string | 'all'>('all');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyFitActiveVehicle, setOnlyFitActiveVehicle] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'stock'>('recommended');

  // Modal dialog states
  const [inspectedPart, setInspectedPart] = useState<SparePart | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isGarageModalOpen, setIsGarageModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isPartFormOpen, setIsPartFormOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<SparePart | null>(null);
  const [isSpecialRequestOpen, setIsSpecialRequestOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'inventory' | 'orders' | 'ai-forecaster' | 'suppliers' | 'categories'>('inventory');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('autopulse_mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('autopulse_parts', JSON.stringify(parts));
  }, [parts]);

  useEffect(() => {
    localStorage.setItem('autopulse_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('autopulse_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('autopulse_vehicles', JSON.stringify(userVehicles));
  }, [userVehicles]);

  useEffect(() => {
    localStorage.setItem('autopulse_cart', JSON.stringify(cart));
  }, [cart]);

  // Cart operations
  const addToCart = (part: SparePart, quantity = 1) => {
    if (part.stockQuantity <= 0) {
      showToast(`⚠️ Sorry, ${part.name} is currently out of stock.`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.part.id === part.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, part.stockQuantity);
        return prev.map((item) =>
          item.part.id === part.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { part, quantity: Math.min(quantity, part.stockQuantity) }];
    });

    showToast(`🛒 Added ${part.name} to cart`);
  };

  const removeFromCart = (partId: string) => {
    setCart((prev) => prev.filter((item) => item.part.id !== partId));
  };

  const updateCartQuantity = (partId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(partId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.part.id === partId) {
          const validQty = Math.min(quantity, item.part.stockQuantity);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.part.price * item.quantity, 0);

  // Parts CRUD
  const addPart = (newPartData: Omit<SparePart, 'id' | 'rating' | 'reviewCount'>) => {
    const id = `part-${Date.now().toString().slice(-4)}`;
    const newPart: SparePart = {
      ...newPartData,
      id,
      rating: 5.0,
      reviewCount: 1,
    };
    setParts((prev) => [newPart, ...prev]);
    savePartToDb(newPart).catch(err => console.error(err));
    showToast(`✓ New part "${newPart.name}" added to inventory`);
  };

  const updatePart = (id: string, updated: Partial<SparePart>) => {
    setParts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const u = { ...p, ...updated };
          savePartToDb(u).catch(err => console.error(err));
          return u;
        }
        return p;
      })
    );
    showToast(`✓ Part updated successfully`);
  };

  const deletePart = (id: string) => {
    setParts((prev) => prev.filter((p) => p.id !== id));
    deletePartFromDb(id).catch(err => console.error(err));
    showToast(`✓ Part removed from inventory`);
  };

  const adjustStock = (id: string, delta: number) => {
    setParts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStock = Math.max(0, p.stockQuantity + delta);
          const u = { ...p, stockQuantity: newStock };
          savePartToDb(u).catch(err => console.error(err));
          return u;
        }
        return p;
      })
    );
  };

  // Vehicles
  const addUserVehicle = (vehicleData: Omit<UserVehicle, 'id'>) => {
    const id = `veh-${Date.now()}`;
    const newVehicle: UserVehicle = { ...vehicleData, id };
    setUserVehicles((prev) => [...prev, newVehicle]);
    setActiveVehicle(newVehicle);
    saveVehicleToDb(newVehicle).catch(err => console.error(err));
    showToast(`🚗 Added ${newVehicle.year} ${newVehicle.make} ${newVehicle.model} to your garage`);
  };

  const removeUserVehicle = (id: string) => {
    setUserVehicles((prev) => {
      const filtered = prev.filter((v) => v.id !== id);
      if (activeVehicle?.id === id) {
        setActiveVehicle(filtered[0] || null);
      }
      return filtered;
    });
    deleteVehicleFromDb(id).catch(err => console.error(err));
    showToast(`Vehicle removed from garage`);
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Order => {
    const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const newOrder: Order = {
      ...orderData,
      id,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      trackingNumber: orderData.fulfillmentType === 'pickup' ? `PICKUP-STORE-${Math.floor(100 + Math.random() * 900)}` : `TRK-AP-${Math.floor(100000 + Math.random() * 900000)}`
    };

    // Deduct inventory
    orderData.items.forEach((item) => {
      adjustStock(item.partId, -item.quantity);
    });

    setOrders((prev) => [newOrder, ...prev]);
    saveOrderToDb(newOrder).catch(err => console.error(err));
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const u = {
            ...ord,
            status,
            trackingNumber: trackingNumber || ord.trackingNumber,
            updatedAt: new Date().toISOString()
          };
          saveOrderToDb(u).catch(err => console.error(err));
          return u;
        }
        return ord;
      })
    );
    showToast(`✓ Order ${orderId} marked as ${status.replace('_', ' ').toUpperCase()}`);
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    deleteOrderFromDb(orderId).catch(err => console.error(err));
    showToast(`✓ Order ${orderId} successfully deleted`);
  };

  // Suppliers
  const addSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    const id = `sup-${Date.now()}`;
    const newSupplier = { ...supplierData, id };
    setSuppliers((prev) => [...prev, newSupplier]);
    saveSupplierToDb(newSupplier).catch(err => console.error(err));
    showToast(`✓ Supplier "${supplierData.name}" added`);
  };

  return (
    <ShopContext.Provider
      value={{
        mode,
        setMode,
        parts,
        addPart,
        updatePart,
        deletePart,
        adjustStock,
        userVehicles,
        activeVehicle,
        setActiveVehicle,
        addUserVehicle,
        removeUserVehicle,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        suppliers,
        addSupplier,
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
        inspectedPart,
        setInspectedPart,
        isCartOpen,
        setIsCartOpen,
        isDiagnosticOpen,
        setIsDiagnosticOpen,
        isGarageModalOpen,
        setIsGarageModalOpen,
        isOrdersModalOpen,
        setIsOrdersModalOpen,
        isPartFormOpen,
        setIsPartFormOpen,
        editingPart,
        setEditingPart,
        isSpecialRequestOpen,
        setIsSpecialRequestOpen,
        adminTab,
        setAdminTab,
        toastMessage,
        showToast,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
