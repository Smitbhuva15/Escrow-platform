import toast from "react-hot-toast";
import { HandelError } from "../HandelError";
import { LoadEscrow } from "../LoadData";
import { markType } from "../types";

export const markdelivery = async ({
  dealId,
  dispatch,
  escrowContract,
  provider,
  setIsLoading,
}: markType) => {
  const isReady =
    escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

  setIsLoading(true);

  if (isReady) {
    toast.loading("Preparing delivery confirmation... Please confirm the transaction in your wallet.", {
      id: "escrowTx",
    });

    const signer = await provider.getSigner();

    try {
      const transaction = await escrowContract.connect(signer).markDelivered(dealId);

      toast.loading("Delivery confirmation submitted. Waiting for on-chain confirmation...", {
        id: "escrowTx",
      });

      const receipt = await transaction.wait();

      if (receipt.status !== 1) {
        toast.error("Delivery confirmation failed. Please try again.", {
          id: "escrowTx",
        });
        setIsLoading(false);
        return;
      }

      const event = receipt.events?.find((e: any) => e.event === "Delivered");

      if (event) {
        toast.success("Deliver marked successfully!", {
          id: "escrowTx",
        });
      } else {
        toast.error("Transaction confirmed but Delivered event not found.", {
          id: "escrowTx",
        });
      }
    } catch (error) {
      HandelError(error, "escrowTx", "Delivery transaction failed.")
    } finally {
      await LoadEscrow(escrowContract, provider, dispatch);
      setIsLoading(false);
    }
  }
};