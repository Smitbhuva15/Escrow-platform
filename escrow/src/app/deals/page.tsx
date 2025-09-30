"use client"
import { LoadEscrow } from '@/lib/LoadData';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useActiveAccount } from 'thirdweb/react';
import { RootState } from "@/store/store";
import Cart from '@/components/cart/Cart';
import { Loader2 } from 'lucide-react';
import Banner from '@/components/banner/Banner';
import { SingledealType } from '@/lib/types';
import { Loader } from '@/components/ui/Loader';


const Escrows = () => {

  const account = useActiveAccount();
  const dispatch = useDispatch();

  const [selected, setSelected] = useState("all");
  const [deals, setDeals] = useState<SingledealType[]>([]);
  const [isLoading, setIsLoading] = useState(false)


  const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
  const provider = useSelector((state: RootState) => state?.escrow?.provider);
  const Deals = useSelector((state: RootState) => state?.escrow?.deals);

  useEffect(() => {
    if (Deals && Deals.length > 0) {
      if (selected == "all") {
        setDeals(Deals);
      }
      else if(selected=="Client"){
        const updateDeal = Deals.filter((deal: SingledealType) => deal?.deal?.client == account?.address)
        setDeals(updateDeal)
      }
      else{
         const updateDeal = Deals.filter((deal: SingledealType) => deal?.deal?.specialist == account?.address)
        setDeals(updateDeal)
      }
    }
  }, [Deals, account, selected])

  useEffect(() => {
    setSelected("all")
  }, [account])

  const isReady = escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

 useEffect(() => {
  const fetchEscrow = async () => {
    try {
      setIsLoading(true); 
      if (isReady) {
        await LoadEscrow(escrowContract, provider, dispatch);
      }
    } catch (err) {
      console.log("Failed to load escrow:", err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchEscrow();
}, [isReady]);

  return (
    account ? (


      <div className={` ${deals.length < 4 && "mb-52"} xl:max-w-5xl min-h-screen lg:max-w-4xl md:max-w-2xl sm:max-w-lg w-[90%] mx-auto text-white py-8`}>

        <div className="text-4xl md:text-5xl font-extrabold mb-6">
          Deals
        </div>
        <div className="flex flex-wrap gap-6 text-zinc-300 items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="dealType"
              value={"all"}
              checked={selected === "all"}
              onChange={(e) => setSelected(e.target.value)}
              className="accent-[#d99e82] w-4 h-4"
            />
            <span className="text-sm md:text-base">All Deals</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="dealType"
              value={"Client"}
              checked={selected === "Client"}
              onChange={(e) => setSelected(e.target.value)}
              className="accent-[#d99e82] w-4 h-4"
            />
            <span className="text-sm md:text-base">Client (Mine)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="dealType"
              value={"Specialist"}
              checked={selected === "Specialist"}
              onChange={(e) => setSelected(e.target.value)}
              className="accent-[#d99e82] w-4 h-4"
            />
            <span className="text-sm md:text-base"> Specialist (Mine)</span>
          </label>
        </div>
        {
          isLoading ? (
            <div className='h-[65vh] flex justify-center items-center'>
             <Loader />
            </div>
          ) :

            (deals && deals.length > 0 ?
              (<div className='my-10'>
                <Cart deals={deals} />
              </div>)
              :
              (
                <div className="h-[65vh] flex flex-col justify-center  text-wrap text-center items-center text-zinc-200">
                  <h1 className="text-lg md:text-xl font-medium">No Deals Available</h1>
                  <p className="text-sm md:text-base text-zinc-300 mt-2">
                    Create your first escrow deal to get started.
                  </p>
                </div>
              )


            )
        }

      </div>
    ) : (
      <div className="md:h-[80vh] h-[77vh] flex items-center justify-center">
        <Banner
          title={'Connect Your Wallet'}
          subtitle={'Please connect your wallet to create and manage escrow deals.'}
        />
      </div>
    )

  )
}

export default Escrows