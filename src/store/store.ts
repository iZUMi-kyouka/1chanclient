import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter/counterSlice";
import userReducer from "./user/userSlice";
import appstateReducer from "./appState/appStateSlice"
import authReducer from "./auth/authSlice"

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    appstate: appstateReducer,
    auth: authReducer
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;