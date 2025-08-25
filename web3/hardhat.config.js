require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks:{
    localhost:{},
    sepolia:{
      url:process.env.SEPOLIA_RPC_URL,
      accounts:[process.env.PRIVATE_KEY1],
      chainId: 11155111,

    }
  },
   etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY,
    },
  },
};


