import { RootState } from '@/store/store';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useActiveAccount } from 'thirdweb/react';

const RightSectionArbitration: React.FC<{ dispute: any }> = ({ dispute }) => {

    const dispatch = useDispatch();
    const account = useActiveAccount();

    const [isLoading, setIsLoading] = useState(false)
    const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
    const provider = useSelector((state: RootState) => state?.escrow?.provider);

    

    return (

        <div className="lg:p-0 p-4 space-y-8">

            {/* Total Votes Card */}
            <div className="bg-gradient-to-r from-[#1E1E24] to-[#2A2A33] p-6 rounded-2xl shadow-xl border border-[#2F2F3A]  transition-all duration-300">
                <h2 className="text-gray-400 font-semibold text-sm mb-1 uppercase tracking-wide">Total Votes</h2>
                <p className="text-3xl font-extrabold text-indigo-500">{0}</p>
            </div>

            {/* voting deadline */}
            <div className="bg-gradient-to-r from-[#1E1E24] to-[#2A2A33] p-6 rounded-2xl shadow-xl border border-[#2F2F3A]  transition-all duration-300">
                <h2 className="text-gray-400 font-semibold text-sm mb-1 uppercase tracking-wide">Voting Deadline</h2>
                <p className="text-3xl font-extrabold text-[#1d45fe]"> {
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
                     <div className="bg-gradient-to-br from-[#1E1E24] to-[#141418] p-8 rounded-2xl shadow-2xl border border-[#2F2F3A] space-y-6  transition-all duration-300">

                        {/* Title & Description */}
                        <h2 className="text-[#1d45fe] font-bold text-2xl md:text-3xl drop-shadow-md">
                            Cast Your Vote
                        </h2>
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                            Help determine the rightful winner of this dispute. Your vote contributes to the final outcome.
                        </p>

                        {/* Buyer Progress */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-gray-400 text-sm font-medium">Buyer Votes</span>
                                <span className="text-white text-sm font-semibold">{`buyerVotePercent`}%</span>
                            </div>
                            <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
                                <div
                                    className="h-2.5 bg-indigo-500 rounded-full transition-all duration-700"
                                // style={{ width: `${buyerVotePercent}%` }}
                                />
                            </div>
                        </div>

                        {/* Seller Progress */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-gray-400 text-sm font-medium">Seller Votes</span>
                                <span className="text-white text-sm font-semibold">{`sellerVotePercent`}%</span>
                            </div>
                            <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
                                <div
                                    className="h-2.5 bg-emerald-500 rounded-full transition-all duration-700"
                                    style={{ width: `60%` }}
                                />
                            </div>
                        </div>

                        {/* Voting Buttons */}
                        <div className="flex gap-4 mt-6">
                            <button

                                className="w-1/2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all transform "
                            >
                                Vote Buyer
                            </button>
                            <button

                                className="w-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all transform "
                            >
                                Vote Seller
                            </button>
                        </div>

                        {/* Optional Info / Tooltip */}
                        <p className="text-gray-400 text-xs italic mt-2">
                            Votes are anonymous and counted automatically. Voting ends when the deadline is reached.
                        </p>

                    </div>
                )}

        </div>

    )
}

export default RightSectionArbitration