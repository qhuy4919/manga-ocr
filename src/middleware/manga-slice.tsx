import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialStateType = {
    file: any[];
    mode: string;
    language: string,
    isLoading: boolean,
};

const initialState: initialStateType = {
    file: [],
    mode: '',
    language: 'vi',
    isLoading: false,
}

export const mangaSlice = createSlice({
    name: 'manga',
    initialState: initialState,
    reducers: {
        clearState: (state) => {
            state.file = [];
            state.isLoading = false;

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
        },

        setLoadingState: (state, action) => {
            const {
                payload: {
                    isLoading,
                }
            } = action;

            state.language = isLoading;
        }
    }
});

export const { updateFile, clearState, changeMode, changeLanguage, setLoadingState } = mangaSlice.actions;
export const selectMangaList = (state: any) => state.manga.file