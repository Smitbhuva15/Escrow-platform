import { RootState } from '@/store/store';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useActiveAccount } from 'thirdweb/react';
import { Toaster } from 'react-hot-toast';
import ProcessingLoader from './ProcessingLoader';
import { markdelivery } from '@/lib/hooks/markdelivery';
import { markconfirmationReceive } from '@/lib/hooks/markconfirmationReceive';
import { markOpenDispute } from '@/lib/hooks/markOpenDispute';
import { dealprops, DealType} from '@/lib/types';


const RightSection = ({ deal }:dealprops) => {
  const dispatch = useDispatch();
  const account = useActiveAccount();
  const [isLoading, setIsLoading] = useState(false)
  const [loadingConfirmation, setLoadingConfirmation] = useState(false);
  const [loadingOpenDispute, setLoadingOpenDispute] = useState(false)

  const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
  const provider = useSelector((state: RootState) => state?.escrow?.provider);


  const markdeliver = (dealId: Number) => {
    markdelivery({ dealId, dispatch, escrowContract, provider, setIsLoading })
  }

  const markconfirm = (dealId: Number) => {
    markconfirmationReceive({ dealId, dispatch, escrowContract, provider, setLoadingConfirmation })
  }

  const markOpendispute = (dealId: Number) => {
    markOpenDispute({ dealId, dispatch, escrowContract, provider, setLoadingOpenDispute })
  }

  return (
    <div className="lg:p-0 p-4 space-y-8">
      {/* Amount Section */}
      <div className="bg-gradient-to-r from-[#1E1E24] to-[#2A2A33] p-6 rounded-2xl shadow-lg border border-[#2F2F3A]">
        <h2 className="text-gray-400 font-semibold text-sm mb-1">Amount</h2>
        <p className="text-2xl font-bold text-indigo-400">
          {deal?.initialAmount ? Number(deal.initialAmount) / 1e18 : "N/A"} ETH
        </p>
      </div>

      {/* Role Validation */}
      {deal?.client != account?.address && deal?.specialist != account?.address ? (
        <div className="bg-[#1E1E24] p-8 rounded-2xl shadow-lg border border-[#2F2F3A] text-center">
          <h2 className="text-yellow-400 font-bold text-lg mb-2">
            No Actions Available
          </h2>
          <p className="text-gray-400 text-sm">
            You are not a participant in this deal. Only the client or specialist can take actions.
          </p>
        </div>
      ) : (
        <>
          {/* client Actions */}
          {deal?.client == account?.address ? (
            <div className="bg-[#1E1E24] p-8 rounded-2xl shadow-lg border border-[#2F2F3A] space-y-3">
              <h2 className="text-[#1d45fe] font-bold text-xl">
                Confirm Receipt
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Confirm delivery once you receive the product or service. This will release the funds to the specialist. Make sure everything matches your expectations before confirming. Once confirmed, the transaction is considered complete and cannot be reversed.
              </p>
              {!loadingConfirmation ? (
                deal?.status >= 4 ? (
                  <button
                    className="w-full bg-gray-500/70 text-gray-800 font-semibold py-3 rounded-xl cursor-not-allowed"
                    disabled
                  >
                    Receipt Confirmed
                  </button>
                ) : (
                  <button
                    onClick={() => markconfirm(deal?.dealId)}
                    className="w-full bg-[#1d45fe] hover:bg-[#1638d6] text-white font-semibold py-3 rounded-xl transition"
                  >
                    Confirm Receipt
                  </button>
                )
              ) : (
                <ProcessingLoader />
              )}
            </div>
          ) : (
            /* specialist Actions */
            <div className="bg-[#1E1E24] p-8 rounded-2xl shadow-lg border border-[#2F2F3A] space-y-3">
              <h2 className="text-[#1d45fe] font-bold text-xl">
                Mark as Delivered
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Mark the order as delivered once you have provided the product or service. The client will then be able to confirm and release the funds to you.
              </p>
              {!isLoading ? (
                deal?.status >= 3 ? (
                  <button
                    className="w-full bg-gray-500/70 text-gray-800 font-semibold py-3 rounded-xl cursor-not-allowed"
                    disabled
                  >
                    Marked as Delivered
                  </button>
                ) : (
                  <button
                    onClick={() => markdeliver(deal?.dealId)}
                    className="w-full bg-[#1d45fe] hover:bg-[#1638d6] text-white font-semibold py-3 rounded-xl transition"
                  >
                    Delivered
                  </button>
                )
              ) : (
                <ProcessingLoader />
              )}
            </div>
          )}

          {/* Dispute Section */}
          <div className="bg-[#1E1E24] p-8 rounded-2xl shadow-lg border border-[#2F2F3A] space-y-3">
            <h2 className="text-[#1d45fe] font-bold text-xl">
              Raise a Dispute
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              {deal.client == account?.address
                ? "If the product or service does not meet your expectations, or if there is any issue with the transaction, you can open a dispute. The platform will mediate fairly."
                : "If a client has received the product or service but fails to confirm delivery, you may open a dispute. The platform will mediate fairly."}
            </p>
            {!loadingOpenDispute ? (
              deal?.status >= 5 ? (
                <button
                  className="w-full bg-gray-500/70 text-gray-800 font-semibold py-3 rounded-xl cursor-not-allowed"
                  disabled
                >
                  Dispute Opened
                </button>
              ) : (
                <button
                  onClick={() => markOpendispute(deal?.dealId)}
                  className="w-full bg-[#1d45fe] hover:bg-[#1638d6] text-white font-semibold py-3 rounded-xl transition"
                >
                  Open Dispute
                </button>
              )
            ) : (
              <ProcessingLoader />
            )}
          </div>
        </>
      )}

      <Toaster position="bottom-right" reverseOrder={false} />
    </div>

  );
};

export default RightSection;

