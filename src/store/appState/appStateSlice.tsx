import { HomeCategory, PostCategoryPlain } from '@/app/categories';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface AppState {
  theme: 'dark' | 'light' | 'auto';
  currentHomePage: PostCategoryPlain;
  copyPasteSnackbarOpen: boolean;
  mobileSiderbarOpen: boolean;
  alwaysShowTags: boolean;
  alwaysShowCustomTags: boolean;
}

const appstateInitialState: AppState = {
  theme: 'auto',
  currentHomePage: HomeCategory,
  copyPasteSnackbarOpen: false,
  mobileSiderbarOpen: false,
  alwaysShowTags: false,
  alwaysShowCustomTags: false,
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
    setAlwaysShowTags(state, action: PayloadAction<boolean>) {
      state.alwaysShowTags = action.payload;
    },
    setAlwaysShowCustomTags(state, action: PayloadAction<boolean>) {
      state.alwaysShowCustomTags = action.payload;
    },
  },
});

export const {
  updateCurrentHomePage,
  openCopyPasteSnackbar,
  closeCopyPasteSnackbar,
  setMobileSidebarOpen,
  setAlwaysShowCustomTags,
  setAlwaysShowTags,
} = appstateSlice.actions;
export const selectCurrentHomePage = (state: RootState) =>
  state.appstate.currentHomePage;
export const selectOpenCopyPasteSnackbar = (state: RootState) =>
  state.appstate.copyPasteSnackbarOpen;
export const selectMobileSidebarOpen = (state: RootState) =>
  state.appstate.mobileSiderbarOpen;
export const selectAlwaysShowTags = (state: RootState) =>
  state.appstate.alwaysShowTags;
export const selectAlwaysShowCustomTags = (state: RootState) =>
  state.appstate.alwaysShowCustomTags;
export default appstateSlice.reducer;
