import React from 'react'

const LeftSection: React.FC<{ deal: any }> = ({ deal }) => {
  return (
   <div className="lg:p-0 p-4 space-y-8">
  {/* Title */}
  <div>
    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
      {deal?.title || "Untitled Deal"}
    </h1>
    <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
      {deal?.description || "No description provided."}
    </p>
  </div>

  {/* Buyer Info */}
  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E1E24]/80 to-[#16161a]/80 border border-indigo-500/30 shadow-md hover:shadow-indigo-500/20 transition-all">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-400 font-medium">Buyer Address</span>
      <span className="px-3 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-400 font-medium">
        Buyer
      </span>
    </div>
    <span className="text-indigo-400 font-mono text-sm break-all">
      {deal?.buyer
        ? `${deal?.buyer.slice(0, 10)}...${deal?.buyer.slice(-10)}`
        : "N/A"}
    </span>
  </div>

  {/* Seller Info */}
  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E1E24]/80 to-[#16161a]/80 border border-green-500/30 shadow-md hover:shadow-green-500/20 transition-all">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-400 font-medium">Seller Address</span>
      <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400 font-medium">
        Seller
      </span>
    </div>
    <span className="text-green-400 font-mono text-sm break-all">
      {deal?.seller
        ? `${deal?.seller.slice(0, 10)}...${deal?.seller.slice(-10)}`
        : "N/A"}
    </span>
  </div>

  {/* Dispute Info */}
  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E1E24]/80 to-[#16161a]/80 border border-red-500/30 shadow-md hover:shadow-red-500/20 transition-all">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-400 font-medium">Dispute Status</span>
      <span
        className={`px-3 py-1 text-xs rounded-full font-medium ${
          deal?.isDisputed
            ? "bg-red-500/20 text-red-400"
            : "bg-emerald-500/20 text-emerald-400"
        }`}
      >
        {deal?.isDisputed ? "Active" : "No Dispute"}
      </span>
    </div>
    <span
      className={`font-medium ${
        deal?.isDisputed ? "text-red-400" : "text-emerald-400"
      }`}
    >
      {deal?.isDisputed
        ? "A dispute has been raised and arbitration is required."
        : "No disputes raised for this deal."}
    </span>
  </div>
</div>

  );
};

export default LeftSection;

