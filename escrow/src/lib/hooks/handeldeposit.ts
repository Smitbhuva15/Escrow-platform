import toast from "react-hot-toast";
import { HandelError } from "../HandelError";
import { LoadEscrow } from "../LoadData";
import { depositType } from "../types";

export const handeldeposit = async ({
  dealId, amount, dispatch, provider, escrowContract, setIsLoading
}: depositType) => {

  const isReady =
    escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

  setIsLoading(dealId)
  if (isReady) {
    toast.loading("Preparing deposit... Please confirm the transaction in your wallet.", {
      id: "escrowTx",
    });

    try {
      const signer = await provider.getSigner();
      const transaction = await escrowContract.connect(signer).deposit(dealId, { value: amount });

      toast.loading("Transaction submitted. Waiting for confirmation on-chain...", {
        id: "escrowTx",
      });

      const receipt = await transaction.wait();

      if (receipt.status !== 1) {
        toast.error("Deposit failed. Please try again.", {
          id: "escrowTx",
        });
        setIsLoading(-1);
        return;
      }

      const event = receipt.events?.find((e: any) => e.event === "Deposit");


      if (event) {
        toast.success("Funds deposited successfully!!", {
          id: "escrowTx",
        });
      } else {
        toast.error("Transaction confirmed, but no Deposit event found.", {
          id: "escrowTx",
        });
      }
    } catch (error) {
      HandelError(error, "escrowTx", "Deposit transaction failed.")
    } finally {
      await LoadEscrow(escrowContract, provider, dispatch);
      setIsLoading(-1);
    }

  }
}
