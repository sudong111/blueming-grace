import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import type { AssetInterface } from '@/models/interface';

interface AssetsState {
    data: AssetInterface[];
}

const initialState: AssetsState = {
    data: []
};

const persistConfig = {
    key: "assets",
    storage,
    whitelist: ["data"],
};

const assetsSlice = createSlice({
    name: 'assets',
    initialState,
    reducers: {
        setAssets(state, action: PayloadAction<AssetInterface[]>) {
            state.data = action.payload;
        },
        clearAssets(state) {
            state.data = [];
        },
    },
});

export const { setAssets, clearAssets } = assetsSlice.actions;
export default persistReducer(persistConfig, assetsSlice.reducer);