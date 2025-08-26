import { EscrowState } from '@/lib/interface'
import { createSlice } from '@reduxjs/toolkit'



const initialState: EscrowState = {
    EscrowContract: {},
    provider: {}
}

export const escrowSlice = createSlice({
    name: 'escrow',
    initialState,
    reducers: {
        getEscrowContract(state, action) {
            state.EscrowContract = action.payload
        },
        getprovider(state, action) {
            state.provider = action.payload
        },

    },
})


export const { getEscrowContract, getprovider } = escrowSlice.actions

export default escrowSlice.reducer