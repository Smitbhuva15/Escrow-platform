import { Button } from "@/components/ui/button";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const Cart = () => {
  const deals = useSelector((state: RootState) => state?.escrow?.deals);

   const handelDeposite=async(dealId:number)=>{
     console.log(dealId.toString())
   }

  return (

    deals && deals.length>0 ?(
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {deals.map((deal: any, index: number) => (
        <div
          key={index}
          className="p-6 bg-[#24292e] rounded-2xl shadow-md hover:shadow-lg transition flex flex-col justify-between"
        >
          {/* Title */}
          <h2 className="text-xl font-bold text-white mb-2 truncate">
            {deal?.args?.title || "Untitled Deal"}
          </h2>

          {/*  description */}
          <p className="text-sm text-zinc-400 mb-4 line-clamp-3">
            {deal?.args?.description || "No deconsscription provided."}
          </p>

          {/* Info section */}
          <div className="text-sm text-zinc-300 space-y-1 mb-4">
            <p>
              <span className="font-semibold text-zinc-200">Buyer:</span>{" "}
              {deal?.args?.buyer?.slice(0, 6)}...{deal?.args?.buyer?.slice(-4)}
            </p>
            <p>
              <span className="font-semibold text-zinc-200">Seller:</span>{" "}
              {deal?.args?.seller?.slice(0, 6)}...{deal?.args?.seller?.slice(-4)}
            </p>
            <p>
              <span className="font-semibold text-zinc-200">Amount:</span>{" "}
              {Number(deal?.args?.amount) / 1e18} ETH
            </p>
            <p>
              <span className="font-semibold text-zinc-200">Status:</span>{" "}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  deal?.args?.status === "Funded"
                    ? "bg-green-600 text-white"
                    : deal?.args?.status === "Pending"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-600 text-white"
                }`}
              >
                {deal?.args?.status || "Unknown"}
              </span>
            </p>
          </div>

          {/* Fund Button */}
          <Button
            className="w-full bg-[#1d45fe] hover:bg-[#1638d6] text-white rounded-xl"
            onClick={() => handelDeposite(deal?.args?.dealId)}
          >
            Deposit Funds
          </Button>
        </div>
      ))}
    </div>
    ):(
      <div>loading</div>
    )
    
 
  );
};

export default Cart;
