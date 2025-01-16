import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { LikedThreads, User, UserAccount, UserProfile } from "@/interfaces/user";



const userAccountInitialState: UserAccount = {
    id: undefined,
    username: undefined,
};

const userProfileInitialState: UserProfile = {
    profile_photo_path: '',
    biodata: '',
    email: '',
    post_count: -1,
    comment_count: -1,
    preferred_lang: "en",
    preferred_theme: "auto",
    creation_date: "",
    last_login: ""
};

const initialState: User = {
    account: userAccountInitialState,
    profile: userProfileInitialState,
    liked_threads: {}
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser(state, action: PayloadAction<{account: UserAccount, profile: UserProfile}>) {
            state.account = action.payload.account;
            state.profile = action.payload.profile;
        },
        updateLike(state, action: PayloadAction<LikedThreads>) {
          state.liked_threads = action.payload
        },
        addToLike(state, action: PayloadAction<number>) {
          state.liked_threads[action.payload] = 1;
        },
        removeFromLikeDislike(state, action: PayloadAction<number>) {
          delete state.liked_threads[action.payload];
        },
        addToDislike(state, action: PayloadAction<number>) {
          state.liked_threads[action.payload] = 0;
        },
        resetUser(state) {
            state.account = initialState.account;
            state.profile = initialState.profile;
        }
    }
});

export const { updateUser, resetUser, updateLike, addToDislike, removeFromLikeDislike, addToLike } = userSlice.actions;
export const selectUserAccount = (state: RootState) => state.user.account;
export const selectUserProfile = (state: RootState) => state.user.profile;
export const selectUserLikedThreads = (state: RootState) => state.user.liked_threads;
export default userSlice.reducer;