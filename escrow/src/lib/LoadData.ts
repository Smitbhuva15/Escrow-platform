import { ethers } from 'ethers'
import React from 'react'
import escrowAbi from '@/abi/escrow.json'
import { config } from '@/config/config';
import { getAdmin, getallDeals, getchainId, getDispute, getEscrowContract, getLockBalance, getPersonalStakeBalance, getprovider, getQuorumDay, getVotingDay } from '@/slice/escrowSlice';
import toast from 'react-hot-toast';
import { AdminInfoType, decoratedisputeType, depositType, DisputeType, markConfirmType, markType, openDisputeType, StakeBalanceType, stakeType, unstakeType, VotingType } from './types';


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
    const remainingDays = Math.ceil(remainingSeconds / (24 * 60 * 60));


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


export const markOpenDispute = async ({
  dealId,
  dispatch,
  escrowContract,
  provider,
  setLoadingOpenDispute,
}: openDisputeType) => {
  const isReady =
    escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

  setLoadingOpenDispute(true);

  if (isReady) {
    toast.loading("Preparing dispute... Please confirm in your wallet.", {
      id: "escrowTx",
    });

    const signer = await provider.getSigner();

    try {
      const transaction = await escrowContract.connect(signer).openDispute(dealId);

      toast.loading("Dispute submitted. Waiting for blockchain confirmation...", {
        id: "escrowTx",
      });

      const receipt = await transaction.wait();

      if (receipt.status !== 1) {
        toast.error("Opening dispute failed. Please try again.", {
          id: "escrowTx",
        });
        setLoadingOpenDispute(false);
        return;
      }

      const event = receipt.events?.find((e: any) => e.event === "Dispute");

      if (event) {
        toast.success("Dispute opened successfully! The issue is now under review.", {
          id: "escrowTx",
        });
      } else {
        toast.error("Transaction confirmed, but no dispute event found. Please check the deal status.", {
          id: "escrowTx",
        });
      }
    } catch (error) {
      toast.error("Dispute transaction failed. Please try again.", {
        id: "escrowTx",
      });
    } finally {
      await LoadEscrow(escrowContract, provider, dispatch);
      setLoadingOpenDispute(false);
    }
  }
};


export const handeldeposite = async ({
  dealId, amount, dispatch, provider, escrowContract, setIsLoading
}: depositType) => {

  const isReady =
    escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

  setIsLoading(dealId)
  if (isReady) {
    toast.loading("Preparing deposit... Please confirm the transaction in your wallet.", {
      id: "escrowTx",
    });

    try {
      const signer = await provider.getSigner();
      const transaction = await escrowContract.connect(signer).deposit(dealId, { value: amount });

      toast.loading("Transaction submitted. Waiting for confirmation on-chain...", {
        id: "escrowTx",
      });

      const receipt = await transaction.wait();

      if (receipt.status !== 1) {
        toast.error("Deposit failed. Please try again.", {
          id: "escrowTx",
        });
        setIsLoading(-1);
        return;
      }

      const event = receipt.events?.find((e: any) => e.event === "Deposit");


      if (event) {
        toast.success("Funds deposited successfully!!", {
          id: "escrowTx",
        });
      } else {
        toast.error("Transaction confirmed, but no Deposit event found.", {
          id: "escrowTx",
        });
      }
    } catch (error) {
      toast.error("Deposit transaction failed.", {
        id: "escrowTx",
      });


    } finally {
      await LoadEscrow(escrowContract, provider, dispatch);
      setIsLoading(-1);
    }

  }
}

export const loadstakebalance = async (
  { dispatch, escrowContract, provider, address }: StakeBalanceType) => {
  const signer = await provider.getSigner();
  try {
    let transaction = await escrowContract.connect(signer).getstaked(address);
    dispatch(getPersonalStakeBalance((Number(transaction) / 1e18)))
    transaction = await escrowContract.connect(signer).getcurrentlyLocked(address);
    dispatch(getLockBalance((Number(transaction) / 1e18)))

  } catch (error) {
    console.log("error :", error)
  }
}

