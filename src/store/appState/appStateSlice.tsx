import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type CurrentHomePage = 'home' | 'trending' | 'technology' | 'games' | 'movies' | 'travel';

export interface AppState {
    theme: 'dark' | 'light' | 'auto',
    currentHomePage: CurrentHomePage,
}

const appstateInitialState: AppState = {
    theme: 'auto',
    currentHomePage: 'home'
}

const appstateSlice = createSlice({
    name: 'appstate',
    initialState: appstateInitialState,
    reducers: {
        updateCurrentHomePage(state, action: PayloadAction<CurrentHomePage>) {
            state.currentHomePage = action.payload;
        }
    }
});

export const { updateCurrentHomePage } = appstateSlice.actions;
export const selectCurrentHomePage = (state: RootState) => state.appstate.currentHomePage;
export default appstateSlice.reducer;