import { HomeCategory, PostCategoryPlain } from '@/app/[locale]/categories';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface AppState {
  theme: 'dark' | 'light' | 'auto';
  currentHomePage: PostCategoryPlain;
  copyPasteSnackbarOpen: boolean;
  snackBarMessage: string;
  mobileSiderbarOpen: boolean;
  alwaysShowTags: boolean;
  alwaysShowCustomTags: boolean;
}

const appstateInitialState: AppState = {
  theme: 'auto',
  currentHomePage: HomeCategory,
  copyPasteSnackbarOpen: false,
  snackBarMessage: '',
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
      state.snackBarMessage = 'Link copied successfully.';
      state.copyPasteSnackbarOpen = true;
    },
    closeCopyPasteSnackbar(state) {
      state.copyPasteSnackbarOpen = false;
      state.snackBarMessage = '';
    },
    openSnackbarWithMessage(state, action: PayloadAction<string>) {
      state.snackBarMessage = action.payload;
      state.copyPasteSnackbarOpen = true;
    },
    setMobileSidebarOpen(state, action: PayloadAction<boolean>) {
      state.mobileSiderbarOpen = action.payload;
    },
    openMobileSidebar(state) {
      state.mobileSiderbarOpen = true;
    },
    closeMobileSidebar(state) {
      state.mobileSiderbarOpen = false;
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
  openSnackbarWithMessage,
  openMobileSidebar,
  closeMobileSidebar
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
export const selectSnackBarMessage = (state: RootState) =>
  state.appstate.snackBarMessage;
export default appstateSlice.reducer;
