import { createSlice } from '@reduxjs/toolkit'
import { PAGE_MAIN } from '../../constants';

interface ContentPage {
    name: string,
    data: any,
}

const initialState: ContentPage = {
    name: PAGE_MAIN,
    data: null,
};

export const contentSlice = createSlice({
    name: 'content',
    initialState,
    reducers: {
        changeContent : (state, action) => {
            state.name = action.payload.name;
            state.data = action.payload.data;
        }
    },
    extraReducers: (builder) => {
    }
  })
  
  export const { changeContent } = contentSlice.actions
  
  export default contentSlice.reducer