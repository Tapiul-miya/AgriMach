import { initializeApp, getApps } from 'firebase/app';
import { 
  initializeFirestore, 
  getFirestore,
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  writeBatch 
} from 'firebase/firestore';
import { SparePart, Order, Supplier, UserVehicle, CategoryConfig } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyDlyhzJqxHu-cEDpE9WWIlUq29lnMW9lFs",
  authDomain: "gen-lang-client-0881564766.firebaseapp.com",
  projectId: "gen-lang-client-0881564766",
  storageBucket: "gen-lang-client-0881564766.firebasestorage.app",
  messagingSenderId: "13178099429",
  appId: "1:13178099429:web:bb09e0dfb8cdd4f3f8660c"
};

const databaseId = "ai-studio-agrimachheavyspa-a1e44547-90f3-4e73-a1f7-e7693e04cfa4";

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with force long polling to avoid WebChannel stream timeouts in iframe sandbox
let dbInstance;
try {
  dbInstance = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    experimentalAutoDetectLongPolling: true,
    ignoreUndefinedProperties: true,
  }, databaseId);
} catch {
  dbInstance = getFirestore(app, databaseId);
}

export const db = dbInstance;

// Helper to abort long-hanging network calls in unstable sandbox connections
const withTimeout = <T>(promise: Promise<T>, timeoutMs = 4000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore connection timeout')), timeoutMs)
    ),
  ]);
};

// Firestore collection references
const PARTS_COL = 'parts';
const ORDERS_COL = 'orders';
const SUPPLIERS_COL = 'suppliers';
const CATEGORIES_COL = 'categories';
const VEHICLES_COL = 'vehicles';

// Generic fetch or seed helper
export async function getCollectionWithSeeding<T extends { id: string }>(
  collectionName: string,
  initialData: T[]
): Promise<T[]> {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await withTimeout(getDocs(colRef), 3500);
    
    if (snapshot.empty) {
      // Seed collection in the background without blocking
      const batch = writeBatch(db);
      initialData.forEach((item) => {
        const docRef = doc(db, collectionName, item.id);
        batch.set(docRef, item);
      });
      batch.commit().catch(() => {});
      return initialData;
    }
    
    const items: T[] = [];
    snapshot.forEach((doc) => {
      items.push({ ...doc.data() } as T);
    });
    return items;
  } catch (error) {
    // Offline or connection timeout fallback to initial local data seamlessly
    return initialData;
  }
}

// PARTS API
export async function savePartToDb(part: SparePart): Promise<void> {
  try {
    await withTimeout(setDoc(doc(db, PARTS_COL, part.id), part), 3500);
  } catch {
    // Silently proceed with local storage
  }
}

export async function deletePartFromDb(id: string): Promise<void> {
  try {
    await withTimeout(deleteDoc(doc(db, PARTS_COL, id)), 3500);
  } catch {
    // Silently proceed with local storage
  }
}

// ORDERS API
export async function saveOrderToDb(order: Order): Promise<void> {
  try {
    await withTimeout(setDoc(doc(db, ORDERS_COL, order.id), order), 3500);
  } catch {
    // Silently proceed with local storage
  }
}

export async function deleteOrderFromDb(id: string): Promise<void> {
  try {
    await withTimeout(deleteDoc(doc(db, ORDERS_COL, id)), 3500);
  } catch {
    // Silently proceed with local storage
  }
}

// SUPPLIERS API
export async function saveSupplierToDb(supplier: Supplier): Promise<void> {
  try {
    await withTimeout(setDoc(doc(db, SUPPLIERS_COL, supplier.id), supplier), 3500);
  } catch {
    // Silently proceed with local storage
  }
}

export async function deleteSupplierFromDb(id: string): Promise<void> {
  try {
    await withTimeout(deleteDoc(doc(db, SUPPLIERS_COL, id)), 3500);
  } catch {
    // Silently proceed with local storage
  }
}

// CATEGORIES API
export async function saveCategoryToDb(category: CategoryConfig): Promise<void> {
  try {
    await withTimeout(setDoc(doc(db, CATEGORIES_COL, category.id), category), 3500);
  } catch {
    // Silently proceed with local storage
  }
}

export async function deleteCategoryFromDb(id: string): Promise<void> {
  try {
    await withTimeout(deleteDoc(doc(db, CATEGORIES_COL, id)), 3500);
  } catch {
    // Silently proceed with local storage
  }
}

// VEHICLES API
export async function saveVehicleToDb(vehicle: UserVehicle): Promise<void> {
  try {
    await withTimeout(setDoc(doc(db, VEHICLES_COL, vehicle.id), vehicle), 3500);
  } catch {
    // Silently proceed with local storage
  }
}

export async function deleteVehicleFromDb(id: string): Promise<void> {
  try {
    await withTimeout(deleteDoc(doc(db, VEHICLES_COL, id)), 3500);
  } catch {
    // Silently proceed with local storage
  }
}
