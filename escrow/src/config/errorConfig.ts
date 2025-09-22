type ErrorConfigType = {
  [chainId: string]: {
    message: string
  };
};

export const errorconfig:ErrorConfigType = {
    "0xf50703c4": { message: "Client and specialist cannot be the same address." },
    "0xcbdd34cf": { message: "The provided address is invalid." },
    "0xaec5ccf3": { message: "The amount provided must be greater than zero." },
    "0x55810581": { message: "The deadline provided is invalid." },
    "0x6ecf574a": { message: "Your stake amount is insufficient." },
    "0xe4d6389f": { message: "The transaction could not be completed." },
    "0x2ddc8c67": { message: "The deal ID does not exist." },
    "0xd96c6d5e": { message: "The action cannot be performed as the deadline has passed." },
    "0x01b7a4f5": { message: "All your stake is locked in ongoing voting." },
    "0x941d6a1b": { message: "The client address is invalid." },
    "0x4cbe7c2e": { message: "The specialist address is invalid." },
    "0x79c2ccfe": { message: "The deal has not been funded by the client yet." },
    "0xf8c6d178": { message: "The work has not been marked as delivered by the specialist." },
    "0x75797cf2": { message: "The deal is neither funded by the client nor delivered by the specialist." },
    "0x3e9113d2": { message: "Only the contract owner can perform this action." },
    "0x7d0daf88": { message: "You are neither the client nor the specialist of this deal." },
    "0x4e9ff321": { message: "A dispute has already been opened for this deal." },
    "0xdba030fd": { message: "The quorum target is invalid or zero." },
    "0x4fa1dfcb": { message: "The dispute ID does not exist." },
    "0x6677ee84": { message: "The dispute has already been closed." },
    "0x55b35329": { message: "You have already voted on this dispute." },
    "0x19a2a9bd": { message: "Voting weight must be greater than zero." },
    "0x03927cca": { message: "You have already used all your available stake for voting." },
    "0xcd798180": { message: "The deal is not currently under dispute." },
    "0x2fb9a98f": { message: "You did not contribute any stake to this dispute." },
    "0xaaabc3b2": { message: "The dispute is not yet closed." },
    "0xbca385ed": { message: "Direct ETH transfer is not allowed." },
    "0xc9ad5f7f": { message: "The deal has already been funded by the client." },
    "0xba6f5a17": { message: "Cannot confirm receipt because the specialist has not delivered the work." },
    "0x6f16f0ff": { message: "Cannot confirm receipt because the client has not funded the deal." },
    "0x4c48e68c": { message: "The deal has already been confirmed." },
    "0xef0ccf50": { message: "Cannot deposit as the funding deadline has already passed." }
};
