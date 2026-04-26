// Local store — persists to localStorage, simulates a real backend

export interface FarmerProfile {
  name: string;
  phone: string;
  village: string;
  mandal: string;
  district: string;
  land_area_acres: number;
  rating: number;
}

export interface Listing {
  id: string;
  crop_name: string;
  variety: string;
  quantity_kg: number;
  price_per_kg: number;
  district: string;
  description: string;
  status: 'active' | 'sold';
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  listing_id: string;
  crop_name: string;
  quantity_kg: number;
  price_per_kg: number;
  shop_name: string;
  shop_location: string;
  status: 'pending' | 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';
  total_amount: number;
  created_at: string;
}

const SEED_ORDERS: Order[] = [
  { id: 'o1', order_number: 'RL-1001', listing_id: 'l1', crop_name: 'Tomato', quantity_kg: 200, price_per_kg: 28, shop_name: 'Sri Balaji Stores', shop_location: 'Begumpet, Hyderabad', status: 'pending', total_amount: 5600, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'o2', order_number: 'RL-1002', listing_id: 'l2', crop_name: 'Onion', quantity_kg: 150, price_per_kg: 22, shop_name: 'Fresh Mart', shop_location: 'Warangal', status: 'confirmed', total_amount: 3300, created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 'o3', order_number: 'RL-1003', listing_id: 'l1', crop_name: 'Chilli', quantity_kg: 80, price_per_kg: 85, shop_name: 'Kisan Bazaar', shop_location: 'Karimnagar', status: 'delivered', total_amount: 6800, created_at: new Date(Date.now() - 259200000).toISOString() },
];

const SEED_LISTINGS: Listing[] = [
  { id: 'l1', crop_name: 'Tomato', variety: 'Hybrid', quantity_kg: 500, price_per_kg: 28, district: 'Hyderabad', description: 'Fresh, grade A tomatoes. Harvested this week.', status: 'active', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'l2', crop_name: 'Onion', variety: 'Red', quantity_kg: 300, price_per_kg: 22, district: 'Warangal', description: 'Good quality red onions.', status: 'active', created_at: new Date(Date.now() - 172800000).toISOString() },
];

function get<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function set(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const store = {
  getProfile: (): FarmerProfile | null => get('rl_profile', null),
  saveProfile: (p: FarmerProfile) => set('rl_profile', p),

  getListings: (): Listing[] => get('rl_listings', SEED_LISTINGS),
  addListing: (l: Omit<Listing, 'id' | 'created_at' | 'status'>) => {
    const listings = store.getListings();
    const newListing: Listing = { ...l, id: `l${Date.now()}`, status: 'active', created_at: new Date().toISOString() };
    set('rl_listings', [newListing, ...listings]);
    return newListing;
  },
  deleteListing: (id: string) => set('rl_listings', store.getListings().filter(l => l.id !== id)),

  getOrders: (): Order[] => get('rl_orders', SEED_ORDERS),
  updateOrderStatus: (id: string, status: Order['status']) => {
    set('rl_orders', store.getOrders().map(o => o.id === id ? { ...o, status } : o));
  },

  logout: () => {
    ['access_token', 'refresh_token', 'phone', 'rl_profile'].forEach(k => localStorage.removeItem(k));
  },

  isLoggedIn: () => !!localStorage.getItem('access_token'),
  hasProfile: () => !!localStorage.getItem('rl_profile'),
};
