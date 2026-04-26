import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  name_telugu: string | null;
  category: string;
  quantity_kg: number;
  price_per_kg: number;
  quality_grade: 'A' | 'B' | 'C' | null;
  quality_score: number | null;
  is_available: boolean;
  image_urls: string[] | null;
  created_at: string;
}

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {items: [], loading: false, error: null};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.items = action.payload;
    },
    addProduct(state, action: PayloadAction<Product>) {
      state.items.unshift(action.payload);
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const idx = state.items.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = action.payload;
      }
    },
    removeProduct(state, action: PayloadAction<string>) {
      state.items = state.items.filter(p => p.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {setProducts, addProduct, updateProduct, removeProduct, setLoading, setError} = productsSlice.actions;
export default productsSlice.reducer;
