import { configureStore } from '@reduxjs/toolkit'
import escrowReducer from '@/slice/escrowSlice'

export const store = configureStore({
  reducer: {
    escrow: escrowReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch