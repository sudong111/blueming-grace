import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import loginReducer from './loginSlice';
import diaryReducer from './diariesSlice'
import assetsReducer from './assetsSlice'

const persistConfig = {
    key: 'login',
    storage: storageSession,
};

const persistedLoginReducer = persistReducer(persistConfig, loginReducer);

export const store = configureStore({
    reducer: {
        login: persistedLoginReducer, // 로그인 slice만 persist 적용
        diaries: diaryReducer,
        assets: assetsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;