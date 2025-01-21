import { configureStore } from "@reduxjs/toolkit";
import appstateReducer from "./appState/appStateSlice";
import authReducer from "./auth/authSlice";
import userReducer from "./user/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    appstate: appstateReducer,
    auth: authReducer
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;