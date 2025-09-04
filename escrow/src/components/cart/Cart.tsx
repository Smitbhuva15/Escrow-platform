import { Button } from "@/components/ui/button";
import { LoadEscrow } from "@/lib/LoadData";
import { RootState } from "@/store/store";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const Cart = ({ deals }: any) => {

  const [isLoading, setIsLoading] = useState(-1);
  const dispatch = useDispatch();


  const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
  const provider = useSelector((state: RootState) => state?.escrow?.provider);


  const handelDeposite = async (dealId: number, amount: number) => {

    setIsLoading(dealId)
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
      LoadEscrow(escrowContract, provider, dispatch);

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
      toast.error("Deposit transaction failed.", {
        id: "escrowTx",
      });


    } finally {
      setIsLoading(-1);
    }


  }

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {deals.map((deal: any, index: number) => (

        <div
          key={index}
          className="p-6 bg-[#1E1E24] rounded-2xl shadow-md hover:shadow-lg transition flex flex-col justify-between"
        >
          <Link href={`escrows/${deal?.deal?.dealId.toString()}`}>

            {/* Title */}
            <h2 className="text-xl font-bold text-white mb-2 truncate">
              {deal?.deal?.title || "Untitled Deal"}
            </h2>

            {/*  description */}
            <p className="text-sm text-zinc-400 mb-4 line-clamp-3">
              {deal?.deal?.description || "No deconsscription provided."}
            </p>

            {/* Info section */}
            <div className="text-sm text-zinc-300 space-y-1 mb-4">
              <p>
                <span className="font-semibold text-zinc-200">Buyer:</span>{" "}
                {deal?.deal?.buyer?.slice(0, 6)}...{deal?.deal?.buyer?.slice(-4)}
              </p>
              <p>
                <span className="font-semibold text-zinc-200">Seller:</span>{" "}
                {deal?.deal?.seller?.slice(0, 6)}...{deal?.deal?.seller?.slice(-4)}
              </p>
              <p>
                <span className="font-semibold text-zinc-200">Amount:</span>{" "}
                {(deal?.deal?.amount) / 1e18} ETH
              </p>
              <p>
                <span className="font-semibold text-zinc-200">Status:</span>{" "}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs  text-white font-medium ${deal?.deal?.status == 1 ? "bg-gray-600" : deal?.deal?.status == 2 ? "bg-indigo-500" : deal?.deal?.status == 3 ? "bg-slate-400" : deal?.deal?.status == 4 ? "bg-emerald-500" : deal?.deal?.status == 5 ? "bg-rose-500" : "bg-purple-800"
                    }`}
                >
                  {deal?.deal?.status == 1 ? "Created" : deal?.deal?.status == 2 ? "Funded" : deal?.deal?.status == 3 ? "Delivered" : deal?.deal?.status == 4 ? "confirmed" : deal?.deal?.status == 5 ? "Disputed" : "Resolved"}
                </span>
              </p>
              <p><span className="font-semibold text-zinc-200">Deposit deadline:</span>{" "}
                {deal?.deal?.remainingDays} {deal?.deal?.remainingDays > 1 ? "days " : "day "}left</p>
            </div>
          </Link>
          {/* Fund Button */}
          {
            isLoading === Number(deal?.deal?.dealId) ? (
              <Button
                className="w-full  flex items-center justify-center gap-2 bg-[#1d45fe] hover:bg-[#1638d6] text-white rounded-xl cursor-not-allowed opacity-80"
                disabled
              >
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </Button>
            ) : (

              deal?.deal?.status > 1 ? (
                <Button
                  className="w-full bg-gray-400 text-gray-800 rounded-xl cursor-not-allowed opacity-70"
                  disabled
                >
                  Deposit Complete
                </Button>
              ) : (
                <Button
                  className="w-full bg-[#1d45fe] hover:bg-[#1638d6] text-white rounded-xl"
                  onClick={() =>
                    handelDeposite(Number(deal?.deal?.dealId), Number(deal?.deal?.amount))
                  }
                >
                  Deposit Funds
                </Button>
              )


            )
          }

        </div>

      ))}
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
    </div>
  )

};

export default Cart;

