import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface Auth {
    accessToken: string,
    deviceID: string,
    isRefreshing: boolean
}

const authStateInitialState: Auth = {
    accessToken: '',
    deviceID: '',
    isRefreshing: false
}

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
        }
    }
})

export const { updateAccessToken, updateDeviceID, setIsRefreshing } = authSlice.actions;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectDeviceID = (state: RootState) => state.auth.deviceID;
export const selectIsRefreshing = (state: RootState) => state.auth.isRefreshing;
export default authSlice.reducer;