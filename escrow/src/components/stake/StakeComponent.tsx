"use client";

import { stakeEth } from '@/lib/LoadData';
import { stakeInputs } from '@/lib/types';
import { RootState } from '@/store/store';
import { ArrowUpCircle, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const StakeComponent = () => {
    const dispatch = useDispatch();
    const [isLoadingStake, setIsLoadingStake] = useState(false);

    const escrowContract = useSelector(
        (state: RootState) => state?.escrow?.EscrowContract
    );
    const provider = useSelector((state: RootState) => state?.escrow?.provider);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<stakeInputs>();

    const onSubmit: SubmitHandler<stakeInputs> = async (data) => {
        await stakeEth({
            dispatch,
            escrowContract,
            provider,
            stake: String(data.stake),
            setIsLoadingStake,
        });

        reset();
    };

    return (
        <div className="flex flex-col bg-gradient-to-br p-8 rounded-2xl shadow-sm bg-[#131519]/90 shadow-[#1d45fe] sm:hover:scale-105 transition-all duration-300">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <ArrowUpCircle className="text-[#1d45fe] w-6 h-6" />
                <h2 className="text-2xl font-bold text-[#1d45fe]">Stake ETH</h2>
            </div>

            {/* Description */}
            <p className="text-gray-400 mb-6 text-sm md:text-base leading-relaxed">
                Stake your ETH to gain voting power in governance decisions. Your staked
                ETH will be locked until you decide to unstake. The more you stake, the
                higher your influence in voting.
            </p>

            {/* Input Section */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col mb-5">
                    <label
                        htmlFor="stakeAmount"
                        className="mb-2 text-gray-300 font-medium"
                    >
                        Amount to Stake
                    </label>
                    <input
                        id="stakeAmount"
                        type="number"
                        step={0.001}
                        {...register("stake", {
                            required: "Stake Amount is required",
                            min: { value: 0.001, message: "Minimum stake is 0.001 ETH" },
                        })}
                        className="border border-gray-600 rounded-xl p-3 bg-[#121217] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1d45fe] transition duration-200 appearance-none 
              [&::-webkit-outer-spin-button]:appearance-none 
              [&::-webkit-inner-spin-button]:appearance-none 
              [&::-moz-appearance]:textfield"
                        placeholder="0.0 ETH"
                    />
                    {errors.stake && (
                        <p className="text-red-500 text-sm mt-2">
                            {errors.stake.message}
                        </p>
                    )}
                </div>

                {/* Button */}
                {isLoadingStake ? (
                    <button
                        disabled
                        className="bg-[#1d45fe] text-white font-semibold py-3 px-6 rounded-xl shadow-md flex items-center justify-center gap-2 w-full cursor-not-allowed opacity-80"
                    >
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="bg-[#1d45fe] hover:bg-[#1638d6] text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-xl w-full transition-all duration-300"
                    >
                        Stake Now
                    </button>
                )}
            </form>
           
        </div>
    );
};

export default StakeComponent;
