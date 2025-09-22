import { Button } from "@/components/ui/button";
import { handeldeposite, LoadEscrow } from "@/lib/LoadData";
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
    handeldeposite({ dealId, amount, dispatch, provider, escrowContract, setIsLoading })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {deals.map((deal: any) => (
        <div
          key={deal?.deal?.dealId.toString()}
          className="relative p-6 rounded-2xl bg-gradient-to-br from-[#1E1E24] to-[#141418] shadow-md hover:shadow-[#1d45fe]/40 hover:shadow-lg sm:hover:scale-[1.03] transition-all duration-300 flex flex-col justify-between"
        >
          {/* Gradient Top Border */}
          <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-[#1d45fe] via-indigo-500 to-[#1d45fe]" />

          <Link href={`escrows/${deal?.deal?.dealId.toString()}`}>
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
              <div className="text-lg font-semibold text-[#1d45fe]">
                {(deal?.deal?.amount / 1e18).toFixed(3)} ETH
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${deal?.deal?.status == 1
                  ? "bg-gray-600 text-white"
                  : deal?.deal?.status == 2
                    ? "bg-indigo-500 text-white"
                    : deal?.deal?.status == 3
                      ? "bg-slate-400 text-black"
                      : deal?.deal?.status == 4
                        ? "bg-emerald-500 text-white"
                        : deal?.deal?.status == 5
                          ? "bg-rose-500 text-white"
                          : "bg-purple-800 text-white"
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
                  && "bg-rose-700 text-white"  }`}
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
                className="w-full flex items-center justify-center gap-2 bg-[#1d45fe] text-white rounded-xl cursor-not-allowed opacity-80"
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
                className="w-full bg-gradient-to-r from-[#1d45fe] to-indigo-600 hover:from-[#1638d6] hover:to-indigo-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all"
                onClick={() =>
                  handelDeposite(
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

