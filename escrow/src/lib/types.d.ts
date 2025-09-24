export interface EscrowState {
  EscrowContract: any,
  provider: any,
  chainId: number,
  deals: any,
  personalstake: Number,
  Lockstake: Number,
  admin: `0x${string}`,
  votingdays: Number,
  Quorum: Number,
  disputes: [],
  votes: [],
  ownerPercentage: 0,
  StakeHistory: [],
  totalstake: Number
}

export interface Inputs {
  title: string
  description: string
  specialist: string
  amount: string
  deadline: string
}

export interface VoteInputs {
  weight: string
}


export interface markType {
  dealId: Number,
  dispatch: any,
  escrowContract: any,
  provider: any
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export interface markConfirmType {
  dealId: Number,
  dispatch: any,
  escrowContract: any,
  provider: any
  setLoadingConfirmation: React.Dispatch<React.SetStateAction<boolean>>
}

export interface openDisputeType {
  dealId: Number,
  dispatch: any,
  escrowContract: any,
  provider: any
  setLoadingOpenDispute: React.Dispatch<React.SetStateAction<boolean>>
}

export interface depositType {
  dealId: number,
  amount: number,
  dispatch: any,
  escrowContract: any,
  provider: any
  setIsLoading: React.Dispatch<React.SetStateAction<number>>
}

export interface stakeType {
  dispatch: any,
  escrowContract: any,
  provider: any,
  stake: string,
  setIsLoadingStake: React.Dispatch<React.SetStateAction<boolean>>,
  address: `0x${string}`
}

export interface unstakeType {
  dispatch: any,
  escrowContract: any,
  provider: any,
  unstake: string,
  setIsLoadingUnStake: React.Dispatch<React.SetStateAction<boolean>>,
  address: `0x${string}`
}

export interface stakeInputs {
  stake: string
}
export interface unstakeInputs {
  unstake: string
}
export interface votingInput {
  days: string
}
export interface PlatformFeeInput {
  fee: string
}
export interface QuorumInput {
  Quorum: string
}

export interface StakeBalanceType {
  dispatch: any,
  escrowContract: any,
  provider: any,
  address: `0x${string}`
}

export interface AdminInfoType {
  dispatch: any,
  escrowContract: any,
  provider: any
}

export interface VotingType {
  dispatch: any,
  escrowContract: any,
  provider: any,
  value: Number
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
}

export interface DisputeType {
  dispatch: any,
  escrowContract: any,
  provider: any,

}
export interface totalvotingtype {
  dispatch: any,
  escrowContract: any,
  provider: any

}

export interface decoratedisputeType {
  dispatch: any,
  escrowContract: any,
  provider: any
  disputeevent: any
}

export interface votingType {
  disputedId: Number,
  supportYes: boolean,
  weight: Number,
  dispatch: any,
  escrowContract: any,
  provider: any
  setIsLoading: React.Dispatch<React.SetStateAction<string>>,
}


export interface resolveType {
  dispatch: any,
  escrowContract: any,
  provider: any,
  disputeId: Number,
  setIsCloseLoading: React.Dispatch<React.SetStateAction<boolean>>,
}

export interface unlockstakeType {
  dispatch: any,
  escrowContract: any,
  provider: any,
  disputeId: Number,
  setIsLoading: React.Dispatch<React.SetStateAction<number>>,
  index: Number
}


export interface singledisputeType {
  dispute:
  {
    Novoting: Number,
    Yesvoting: Number,
    amount: String,
    client: String,
    closed: Number,
    createdAt: Number,
    dealId: Number,
    dealdeadline: Number,
    description: String,
    disputedId: Number,
    isDisputed: boolean,
    quorumTarget: Number,
    specialist: String,
    status: Number,
    title: String,
    votingEndTime: Number,
    votingremainingDays: Number
  }
}

export interface SingledealType {
  deal: {
    dealId: number;
    title: string;
    description: string;
    amount: string;
    client: string;
    specialist: string;
    createdAt: number;
    deadline: number;
    status: number;
    isDisputed: boolean;
    disputedId: number;
    remainingDays: number;
  }
}

export interface DealVote {
  dealId: number;
  disputedId: number;
  createdAt: number;
  support: boolean;
  voterAddress: string;
  weight: string;
}

export interface stakeDetails {
  address: string
  amount: number
  createdAt: number
  method: string
}

interface CartProps {
  deals: SingledealType[];
}

export interface disputeprops{
    disputes:singledisputeType[]
}

export interface stakeprops{
   stakeHistory: stakeDetails[]
}