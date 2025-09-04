type ConfigType = {
  [chainId: number]: {
    escrow: { address: string };
  };
};

export const config: ConfigType = {
  11155111: {
    escrow: {
      address: "0x7870fFae27A76C9B7e9A8A1697B8ea9b6674E67e",
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