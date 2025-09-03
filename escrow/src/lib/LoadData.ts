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
    let deals = await decorateDeals(escrowDeals, escrowcontract, provider);
    deals = deals.sort((a: any, b: any) => b?.deal?.createdAt - a?.deal?.createdAt)
    dispatch(getallDeals(deals));

}

const decorateDeals = async (escrowDeals: any, escrowContract: any, provider: any) => {

    const signer = provider.getSigner();
    const decoratedDeals = await Promise.all(escrowDeals.map(async (event: any) => {
        const dealId = Number(event?.args?.dealId);
        const updatedDeal = await escrowContract.connect(signer).getDeal(dealId);

        const currenttime = Math.floor(Date.now() / 1000);
        const remainingSeconds = Number(updatedDeal?.deadline) - currenttime;
        const remainingDays = Math.floor(remainingSeconds / (24 * 60 * 60));


        return {
            deal: {
                buyer: updatedDeal?.buyer,
                seller: updatedDeal?.seller,
                dealId: Number(updatedDeal?.dealId),
                title: updatedDeal?.title,
                description: updatedDeal?.description,
                amount: updatedDeal.amount.toString(),
                status: Number(updatedDeal?.status),
                createdAt: Number(updatedDeal?.createdAt),
                deadline: Number(updatedDeal?.deadline),
                isDisputed: updatedDeal?.isDisputed,
                disputedId: Number(updatedDeal?.disputedId),
                remainingDays:Number(remainingDays)
            }
        }
    })

    )
    return decoratedDeals;

}

