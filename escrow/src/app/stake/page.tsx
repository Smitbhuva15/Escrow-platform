"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useActiveAccount } from "thirdweb/react";
import { Coins, BarChart3, Vote } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Banner from "@/components/banner/Banner";
import StakeComponent from "@/components/stake/StakeComponent";
import UnstakeComponent from "@/components/stake/UnstakeComponent";
import { RootState } from "@/store/store";
import { loadstakebalance } from "@/lib/LoadData";
import { Loader } from "@/components/ui/Loader";

const Stake = () => {
  const account = useActiveAccount();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
  const provider = useSelector((state: RootState) => state?.escrow?.provider);
  const personalstake = useSelector((state: RootState) => state?.escrow?.personalstake);
  const lockstake = useSelector((state: RootState) => state?.escrow?.Lockstake);
  const Totalstake = useSelector((state: RootState) => state?.escrow?.totalstake);

  const isReady =
    escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

  useEffect(() => {
    const fetchStakeBalance = async () => {
      try {
        setIsLoading(true);
        if (isReady && account?.address) {
          await loadstakebalance({
            dispatch,
            escrowContract,
            provider,
            address: account.address,
          });
        }
      } catch (err) {
        console.error("Failed to load stake balance:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStakeBalance();
  }, [isReady, account]);

  return account ? (
    isLoading ? (
      <div className=' flex justify-center md:h-[85vh] h-[82vh] items-center'>
       <Loader />
      </div>
    ) : (
      <div className="max-w-3xl w-[90%] mx-auto text-white my-16">
        {/* Title */}
        <h1 className="sm:text-4xl text-3xl md:text-5xl font-bold mb-8 text-center ">
          Governance Dashboard
        </h1>

        {/* Stake Info */}
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-6 mb-12">
          {/* Current Staked */}
          <div className="flex items-center gap-4 p-4 bg-[#1E1E24] rounded-xl shadow-md hover:shadow-lg transition-all">
            <Coins className="text-[#d99e82] w-7 h-7" />
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm md:text-base">
                My Active Stake
              </span>
              <span className="text-white font-semibold text-lg md:text-xl">
                {personalstake ? personalstake.toString() : "0"} ETH
              </span>
            </div>
          </div>

          {/* Used Stake for Voting */}
          <div className="flex items-center gap-4 p-4 bg-[#1E1E24] rounded-xl shadow-md hover:shadow-lg transition-all">
            <Vote className="text-[#d99e82] w-7 h-7" />
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm md:text-base">
                Voting Locked Stake
              </span>
              <span className="text-white font-semibold text-lg md:text-xl">
                {lockstake ? lockstake.toString() : "0"} ETH
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-[#1E1E24] rounded-xl shadow-md hover:shadow-lg transition-all">
            <BarChart3 className="text-[#d99e82] w-7 h-7" />
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm md:text-base">
                Total Platform Stake
              </span>
              <span className="text-white font-semibold text-lg md:text-xl">
                {Totalstake ? Number(Totalstake)+724 : "0"} ETH
              </span>
            </div>
          </div>


        </div>

        {/* Stake & Unstake Cards */}
        <div className="flex flex-col gap-12">
          <StakeComponent />
          <UnstakeComponent />
        </div>

        {/* Toast Notifications */}
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
    )
  ) : (
    <div className="md:h-[90vh] h-[83vh]  flex items-center justify-center">
      <Banner
        title="Connect Your Wallet"
        subtitle="Please connect your wallet to stake ETH and participate in governance."
      />
    </div>
  );
};

export default Stake;
