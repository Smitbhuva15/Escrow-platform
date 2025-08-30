"use client"
import { LoadEscrow } from '@/lib/LoadData';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useActiveAccount } from 'thirdweb/react';
import { RootState } from "@/store/store";
import Cart from '@/components/cart/Cart';


const Escrows = () => {

  const account = useActiveAccount();
  const dispatch = useDispatch();

  const [selected, setSelected] = useState("all");


  const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
  const provider = useSelector((state: RootState) => state?.escrow?.provider);
   

  const isReady = escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

  useEffect(() => {
    if (isReady) {
      LoadEscrow(escrowContract, provider, dispatch);
    }
  }, [isReady])

  return (
    <div className=' xl:max-w-5xl lg:max-w-4xl md:max-w-2xl sm:max-w-lg w-[90%] mx-auto text-white py-8'>

      <div className="text-4xl md:text-5xl font-extrabold mb-6">
        Deals
      </div>
      <div className="flex flex-wrap gap-6 text-zinc-300 items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="dealType"
            value={"all"}
            defaultChecked
            onChange={(e) => setSelected(e.target.value)}
            className="accent-[#1d45fe] w-4 h-4"
          />
          <span className="text-sm md:text-base">All Deals</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="dealType"
            value={"my"}
            onChange={(e) => setSelected(e.target.value)}
            className="accent-[#1d45fe] w-4 h-4"
          />
          <span className="text-sm md:text-base">My Deals</span>
        </label>
      </div>
      <div className='my-10'>
        <Cart />
      </div>
    </div>
  )
}

export default Escrows