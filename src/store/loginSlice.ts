import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface loginState {
    token: string | null;
    isLoggedIn: boolean;
}

const initialState: loginState = {
    token: null,
    isLoggedIn: false,
};

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        login(state, action: PayloadAction<string>) {
            state.token = action.payload;
            state.isLoggedIn = true;
        },
        logout(state) {
            state.token = null;
            state.isLoggedIn = false;
        },
    },
});

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;