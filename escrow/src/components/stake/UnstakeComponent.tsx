import { RootState } from '@/store/store';
import { ArrowDownCircle } from 'lucide-react';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

const UnstakeComponent = () => {
    const [unstake, setUnStake] = useState("");
    const [isLoadingUnStake, setIsLoadingUnStake] = useState(false);

    const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
    const provider = useSelector((state: RootState) => state?.escrow?.provider);
    return (
        <div className="flex flex-col bg-gradient-to-br  p-8 rounded-2xl shadow-sm bg-[#131519]/90  shadow-[#1d45fe] sm:hover:scale-105 transition-all duration-300">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <ArrowDownCircle className="text-[#1d45fe] w-6 h-6" />
                <h2 className="text-2xl font-bold text-[#1d45fe]">Unstake ETH</h2>
            </div>

            {/* Description */}
            <p className="text-gray-400 mb-6 text-sm md:text-base leading-relaxed">
                Unstake your ETH to withdraw it back to your wallet. Your voting power will decrease accordingly. Always confirm the unstake amount before submitting.
            </p>

            {/* Input Section */}
            <div className="flex flex-col mb-5">
                <label htmlFor="unstakeAmount" className="mb-2 text-gray-300 font-medium">Amount to Unstake</label>
                <input
                    id="unstakeAmount"
                    type="number"
                    step={0.001}
                    onChange={(e) => { setUnStake(e.target.value) }}
                    className="border border-gray-600 rounded-xl p-3 bg-[#121217] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1d45fe] transition duration-200 appearance-none 
                      [&::-webkit-outer-spin-button]:appearance-none 
                      [&::-webkit-inner-spin-button]:appearance-none 
                      [&::-moz-appearance]:textfield"
                    placeholder="0.0 ETH"
                />
            </div>

            {/* Button */}
            <button className="bg-[#1d45fe] hover:bg-[#1638d6] text-white font-semibold py-3 px-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                Unstake Now
            </button>
        </div>

    )
}

export default UnstakeComponent