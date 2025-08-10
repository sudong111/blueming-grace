import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './loginSlice';
import { persistStore } from "redux-persist";

export const store = configureStore({
    reducer: {
        login: loginReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;