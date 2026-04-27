import {
  collection, doc, addDoc, setDoc, getDoc, getDocs, updateDoc,
  query, where, orderBy, limit, onSnapshot, serverTimestamp, arrayUnion, Unsubscribe
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';

export interface UserProfile {
  uid: string; email: string; displayName: string; photoURL: string;
  role: 'farmer' | 'buyer' | null; buyerType?: 'shop' | 'restaurant' | 'bulk';
  phone?: string; language: string; profileComplete: boolean;
  village?: string; mandal?: string; district?: string; landAcres?: number; rating?: number;
  businessName?: string; businessAddress?: string; pincode?: string; createdAt?: any;
}

export interface Listing {
  id: string; farmerId: string; farmerName: string; farmerDistrict: string;
  cropName: string; variety: string; quantityKg: number; pricePerKg: number;
  description: string; imageURL: string; imagePath: string;
  status: 'active' | 'sold' | 'expired'; district: string; createdAt: any;
}

export interface Need {
  id: string; buyerId: string; buyerName: string; buyerType: string;
  cropName: string; quantityKg: number; maxPricePerKg: number;
  district: string; description: string; status: 'open' | 'fulfilled' | 'expired'; createdAt: any;
}

export interface Order {
  id: string; orderNumber: string; flowType: 'A' | 'B';
  listingId?: string; needId?: string;
  farmerId: string; buyerId: string; farmerName: string; buyerName: string;
  buyerBusinessName?: string; cropName: string; quantityKg: number;
  pricePerKg: number; totalAmount: number; deliveryDistrict: string; notes?: string;
  status: 'pending' | 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';
  farmerPhone?: string; buyerPhone?: string;
  statusHistory: { status: string; timestamp: any; by: string }[]; createdAt: any;
}

async function compressImage(file: File): Promise<Blob> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const max = 800;
      let { width, height } = img;
      if (width > max || height > max) {
        if (width > height) { height = (height / width) * max; width = max; }
        else { width = (width / height) * max; height = max; }
      }
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
      canvas.toBlob(blob => resolve(blob!), 'image/jpeg', 0.75);
    };
    img.src = URL.createObjectURL(file);
  });
}

// ─── Users ──────────────────────────────────────────────────────────────────

export async function saveUserProfile(uid: string, data: Partial<UserProfile>) {
  await setDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { uid, ...snap.data() } as UserProfile : null;
}

// ─── Listings ───────────────────────────────────────────────────────────────

export async function createListing(
  data: Omit<Listing, 'id' | 'imageURL' | 'imagePath' | 'status' | 'createdAt'>,
  imageFile: File | null,
  onProgress?: (pct: number) => void
): Promise<string> {
  let imageURL = '';
  let imagePath = '';
  if (imageFile) {
    const compressed = await compressImage(imageFile);
    imagePath = `crop-images/${data.farmerId}/${Date.now()}_${imageFile.name}`;
    const storageRef = ref(storage, imagePath);
    await new Promise<void>((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, compressed);
      task.on('state_changed',
        snap => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
        reject,
        async () => { imageURL = await getDownloadURL(task.snapshot.ref); resolve(); }
      );
    });
  }
  const docRef = await addDoc(collection(db, 'listings'), {
    ...data, imageURL, imagePath, status: 'active', createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getAllListings(): Promise<Listing[]> {
  const q = query(collection(db, 'listings'), where('status', '==', 'active'), orderBy('createdAt', 'desc'), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Listing);
}

export async function getMyListings(farmerId: string): Promise<Listing[]> {
  const q = query(collection(db, 'listings'), where('farmerId', '==', farmerId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Listing);
}

export function subscribeToListings(callback: (listings: Listing[]) => void): Unsubscribe {
  const q = query(collection(db, 'listings'), where('status', '==', 'active'), orderBy('createdAt', 'desc'), limit(50));
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Listing)));
}

export async function deleteListing(listingId: string, imagePath: string) {
  if (imagePath) await deleteObject(ref(storage, imagePath)).catch(() => {});
  await updateDoc(doc(db, 'listings', listingId), { status: 'expired' });
}

// ─── Needs ──────────────────────────────────────────────────────────────────

export async function createNeed(data: Omit<Need, 'id' | 'status' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'needs'), { ...data, status: 'open', createdAt: serverTimestamp() });
  return docRef.id;
}

export function subscribeToNeeds(callback: (needs: Need[]) => void): Unsubscribe {
  const q = query(collection(db, 'needs'), where('status', '==', 'open'), orderBy('createdAt', 'desc'), limit(50));
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Need)));
}

export async function getMyNeeds(buyerId: string): Promise<Need[]> {
  const q = query(collection(db, 'needs'), where('buyerId', '==', buyerId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Need);
}

// ─── Orders ─────────────────────────────────────────────────────────────────

export async function createOrder(data: Omit<Order, 'id' | 'orderNumber' | 'statusHistory' | 'createdAt'>): Promise<string> {
  const orderNumber = 'RL-' + Date.now().toString(36).toUpperCase();
  const docRef = await addDoc(collection(db, 'orders'), {
    ...data, orderNumber, statusHistory: [{ status: data.status, timestamp: serverTimestamp(), by: data.buyerId }],
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export function subscribeToOrders(uid: string, role: 'farmer' | 'buyer', callback: (orders: Order[]) => void): Unsubscribe {
  const field = role === 'farmer' ? 'farmerId' : 'buyerId';
  const q = query(collection(db, 'orders'), where(field, '==', uid), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Order)));
}

export async function updateOrderStatus(orderId: string, status: string, by: string) {
  await updateDoc(doc(db, 'orders', orderId), {
    status,
    statusHistory: arrayUnion({ status, timestamp: new Date().toISOString(), by }),
    updatedAt: serverTimestamp(),
  });
}
