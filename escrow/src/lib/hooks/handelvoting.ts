import toast from "react-hot-toast";
import { HandelError } from "../HandelError";
import { loadDispute, loadTotalVotings } from "../LoadData";
import { ethers } from "ethers";
import { votingType } from "../types";

export const handelvoting = async ({
  disputedId,
  supportYes,
  weight,
  dispatch,
  escrowContract,
  provider,
  setIsLoading,
}: votingType) => {

  const isReady =
    escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;
  if (supportYes == true) {
    setIsLoading("specialist");
  }
  else {
    setIsLoading("client")
  }

  if (isReady) {
    toast.loading("Preparing vote... Please confirm the transaction in your wallet.", {
      id: "escrowTx",
    });

    const signer = await provider.getSigner();

    try {
      const transaction = await escrowContract.connect(signer)
        .vote(
          disputedId,
          supportYes,
          ethers.utils.parseEther(weight.toString())
        );

      toast.loading("Vote submitted. Waiting for on-chain confirmation...", {
        id: "escrowTx",
      });

      const receipt = await transaction.wait();

      if (receipt.status !== 1) {
        toast.error("Voting failed. Please try again.", {
          id: "escrowTx",
        });
        setIsLoading("");
        return;
      }

      const event = receipt.events?.find((e: any) => e.event === "Voted");

      if (event) {
        toast.success(
          supportYes
            ? "Your vote has been cast in favor of the Specialist!"
            : "Your vote has been cast in favor of the Client!",
          { id: "escrowTx" }
        );
      } else {
        toast.error("Transaction confirmed, but no vote event found. Please check the deal status.", {
          id: "escrowTx",
        });
      }
    } catch (error) {
      HandelError(error, "escrowTx", "Voting transaction failed.")
      console.log(error)
    } finally {
      await loadTotalVotings({ dispatch, escrowContract, provider })
      await loadDispute({ dispatch, escrowContract, provider });
      setIsLoading("");
    }
  }
};
