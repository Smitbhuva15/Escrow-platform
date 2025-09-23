import { updatePlatformFee } from '@/lib/hooks/updatePlatformFee';
import { PlatformFeeInput } from '@/lib/types';
import { RootState } from '@/store/store';
import { Loader2, PieChartIcon } from 'lucide-react';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

const PlatformFeeCard = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
    const provider = useSelector((state: RootState) => state?.escrow?.provider);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PlatformFeeInput>();

    const onSubmit: SubmitHandler<PlatformFeeInput> = async (data) => {
        const value = Number(data?.fee)
        updatePlatformFee({
            dispatch,
            escrowContract,
            provider,
            value,
            setIsLoading,
        })

        reset();
    };
    return (
        <div className="flex flex-col bg-gradient-to-br p-8 rounded-2xl shadow-sm bg-[#131519]/90 shadow-[#1d45fe] sm:hover:scale-105 transition-all duration-300">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <PieChartIcon className="text-[#1d45fe] w-6 h-6" />
                <h2 className="text-2xl font-bold text-[#1d45fe]">Set Platform Fee</h2>
            </div>

            {/* Description */}
            <p className="text-gray-400 mb-6 text-sm md:text-base leading-relaxed">
                Set the platform’s service fee for every completed deal.
                You can choose any percentage between
                <span className="text-white font-semibold"> 1&nbsp;% and 18&nbsp;%</span>.
                This fee is automatically deducted and credited to the admin.
            </p>


            {/* Input Section */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col mb-5">
                    <label
                        htmlFor="PlatformFee"
                        className="mb-2 text-gray-300 font-medium"
                    >
                        Platform Fee (%)
                    </label>
                    <input
                        id="PlatformFee"
                        type="number"
                        min={1}
                        max={18}
                        {...register("fee", {
                            required: "Voting period is required",
                            min: { value: 1, message: "Platform Fee must be at least 1 percentage." },
                            max: { value: 18, message: "Platform Fee cannot exceed 18 percentage." },

                        })}
                        className="border border-gray-600 rounded-xl p-3 bg-[#121217] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1d45fe] transition duration-200 appearance-none 
            [&::-webkit-outer-spin-button]:appearance-none 
            [&::-webkit-inner-spin-button]:appearance-none 
            [&::-moz-appearance]:textfield"
                        placeholder="Enter Platform Fee percentage"
                    />
                    {errors.fee && (
                        <p className="text-red-500 text-sm mt-2">
                            {errors.fee.message}
                        </p>
                    )}
                </div>

                {/* Button */}
                {isLoading ? (
                    <button
                        disabled
                        className="bg-[#1d45fe] text-white font-semibold py-3 px-6 rounded-xl shadow-md flex items-center justify-center gap-2 w-full cursor-not-allowed opacity-80"
                    >
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Updating...
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="bg-[#1d45fe] hover:bg-[#1638d6] text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-xl w-full transition-all duration-300"
                    >
                        Update Fee
                    </button>
                )}
            </form>
        </div>
    );
}

export default PlatformFeeCard