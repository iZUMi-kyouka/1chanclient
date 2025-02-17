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
  locale: SupportedLanguages
}

export type SupportedLanguages = 'en' | 'ja';
export type LocaleParams = {params: Promise<{locale: SupportedLanguages}>}

const appstateInitialState: AppState = {
  theme: 'auto',
  currentHomePage: HomeCategory,
  copyPasteSnackbarOpen: false,
  snackBarMessage: '',
  mobileSiderbarOpen: false,
  alwaysShowTags: false,
  alwaysShowCustomTags: false,
  locale: 'en'
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
    toggleMobileSidebar(state) {
      state.mobileSiderbarOpen = !state.mobileSiderbarOpen;
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
    setLocale(state, action: PayloadAction<SupportedLanguages>) {
      state.locale = action.payload;
    }
  },
});

export const {
  updateCurrentHomePage,
  openCopyPasteSnackbar,
  closeCopyPasteSnackbar,
  toggleMobileSidebar,
  setAlwaysShowCustomTags,
  setAlwaysShowTags,
  openSnackbarWithMessage,
  openMobileSidebar,
  closeMobileSidebar,
  setLocale
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
export const selectLocale = (state: RootState) => 
  state.appstate.locale;
export default appstateSlice.reducer;
