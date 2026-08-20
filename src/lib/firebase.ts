import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  updateDoc, 
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

const app = initializeApp(firebaseConfig);
// Using custom databaseId from config
const db = getFirestore(app, "ai-studio-agrimachheavyspa-a1e44547-90f3-4e73-a1f7-e7693e04cfa4");

export { db };

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
    const snapshot = await getDocs(colRef);
    
    if (snapshot.empty) {
      // Seed collection with initial mock data
      const batch = writeBatch(db);
      initialData.forEach((item) => {
        const docRef = doc(db, collectionName, item.id);
        batch.set(docRef, item);
      });
      await batch.commit();
      return initialData;
    }
    
    const items: T[] = [];
    snapshot.forEach((doc) => {
      items.push({ ...doc.data() } as T);
    });
    return items;
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    return initialData;
  }
}

// PARTS API
export async function savePartToDb(part: SparePart): Promise<void> {
  await setDoc(doc(db, PARTS_COL, part.id), part);
}

export async function deletePartFromDb(id: string): Promise<void> {
  await deleteDoc(doc(db, PARTS_COL, id));
}

// ORDERS API
export async function saveOrderToDb(order: Order): Promise<void> {
  await setDoc(doc(db, ORDERS_COL, order.id), order);
}

export async function deleteOrderFromDb(id: string): Promise<void> {
  await deleteDoc(doc(db, ORDERS_COL, id));
}

// SUPPLIERS API
export async function saveSupplierToDb(supplier: Supplier): Promise<void> {
  await setDoc(doc(db, SUPPLIERS_COL, supplier.id), supplier);
}

export async function deleteSupplierFromDb(id: string): Promise<void> {
  await deleteDoc(doc(db, SUPPLIERS_COL, id));
}

// CATEGORIES API
export async function saveCategoryToDb(category: CategoryConfig): Promise<void> {
  await setDoc(doc(db, CATEGORIES_COL, category.id), category);
}

export async function deleteCategoryFromDb(id: string): Promise<void> {
  await deleteDoc(doc(db, CATEGORIES_COL, id));
}

// VEHICLES API
export async function saveVehicleToDb(vehicle: UserVehicle): Promise<void> {
  await setDoc(doc(db, VEHICLES_COL, vehicle.id), vehicle);
}

export async function deleteVehicleFromDb(id: string): Promise<void> {
  await deleteDoc(doc(db, VEHICLES_COL, id));
}
