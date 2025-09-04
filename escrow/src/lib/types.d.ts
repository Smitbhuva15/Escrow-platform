export interface EscrowState {
  EscrowContract: any,
  provider: any,
  chainId: number,
  deals: any
}

export interface Inputs {
  title: string
  description: string
  seller: string
  amount: string
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