"use client"
import Banner from '@/components/banner/Banner';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useActiveAccount } from 'thirdweb/react';

const Arbitration = () => {
  const account = useActiveAccount();
  const dispatch = useDispatch();

  const [selected, setSelected] = useState("Open");

  return (
    account ? (
      <div className="xl:max-w-5xl lg:max-w-4xl md:max-w-2xl sm:max-w-lg w-[90%] mx-auto text-white py-8">
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
