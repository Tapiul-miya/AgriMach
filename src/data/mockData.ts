import { SparePart, Supplier, Order, UserVehicle } from '../types';

export const DEFAULT_VEHICLES: UserVehicle[] = [
  {
    id: 'veh-1',
    machineryType: 'Tractor',
    make: 'Mahindra',
    model: '575 DI XP Plus',
    year: 2022,
    engine: '47 HP 4-Cyl ELS DI Engine',
    nickname: 'Primary Farm Tractor (Mahindra 575)',
    isDefault: true,
  }
];

export const POPULAR_VEHICLE_MAKES = [
  'Mahindra', 
  'JCB', 
  'John Deere', 
  'Swaraj', 
  'Massey Ferguson', 
  'Sonalika', 
  'New Holland', 
  'Kubota', 
  'Claas', 
  'Eicher', 
  'Caterpillar', 
  'Preet', 
  'Tata Hitachi'
];

export const VEHICLE_MODELS_BY_MAKE: Record<string, string[]> = {
  Mahindra: ['575 DI XP Plus', 'Arjun Novo 605 DI', 'Yuvo Tech+ 585', 'Jivo 245 4WD Mini', 'OJA 3140 4WD', 'Applitrac Harvester'],
  JCB: ['3DX Super Backhoe', '3DX Plus', '4DX Backhoe Loader', 'JS205 Tracked Excavator', '3DX 4WD', '530-70 Telehandler'],
  'John Deere': ['5310 4WD PowerTech', '5050 D GearPro', '5405 4WD AC Cabin', 'W70 Combine Harvester', 'W50 Grain Harvester'],
  Swaraj: ['855 FE 4WD', '744 FE Plus', '963 FE 60 HP', '735 FE', '8200 Smart Harvester'],
  'Massey Ferguson': ['MF 241 DI Dynatrack', 'MF 7250 PowerUp', 'MF 9500 4WD 58 HP', 'MF 1035 DI Mahashakti'],
  Sonalika: ['Sikander DI 745 III', 'Tiger 55 DI 4WD', 'WorldTrac 90 Heavy Duty', 'Sikander DI 60 Torque Plus'],
  'New Holland': ['3630 TX Special Edition', '3600-2 TX All Rounder', 'Excel 4710 4WD', 'TC5.30 Combine Harvester'],
  Kubota: ['MU5502 4WD 55HP', 'MU4501 2WD', 'B2741 Neostar Mini', 'DC-68G Paddy Combine Harvester'],
  Claas: ['Crop Tiger 30 Harvester', 'Crop Tiger 40 Wheel Harvester', 'Dominator 130 Combine', 'Jaguar Forage Harvester'],
  Eicher: ['Eicher 380 Super DI', 'Eicher 485', 'Eicher 557 50HP', 'Eicher 242 NC'],
  Caterpillar: ['CAT 424 Backhoe Loader', 'CAT 320D Hydraulic Excavator', 'CAT 426F2 Backhoe'],
  Preet: ['987 Self Propelled Harvester', '955 Tractor 4WD', '9049 AC Harvester', '6049 60HP Tractor'],
  'Tata Hitachi': ['EX 200 LC Super', 'Shinrai Prime Backhoe', 'ZAXIS 140H Hydraulic Excavator']
};

