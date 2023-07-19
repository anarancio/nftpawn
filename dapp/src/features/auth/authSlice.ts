import { createSlice } from '@reduxjs/toolkit'

interface UserInfo {
  isLoggedIn: boolean,
  account: string,
}

const initialState: UserInfo = {
  isLoggedIn: false,
  account: '',
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      connectUser: (state, action) => {
        state.account = action.payload;
        state.isLoggedIn = true;
      },
      disconnectUser: (state) => {
        state.account = '';
        state.isLoggedIn = false;
      },
    },
    extraReducers: (builder) => {
    }
  })
  
  export const { connectUser, disconnectUser } = authSlice.actions
  
  export default authSlice.reducer