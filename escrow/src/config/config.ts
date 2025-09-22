type ConfigType = {
  [chainId: number]: {
    escrow: { address: string };
  };
};

export const config: ConfigType = {
  11155111: {
    escrow: {
      address: "0x5cb338DC73cE40ad63b7656e64133c5d09A9873C",
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