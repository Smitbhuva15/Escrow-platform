"use client"
import Banner from '@/components/banner/Banner';
import { RootState } from '@/store/store';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useActiveAccount } from 'thirdweb/react';
import DashboradTab from '@/components/dashboard/DashboardTab'

const Dashboard = () => {
  const account = useActiveAccount();
 
  return (
    account ? (
      <div className={` xl:max-w-5xl lg:max-w-4xl md:max-w-2xl sm:max-w-lg w-[90%] mx-auto text-white py-8`}>
        {/* Page Heading */}
        <div className="text-4xl md:text-5xl font-extrabold mb-6">
         Dashborad
        </div>

        <div className='text-zinc-300'>
           <DashboradTab />
        </div>
      </div>
    ) : (
      <div className="h-[90vh] flex items-center justify-center">
        <Banner
          title="Connect Your Wallet"
          subtitle="Please connect your wallet to access dashboard."
        />
      </div>
    )
  )
}

export default Dashboard