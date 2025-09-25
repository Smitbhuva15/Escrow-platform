"use client"
import { Inputs } from "@/lib/types";
import { RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form"
import { useSelector } from "react-redux";
import { useActiveAccount } from "thirdweb/react";

import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import Banner from "@/components/banner/Banner";
import { HandelError } from "@/lib/HandelError";

const balanceget = async (address: string) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const balance = await provider.getBalance(address);
  return ethers.utils.formatEther(balance);
};

const CreateEscrow = () => {

  const [balance, setBalance] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
  const provider = useSelector((state: RootState) => state?.escrow?.provider);

  const account = useActiveAccount();

  useEffect(() => {
    if (account?.address) {
      balanceget(account.address).then((balance) => {
        setBalance(Number(balance));
      })
    }
  }, [account]);


  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (balance < Number(data?.amount)) {
      toast.error("Insufficient balance. Please fund your wallet first.");
      return;
    }

    setIsLoading(true);
    toast.loading("Creating escrow deal... Please confirm the transaction in your wallet.", {
      id: "escrowTx",
    });

    try {
      const signer = await provider.getSigner();
      const amount = ethers.utils.parseEther(data?.amount.toString());
      const transaction = await escrowContract.connect(signer).dealCreation(data?.specialist, data?.title, data?.description, amount, data?.deadline);

      toast.loading("Transaction submitted. Waiting for confirmation...", {
        id: "escrowTx",
      });

      const receipt = await transaction.wait();

      if (receipt.status !== 1) {
        toast.error("Escrow deal creation failed. Please try again.", {
          id: "escrowTx",
        });
        setIsLoading(false);
        return;
      }

      const event = receipt.events?.find((e: any) => e.event === "Deal");

      if (event) {
        toast.success("Escrow deal created successfully!", {
          id: "escrowTx",
        });


      } else {
        toast.error("Transaction confirmed but no Deal event found.", {
          id: "escrowTx",
        });


      }
    } catch (error) {
      HandelError(error, "escrowTx", "Transaction failed. Please try again")
    }
    finally {
      reset();
      setIsLoading(false);
    }
  };


  return (
    <div className="xl:max-w-4xl lg:max-w-3xl md:max-w-2xl sm:max-w-lg w-[90%] mx-auto text-white py-12">
      {
        account ? (<div><h1 className="md:text-5xl text-3xl font-bold mb-8 text-center ">
        Start Deal
        </h1>

          {/* Card Container with custom blue shadow */}
          <div className="bg-[#131519]/90 rounded-2xl p-8 shadow-sm shadow-[#1d45fe]">
            <form className="space-y-6 " onSubmit={handleSubmit(onSubmit)}>
              {/* Title */}
              <div className="flex flex-col">
                <label htmlFor="title" className="mb-2 font-medium">
                  Deal Title
                </label>
                <input
                  type="text"
                  placeholder="Enter deal title"
                  {...register("title", {
                    required: "deal title is required",
                    minLength: {
                      value: 15,
                      message: "Minimum length is 15 characters",
                    }
                  })}
                  className="border border-gray-500 bg-transparent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1d45fe] transition w-full"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-2">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col">
                <label htmlFor="description" className="mb-2 font-medium">
                  Description
                </label>
                <textarea

                  rows={4}
                  placeholder="Write a short description..."
                  {...register("description", {
                    required: "description is required",
                    minLength: {
                      value: 30,
                      message: "Minimum length is 30 characters",
                    }

                  })}

                  className="border border-gray-500 bg-transparent rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#1d45fe] transition w-full"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-2">{errors.description.message}</p>
                )}
              </div>

              {/* specialist Address */}
              <div className="flex flex-col">
                <label htmlFor="specialist" className="mb-2 font-medium">
                  Specialist Address
                </label>
                <input
                  type="text"
                  placeholder="0x1234...abcd"
                  {...register("specialist", {
                    required: "specialist address is required",
                    minLength: {
                      value: 42,
                      message: "Address must be exactly 42 characters",
                    },
                    maxLength: {
                      value: 42,
                      message: "Address must be exactly 42 characters",
                    },
                    pattern: {
                      value: /^0x[a-fA-F0-9]{40}$/,
                      message: "Invalid Ethereum address format",
                    },
                  })}
                  className="border border-gray-500 bg-transparent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1d45fe] transition w-full"
                />

                {errors.specialist && (
                  <p className="text-red-500 text-sm mt-2">{errors.specialist.message}</p>
                )}
              </div>

              {/* Amount */}
              <div className="flex flex-col">
                <label htmlFor="amount" className="mb-2 font-medium">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="Enter amount in ETH"
                  {...register("amount", {
                    required: "ETH Amount is required",
                    min: { value: 0.001, message: "Amount must be at least 0.001ETH" },
                  })}
                  className="border border-gray-50 bg-transparent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1d45fe] transition w-full
                appearance-none 
                      [&::-webkit-outer-spin-button]:appearance-none 
                      [&::-webkit-inner-spin-button]:appearance-none 
                      [&::-moz-appearance]:textfield
                      "
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-2">{errors.amount.message}</p>
                )}
              </div>

              {/* deadline */}
              <div className="flex flex-col">
                <label htmlFor="amount" className="mb-2 font-medium">
                  Deadline
                </label>
                <input
                  type="number"
                  min={1}
                  max={90}
                  placeholder="e.g. 30"
                  {...register("deadline", {
                    required: "Deadline is required",
                    min: { value: 1, message: "Deadline must be at least 1 day." },
                    max: { value: 90, message: "Deadline cannot exceed 90 days." },


                  })}
                  className="border border-gray-50 bg-transparent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1d45fe] transition w-full
                appearance-none 
                      [&::-webkit-outer-spin-button]:appearance-none 
                      [&::-webkit-inner-spin-button]:appearance-none 
                      [&::-moz-appearance]:textfield
                      "
                />
                {errors.deadline && (
                  <p className="text-red-500 text-sm mt-2">{errors.deadline.message}</p>
                )}
              </div>

              {/* Button */}
              <div className="pt-4 flex justify-center">
                {isLoading ? (
                  <button
                    disabled
                    type="submit"
                    className="bg-[#1d45fe] text-white font-semibold px-6 py-3 rounded-full flex items-center justify-center gap-2 w-full cursor-not-allowed opacity-80"
                  >
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-[#1d45fe] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#1638d6] transition w-full flex items-center justify-center"
                  >
                    Start Deal
                  </button>
                )}
              </div>
            </form>
          </div>
          <Toaster
            position="bottom-right"
            reverseOrder={false}
          />
        </div>
        ) : (
          <div className="md:h-[80vh] h-[72vh] flex items-center justify-center">
            <Banner
              title={'Connect Your Wallet'}
              subtitle={'Secure your transactions by linking a wallet before proceeding.'}
            />
          </div>
        )
      }
    </div>
  );
};

export default CreateEscrow;
