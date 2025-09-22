import toast from "react-hot-toast";
import { HandelError } from "../HandelError";
import { loadAdmininfo } from "../LoadData";
import { VotingType } from "../types";

export const updateVotingDays = async ({
  dispatch,
  escrowContract,
  provider,
  value,
  setIsLoading,
}: VotingType) => {
  const isReady =
    escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

  setIsLoading(true);

  if (isReady) {
    toast.loading("Preparing to update voting period... Please confirm in your wallet.", {
      id: "votingDaysTx",
    });

    const signer = await provider.getSigner();

    try {
      const transaction = await escrowContract.connect(signer).setvotingDay(Number(value));

      toast.loading("Transaction submitted. Waiting for blockchain confirmation...", {
        id: "votingDaysTx",
      });

      const receipt = await transaction.wait();

      if (receipt.status !== 1) {
        toast.error("Failed to update voting period. Please try again.", {
          id: "votingDaysTx",
        });
        setIsLoading(false);
        return;
      }

      toast.success(`Voting period successfully updated to ${value} days.`, {
        id: "votingDaysTx",
      });
    } catch (error) {
      HandelError(error, "votingDaysTx", "Transaction failed. Please try again.")
    } finally {
      await loadAdmininfo({ dispatch, escrowContract, provider });
      setIsLoading(false);
    }
  }
};
