import { ethers } from 'ethers'
import React from 'react'
import escrowAbi from '@/abi/escrow.json'
import { config } from '@/config/config';
import { getallDeals, getchainId, getEscrowContract, getprovider } from '@/slice/escrowSlice';


declare global {
    interface Window {
        ethereum?: any;
    }
}

export const LoadContarct = async (dispatch: any) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    dispatch(getprovider(provider))

    const { chainId } = await provider.getNetwork();
    dispatch(getchainId(chainId))

    const escrowContract = new ethers.Contract(config[chainId]?.escrow?.address, escrowAbi, provider);
    dispatch(getEscrowContract(escrowContract))
}


export const LoadEscrow = async (escrowcontract: any, provider: any, dispatch: any) => {

    let escrowDeals = await escrowcontract.queryFilter("Deal");
    escrowDeals=escrowDeals.sort((a:any,b:any)=>b?.args?.createdAt-a?.args?.createdAt)
    dispatch(getallDeals(escrowDeals));

}

