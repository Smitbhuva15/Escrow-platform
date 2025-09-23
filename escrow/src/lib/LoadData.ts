import { ethers } from 'ethers'
import escrowAbi from '@/abi/escrow.json'
import { config } from '@/config/config';
import { getAdmin, getallDeals, getchainId, getDispute, getEscrowContract, getLockBalance, getownerPercentage, getPersonalStakeBalance, getprovider, getQuorumDay, getStakeHistory, gettotalstake, getvotes, getVotingDay } from '@/slice/escrowSlice';
import { AdminInfoType, decoratedisputeType, DisputeType, StakeBalanceType, totalvotingtype } from './types';

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
        client: updatedDeal?.buyer,
        specialist: updatedDeal?.seller,
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

export const loadstakebalance = async (
  { dispatch, escrowContract, provider, address }: StakeBalanceType) => {
  const signer = await provider.getSigner();
  try {
    let transaction = await escrowContract.connect(signer).getstaked(address);
    dispatch(getPersonalStakeBalance((Number(transaction) / 1e18)))
    transaction = await escrowContract.connect(signer).getcurrentlyLocked(address);
    dispatch(getLockBalance((Number(transaction) / 1e18)))
     transaction = await escrowContract.connect(signer).totalStake();
    dispatch(gettotalstake((Number(transaction) / 1e18)))

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
    transaction = await escrowContract.connect(signer).ownerPercentage();
    dispatch(getownerPercentage(Number(transaction)))

  } catch (error) {
    console.log("error :", error)
  }
}

export const loadDispute = async ({ dispatch, escrowContract, provider }: DisputeType) => {
  const isReady =
    escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

  let disputeevent;
  if (isReady) {
    disputeevent = await escrowContract.queryFilter("Dispute");
    let dispute = await decoratedispute({ dispatch, escrowContract, provider, disputeevent });
    dispute = dispute?.sort((a: any, b: any) => Number(b?.dispute?.createdAt) - Number(a?.dispute?.createdAt))
   
    dispatch(getDispute(dispute));
  }
}

const decoratedispute = async ({ dispatch, escrowContract, provider, disputeevent }: decoratedisputeType) => {
  const signer = await provider.getSigner();
  if (disputeevent && disputeevent.length > 0) {
    const decoratedDispute = await Promise.all(disputeevent.map(async (event: any) => {
      const dealId = Number(event?.args?.dealId);
      const updatedDeal = await escrowContract.connect(signer).getDeal(dealId);

      const updatedDispute = await escrowContract.connect(signer).getDispute(updatedDeal?.disputedId);

      const currenttime = Math.floor(Date.now() / 1000);
      const remainingSeconds = Number(updatedDispute?.votingEndTime) - currenttime;
      const votingremainingDays = Math.ceil(remainingSeconds / (24 * 60 * 60));

      return {
        dispute: {
          client: updatedDeal?.buyer,
          specialist: updatedDeal?.seller,
          dealId: Number(updatedDeal?.dealId),
          title: updatedDeal?.title,
          description: updatedDeal?.description,
          amount: updatedDeal.amount.toString(),
          status: Number(updatedDeal?.status),
          createdAt: Number(event?.args?.createdAt),
          dealdeadline: Number(updatedDeal?.deadline),
          isDisputed: updatedDeal?.isDisputed,
          disputedId: Number(updatedDeal?.disputedId),
          votingEndTime: Number(updatedDispute?.votingEndTime),
          Yesvoting: Number(updatedDispute?.YesVoting),
          Novoting: Number(updatedDispute?.Novoting),
          quorumTarget: Number(updatedDispute?.quorumTarget),
          closed: Number(updatedDispute?.closed),
          votingremainingDays: votingremainingDays
        }
      }
    }))
    return decoratedDispute;
  }

}

export const loadTotalVotings = async ({ dispatch, escrowContract, provider }: totalvotingtype) => {
  const isReady =
    escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

  let voteEvent;
  let decoratedVote;

  if (isReady) {
    voteEvent = await escrowContract.queryFilter("Voted");

    decoratedVote = voteEvent.map((event: any) => {
      return ({
        disputedId: Number(event?.args?.disputedId),
        dealId: Number(event?.args?.dealId),
        voterAddress: event?.args?.voterAddress,
        weight: Number(event?.args?.weight),
        support: event?.args?.support,
        createdAt:Number(event?.args?.createdAt)
      })
    })
  }
 decoratedVote=decoratedVote.sort((a:any,b:any)=>b?.createdAt-a?.createdAt)
  dispatch(getvotes(decoratedVote))
}

export const loadStakeAndUnStakeHistory = async ({ dispatch, escrowContract, provider }: totalvotingtype) => {
  const isReady =
    escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

  let stakeEvent;
  let unstakeEvent;
  let decoratedEvent;

  if (isReady) {
    stakeEvent = await escrowContract.queryFilter("Staked");
    unstakeEvent = await escrowContract.queryFilter("Unstaked");

    stakeEvent = stakeEvent.map((event: any) => {
      return ({
        amount: Number(event?.args?.amount),
        address: event?.args?.depositer,
        method: "Staked",
        createdAt:Number(event?.args?.createdAt)
      })
    })

    unstakeEvent = unstakeEvent.map((event: any) => {
      return ({
        amount: Number(event?.args?.amount),
        address: event?.args?.withdrawer,
        method: "Unstaked",
        createdAt:Number(event?.args?.createdAt)
      })
    })
  }

  decoratedEvent = [...stakeEvent, ...unstakeEvent]
  decoratedEvent=decoratedEvent.sort((a:any,b:any)=>b?.createdAt-a?.createdAt)
  dispatch(getStakeHistory(decoratedEvent))
}



