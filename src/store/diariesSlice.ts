import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import type { DiaryInterface } from '@/models/interface';

interface DiariesInterface {
    data: DiaryInterface[]
}

const initialState: DiariesInterface = {
    data: []
};

const persistConfig = {
    key: "diaries",
    storage,
    whitelist: ["data"],
};

const diariesSlice = createSlice({
    name: 'diaries',
    initialState,
    reducers: {
        setDiaries(state, action: PayloadAction<DiaryInterface[]>) {
            state.data = action.payload;
        },
        clearDiaries(state) {
            state.data = [];
        },
    },
});

export const { setDiaries, clearDiaries } = diariesSlice.actions;
export default persistReducer(persistConfig, diariesSlice.reducer);