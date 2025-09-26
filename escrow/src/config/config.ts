type ConfigType = {
  [chainId: number]: {
    escrow: { address: string };
  };
};

export const config: ConfigType = {
  11155111: {
    escrow: {
      address: "0x8f23080Fd8a384A3e918021d8019F57e53624E63",
    },
  },
};




export const dealStatus = [
    {
        name: "Created",
        rank: 1,
    },
    {
        name: "Funded",
        rank: 2,
    },
    {
        name: "Delivered",
        rank: 3,
    }
]