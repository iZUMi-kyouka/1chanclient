import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { LikedComments, LikedThreads, User, UserAccount, UserProfile, WrittenComments, WrittenThreads } from "@/interfaces/user";


const userAccountInitialState: UserAccount = {
    id: undefined,
    username: undefined,
};

const userProfileInitialState: UserProfile = {
    profile_picture_path: '',
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
    liked_threads: {},
    liked_comments: {},
    comments: {},
    threads: {}
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser(state, action: PayloadAction<{account: UserAccount, profile: UserProfile}>) {
            state.account = action.payload.account;
            state.profile = action.payload.profile;
        },
        updateProfilePicture(state, action: PayloadAction<string>) {
          state.profile.profile_picture_path = action.payload;
        },
        updateWrittenThreads(state, action: PayloadAction<WrittenThreads>) {
          state.threads = action.payload
        },
        updateWrittenComments(state, action: PayloadAction<WrittenComments>) {
          state.comments = action.payload
        },
        updateThreadLike(state, action: PayloadAction<LikedThreads>) {
          state.liked_threads = action.payload;
        },
        updateCommentLike(state, action: PayloadAction<LikedComments>) {
          state.liked_comments = action.payload;
        },
        addToThreadLike(state, action: PayloadAction<number>) {
          state.liked_threads[action.payload] = 1;
        },
        addToCommentLike(state, action: PayloadAction<number>) {
          state.liked_comments[action.payload] = 1;
        },
        removeFromThreadLikeDislike(state, action: PayloadAction<number>) {
          delete state.liked_threads[action.payload];
        },
        removeFromCommentLikeDislike(state, action: PayloadAction<number>) {
          delete state.liked_comments[action.payload];
        },
        addToCommentDislike(state, action: PayloadAction<number>) {
          state.liked_comments[action.payload] = 0;
        },
        addToThreadDislike(state, action: PayloadAction<number>) {
          state.liked_threads[action.payload] = 0;
        },
        resetUser(state) {
            state.account = initialState.account;
            state.profile = initialState.profile;
            state.liked_threads = initialState.liked_threads;
            state.liked_comments = initialState.liked_comments;
        }
    }
});

export const { updateProfilePicture, updateUser, resetUser, updateWrittenComments, updateWrittenThreads, updateThreadLike, addToThreadDislike, removeFromThreadLikeDislike, addToThreadLike, addToCommentDislike, addToCommentLike, removeFromCommentLikeDislike, updateCommentLike } = userSlice.actions;
export const selectUserAccount = (state: RootState) => state.user.account;
export const selectUserProfile = (state: RootState) => state.user.profile;
export const selectUserLikedThreads = (state: RootState) => state.user.liked_threads;
export const selectUserLikedComments = (state: RootState) => state.user.liked_comments;
export const selectUserWrittenThreads = (state: RootState) => state.user.threads;
export const selectUserWrittenComments = (state: RootState) => state.user.comments;
export default userSlice.reducer;