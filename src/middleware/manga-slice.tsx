import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialStateType = {
    file: any[];
    mode: string;
};

const initialState: initialStateType = {
    file: [],
    mode: '',
}

export const mangaSlice = createSlice({
    name: 'manga',
    initialState: initialState,
    reducers: {
        clearState: (state) => {
            state.file = [];

            return state;
        },
        updateFile: (state, action) => {
            const {
                payload: {
                    file
                }
            } = action;

            state.file = [...file];
        },
        changeMode: (state, action) => {
            const {
                payload: {
                    mode,
                }
            } = action;

            state.mode = mode
        }
    }
});

export const { updateFile, clearState, changeMode } = mangaSlice.actions;
export const selectMangaList = (state: any) => state.manga.file