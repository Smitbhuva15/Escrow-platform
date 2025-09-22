import toast from "react-hot-toast";
import { HandelError } from "../HandelError";
import { loadstakebalance } from "../LoadData";
import { stakeType } from "../types";
import { ethers } from "ethers";

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
      HandelError(error, "stakeTx", "Stake transaction failed. Please try again")
    } finally {
      await loadstakebalance({ dispatch, escrowContract, provider, address });
      setIsLoadingStake(false);
    }
  }
};