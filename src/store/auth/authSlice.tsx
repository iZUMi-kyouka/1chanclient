import Auth from '@/interfaces/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const authStateInitialState: Auth = {
  accessToken: '',
  deviceID: '',
  isRefreshing: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: authStateInitialState,
  reducers: {
    updateAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    updateDeviceID(state, action: PayloadAction<string>) { 
      state.deviceID = action.payload;
    },
    setIsRefreshing(state, action: PayloadAction<boolean>) {
      state.isRefreshing = action.payload;
    },
    resetAuth(state) {
      state.accessToken = '';
      state.isRefreshing = false;
    },
  },
});

export const { updateAccessToken, updateDeviceID, setIsRefreshing, resetAuth } =
  authSlice.actions;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectDeviceID = (state: RootState) => state.auth.deviceID;
export const selectIsRefreshing = (state: RootState) => state.auth.isRefreshing;
export default authSlice.reducer;
