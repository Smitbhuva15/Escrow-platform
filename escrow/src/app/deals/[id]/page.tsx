"use client"
import Banner from '@/components/banner/Banner';
import LeftSection from '@/components/escrowId/LeftSection';
import RightSection from '@/components/escrowId/RightSection';
import TimeLine from '@/components/escrowId/TimeLine';
import { Loader } from '@/components/ui/Loader';
import { LoadEscrow } from '@/lib/LoadData';
import { DealType, SingledealType } from '@/lib/types';
import { RootState } from '@/store/store';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useActiveAccount } from 'thirdweb/react';

const page = () => {

    const account = useActiveAccount();
    const dispatch = useDispatch();
     const { id } = useParams<{ id: string }>()
      const numericId = id ? Number(id) : undefined;

    const [isLoading, setIsLoading] = useState(true)
    const [deal, setDeals] = useState<DealType>();
   
    const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
    const provider = useSelector((state: RootState) => state?.escrow?.provider);
    const Deals = useSelector((state: RootState) => state?.escrow?.deals);

    const isReady = escrowContract && Object.keys(escrowContract).length > 0 &&
        provider && Object.keys(provider).length > 0;

    useEffect(() => {
        if (Deals && Deals.length > 0) {
            const Deal = Deals.filter((deal: SingledealType) => (deal?.deal?.dealId) == numericId);
            
            setDeals(Deal[0].deal);
        }
    }, [Deals])

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
            isLoading ? (
                <div className='md:h-[85vh] h-[82vh] flex justify-center items-center'>
                    <Loader />
                </div>
            )
                : (
                    <div className='xl:max-w-5xl lg:max-w-4xl min-h-screen md:max-w-2xl sm:max-w-lg w-[90%] mx-auto text-white py-8 '>
                        <div className='lg:flex lg:gap-16'>
                            <div className='lg:w-[50%]'>
                                <LeftSection deal={deal} section='deal'/>
                            </div>
                            <div className='lg:w-[50%]'>
                                <RightSection deal={deal!} />
                            </div>
                        </div>
                        <div>
                            <TimeLine deal={deal!}/>
                        </div>
                    </div>
                )
        ) : (
            <div className="md:h-[80vh] h-[77vh]  flex items-center justify-center">
                <Banner
                    title={'Connect Your Wallet'}
                    subtitle={'Please connect your wallet to create and manage escrow deals.'}
                />
            </div>
        )
    )
}

export default page