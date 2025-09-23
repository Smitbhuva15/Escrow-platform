import toast from "react-hot-toast";
import { HandelError } from "../HandelError";
import { LoadEscrow } from "../LoadData";
import { depositType } from "../types";
import { ethers } from "ethers";

export const handeldeposit = async ({
  dealId, amount, dispatch, provider, escrowContract, setIsLoading
}: depositType) => {

const newvalue = ethers.BigNumber.from(amount.toString());
  if (!escrowContract || !provider) {
    toast.error("Escrow contract or provider not available.");
    return;
  }
  setIsLoading(dealId);

  toast.loading("Preparing deposit... Please confirm the transaction in your wallet.", { id: "escrowTx" });

  try {
    const signer = provider.getSigner();
    const tx = await escrowContract.connect(signer).deposit(dealId, { value: newvalue});

    toast.loading("Transaction submitted. Waiting for confirmation on-chain...", { id: "escrowTx" });

    const receipt = await tx.wait();

    if (receipt.status !== 1) {
      toast.error("Deposit failed. Please try again.", { id: "escrowTx" });
      return;
    }

    const event = receipt.events?.find((e: any) => e.event === "Deposit");
    if (event) {
      toast.success("Funds deposited successfully!", { id: "escrowTx" });
    } else {
      toast.error("Transaction confirmed, but no Deposit event found.", { id: "escrowTx" });
    }

  } catch (error) {
    console.log(error)
    HandelError(error , "escrowTx", "Deposit transaction failed.");
  } finally {
    await LoadEscrow(escrowContract, provider, dispatch);
    setIsLoading(-1);
  }
};
