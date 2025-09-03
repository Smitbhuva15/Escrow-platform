import React from 'react'

const LeftSection: React.FC<{ deal: any }> = ({ deal }) => {
  return (
    <div className="lg:p-0 p-4  space-y-6">
      {/* Title */}
      <h1 className="text-2xl sm:text-4xl text-[#1d45fe] font-bold ">
        {deal?.title || "Title"}
      </h1>

      {/* Description */}
      <p className="text-gray-300 text-base sm:text-lg">
        {deal?.description || "No description provided."}
      </p>

      {/* Buyer Info */}
      <div className="bg-[#1E1E24] p-5 rounded-2xl flex flex-col space-y-1">
        <span className="text-gray-400 font-semibold">Buyer Address:</span>
        <span className="text-indigo-400 break-all">{`${deal?.buyer.slice(0,10)}...${deal?.buyer.slice(-10)}`|| "N/A"}</span>
      </div>

      {/* Seller Info */}
      <div className="bg-[#1E1E24] p-5 rounded-2xl flex flex-col space-y-1">
        <span className="text-gray-400 font-semibold">Seller Address:</span>
        <span className="text-green-400 break-all">{`${deal?.seller.slice(0,10)}...${deal?.seller.slice(-10)}`|| "N/A"}</span>
      </div>

      {/* Dispute Info */}
      <div className="bg-[#1E1E24] p-5 rounded-2xl flex flex-col space-y-1">
        <span className="text-gray-400 font-semibold">Dispute Status:</span>
        <span className="text-red-400">{deal?.isDisputed ? "Yes" : "No"}</span>
      </div>
    </div>
  );
};

export default LeftSection;

