import { handelvoting } from '@/lib/LoadData';
import { Inputs, VoteInputs } from '@/lib/types';
import { RootState } from '@/store/store';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useActiveAccount } from 'thirdweb/react';

const RightSectionArbitration: React.FC<{ dispute: any }> = ({ dispute }) => {

    const dispatch = useDispatch();
    const account = useActiveAccount();

    const [isLoading, setIsLoading] = useState("")
    const [totalVotes, setTotalVotes] = useState<any>();
      const [buyerVotePercent, setBuyerVotePercent] = useState(0);
    const [sellerVotePercent, setSellerVotePercent] = useState(0);

    const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
    const provider = useSelector((state: RootState) => state?.escrow?.provider);
    const votes = useSelector((state: RootState) => state?.escrow?.votes);

    useEffect(() => {
        setBuyerVotePercent(((dispute?.dispute?.Novoting) / (dispute?.dispute?.Yesvoting + dispute?.dispute?.Novoting)) * 100);
        setSellerVotePercent(((dispute?.dispute?.Yesvoting) / (dispute?.dispute?.Yesvoting + dispute?.dispute?.Novoting)) * 100);
    }, [dispute])

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<VoteInputs>()

    const onSubmit = async (data: VoteInputs, role: "buyer" | "seller") => {


        await handelvoting({
            disputedId: dispute?.dispute?.disputedId,
            supportYes: role == "seller" ? true : false,
            weight: Number(data?.weight),
            dispatch,
            escrowContract,
            provider,
            setIsLoading,
        });


        reset();
    };

    useEffect(() => {
        if (votes && votes.length > 0) {
            const filtervotes = votes.filter((vote: any) => vote?.disputedId == dispute?.dispute?.disputedId)
            setTotalVotes(filtervotes);
        }
    }, [votes])


    return (

        <div className="lg:p-0 p-4 space-y-8">

            {/* Total Votes Card */}
            <div className="bg-gradient-to-r from-[#1E1E24] to-[#2A2A33] p-6 rounded-2xl shadow-xl border border-[#2F2F3A]  transition-all duration-300">
                <h2 className="text-gray-400 font-semibold text-sm mb-1 uppercase tracking-wide">Total Votes</h2>
                <p className="text-3xl font-extrabold text-indigo-500">{totalVotes?.length ? totalVotes?.length : 0}</p>
            </div>

            {/* voting deadline */}
            <div className="bg-gradient-to-r from-[#1E1E24] to-[#2A2A33] p-6 rounded-2xl shadow-xl border border-[#2F2F3A]  transition-all duration-300">
                <h2 className="text-gray-400 font-semibold text-sm mb-1 uppercase tracking-wide">Voting Deadline</h2>
                <p className="text-3xl font-extrabold text-[#1d45fe]/70"> {
                    dispute?.dispute?.votingremainingDays == 0
                        ? "Expired"
                        : ` ${dispute?.dispute?.votingremainingDays}${" "}
                                ${dispute?.dispute?.votingremainingDays > 1 ? "days" : "day"} left`
                }</p>
            </div>

            {/* Voting Section */}
            {
                dispute?.dispute?.buyer === account?.address || dispute?.dispute?.seller === account?.address ? (
                    <div className="bg-[#1E1E24] p-8 rounded-2xl shadow-lg border border-[#2F2F3A] text-center">
                        <h2 className="text-yellow-400 font-bold text-lg mb-2">
                            No Actions Available
                        </h2>
                        <p className="text-gray-400 text-sm">
                            You are a participant in this deal, voting is restricted.
                        </p>
                    </div>

                ) : (
                    <div className=" p-8 bg-[#1E1E24] rounded-2xl shadow-lg border border-[#2F2F3A] space-y-8">

                        {/* Title & Description */}
                        <div>
                            <h2 className="text-[#1d45fe] font-extrabold text-2xl md:text-3xl">
                                Vote on Dispute
                            </h2>
                            <p className="text-gray-400 text-sm md:text-base mt-2">
                                Assign ETH weight to support Buyer or Seller. Your vote determines the outcome.
                            </p>
                        </div>

                        {/* Buyer Progress */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400 text-sm font-medium">Buyer</span>
                                <span className="text-gray-200 text-sm font-semibold">{buyerVotePercent?buyerVotePercent.toFixed(3):0}%</span>
                            </div>
                            <div className="relative w-full h-[6px] bg-[#1E1F25] rounded-full overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-[6px] rounded-full bg-[#1d45fe]/70 transition-all duration-700"
                                    style={{ width: `${buyerVotePercent}%` }}
                                />

                                <div
                                    className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow-md"
                                    style={{ left: `${buyerVotePercent}%` }}
                                />
                            </div>
                        </div>

                        {/* Seller Progress */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400 text-sm font-medium">Seller</span>
                                <span className="text-gray-200 text-sm font-semibold">{sellerVotePercent?sellerVotePercent.toFixed(3) : 0}%</span>
                            </div>
                            <div className="relative w-full h-[6px] bg-[#1E1F25] rounded-full overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-[6px] rounded-full bg-emerald-500/70 transition-all duration-700"
                                    style={{ width: `${sellerVotePercent}%` }}
                                />

                                <div
                                    className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow-md"
                                    style={{ left: `${sellerVotePercent}%` }}
                                />
                            </div>
                        </div>

                        {/* Weight Input */}
                        <form className="space-y-6 " >
                            <div className="space-y-2">
                                <label className="text-gray-300 text-sm mb-2! font-medium">Voting Weight (ETH)</label>
                                <input
                                    type="number"
                                    step={0.0001}
                                    placeholder="Enter ETH weight..."
                                    {...register("weight", {
                                        required: "ETH Amount is required",
                                        min: { value: 0.0001, message: "Minimum ETH weight is 0.0001 ETH" },
                                    })}
                                    className="w-full px-4 py-3 rounded-xl mt-2 bg-[#1E1F25] border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1d45fe] focus:border-[#1d45fe] transition-all   appearance-none 
                                [&::-webkit-outer-spin-button]:appearance-none 
                                [&::-webkit-inner-spin-button]:appearance-none 
                                [&::-moz-appearance]:textfield"
                                />
                                {errors.weight && (
                                    <p className="text-red-500 text-sm mt-2">{errors.weight.message}</p>
                                )}
                            </div>

                            {/* Voting Buttons */}
                            <div className="flex gap-4">
                                {isLoading == "buyer"
                                    ? (
                                        <button className="w-1/2 bg-[#1d45fe] hover:bg-[#1638d6] text-white font-semibold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-not-allowed opacity-80"

                                        >
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Processing...
                                        </button>
                                    ) : (
                                        <button className="w-1/2 bg-[#1d45fe] hover:bg-[#1638d6] text-white font-semibold py-3 rounded-xl shadow-md transition-all"
                                            onClick={handleSubmit((data) => onSubmit(data, "buyer"))}
                                        >
                                            Vote Buyer
                                        </button>
                                    )
                                }

                                {isLoading == "seller"
                                    ? (
                                        <button className="w-1/2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-not-allowed opacity-80"

                                        >
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Processing...
                                        </button>
                                    ) : (
                                        <button className="w-1/2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl shadow-md transition-all"
                                            onClick={handleSubmit((data) => onSubmit(data, "seller"))}
                                        >
                                            Vote Seller
                                        </button>
                                    )

                                }
                            </div>
                        </form>

                        {/* Info */}
                        <p className="text-gray-500 text-xs italic text-center">
                            Votes are anonymous and weighted by ETH. Results finalize once the deadline ends.
                        </p>
                    </div>

                )}
            <Toaster
                position="bottom-right"
                reverseOrder={false}
            />
        </div>

    )
}

export default RightSectionArbitration