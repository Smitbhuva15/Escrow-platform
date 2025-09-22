import toast from "react-hot-toast";
import { HandelError } from "../HandelError";
import { LoadEscrow } from "../LoadData";
import { openDisputeType } from "../types";

export const markOpenDispute = async ({
  dealId,
  dispatch,
  escrowContract,
  provider,
  setLoadingOpenDispute,
}: openDisputeType) => {
  const isReady =
    escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

  setLoadingOpenDispute(true);

  if (isReady) {
    toast.loading("Preparing dispute... Please confirm in your wallet.", {
      id: "escrowTx",
    });

    const signer = await provider.getSigner();

    try {
      const transaction = await escrowContract.connect(signer).openDispute(dealId);

      toast.loading("Dispute submitted. Waiting for blockchain confirmation...", {
        id: "escrowTx",
      });

      const receipt = await transaction.wait();

      if (receipt.status !== 1) {
        toast.error("Opening dispute failed. Please try again.", {
          id: "escrowTx",
        });
        setLoadingOpenDispute(false);
        return;
      }

      const event = receipt.events?.find((e: any) => e.event === "Dispute");

      if (event) {
        toast.success("Dispute opened successfully! The issue is now under review.", {
          id: "escrowTx",
        });
      } else {
        toast.error("Transaction confirmed, but no dispute event found. Please check the deal status.", {
          id: "escrowTx",
        });
      }
    } catch (error) {
      HandelError(error, "escrowTx", "Dispute transaction failed. Please try again.")
    } finally {
      await LoadEscrow(escrowContract, provider, dispatch);
      setLoadingOpenDispute(false);
    }
  }
};
