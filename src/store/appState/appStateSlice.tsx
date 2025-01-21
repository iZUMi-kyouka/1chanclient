import { HomeCategory, PostCategoryPlain } from '@/app/categories';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface AppState {
  theme: 'dark' | 'light' | 'auto';
  currentHomePage: PostCategoryPlain;
  copyPasteSnackbarOpen: boolean;
  mobileSiderbarOpen: boolean;
}

const appstateInitialState: AppState = {
  theme: 'auto',
  currentHomePage: HomeCategory,
  copyPasteSnackbarOpen: false,
  mobileSiderbarOpen: false,
};

const appstateSlice = createSlice({
  name: 'appstate',
  initialState: appstateInitialState,
  reducers: {
    updateCurrentHomePage(state, action: PayloadAction<PostCategoryPlain>) {
      state.currentHomePage = action.payload;
    },
    openCopyPasteSnackbar(state) {
      state.copyPasteSnackbarOpen = true;
    },
    closeCopyPasteSnackbar(state) {
      state.copyPasteSnackbarOpen = false;
    },
    setMobileSidebarOpen(state, action: PayloadAction<boolean>) {
      state.mobileSiderbarOpen = action.payload;
    },
  },
});

export const {
  updateCurrentHomePage,
  openCopyPasteSnackbar,
  closeCopyPasteSnackbar,
  setMobileSidebarOpen,
} = appstateSlice.actions;
export const selectCurrentHomePage = (state: RootState) =>
  state.appstate.currentHomePage;
export const selectOpenCopyPasteSnackbar = (state: RootState) =>
  state.appstate.copyPasteSnackbarOpen;
export const selectMobileSidebarOpen = (state: RootState) =>
  state.appstate.mobileSiderbarOpen;
export default appstateSlice.reducer;
