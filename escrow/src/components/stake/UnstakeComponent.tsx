import { unstakeEth } from '@/lib/LoadData';
import { unstakeInputs } from '@/lib/types';
import { RootState } from '@/store/store';
import { ArrowDownCircle, Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useActiveAccount } from 'thirdweb/react';

const UnstakeComponent = () => {
    const dispatch = useDispatch();
    const account = useActiveAccount();

    const [isLoadingUnStake, setIsLoadingUnStake] = useState(false);

    const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
    const provider = useSelector((state: RootState) => state?.escrow?.provider);


    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<unstakeInputs>();

    const onSubmit: SubmitHandler<unstakeInputs> = async (data) => {
        const address = account?.address;

        if (address) {
            await unstakeEth({
                dispatch,
                escrowContract,
                provider,
                unstake: String(data.unstake),
                setIsLoadingUnStake,
                address
            });
        }

        reset();
    };

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
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col mb-5">
                    <label htmlFor="unstakeAmount" className="mb-2 text-gray-300 font-medium">Amount to Unstake</label>
                    <input
                        id="unstakeAmount"
                        type="number"
                        step={0.0001}
                        {...register("unstake", {
                            required: "Unstake Amount is required",
                            min: { value: 0.0001, message: "Minimum stake is 0.0001 ETH" },
                        })}

                        className="border border-gray-600 rounded-xl p-3 bg-[#121217] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1d45fe] transition duration-200 appearance-none 
                      [&::-webkit-outer-spin-button]:appearance-none 
                      [&::-webkit-inner-spin-button]:appearance-none 
                      [&::-moz-appearance]:textfield"
                        placeholder="0.0 ETH"
                    />
                    {errors.unstake && (
                        <p className="text-red-500 text-sm mt-2">
                            {errors.unstake.message}
                        </p>
                    )}
                </div>

                {/* Button */}
                {isLoadingUnStake ? (
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
                        Unstake Now
                    </button>)
                }


            </form>
        </div>

    )
}

export default UnstakeComponent