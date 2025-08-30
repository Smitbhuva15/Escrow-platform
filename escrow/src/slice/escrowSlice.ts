import { EscrowState } from '@/lib/types'
import { createSlice } from '@reduxjs/toolkit'



const initialState: EscrowState = {
    EscrowContract: {},
    provider: {},
    chainId:0
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
         getchainId(state, action) {
            state.chainId = action.payload
        },

    },
    
})


export const { getEscrowContract, getprovider ,getchainId } = escrowSlice.actions

export default escrowSlice.reducer