import toast from "react-hot-toast";
import { HandelError } from "../HandelError";
import { loadstakebalance } from "../LoadData";
import { ethers } from "ethers";
import { unstakeType } from "../types";

export const unstakeEth = async ({
  dispatch,
  escrowContract,
  provider,
  unstake,
  setIsLoadingUnStake,
  address,
}: unstakeType) => {
  const isReady =
    escrowContract &&
    Object.keys(escrowContract).length > 0 &&
    provider &&
    Object.keys(provider).length > 0;

  setIsLoadingUnStake(true);

  if (isReady) {
    toast.loading("Preparing to unstake... Please confirm in your wallet.", {
      id: "unstakeTx",
    });

    const signer = await provider.getSigner();

    try {
      const transaction = await escrowContract.connect(signer)
        .unstake(ethers.utils.parseEther(unstake));

      toast.loading("Unstake transaction submitted. Waiting for confirmation...", {
        id: "unstakeTx",
      });

      const receipt = await transaction.wait();

      if (receipt.status !== 1) {
        toast.error("Unstaking failed. Please try again.", {
          id: "unstakeTx",
        });
        setIsLoadingUnStake(false);
        return;
      }

      const event = receipt.events?.find((e: any) => e.event === "Unstaked");

      if (event) {
        toast.success(`Successfully unstaked ${unstake} ETH! Your balance has been updated.`, {
          id: "unstakeTx",
        });
      } else {
        toast.error("Transaction confirmed, but no unstake event found. Please check your balance.", {
          id: "unstakeTx",
        });
      }
    } catch (error) {
      HandelError(error, "unstakeTx", "Unstake transaction failed. Please try again.")
    } finally {
      await loadstakebalance({ dispatch, escrowContract, provider, address });
      setIsLoadingUnStake(false);
    }
  }
};