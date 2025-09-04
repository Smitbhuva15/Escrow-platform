"use client"
import Banner from '@/components/banner/Banner';
import { RootState } from '@/store/store';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useActiveAccount } from 'thirdweb/react';
import { Coins, Activity } from 'lucide-react';
import StakeComponent from '@/components/stake/StakeComponent';
import UnstakeComponent from '@/components/stake/UnstakeComponent';
import { Toaster } from 'react-hot-toast';
import { loadstakebalance } from '@/lib/LoadData';

const Stake = () => {
  const account = useActiveAccount();
  const dispatch = useDispatch();
  

  const [isLoadingStake, setIsLoadingStake] = useState(false);
  const [isLoadingUnStake, setIsLoadingUnStake] = useState(false);

  const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
  const provider = useSelector((state: RootState) => state?.escrow?.provider);
  const personalstake = useSelector((state: RootState) => state?.escrow?.personalstake);


   const isReady = escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

   useEffect(() => {
    const fetchstakebalance = async () => {
      try {
        // setIsLoading(true); 
        if (isReady && account) {
          const address=account?.address;
          await loadstakebalance({dispatch, escrowContract, provider,address});
        }
      } catch (err) {
        console.log("Failed to load escrow:", err);
      } finally {
        // setIsLoading(false);
      }
    };
  
     fetchstakebalance();
  }, [isReady,account]);
  

  return account ? (
    <div className="max-w-3xl w-[90%] mx-auto text-white my-16">
      {/*  Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-[#1d45fe]">
        Stake Voting Power
      </h1>

      <div className="flex flex-col gap-6  mb-12">
        {/* Current Staked */}
        <div className="flex items-center gap-4 p-4 bg-[#1E1E24] rounded-xl shadow-md hover:shadow-lg transition-all">
          <Coins className="text-[#1d45fe] w-7 h-7" />
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm md:text-base">Current Staked</span>
            <span className="text-white font-semibold text-lg md:text-xl">{personalstake.toString()} ETH</span>
          </div>
        </div>

        {/* Used Stake for Voting */}
        <div className="flex items-center gap-4 p-4 bg-[#1E1E24] rounded-xl shadow-md hover:shadow-lg transition-all">
          <Activity className="text-[#1d45fe] w-7 h-7" />
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm md:text-base">Used Stake for Voting</span>
            <span className="text-white font-semibold text-lg md:text-xl">0 ETH</span>
          </div>
        </div>
      </div>



      <div className="flex flex-col gap-12">
        {/* Stake Card */}
        <StakeComponent />

        {/* Unstake Card */}
        <UnstakeComponent />

      </div>
       <Toaster
                position="bottom-right"
                reverseOrder={false}
            />
    </div >
  ) : (
    <div className="h-[90vh] flex items-center justify-center">
      <Banner
        title={'Connect Your Wallet'}
        subtitle={'Please connect your wallet to stake ETH and participate in governance.'}
      />
    </div>
  );
};

export default Stake;
