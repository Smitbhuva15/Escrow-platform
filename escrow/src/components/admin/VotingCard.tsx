import { updateVotingDays } from '@/lib/hooks/updateVotingDays';
import { votingInput } from '@/lib/types';
import { RootState } from '@/store/store';
import { ArrowUpCircle, Clock, Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

const VotingCard = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
    const provider = useSelector((state: RootState) => state?.escrow?.provider);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<votingInput>();

    const onSubmit: SubmitHandler<votingInput> = async (data) => {

        await updateVotingDays({
            dispatch,
            escrowContract,
            provider,
            value: Number(data?.days),
            setIsLoading
        })
        reset();
    };
    return (
        <div className="flex flex-col bg-gradient-to-br p-8 rounded-2xl shadow-sm bg-[#131519]/90 shadow-[#1d45fe] sm:hover:scale-105 transition-all duration-300">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <Clock className="text-[#1d45fe] w-6 h-6" />
                <h2 className="text-2xl font-bold text-[#1d45fe]">Set Voting Period</h2>
            </div>

            {/* Description */}
            <p className="text-gray-400 mb-6 text-sm md:text-base leading-relaxed">
                Decide how long community members have to cast their votes on a proposal. 
                Choose a duration between <span className="text-white font-semibold">1 to 30 days</span>.
                Once set, proposals will follow this voting period by default.
            </p>

            {/* Input Section */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col mb-5">
                    <label
                        htmlFor="votingDays"
                        className="mb-2 text-gray-300 font-medium"
                    >
                        Voting Period (Days)
                    </label>
                    <input
                        id="votingDays"
                        type="number"
                        min={1}
                        max={30}
                        {...register("days", {
                            required: "Voting period is required",
                        })}
                        className="border border-gray-600 rounded-xl p-3 bg-[#121217] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1d45fe] transition duration-200 appearance-none 
            [&::-webkit-outer-spin-button]:appearance-none 
            [&::-webkit-inner-spin-button]:appearance-none 
            [&::-moz-appearance]:textfield"
                        placeholder="Enter number of days"
                    />
                    {errors.days && (
                        <p className="text-red-500 text-sm mt-2">
                            {errors.days.message}
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
                        Update Period
                    </button>
                )}
            </form>
        </div>
    );

}

export default VotingCard