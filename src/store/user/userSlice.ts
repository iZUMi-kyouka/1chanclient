import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type UUID = string;

export interface UserAccount {
    id?: UUID,
    username?: string,
    access_token?: string
}

interface UserProfile {
    profile_photo_path: string,
    biodata: string,
    email: string,
    post_count: number,
    comment_count: number,
    preferred_lang: "en" | "id" | "ja",
    preferred_theme: "light" | "dark" | "auto",
    creation_date: string,
    last_login: string
}

export interface User {
    account: UserAccount,
    profile: UserProfile,
    deviceID: undefined | string
}

const userAccountInitialState: UserAccount = {
    id: undefined,
    username: undefined,
    access_token: undefined,
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
    deviceID: undefined
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser(state, action: PayloadAction<{account: UserAccount, profile: UserProfile}>) {
            state.account = action.payload.account;
            state.profile = action.payload.profile;
        },
        updateDeviceID(state, action: PayloadAction<string>) {
            state.deviceID =action.payload;
        },
        updateAccessToken(state, action: PayloadAction<string>) {
            state.account.access_token = action.payload;
        },
        resetUser(state) {
            state.account = initialState.account;
            state.profile = initialState.profile;
        }
    }
});

export const { updateUser, updateDeviceID, updateAccessToken, resetUser } = userSlice.actions;
export const selectUserDeviceID = (state: RootState) => state.user.deviceID;
export const selectUserAccount = (state: RootState) => state.user.account;
export const selectUserProfile = (state: RootState) => state.user.profile;
export default userSlice.reducer;