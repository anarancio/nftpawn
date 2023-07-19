import { createSlice } from '@reduxjs/toolkit'

interface Loan {
    id: string,
    amount: number,
    duration: number,
    status: string,
    expires: string,
    interest: number, 
    borrower: string,
    nftId: string,
}

interface Loans {
    loans: Loan[],
}

const initialState: Loans = {
    loans: [
            {
                id: '0',
                amount: 1000,
                duration: 30,
                status: 'active',
                expires: '2021-09-30',
                interest: 2,
                borrower: '0x33333',
                nftId: '0x44444',
            }
    ]
};

export const loansSlice = createSlice({
    name: 'loanskets',
    initialState,
    reducers: {
        /* changeContent : (state, action) => {
            state.name = action.payload.name;
            state.data = action.payload.data;
        } */
    },
    extraReducers: (builder) => {
    }
  })
  
  //export const { changeContent } = basketsSlice.actions
  
  export default loansSlice.reducer