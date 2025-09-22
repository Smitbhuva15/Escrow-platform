import toast from "react-hot-toast";
import { HandelError } from "../HandelError";
import { loadAdmininfo } from "../LoadData";
import { VotingType } from "../types";


export const updateQuorum = async ({
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
    toast.loading("Preparing to update quorum... Please confirm in your wallet.", {
      id: "quorumTx",
    });

    const signer = await provider.getSigner();

    try {
      const transaction = await escrowContract
        .connect(signer)
        .setminmumvotedweightPercentage(Number(value));

      toast.loading("Quorum update submitted. Waiting for blockchain confirmation...", {
        id: "quorumTx",
      });

      const receipt = await transaction.wait();

      if (receipt.status !== 1) {
        toast.error("Failed to update quorum. Please try again.", {
          id: "quorumTx",
        });
        setIsLoading(false);
        return;
      }

      toast.success(`Quorum successfully updated to ${value}%.`, {
        id: "quorumTx",
      });
    } catch (error) {
      HandelError(error, "quorumTx", "Quorum update transaction failed. Please try again.")
    } finally {
      await loadAdmininfo({ dispatch, escrowContract, provider });
      setIsLoading(false);
    }
  }
};

