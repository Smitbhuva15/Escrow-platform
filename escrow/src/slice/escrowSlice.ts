import { EscrowState } from '@/lib/types'
import { createSlice } from '@reduxjs/toolkit'



const initialState: EscrowState = {
    EscrowContract: {},
    provider: {},
    chainId:0,
    deals:{}
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
        getallDeals(state,action){
            state.deals=action.payload
        }

    },
    
})


export const { getEscrowContract, getprovider ,getchainId, getallDeals } = escrowSlice.actions

export default escrowSlice.reducer