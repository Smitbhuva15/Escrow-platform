import { ethers } from 'ethers'
import React from 'react'
import escrowAbi from '@/abi/escrow.json'
import { config } from '@/config/config';
import { getallDeals, getchainId, getEscrowContract, getprovider } from '@/slice/escrowSlice';
import toast from 'react-hot-toast';
import { markConfirmType, markType } from './types';


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
                remainingDays: Number(remainingDays)
            }
        }
    })

    )
    return decoratedDeals;

}

export const markdelivery = async ({
    dealId,
    dispatch,
    escrowContract,
    provider,
    setIsLoading,
}: markType) => {
    const isReady =
        escrowContract && Object.keys(escrowContract).length > 0 &&
        provider && Object.keys(provider).length > 0;

    setIsLoading(true);

    if (isReady) {
        toast.loading("Preparing delivery confirmation... Please confirm the transaction in your wallet.", {
            id: "escrowTx",
        });

        const signer = await provider.getSigner();

        try {
            const transaction = await escrowContract.connect(signer).markDelivered(dealId);

            toast.loading("Delivery confirmation submitted. Waiting for on-chain confirmation...", {
                id: "escrowTx",
            });

            const receipt = await transaction.wait();

            if (receipt.status !== 1) {
                toast.error("Delivery confirmation failed. Please try again.", {
                    id: "escrowTx",
                });
                setIsLoading(false);
                return;
            }

            const event = receipt.events?.find((e: any) => e.event === "Delivered");

            if (event) {
                toast.success("Deliver marked successfully!", {
                    id: "escrowTx",
                });
            } else {
                toast.error("Transaction confirmed but Delivered event not found.", {
                    id: "escrowTx",
                });
            }
        } catch (error) {
            toast.error("Delivery transaction failed.", {
                id: "escrowTx",
            });
        } finally {
            await LoadEscrow(escrowContract, provider, dispatch);
            setIsLoading(false);
        }
    }
};


export const markconfirmationReceive = async ({
  dealId,
  dispatch,
  escrowContract,
  provider,
  setLoadingConfirmation,
}: markConfirmType) => {
  const isReady =
    escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

  setLoadingConfirmation(true);

  if (isReady) {
    toast.loading("Preparing receipt confirmation... Please confirm in your wallet.", {
      id: "escrowTx",
    });

    const signer = await provider.getSigner();

    try {
      const transaction = await escrowContract.connect(signer).confirmReceived(dealId);

      toast.loading("Receipt confirmation submitted. Waiting for blockchain confirmation...", {
        id: "escrowTx",
      });

      const receipt = await transaction.wait();

      if (receipt.status !== 1) {
        toast.error("Receipt confirmation failed. Please try again.", {
          id: "escrowTx",
        });
        setLoadingConfirmation(false);
        return;
      }

      const event = receipt.events?.find((e: any) => e.event === "Confirmation");

      if (event) {
        toast.success("Receipt confirmed successfully! Funds have been released to the seller.", {
          id: "escrowTx",
        });
      } else {
        toast.error("Transaction confirmed, but no Confirmation event found. Please check the deal status.", {
          id: "escrowTx",
        });
      }
    } catch (error) {
      toast.error("Receipt confirmation transaction failed.", {
        id: "escrowTx",
      });
    } finally {
      await LoadEscrow(escrowContract, provider, dispatch);
      setLoadingConfirmation(false);
    }
  }
};
