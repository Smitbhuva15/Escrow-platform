import { configureStore } from '@reduxjs/toolkit'
import escrowReducer from '@/slice/escrowSlice'

export const store = configureStore({
  reducer: {
    escrow: escrowReducer,
  },
})