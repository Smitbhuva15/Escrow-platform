import { markconfirmationReceive, markdelivery } from '@/lib/LoadData';
import { RootState } from '@/store/store';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useActiveAccount } from 'thirdweb/react';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';


const RightSection: React.FC<{ deal: any }> = ({ deal }) => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false)
    const [loadingConfirmation,setLoadingConfirmation]=useState(false);

    const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
    const provider = useSelector((state: RootState) => state?.escrow?.provider);


    const markdeliver = (dealId: Number) => {
        markdelivery({ dealId, dispatch, escrowContract, provider, setIsLoading })
    }

     const markconfirm = (dealId: Number) => {
        markconfirmationReceive({ dealId, dispatch, escrowContract, provider, setLoadingConfirmation})
    }

    const account = useActiveAccount();
    return (
        <div className="lg:p-0 p-4 space-y-6 ">

            {/* Amount Section */}
            <div className="bg-[#1E1E24] p-6 rounded-2xl flex flex-col space-y-1">
                <span className="text-gray-400 font-semibold">Amount:</span>
                <span className="text-indigo-400 font-medium break-all">
                    {deal?.amount ? deal.amount / 1e18 : "N/A"} ETH
                </span>
            </div>
            {
                deal?.buyer != account?.address && deal?.seller != account?.address ? (<div className="bg-[#1E1E24] p-7 rounded-2xl flex flex-col items-center text-center">
                    <h2 className="text-yellow-400 font-bold text-lg mb-2">No Actions Available</h2>
                    <p className="text-gray-400 text-sm">
                        You are not a participant in this deal. Only the buyer or seller can take actions.
                    </p>
                </div>) : (
                    <>
                        {
                            deal?.buyer == account?.address ? (

                                <div className="bg-[#1E1E24] p-7 rounded-2xl flex flex-col space-y-2">
                                    <h2 className="text-[#1d45fe] font-bold text-xl mb-3">Confirm Deliver</h2>
                                    <p className="text-gray-300 text-[15px]">
                                        Confirm delivery once you receive the product or service. This will release the funds to the seller.
                                        Make sure everything matches your expectations before confirming.
                                        Once confirmed, the transaction is considered complete and cannot be reversed.
                                    </p>
                                    <button className="bg-[#1d45fe] hover:bg-[#1638d6] mt-3 text-white font-semibold py-2 px-4 rounded-lg  transition"  onClick={()=>markconfirm(deal?.dealId)}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-[#1E1E24] p-7 rounded-2xl flex flex-col space-y-2">
                                    <h2 className="text-[#1d45fe] font-bold text-xl mb-3">Mark as Delivered</h2>
                                    <p className="text-gray-300 text-[15px]">
                                        Mark the order as delivered once you have successfully provided the product
                                        or service. This lets the buyer know that the delivery is complete. The buyer
                                        will then be able to confirm and release the funds to you.
                                    </p>
                                    {
                                        !isLoading ? (

                                            deal?.status >= 3 ? (
                                                <Button
                                                    className="w-full bg-gray-400 text-gray-800 cursor-not-allowed opacity-70  mt-3  font-semibold py-5 px-4 rounded-lg  transition"
                                                    disabled
                                                >
                                                    Delivery Complete
                                                </Button>
                                            ) : (
                                                <button className="bg-[#1d45fe] hover:bg-[#1638d6] mt-3 text-white font-semibold py-2 px-4 rounded-lg  transition"
                                                    onClick={() => markdeliver(deal?.dealId)}
                                                >
                                                    Delivered
                                                </button>
                                            )
                                        ) : (
                                            <Button
                                                className=" bg-[#1d45fe] hover:bg-[#1638d6] mt-3 py-5 px-4 rounded-lg  transition text-white cursor-not-allowed opacity-80 "
                                                disabled
                                            >
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Processing...
                                            </Button>
                                        )
                                    }
                                </div>
                            )}


                        {/* Open Dispute Section */}
                        <div className="bg-[#1E1E24] p-7 rounded-2xl flex flex-col space-y-2">
                            <h2 className="text-[#1d45fe] font-bold text-xl mb-3">Raise Dispute</h2>
                            {
                                deal.buyer == account?.address ? (
                                    <p className="text-gray-300 text-[15px]">
                                        If the product or service does not meet your expectations, or if there is any issue with the transaction, you can open a dispute. The platform will mediate fairly, ensuring your payment remains secure until the issue is resolved.
                                    </p>
                                ) : (
                                    <p className="text-gray-300 text-[15px]">
                                        If a buyer has received the product or service but fails to confirm delivery, you may open a dispute. The platform will mediate fairly, ensuring your payment remains secure until the issue is resolved.
                                    </p>
                                )
                            }
                            <button className="bg-[#1d45fe] hover:bg-[#1638d6] mt-3 text-white  font-semibold py-2 px-4 rounded-lg transition">
                                Open Dispute
                            </button>
                        </div>
                    </>
                )
            }

            <Toaster
                position="bottom-right"
                reverseOrder={false}
            />

        </div>
    );
};

export default RightSection;

