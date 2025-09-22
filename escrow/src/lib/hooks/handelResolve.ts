import toast from "react-hot-toast";
import { HandelError } from "../HandelError";
import { loadDispute } from "../LoadData";
import { resolveType } from "../types";

export const handelResolve = async ({
  dispatch,
  escrowContract,
  provider,
  disputeId,
  setIsCloseLoading
}: resolveType) => {
  const isReady =
    escrowContract &&
    Object.keys(escrowContract).length > 0 &&
    provider &&
    Object.keys(provider).length > 0;

  setIsCloseLoading(true);

  if (isReady) {
    toast.loading("Preparing to resolve dispute... Please confirm in your wallet.", {
      id: "resolveTx",
    });

    const signer = await provider.getSigner();

    try {
      const transaction = await escrowContract.connect(signer).closeDispute(Number(disputeId));

      toast.loading("Resolution submitted. Waiting for on-chain confirmation...", {
        id: "resolveTx",
      });

      const receipt = await transaction.wait();

      if (receipt.status !== 1) {
        toast.error("Dispute resolution failed. Please try again.", {
          id: "resolveTx",
        });
        setIsCloseLoading(false);
        return;
      }

      const event = receipt.events?.find((e: any) => e.event === "DisputeClosed");

      if (event) {
        toast.success("Dispute successfully resolved! Funds will be distributed accordingly.", {
          id: "resolveTx",
        });
      } else {
        toast.error("Transaction confirmed, but no dispute resolution event found.", {
          id: "resolveTx",
        });
      }
    } catch (error) {
      HandelError(error, "resolveTx", "Dispute resolution failed. Please try again.")
    } finally {
      await loadDispute({ dispatch, escrowContract, provider });
      setIsCloseLoading(false);
    }
  }
};