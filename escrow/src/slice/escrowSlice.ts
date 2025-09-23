import { EscrowState } from '@/lib/types'
import { createSlice } from '@reduxjs/toolkit'



const initialState: EscrowState = {
    EscrowContract: {},
    provider: {},
    chainId: 0,
    deals: {},
    personalstake: 0,
    Lockstake: 0,
    admin: "0x0000000000000000000000000000000000000000",
    votingdays: 0,
    Quorum: 0,
    disputes: [],
    votes: [],
    ownerPercentage: 0,
    StakeHistory: [],
    totalstake: 0
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
        getallDeals(state, action) {
            state.deals = action.payload
        },
        getPersonalStakeBalance(stake, action) {
            stake.personalstake = action.payload
        },
        getLockBalance(stake, action) {
            stake.Lockstake = action.payload
        },
        getAdmin(stake, action) {
            stake.admin = action.payload
        },
        getVotingDay(stake, action) {
            stake.votingdays = action.payload
        },
        getQuorumDay(stake, action) {
            stake.Quorum = action.payload
        },
        getownerPercentage(stake, action) {
            stake.ownerPercentage = action.payload
        },
        getDispute(stake, action) {
            stake.disputes = action.payload
        },
        getvotes(stake, action) {
            stake.votes = action.payload
        },
        getStakeHistory(stake, action) {
            stake.StakeHistory = action.payload
        },
        gettotalstake(stake, action) {
            stake.totalstake = action.payload
        },
    },

})


export const { getEscrowContract, getprovider, getchainId, getallDeals, getPersonalStakeBalance, getLockBalance, getAdmin, getQuorumDay, getVotingDay, getDispute, getvotes, getStakeHistory, getownerPercentage ,gettotalstake } = escrowSlice.actions

export default escrowSlice.reducer