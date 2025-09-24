import React from 'react'
import { Toaster } from 'react-hot-toast';
import { Button } from '../ui/button';
import Link from 'next/link';
import { disputeprops, singledisputeType } from '@/lib/types';


const DisputeCart = ({ disputes }: disputeprops) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {disputes.map((dispute: singledisputeType) => (
                <div
                    key={dispute?.dispute?.dealId.toString()}
                    className="relative bg-[#1E1E24] rounded-2xl p-6 shadow-lg border border-zinc-800 hover:border-[#1d45fe]/60 hover:shadow-[#1d45fe]/20 transition-all duration-300 flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white truncate">
                            {dispute?.dispute?.title || "Untitled Deal"}
                        </h2>
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${dispute?.dispute?.status == 5
                                    ? "bg-rose-600 text-white"
                                    : "bg-emerald-600 text-white"
                                }`}
                        >
                            {dispute?.dispute?.status == 5 ? "Disputed" : "Resolved"}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-400 mb-5 line-clamp-2">
                        {dispute?.dispute?.description || "No description provided."}
                    </p>

                    
                    <div className="space-y-4 relative border-l border-zinc-700 pl-4 mb-6">
                        <div>
                            <span className="absolute -left-2 top-1.5 w-3 h-3 bg-[#1d45fe] rounded-full"></span>
                            <p className="text-sm text-white font-medium">Client</p>
                            <p className="text-xs text-gray-400">
                                {dispute?.dispute?.client?.slice(0, 6)}...
                                {dispute?.dispute?.client?.slice(-4)}
                            </p>
                        </div>
                        <div>
                            <span className="absolute -left-2 top-14 w-3 h-3 bg-green-500 rounded-full"></span>
                            <p className="text-sm text-white font-medium">Specialist</p>
                            <p className="text-xs text-gray-400">
                                {dispute?.dispute?.specialist?.slice(0, 6)}...
                                {dispute?.dispute?.specialist?.slice(-4)}
                            </p>
                        </div>
                        <div>
                            <span className="absolute -left-2 top-28 w-3 h-3 bg-amber-500 rounded-full"></span>
                            <p className="text-sm text-white font-medium">Voting Deadline</p>
                            <p className="text-xs text-gray-400">
                                {
                                    Number(dispute?.dispute?.votingremainingDays)<=0 ?"Expired":` ${dispute?.dispute?.votingremainingDays}${" "}
                                ${Number(dispute?.dispute?.votingremainingDays) > 1 ? "days" : "day"} left`
                                }
                               
                            </p>
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-400 text-sm">Amount</span>
                        <span className="text-[#1d45fe] font-bold text-lg">
                            {(Number(dispute?.dispute?.amount) / 1e18).toFixed(3)} ETH
                        </span>
                    </div>

                    {/* Button */}
                    <Link href={`arbitration/${dispute?.dispute?.disputedId.toString()}`}>
                        <Button className="w-full bg-gradient-to-r from-[#1d45fe] to-indigo-600 hover:from-[#1638d6] hover:to-indigo-700 text-white font-semibold rounded-xl transition-all">
                            View Case
                        </Button>
                    </Link>
                </div>
            ))}
            <Toaster position="bottom-right" reverseOrder={false} />
        </div>

    )

}

export default DisputeCart