import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import type { diaryInterface } from '@/models/interface';

const initialState: diaryInterface = {
    id: 0,
    title: '',
    contents: '',
    date: '',
};

const persistConfig = {
    key: "dairy",
    storage,
    whitelist: ["id", "title", "contents", "date"],
};

const diarySlice = createSlice({
    name: 'diary',
    initialState,
    reducers: {
        setDairy(state, action: PayloadAction<{ id: number; title: string; contents: string, date: string }>) {
            state.id = action.payload.id;
            state.title = action.payload.title;
            state.contents = action.payload.contents;
            state.date = action.payload.date;
        },
        clearDairy(state) {
            state.id = 0;
            state.title = '';
            state.contents = '';
            state.date = '';
        },
    },
});

export const { setDairy, clearDairy } = diarySlice.actions;
export default persistReducer(persistConfig, diarySlice.reducer);