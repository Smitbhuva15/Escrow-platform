import { singledisputeType } from '@/lib/types';
import React from 'react'

const LeftSection: React.FC<{ deal:any, section: string }> = ({ deal, section }) => {
  return (
    <div className="lg:p-0 p-4 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          {
            section == 'dispute' ?
              `${deal?.dispute?.title || "Untitled Deal"}` : `${deal?.title || "Untitled Deal"}`
          }
        </h1>
        <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
          {
            section == 'dispute' ?
              `${deal?.dispute?.description || "Untitled Deal"}` : `${deal?.description || "Untitled Deal"}`
          }
        </p>
      </div>

      {/* client Info */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E1E24]/80 to-[#16161a]/80 border border-[#8f614c] transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium">Client Address</span>
          <span className="px-3 py-1 text-xs rounded-full bg-[#8f614c] text-white font-medium">
            Client
          </span>
        </div>
        <span className="text-gray-400 font-mono text-sm break-all">
          {
            section == 'dispute'
              ?
              (`${deal?.dispute?.client.slice(0, 10)}...${deal?.dispute?.client.slice(-10)}`) : (`${deal?.client.slice(0, 10)}...${deal?.client.slice(-10)}`)
          }
        </span>
      </div>

      {/* specialist Info */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E1E24]/80 to-[#16161a]/80 border border-[#8f614c] transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium">Specialist Address</span>
          <span className="px-3 py-1 text-xs rounded-full bg-[#8f614c] text-white  font-medium">
            Specialist
          </span>
        </div>
        <span className="text-gray-400 font-mono text-sm break-all">
          {
            section == 'dispute'
              ?
              (`${deal?.dispute?.specialist.slice(0, 10)}...${deal?.dispute?.specialist.slice(-10)}`) : (`${deal?.specialist.slice(0, 10)}...${deal?.specialist.slice(-10)}`)
          }
        </span>
      </div>

      {/* Dispute Info */}
      {
        section == 'dispute'
          ?
          (  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E1E24]/80 to-[#16161a]/80 border border-[#8f614c]  transition-all">
            <h2 className="text-white font-semibold text-sm mb-1">Amount</h2>
            <p className="text-2xl font-bold text-gray-400">
              {deal?.dispute?.initialAmount ? deal?.dispute?.initialAmount / 1e18 : "N/A"} ETH
            </p>
          </div>)
          :
          (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E1E24]/80 to-[#16161a]/80 border border-[#8f614c]   transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Dispute Status</span>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${deal?.isDisputed
                    ? "bg-[#8f614c] text-white"
                    : "bg-[#8f614c] text-white"
                    }`}
                >
                  {deal?.isDisputed ? "Active" : "No Dispute"}
                </span>
              </div>
              <span
                className={`font-medium ${deal?.isDisputed ? "text-red-400" : "text-emerald-400"
                  }`}
              >
                {deal?.isDisputed
                  ? "A dispute has been raised and arbitration is required."
                  : "No disputes raised for this deal."}
              </span>
            </div>)
      }

    </div>

  );
};

export default LeftSection;

