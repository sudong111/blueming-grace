import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from "redux-persist";
import loginReducer from './loginSlice';
import diaryReducer from './diariesSlice'
import assetsReducer from './assetsSlice'

export const store = configureStore({
    reducer: {
        login: loginReducer,
        diaries: diaryReducer,
        assets: assetsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;