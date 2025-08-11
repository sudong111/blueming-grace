import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import type { DiaryInterface } from '@/models/interface';

const initialState: DiaryInterface = {
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

const investmentDiarySlice = createSlice({
    name: 'investmentDiary',
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

export const { setDairy, clearDairy } = investmentDiarySlice.actions;
export default persistReducer(persistConfig, investmentDiarySlice.reducer);