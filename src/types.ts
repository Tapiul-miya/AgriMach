export type PartCategory = string;

export interface CategoryConfig {
  id: string;
  label: string;
  iconName: string;
}

export type MachineryType = 'Tractor' | 'JCB / Backhoe' | 'Harvester' | 'Heavy Equipment';

export interface VehicleCompatibility {
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number;
  engine?: string;
}

export interface UserVehicle {
  id: string;
  machineryType?: MachineryType;
  make: string;
  model: string;
  year: number;
  engine?: string;
  vin?: string;
  nickname?: string;
  isDefault?: boolean;
}

export interface SparePart {
  id: string;
  name: string;
  oemNumber: string;
  brand: string | null;
  category: PartCategory;
  price: number;
  costPrice: number;
  stockQuantity: number;
  minStockThreshold: number;
  warehouseLocation: string; // e.g. "Shelf B3-Aisle 2"
  compatibleVehicles: VehicleCompatibility[];
  description: string;
  specs: Record<string, string>;
  imageUrl: string;
  imageUrls?: string[];
  condition: 'New - OEM Genuine' | 'New - Aftermarket Premium' | 'Remanufactured OEM';
  weightKg: number | null;
  rating: number;
  reviewCount: number;
  supplier: string;
  inDemandScore?: number;
  isUniversal?: boolean;
}

export interface CartItem {
  part: SparePart;
  quantity: number;
  vehicleFitConfirmed?: boolean;
}

export type OrderStatus = 'pending' | 'processing' | 'ready_for_pickup' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  partId: string;
  partName: string;
  oemNumber: string;
  brand: string | null;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  fulfillmentType: 'delivery' | 'pickup';
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  paymentMethod: 'credit_card' | 'cash_on_delivery' | 'bank_transfer';
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  vehicleDetails?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactEmail: string;
  phone: string;
  categoriesSupplied: PartCategory[];
  leadTimeDays: number;
  rating: number;
}

export interface AIDiagnosticResponse {
  probableIssue: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  explanation: string;
  recommendedPartCategories: string[];
  suggestedOEMNumbers: string[];
  estimatedLaborDifficulty: string;
  safetyWarning?: string;
  stepByStepChecks: string[];
}
