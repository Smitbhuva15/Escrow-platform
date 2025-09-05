"use client"
import Banner from '@/components/banner/Banner';
import React, { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useActiveAccount } from 'thirdweb/react';
import { Clock, Loader2, Users, X } from 'lucide-react'; // Added icons
import { RootState } from '@/store/store';
import { loadAdmininfo } from '@/lib/LoadData';
import Link from 'next/link';
import VotingCard from '@/components/admin/VotingCard';


const Admin = () => {
  const account = useActiveAccount();
  const dispatch = useDispatch();
  const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
  const provider = useSelector((state: RootState) => state?.escrow?.provider);
  const admin = useSelector((state: RootState) => state?.escrow?.admin);
  const votingdays = useSelector((state: RootState) => state?.escrow?.votingdays);
  const Quorum = useSelector((state: RootState) => state?.escrow?.Quorum);

  const [isLoading, setIsLoading] = useState(true);


  const isReady =
    escrowContract &&
    Object.keys(escrowContract).length > 0 &&
    provider &&
    Object.keys(provider).length > 0;

  useEffect(() => {
    const fetchadmin = async () => {
      try {
        setIsLoading(true);
        if (isReady) {
          await loadAdmininfo({
            dispatch,
            escrowContract,
            provider,
          });
        }
      } catch (err) {
        console.error("Failed to load stake balance:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchadmin();
  }, [isReady, account]);

  return (
    account ? (
      isLoading ? (
        <div className='h-[85vh] flex justify-center items-center'>
          <Loader2 className="h-10 w-10 animate-spin text-[white]" />
        </div>
      ) :
        admin == account?.address ? (<div className="max-w-3xl w-[90%] mx-auto text-white my-16">
          {/* Page Title */}
          <h1 className="sm:text-4xl text-3xl md:text-5xl font-bold mb-8 text-center text-[#1d45fe]">
            Admin Controls
          </h1>

          {/* Governance Parameters Section */}
          <div className="flex flex-col gap-6 mb-12">
            {/* Voting Period Setting */}
            <div className="flex items-center gap-4 p-4 bg-[#1E1E24] rounded-xl shadow-md hover:shadow-lg transition-all">
              <Clock className="text-[#1d45fe] w-7 h-7" /> {/* Icon */}
              <div className="flex flex-col">
                <span className="text-gray-400 text-sm md:text-base">
                  Voting Period
                </span>
                <span className="text-white font-semibold text-lg md:text-xl">
                    {votingdays?Number(votingdays):0} Days
                </span>
              </div>
            </div>

            {/* Quorum Requirement */}
            <div className="flex items-center gap-4 p-4 bg-[#1E1E24] rounded-xl shadow-md hover:shadow-lg transition-all">
              <Users className="text-[#1d45fe] w-7 h-7" /> {/* Icon */}
              <div className="flex flex-col">
                <span className="text-gray-400 text-sm md:text-base">
                  Voting Quorum
                </span>
                <span className="text-white font-semibold text-lg md:text-xl">
                  {Quorum?Number(Quorum):0} %
                </span>
              </div>
            </div>
          </div>

          {/* Admin Controls  */}
          <div className="flex flex-col gap-12">
            <VotingCard />
          </div>


          <Toaster position="bottom-right" reverseOrder={false} />
        </div>) : (
          <div className="h-[80vh] flex justify-center items-center">
            <div className="bg-[#1E1E24] px-8 py-12 rounded-2xl shadow-lg border border-[#1d45fe]/30 text-center max-w-md w-[90%]">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="bg-[#1d45fe]/10 p-4 rounded-full">
                  <X className='text-[#1d45fe] size-10' />

                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-white mb-4">Access Denied</h2>

              {/* Subtitle */}
              <p className="text-gray-400 mb-6 text-lg">
                Only the <span className="text-[#1d45fe] font-semibold">Admin</span> can access this section.
              </p>

              {/* Button to go back or home */}
              <Link href={'/'}>
                <button
                  className="bg-[#1d45fe] hover:bg-[#1638d6] px-6 py-3 rounded-xl font-semibold text-white shadow-md hover:shadow-xl transition-all duration-300"
                >
                  Go Back Home
                </button>
              </Link>
            </div>
          </div>

        )
    ) : (
      <div className="h-[90vh] flex items-center justify-center">
        <Banner
          title="Connect Your Wallet"
          subtitle="Please connect your wallet to access governance settings."
        />
      </div>
    )
  )
}

export default Admin;
