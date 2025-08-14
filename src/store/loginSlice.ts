import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import type { LoginInterface } from "@/models/interface";

const initialState: LoginInterface = {
    token: null,
    userId: 0,
    isLoggedIn: false,
};

const persistConfig = {
    key: "login",
    storage: storageSession,
    whitelist: ["token", "userId", "isLoggedIn"],
};

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ token: string; user_id: number }>) {
            state.token = action.payload.token;
            state.userId = action.payload.user_id;
            state.isLoggedIn = true;
        },
        logout(state) {
            state.token = null;
            state.userId = 0;
            state.isLoggedIn = false;
        },
    },
});

export const { login, logout } = loginSlice.actions;
export default persistReducer(persistConfig, loginSlice.reducer);