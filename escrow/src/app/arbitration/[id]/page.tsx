"use client"
import RightSectionArbitration from '@/components/Arbitration/RightSectionArbitration';
import Banner from '@/components/banner/Banner';
import LeftSection from '@/components/escrowId/LeftSection';
import { Loader } from '@/components/ui/Loader';
import { loadDispute, loadTotalVotings } from '@/lib/LoadData';
import { singledisputeType } from '@/lib/types';
import { RootState } from '@/store/store';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useActiveAccount } from 'thirdweb/react';

const page = () => {
  const account = useActiveAccount();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const numericId = id ? Number(id) : undefined;

  const [isLoading, setIsLoading] = useState(true)
  const [dispute, setDispute] = useState<any>();

  const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
  const provider = useSelector((state: RootState) => state?.escrow?.provider);
  const Disputes = useSelector((state: RootState) => state?.escrow?.disputes);

  const isReady = escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

  useEffect(() => {
    const fetchdispute = async () => {
      try {
        setIsLoading(true);
        if (isReady) {
          await loadDispute({ dispatch, escrowContract, provider });
          await loadTotalVotings({ dispatch, escrowContract, provider })
        }
      } catch (err) {
        console.log("Failed to load escrow:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchdispute();
  }, [isReady]);


  useEffect(() => {
    if (Disputes && Disputes.length > 0) {
      const filtered = Disputes.filter((item: singledisputeType) => item?.dispute?.disputedId == numericId)
      setDispute(filtered[0]);
    }
  }, [Disputes, id]);

  return (
    account ? (
      isLoading ? (
        <div className='md:h-[85vh] h-[82vh] flex justify-center items-center'>
          <Loader />
        </div>
      ) : (
        <div className='xl:max-w-5xl lg:max-w-4xl min-h-screen md:max-w-2xl sm:max-w-lg w-[90%] mx-auto text-white py-8 mb-24'>
          <div className='lg:flex lg:gap-16'>
            <div className='lg:w-[50%]'>
              <LeftSection deal={dispute} section='dispute' />
            </div>
            <div className='lg:w-[50%]'>
              <RightSectionArbitration dispute={dispute} />
            </div>
          </div>
        </div>
      )
    ) : (
      <div className="md:h-[80vh] h-[77vh]  flex items-center justify-center">
        <Banner
          title={'Connect Your Wallet'}
          subtitle={'Please Connect your wallet to participate in governance voting.'}
        />
      </div>
    )
  )
}

export default page