import { Button } from "@/components/ui/button";
import { handeldeposit } from "@/lib/hooks/handeldeposit";
import { CartProps, SingledealType } from "@/lib/types";
import { RootState } from "@/store/store";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import  { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";


const Cart = ({ deals }: CartProps) => {
  const [isLoading, setIsLoading] = useState(-1);
  const dispatch = useDispatch();

  const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
  const provider = useSelector((state: RootState) => state?.escrow?.provider);


  const handelDeposit = async (dealId: number, amount: number) => {
    handeldeposit({ dealId, amount, dispatch, provider, escrowContract, setIsLoading })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {deals.map((deal: SingledealType) => (
        <div
          key={deal?.deal?.dealId.toString()}
          className="relative p-6 rounded-2xl bg-gradient-to-br from-[#1E1E24] to-[#141418] shadow-md hover:shadow-[#8f614c]/40 hover:shadow-lg sm:hover:scale-[1.03] transition-all duration-300 flex flex-col justify-between"
        >
          {/* Gradient Top Border */}
          <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-[#8f614c] via-[#765140] to-[#8f614c]" />

          <Link href={`deals/${deal?.deal?.dealId.toString()}`}>
            {/* Title */}
            <h2 className="text-xl font-bold text-white mb-2 truncate">
              {deal?.deal?.title || "Untitled Deal"}
            </h2>

            {/* Description */}
            <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
              {deal?.deal?.description || "No description provided."}
            </p>

            {/* Info Section */}
            <div className="text-sm text-zinc-300 space-y-2 mb-4">
              <p>
                <span className="font-semibold text-zinc-200">Client:</span>{" "}
                {deal?.deal?.client?.slice(0, 6)}...{deal?.deal?.client?.slice(-4)}
              </p>
              <p>
                <span className="font-semibold text-zinc-200">Specialist:</span>{" "}
                {deal?.deal?.specialist?.slice(0, 6)}...{deal?.deal?.specialist?.slice(-4)}
              </p>
            </div>

            {/* Amount & Status */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold text-[#8f614c]">
                {(Number(deal?.deal?.initialAmount) / 1e18).toFixed(3)} ETH
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium bg-[#346660] text-white
                  }`}
              >
                {deal?.deal?.status == 1
                  ? "Created"
                  : deal?.deal?.status == 2
                    ? "Funded"
                    : deal?.deal?.status == 3
                      ? "Delivered"
                      : deal?.deal?.status == 4
                        ? "Confirmed"
                        : deal?.deal?.status == 5
                          ? "Disputed"
                          : "Resolved"}
              </span>
            </div>

            {/* Deadline */}
            <p className="text-xs md:text-sm text-zinc-400">
              Deposit Deadline:{" "}
              <span
                className={`font-medium px-3 py-1 rounded-full text-xs ${deal?.deal?.remainingDays <= 0
                  && "bg-[#6c2d29] text-white"}`}
              >
                {deal?.deal?.remainingDays <= 0
                  ? "Expired"
                  : `${deal?.deal?.remainingDays} ${deal?.deal?.remainingDays > 1 ? "days" : "day"} left`}
              </span>
            </p>

          </Link>

          {/* Fund Button */}
          <div className="mt-6">
            {isLoading === Number(deal?.deal?.dealId) ? (
              <Button
                className="w-full flex items-center justify-center gap-2 bg-[#8f614c] text-white rounded-xl cursor-not-allowed opacity-80"
                disabled
              >
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </Button>
            ) : deal?.deal?.status > 1 ? (
              <Button
                className="w-full bg-gray-500/60 text-gray-200 rounded-xl cursor-not-allowed opacity-70"
                disabled
              >
                Deposit Complete
              </Button>
            ) : (
              <Button
                className="w-full bg-gradient-to-r from-[#8f614c] to-[#765140] hover:from-[#6a4a3d] hover:to-[#4f3327] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all"
                onClick={() =>
                  handelDeposit(
                    Number(deal?.deal?.dealId),
                    Number(deal?.deal?.amount)
                  )
                }
              >
                Deposit Funds
              </Button>
            )}
          </div>
        </div>
      ))}
      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  )

};

export default Cart;