export const INITIAL_PARTS: SparePart[] = [
  // TRACTOR PARTS
  {
    id: 'part-tractor-01',
    name: 'Mahindra Tractor Dual Clutch Plate Assembly 280mm / 11-Inch',
    oemNumber: '006505121R91',
    brand: 'Mahindra Genuine Parts',
    category: 'tractor',
    price: 8500.00,
    costPrice: 5200.00,
    stockQuantity: 18,
    minStockThreshold: 4,
    warehouseLocation: 'Aisle 3 - Shelf T-01',
    compatibleVehicles: [
      { make: 'Mahindra', model: '575 DI XP Plus', yearStart: 2012, yearEnd: 2026 },
      { make: 'Mahindra', model: 'Arjun Novo 605 DI', yearStart: 2015, yearEnd: 2026 },
      { make: 'Sonalika', model: 'Sikander DI 745 III', yearStart: 2014, yearEnd: 2025 }
    ],
    description: 'ট্র্যাক্টরের জন্য হেভি ডিউটি ডুয়াল ক্লাচ প্লেট অ্যাসেম্বলি। হাই ফ্রিরিকশন সিরামিক ম্যাটেরিয়াল দিয়ে তৈরি, যা তীব্র তাপেও স্লিপ না করে সর্বোচ্চ ক্রপ ও ফিল্ড পারফরম্যান্স প্রদান করে।',
    specs: {
      'আকার': '280 mm (11 Inches)',
      'উপাদান': 'Organic & Cerametalic Dual Facings',
      'স্প্লাইন সংখ্যা': '10-Spline Primary, 19-Spline PTO',
      'ওয়ারেন্টি': '1 Year Field Warranty'
    },
    imageUrl: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?w=600&auto=format&fit=crop&q=80',
    condition: 'New - OEM Genuine',
    weightKg: 12.5,
    rating: 4.9,
    reviewCount: 94,
    supplier: 'Mahindra Agri Industrial Parts Distribution',
    inDemandScore: 98
  },
  {
    id: 'part-harvester-01',
    name: 'John Deere Harvester Cutter Bar Knife Section (Pack of 25)',
    oemNumber: 'AZ58904-PK25',
    brand: 'John Deere Genuine Parts',
    category: 'harvester',
    price: 3200.00,
    costPrice: 1800.00,
    stockQuantity: 45,
    minStockThreshold: 8,
    warehouseLocation: 'Aisle 5 - Harvester Shelf H-01',
    compatibleVehicles: [
      { make: 'John Deere', model: 'W70 Combine Harvester', yearStart: 2014, yearEnd: 2026 }
    ],
    description: 'ক্রোমিয়াম-কোটেড আল্ট্রা-শার্প করাতদন্ত ব্লেড যা ধান, গম ও সরিষা কাটার সময় চমৎকার কাটিং স্পিড বজায় রাখে। ২৫টি হেভি-গেজ সেকশনের প্রিমিয়াম প্যাক।',
    specs: {
      'উপাদান': 'Electro-Plated Hardened Carbon Steel',
      'প্যাকেজ সাইজ': '25 Pieces per Carton',
      'পিল থ্রেশহোল্ড': '52 mm Standard Pitch',
      'প্রলেপ': 'Anti-Rust Zinc-Chromium Coated'
    },
    imageUrl: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=600&auto=format&fit=crop&q=80',
    condition: 'New - OEM Genuine',
    weightKg: 4.5,
    rating: 4.9,
    reviewCount: 130,
    supplier: 'John Deere Agricultural Global Supply',
    inDemandScore: 99
  },
  {
    id: 'part-jcb-01',
    name: 'JCB 3DX Heavy Duty Rock Bucket Teeth with Pin & Lock Kit (Set of 5)',
    oemNumber: '332/C4388-SET',
    brand: 'JCB Genuine Parts',
    category: 'jcb',
    price: 8900.00,
    costPrice: 5500.00,
    stockQuantity: 28,
    minStockThreshold: 6,
    warehouseLocation: 'Heavy Yard - Rack A-01',
    compatibleVehicles: [
      { make: 'JCB', model: '3DX Super Backhoe', yearStart: 2015, yearEnd: 2026 }
    ],
    description: 'জেসিবি ৩ডিএক্স বাকেটের জন্য ম্যাঙ্গানিজ অ্যালয় স্টিলের তৈরি ৫টি হেভি ডিউটি রক বাকেট টিথ সেট। লক রিং ও পিন সহ আসে।',
    specs: {
      'উপাদান': 'Forged Manganese Alloy Steel',
      'ডিজাইন': 'Chisel Penetration Rock Tooth',
      'কঠোরতা': '52-56 HRC Surface Hardness'
    },
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    condition: 'New - OEM Genuine',
    weightKg: 18.5,
    rating: 4.9,
    reviewCount: 142,
    supplier: 'JCB India Central Spares Depot',
    inDemandScore: 98
  }
];


export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'JCB India Central Spares Depot',
    contactEmail: 'dealer.spares@jcb.com',
    phone: '+91 1800 200 0522',
    categoriesSupplied: ['jcb'],
    leadTimeDays: 2,
    rating: 4.9
  }
];

export const INITIAL_ORDERS: Order[] = [];
