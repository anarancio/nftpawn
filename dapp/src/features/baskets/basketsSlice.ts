import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Basket, Loan, InterestRate } from '../../model/BasketTypes';

interface Baskets {
    baskets: Basket[],
}

const initialState: Baskets = {
    baskets: [
        /* {
            id: '0',
            erc20: '0x11111',
            nft: '0x22222',
            availableLiquidity: 15000,
            minimumLoanAmount: 1000,
            interestRates: [
                {
                    duration: 30,
                    interest: 2,
                },
                {
                    duration: 60,
                    interest: 4,
                },
            ],
            paused: false,
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
            ],
        },
        {
            id: '1',
            erc20: '0x11111',
            nft: '0x22222',
            availableLiquidity: 30000,
            minimumLoanAmount: 500,
            interestRates: [
                {
                    duration: 30,
                    interest: 2,
                },
                {
                    duration: 90,
                    interest: 5,
                },
            ],
            paused: true,
        }, */
    ],
};

export const basketsSlice = createSlice({
    name: 'baskets',
    initialState,
    reducers: {
        /* changeContent : (state, action) => {
            state.name = action.payload.name;
            state.data = action.payload.data;
        } */
        loadBaskets: (state, action) => {
            state.baskets = action.payload;
        },
        updateBasketLiquidity: (state, action) => {
            const basket = state.baskets.find(b => b.id === action.payload.id);
            if (basket) {
                basket.availableLiquidity = action.payload.liquidity;
            }
        },
        changeBasketStatus: (state, action) => {
            const basket = state.baskets.find(b => b.id === action.payload.id);
            if (basket) {
                basket.paused = action.payload.paused;
            }
        }
    },
    extraReducers: (builder) => {
        /* builder
      .addCase(fetchBaskets.pending, (state) => {
        // Here you can handle the pending state if needed.
        // For instance, set a loading flag to true.
        console.log('---------fetchBaskets.pending---------');
      })
      .addCase(fetchBaskets.fulfilled, (state, action) => {
        // Update your state based on the fetched events
        // For now, let's just replace the entire baskets array
        // assuming that action.payload is in the right format.
        console.log('---------fetchBaskets.fulfilled---------');
        console.log(action.payload);
      })
      .addCase(fetchBaskets.rejected, (state, action) => {
        // Handle the error state if needed
        // For instance, store the error message for displaying to the user.
        console.log('---------fetchBaskets.rejected---------');
      }); */
    }
  })
  
  export const { loadBaskets, updateBasketLiquidity, changeBasketStatus } = basketsSlice.actions
  
  export default basketsSlice.reducer