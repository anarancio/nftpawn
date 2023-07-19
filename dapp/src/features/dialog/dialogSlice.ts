import { createSlice } from '@reduxjs/toolkit'

interface DialogState {
    isOpen: boolean,
    componentName: string,
    data?: any,
}

const initialState: DialogState = {
    isOpen: false,
    componentName: '',
    data: null,
};

export const dialogSlice = createSlice({
    name: 'dialog',
    initialState,
    reducers: {
      openDialogWithData: (state, action) => {
        state.isOpen = true;
        state.componentName = action.payload.componentName;
        state.data = action.payload.data;
      },
      openDialog: (state, action) => {
        state.isOpen = true;
        state.componentName = action.payload;
      },
      closeDialog: (state, action) => {
        state.isOpen = false;
        state.componentName = '';
      },
    },
  })
  
  export const { openDialog, openDialogWithData, closeDialog } = dialogSlice.actions
  
  export default dialogSlice.reducer