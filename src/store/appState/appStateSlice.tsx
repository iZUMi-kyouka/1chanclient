import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { HomeCategory, PostCategoryPlain } from "@/app/categories";

export interface AppState {
    theme: 'dark' | 'light' | 'auto',
    currentHomePage: PostCategoryPlain,
    copyPasteSnackbarOpen: boolean
}

const appstateInitialState: AppState = {
    theme: 'auto',
    currentHomePage: HomeCategory,
    copyPasteSnackbarOpen: false
}

const appstateSlice = createSlice({
    name: 'appstate',
    initialState: appstateInitialState,
    reducers: {
        updateCurrentHomePage(state, action: PayloadAction<PostCategoryPlain>) {
            state.currentHomePage = action.payload
        },
        openCopyPasteSnackbar(state) {
          state.copyPasteSnackbarOpen = true;
        },
        closeCopyPasteSnackbar(state) {
          state.copyPasteSnackbarOpen = false;
        }
    }
});

export const { updateCurrentHomePage, openCopyPasteSnackbar, closeCopyPasteSnackbar } = appstateSlice.actions;
export const selectCurrentHomePage = (state: RootState) => state.appstate.currentHomePage;
export const selectOpenCopyPasteSnackbar = (state: RootState) => state.appstate.copyPasteSnackbarOpen;
export default appstateSlice.reducer;