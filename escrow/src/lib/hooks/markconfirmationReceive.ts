import toast from "react-hot-toast";
import { HandelError } from "../HandelError";
import { LoadEscrow } from "../LoadData";
import { markConfirmType } from "../types";

export const markconfirmationReceive = async ({
  dealId,
  dispatch,
  escrowContract,
  provider,
  setLoadingConfirmation,
}: markConfirmType) => {
  const isReady =
    escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

  setLoadingConfirmation(true);

  if (isReady) {
    toast.loading("Preparing receipt confirmation... Please confirm in your wallet.", {
      id: "escrowTx",
    });

    const signer = await provider.getSigner();

    try {
      const transaction = await escrowContract.connect(signer).confirmReceived(dealId);

      toast.loading("Receipt confirmation submitted. Waiting for blockchain confirmation...", {
        id: "escrowTx",
      });

      const receipt = await transaction.wait();

      if (receipt.status !== 1) {
        toast.error("Receipt confirmation failed. Please try again.", {
          id: "escrowTx",
        });
        setLoadingConfirmation(false);
        return;
      }

      const event = receipt.events?.find((e: any) => e.event === "Confirmation");

      if (event) {
        toast.success("Receipt confirmed successfully! Funds have been released to the specialist.", {
          id: "escrowTx",
        });
      } else {
        toast.error("Transaction confirmed, but no Confirmation event found. Please check the deal status.", {
          id: "escrowTx",
        });
      }
    } catch (error) {
      HandelError(error, "escrowTx", "Receipt confirmation transaction failed.")
    } finally {
      await LoadEscrow(escrowContract, provider, dispatch);
      setLoadingConfirmation(false);
    }
  }
};