import { configureStore } from '@reduxjs/toolkit';
import { mangaSlice } from './manga-slice';

export const store = configureStore({
    reducer: {
        manga: mangaSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>
