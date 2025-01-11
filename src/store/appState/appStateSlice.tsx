import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { HomeCategory, PostCategoryPlain } from "@/app/categories";

export interface AppState {
    theme: 'dark' | 'light' | 'auto',
    currentHomePage: PostCategoryPlain,
}

const appstateInitialState: AppState = {
    theme: 'auto',
    currentHomePage: HomeCategory
}

const appstateSlice = createSlice({
    name: 'appstate',
    initialState: appstateInitialState,
    reducers: {
        updateCurrentHomePage(state, action: PayloadAction<PostCategoryPlain>) {
            state.currentHomePage = action.payload
        }
    }
});

export const { updateCurrentHomePage } = appstateSlice.actions;
export const selectCurrentHomePage = (state: RootState) => state.appstate.currentHomePage;
export default appstateSlice.reducer;