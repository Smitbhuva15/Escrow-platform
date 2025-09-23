import toast from "react-hot-toast";
import { HandelError } from "../HandelError";
import { loadAdmininfo } from "../LoadData";
import { VotingType } from "../types";


export const updatePlatformFee = async ({
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
    toast.loading("Preparing to Platform Fee... Please confirm in your wallet.", {
      id: "PlatformFeeTx",
    });

    const signer = await provider.getSigner();

    try {
      const transaction = await escrowContract
        .connect(signer)
        .setownerPercentage(Number(value));

      toast.loading("Platform Fee update submitted. Waiting for blockchain confirmation...", {
        id: "PlatformFeeTx",
      });

      const receipt = await transaction.wait();

      if (receipt.status !== 1) {
        toast.error("Failed to update Platform Fee. Please try again.", {
          id: "PlatformFeeTx",
        });
        setIsLoading(false);
        return;
      }

      toast.success(`PlatformFee successfully updated to ${value}%.`, {
        id: "PlatformFeeTx",
      });
    } catch (error) {
      HandelError(error, "PlatformFeeTx", "PlatformFee update transaction failed. Please try again.")
    } finally {
      await loadAdmininfo({ dispatch, escrowContract, provider });
      setIsLoading(false);
    }
  }
};

