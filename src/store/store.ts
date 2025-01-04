import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter/counterSlice";
import userReducer from "./user/userSlice";
import appstateReducer from "./appState/appStateSlice"

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    appstate: appstateReducer
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;