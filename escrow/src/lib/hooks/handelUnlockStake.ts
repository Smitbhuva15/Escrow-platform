import toast from "react-hot-toast";
import { HandelError } from "../HandelError";
import { unlockstakeType } from "../types";

export const handelUnlockStake = async ({
  dispatch,
  escrowContract,
  provider,
  disputeId,
  setIsLoading,
  index
}: unlockstakeType) => {
  const isReady =
    escrowContract &&
    Object.keys(escrowContract).length > 0 &&
    provider &&
    Object.keys(provider).length > 0;

  setIsLoading(Number(index));

  if (isReady) {
    // Preparing toast
    toast.loading("Preparing to unlock your stake… Please confirm the transaction in your wallet.", {
      id: "unlockStakeTx",
    });

    const signer = await provider.getSigner();

    try {
      const transaction = await escrowContract.connect(signer).unlockstakefromdispute(Number(disputeId));

      toast.loading("Unlock transaction submitted. Waiting for on-chain confirmation…", {
        id: "unlockStakeTx",
      });

      const receipt = await transaction.wait();

      if (receipt.status !== 1) {
        toast.error("Stake unlock failed. Please try again or check the transaction details.", {
          id: "unlockStakeTx",
        });
        setIsLoading(Number(index));
        return;
      }

      toast.success("Stake successfully unlocked! Your funds are now available in your wallet.", {
        id: "unlockStakeTx",
      });
    } catch (error) {
      HandelError(error, "unlockStakeTx", "Transaction unsuccessful. Your stake remains locked-please retry.")
    } finally {

      setIsLoading(-1);
    }
  }
};

