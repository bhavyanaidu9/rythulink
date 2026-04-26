import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Order {
  id: string;
  order_number: string;
  shop_id: string;
  status: string;
  payment_status: string;
  total_amount: number;
  delivery_address: string;
  created_at: string;
}

interface OrdersState {
  items: Order[];
  loading: boolean;
}

const initialState: OrdersState = {items: [], loading: false};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<Order[]>) {
      state.items = action.payload;
    },
    updateOrderStatus(state, action: PayloadAction<{id: string; status: string}>) {
      const order = state.items.find(o => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const {setOrders, updateOrderStatus, setLoading} = ordersSlice.actions;
export default ordersSlice.reducer;
