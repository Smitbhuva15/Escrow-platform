export interface EscrowState {
  EscrowContract: any,
  provider: any,
  chainId: number,
  deals: any,
  personalstake: Number,
  Lockstake: Number,
  admin: `0x${string}`,
  votingdays: Number,
  Quorum: Number
}

export interface Inputs {
  title: string
  description: string
  seller: string
  amount: string
  deadline: string
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
