import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  role: 'farmer' | 'shop' | null;
  profileComplete: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userId: null,
  role: null,
  profileComplete: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<{accessToken: string; refreshToken: string; userId: string; role: 'farmer' | 'shop'}>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userId = action.payload.userId;
      state.role = action.payload.role;
    },
    setProfileComplete(state, action: PayloadAction<boolean>) {
      state.profileComplete = action.payload;
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.userId = null;
      state.role = null;
      state.profileComplete = false;
    },
  },
});

export const {setTokens, setProfileComplete, logout} = authSlice.actions;
export default authSlice.reducer;