export const loadAdmininfo = async (
  { dispatch, escrowContract, provider }: AdminInfoType) => {
  const signer = await provider.getSigner();
  try {
    let transaction = await escrowContract.connect(signer).owner();
    dispatch(getAdmin(transaction))
    transaction = await escrowContract.connect(signer).votingDays();
    dispatch(getVotingDay(Number(transaction) / (24 * 60 * 60)))
    transaction = await escrowContract.connect(signer).minmumvotedweightPercentage();
    dispatch(getQuorumDay(Number(transaction)))


  } catch (error) {
    console.log("error :", error)
  }
}

export const stakeEth = async ({
  dispatch,
  escrowContract,
  provider,
  stake,
  setIsLoadingStake,
  address
}: stakeType) => {
  const isReady =
    escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

  setIsLoadingStake(true);

  if (isReady) {
    toast.loading("Preparing your stake... Please confirm in your wallet.", {
      id: "stakeTx",
    });

    const signer = await provider.getSigner();

    try {
      const transaction = await escrowContract.connect(signer).stake({ value: ethers.utils.parseEther(stake) });

      toast.loading("Stake transaction submitted. Waiting for blockchain confirmation...", {
        id: "stakeTx",
      });

      const receipt = await transaction.wait();

      if (receipt.status !== 1) {
        toast.error("Staking failed. Please try again.", {
          id: "stakeTx",
        });
        setIsLoadingStake(false);
        return;
      }

      const event = receipt.events?.find((e: any) => e.event === "Staked");

      if (event) {
        toast.success(`Successfully staked ${stake} ETH! Your voting power has increased.`, {
          id: "stakeTx",
        });
      } else {
        toast.error("Transaction confirmed, but no staking event found. Please check your balance.", {
          id: "stakeTx",
        });
      }
    } catch (error) {
      toast.error("Stake transaction failed. Please try again.", {
        id: "stakeTx",
      });
    } finally {
      await loadstakebalance({ dispatch, escrowContract, provider, address });
      setIsLoadingStake(false);
    }
  }
};

export const unstakeEth = async ({
  dispatch,
  escrowContract,
  provider,
  unstake,
  setIsLoadingUnStake,
  address,
}: unstakeType) => {
  const isReady =
    escrowContract &&
    Object.keys(escrowContract).length > 0 &&
    provider &&
    Object.keys(provider).length > 0;

  setIsLoadingUnStake(true);

  if (isReady) {
    toast.loading("Preparing to unstake... Please confirm in your wallet.", {
      id: "unstakeTx",
    });

    const signer = await provider.getSigner();

    try {
      const transaction = await escrowContract.connect(signer)
        .unstake(ethers.utils.parseEther(unstake));

      toast.loading("Unstake transaction submitted. Waiting for confirmation...", {
        id: "unstakeTx",
      });

      const receipt = await transaction.wait();

      if (receipt.status !== 1) {
        toast.error("Unstaking failed. Please try again.", {
          id: "unstakeTx",
        });
        setIsLoadingUnStake(false);
        return;
      }

      const event = receipt.events?.find((e: any) => e.event === "Unstaked");

      if (event) {
        toast.success(`Successfully unstaked ${unstake} ETH! Your balance has been updated.`, {
          id: "unstakeTx",
        });
      } else {
        toast.error("Transaction confirmed, but no unstake event found. Please check your balance.", {
          id: "unstakeTx",
        });
      }
    } catch (error) {
      console.log(error)
      toast.error("Unstake transaction failed. Please try again.", {
        id: "unstakeTx",
      });
    } finally {
      await loadstakebalance({ dispatch, escrowContract, provider, address });
      setIsLoadingUnStake(false);
    }
  }
};

