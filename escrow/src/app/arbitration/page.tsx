"use client"
import Banner from '@/components/banner/Banner';
import DisputeCart from '@/components/cart/DisputeCart';
import { Loader } from '@/components/ui/Loader';
import { loadDispute } from '@/lib/LoadData';
import { singledisputeType } from '@/lib/types';
import { RootState } from '@/store/store';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useActiveAccount } from 'thirdweb/react';

const Arbitration = () => {
  const account = useActiveAccount();
  const dispatch = useDispatch();

  const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
  const provider = useSelector((state: RootState) => state?.escrow?.provider);
  const disputes = useSelector((state: RootState) => state?.escrow?.disputes);


  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState("Open");
  const [isDisputes, setIsDisputes] = useState<singledisputeType[]>([])

  const isReady =
    escrowContract &&
    Object.keys(escrowContract).length > 0 &&
    provider &&
    Object.keys(provider).length > 0;

  useEffect(() => {
    if (disputes && disputes.length > 0) {
      let filterdisputes;
      if (selected == "Closed") {
        filterdisputes = disputes.filter((dispute: singledisputeType) => dispute?.dispute?.closed == 1);
      }
      else {
        filterdisputes = disputes.filter((dispute: singledisputeType) => dispute?.dispute?.closed == 0);
      }
      setIsDisputes(filterdisputes)
    }
  }, [selected, disputes])

  useEffect(() => {
    setSelected("Open");
  }, [account])

  useEffect(() => {
    const fetchDispute = async () => {
      try {
        setIsLoading(true);
        if (isReady) {
          await loadDispute({ dispatch, escrowContract, provider });
        }
      } catch (err) {
        console.error("Failed to load stake balance:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDispute();
  }, [isReady]);

  return (
    account ? (
      <div className={`${isDisputes.length < 4 && "mb-52"} xl:max-w-5xl lg:max-w-4xl md:max-w-2xl sm:max-w-lg w-[90%] mx-auto text-white py-8`}>
        {/* Page Heading */}
        <div className="text-4xl md:text-5xl font-extrabold mb-6">
          Arbitrations
        </div>

        {/* Radio Filters */}
        <div className="flex flex-wrap gap-6 text-zinc-300 items-center">
          {/* open dispute */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="dealType"
              value="Open"
              checked={selected === "Open"}
              onChange={(e) => setSelected(e.target.value)}
              className="accent-[#1d45fe] w-4 h-4"
            />
            <span className="text-sm md:text-base">Open</span>
          </label>

          {/* closed dispute */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="dealType"
              value="Closed"
              checked={selected === "Closed"}
              onChange={(e) => setSelected(e.target.value)}
              className="accent-[#1d45fe] w-4 h-4"
            />
            <span className="text-sm md:text-base">Closed</span>
          </label>
        </div>

        {
          isLoading ? (
            <div className='h-[68vh] flex justify-center items-center'>
            <Loader />
            </div>
          ) :

            (isDisputes && isDisputes.length > 0 ?
              (<div className='my-10'>
                <DisputeCart disputes={isDisputes} />
              </div>)
              :
              (
                <div className="h-[65vh] flex flex-col justify-center  text-wrap text-center items-center text-zinc-200">
                  <h1 className="text-lg md:text-xl font-medium">No disputes {selected == "Open" ? "open" : "closed"} yet</h1>
                  <p className="text-sm md:text-base text-zinc-300 mt-2">
                    There are no {selected == "Open" ? "open" : "closed"} disputes available to view at this moment.
                  </p>
                </div>
              )


            )
        }
      </div>
    ) : (
      <div className="h-[90vh] flex items-center justify-center">
        <Banner
          title="Connect Your Wallet"
          subtitle="Please connect your wallet to create and manage escrow deals."
        />
      </div>
    )
  );
};

export default Arbitration;
