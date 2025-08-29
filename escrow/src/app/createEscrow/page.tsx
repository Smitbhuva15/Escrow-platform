"use client"
import { Inputs } from "@/lib/interface";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form"



const CreateEscrow = () => {

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
   console.log(data)
  }




  return (
    <div className="xl:max-w-4xl lg:max-w-3xl md:max-w-2xl sm:max-w-lg w-[90%] mx-auto text-white py-12">
      <h1 className="md:text-5xl text-3xl font-bold mb-8 text-center text-[#1d45fe]">
        Create Escrow
      </h1>

      {/* Card Container with custom blue shadow */}
      <div className="bg-[#131519]/90 rounded-2xl p-8 shadow-sm shadow-[#1d45fe]">
        <form className="space-y-6 " onSubmit={handleSubmit(onSubmit)}>
          {/* Title */}
          <div className="flex flex-col">
            <label htmlFor="title" className="mb-2 font-medium">
              Escrow Title
            </label>
            <input
              type="text"
              placeholder="Enter escrow title"
              {...register("title", {
                required: "Escrow title is required",
                minLength: {
                  value: 15,
                  message: "Minimum length is 15 characters",
                }
                // maxLength: {
                //   value: 30,
                //   message: "Maximum length is 30 characters",
                // }
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

          {/* Seller Address */}
          <div className="flex flex-col">
            <label htmlFor="seller" className="mb-2 font-medium">
              Seller Address
            </label>
            <input
              type="text"
              placeholder="0x1234...abcd"
              {...register("seller", {
                required: "Seller address is required",
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

            {errors.seller && (
              <p className="text-red-500 text-sm mt-2">{errors.seller.message}</p>
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

          {/* Button */}
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              className="bg-[#1d45fe] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#1638d6] transition w-full"
            >
              Create Escrow
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEscrow;