export const updateVotingDays = async ({
  dispatch,
  escrowContract,
  provider,
  value,
  setIsLoading,
}: VotingType) => {
  const isReady =
    escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

  setIsLoading(true);

  if (isReady) {
    toast.loading("Preparing to update voting period... Please confirm in your wallet.", {
      id: "votingDaysTx",
    });

    const signer = await provider.getSigner();

    try {
      const transaction = await escrowContract.connect(signer).setvotingDay(Number(value));

      toast.loading("Transaction submitted. Waiting for blockchain confirmation...", {
        id: "votingDaysTx",
      });

      const receipt = await transaction.wait();

      if (receipt.status !== 1) {
        toast.error("Failed to update voting period. Please try again.", {
          id: "votingDaysTx",
        });
        setIsLoading(false);
        return;
      }

      toast.success(`Voting period successfully updated to ${value} days.`, {
        id: "votingDaysTx",
      });
    } catch (error) {
      toast.error("Transaction failed. Please try again.", {
        id: "votingDaysTx",
      });
    } finally {
      await loadAdmininfo({ dispatch, escrowContract, provider });
      setIsLoading(false);
    }
  }
};

export const updateQuorum = async ({
  dispatch,
  escrowContract,
  provider,
  value,
  setIsLoading,
}: VotingType) => {
  const isReady =
    escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

  setIsLoading(true);

  if (isReady) {
    toast.loading("Preparing to update quorum... Please confirm in your wallet.", {
      id: "quorumTx",
    });

    const signer = await provider.getSigner();

    try {
      const transaction = await escrowContract
        .connect(signer)
        .setminmumvotedweightPercentage(Number(value));

      toast.loading("Quorum update submitted. Waiting for blockchain confirmation...", {
        id: "quorumTx",
      });

      const receipt = await transaction.wait();

      if (receipt.status !== 1) {
        toast.error("Failed to update quorum. Please try again.", {
          id: "quorumTx",
        });
        setIsLoading(false);
        return;
      }

      toast.success(`Quorum successfully updated to ${value}%.`, {
        id: "quorumTx",
      });
    } catch (error) {
      toast.error("Quorum update transaction failed. Please try again.", {
        id: "quorumTx",
      });
    } finally {
      await loadAdmininfo({ dispatch, escrowContract, provider });
      setIsLoading(false);
    }
  }
};


export const loadDispute = async ({ dispatch, escrowContract, provider, setIsLoading }: DisputeType) => {
  const isReady =
    escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

  setIsLoading(true);
  let disputeevent;
  if (isReady) {
    disputeevent = await escrowContract.queryFilter("Dispute");
    const dispute=await decoratedispute({ dispatch, escrowContract, provider, disputeevent });
   dispatch(getDispute(dispute));
  }
}

const decoratedispute = async ({ dispatch, escrowContract, provider, disputeevent }: decoratedisputeType) => {
  const signer = await provider.getSigner();
  if (disputeevent && disputeevent.length > 0) {
    const decoratedDispute = await Promise.all(disputeevent.map(async (event: any) => {
      const dealId = Number(event?.args?.dealId);
      const updatedDeal = await escrowContract.connect(signer).getDeal(dealId);

      const currenttime = Math.floor(Date.now() / 1000);
      const remainingSeconds = Number(event?.args?.votingEndTime) - currenttime;
      const votingremainingDays = Math.ceil(remainingSeconds / (24 * 60 * 60));

      return {
        dispute: {
          buyer: updatedDeal?.buyer,
          seller: updatedDeal?.seller,
          dealId: Number(updatedDeal?.dealId),
          title: updatedDeal?.title,
          description: updatedDeal?.description,
          amount: updatedDeal.amount.toString(),
          status: Number(updatedDeal?.status),
          createdAt: Number(updatedDeal?.createdAt),
          dealdeadline: Number(updatedDeal?.deadline),
          isDisputed: updatedDeal?.isDisputed,
          disputedId: Number(updatedDeal?.disputedId),
          votingEndTime: Number(event?.args?.votingEndTime),
          YesVoting: Number(event?.args?.YesVoting),
          Novoting: Number(event?.args?.Novoting),
          quorumTarget: Number(event?.args?.quorumTarget),
          closed: Number(event?.args?.closed),
          votingremainingDays:votingremainingDays
        }
      }
    }))
    return decoratedDispute;
  }

}