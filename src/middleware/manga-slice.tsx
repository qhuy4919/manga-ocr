import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialStateType = {
    file: any[];
    mode: string;
    language: string,
};

const initialState: initialStateType = {
    file: [],
    mode: '',
    language: 'vi',
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
        },
        changeLanguage: (state, action) => {
             const {
                payload: {
                    language,
                }
            } = action;

            state.language = language
        }
    }
});

export const { updateFile, clearState, changeMode, changeLanguage } = mangaSlice.actions;
export const selectMangaList = (state: any) => state.manga.file