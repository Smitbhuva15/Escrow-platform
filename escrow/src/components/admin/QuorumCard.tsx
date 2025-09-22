import { updateQuorum } from '@/lib/LoadData';
import { QuorumInput, votingInput } from '@/lib/types';
import { RootState } from '@/store/store';
import {  Loader2, Users } from 'lucide-react';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

const QuorumCard = () => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
    const provider = useSelector((state: RootState) => state?.escrow?.provider);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<QuorumInput>();

    const onSubmit: SubmitHandler<QuorumInput> = async (data) => {

        await updateQuorum({
            dispatch,
            escrowContract,
            provider,
            value: Number(data?.Quorum),
            setIsLoading
        })
        reset();
    };
    return (
        <div className="flex flex-col bg-gradient-to-br p-8 rounded-2xl shadow-sm bg-[#131519]/90 shadow-[#1d45fe] sm:hover:scale-105 transition-all duration-300">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <Users className="text-[#1d45fe] w-6 h-6" />
                <h2 className="text-2xl font-bold text-[#1d45fe]">Set Voting Quorum</h2>
            </div>

            {/* Description */}
            <p className="text-gray-400 mb-6 text-sm md:text-base leading-relaxed">
          
                ⚠️ <span className="text-red-400 font-medium">Important:</span> If the quorum is
                <span className="text-white font-semibold"> not met</span>, then by default the
                <span className="text-[#1d45fe] font-semibold"> client automatically wins </span>
                and the total deposited funds are released to them.  Choose a value between <span className="text-white font-semibold">1% and 70%</span>.
            </p>


            {/* Input Section */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col mb-5">
                    <label
                        htmlFor="votingQuorum"
                        className="mb-2 text-gray-300 font-medium"
                    >
                        Voting Quorum (%)
                    </label>
                    <input
                        id="votingQuorum"
                        type="number"
                        min={1}
                        max={70}
                        {...register("Quorum", {
                            required: "Voting Quorum is required",
                        })}
                        className="border border-gray-600 rounded-xl p-3 bg-[#121217] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1d45fe] transition duration-200 appearance-none 
        [&::-webkit-outer-spin-button]:appearance-none 
        [&::-webkit-inner-spin-button]:appearance-none 
        [&::-moz-appearance]:textfield"
                        placeholder="Enter quorum percentage"
                    />
                    {errors?.Quorum && (
                        <p className="text-red-500 text-sm mt-2">
                            {errors.Quorum.message}
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
                        Updating ...
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="bg-[#1d45fe] hover:bg-[#1638d6] text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-xl w-full transition-all duration-300"
                    >
                        Update Quorum
                    </button>
                )}
            </form>
        </div>

    );
}

export default QuorumCard