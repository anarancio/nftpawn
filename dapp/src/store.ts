import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

import counterReducer from './features/counter/counterSlice'
import dialogReducer from './features/dialog/dialogSlice'
import progressSlice from './features/progress/progressSlice'
import authSlice from './features/auth/authSlice'
import contentSlice from './features/content/contentSlice'
import basketsSlice from './features/baskets/basketsSlice'
import loansSlice from './features/loans/loansSlice'

export function makeStore() {
  return configureStore({
    reducer: { 
      counter: counterReducer,
      dialog: dialogReducer,
      progress: progressSlice,
      auth: authSlice,
      content: contentSlice,
      baskets: basketsSlice,
      loans: loansSlice,
    },
  })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

export default store
