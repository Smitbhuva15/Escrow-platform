"use client"
import Banner from '@/components/banner/Banner';
import LeftSection from '@/components/escrowId/LeftSection';
import RightSection from '@/components/escrowId/RightSection';
import { LoadEscrow } from '@/lib/LoadData';
import { RootState } from '@/store/store';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useActiveAccount } from 'thirdweb/react';

const page = () => {

    const account = useActiveAccount();
    const dispatch = useDispatch();
    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(false)
    const [deal, setDeals] = useState<any>();

    const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
    const provider = useSelector((state: RootState) => state?.escrow?.provider);
    const Deals = useSelector((state: RootState) => state?.escrow?.deals);

    const isReady = escrowContract && Object.keys(escrowContract).length > 0 &&
        provider && Object.keys(provider).length > 0;

    useEffect(() => {
        if (Deals && Deals.length > 0) {
            const Deal = Deals.filter((deal: any) => (deal?.deal?.dealId) == id );
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
                <div className='h-[85vh] flex justify-center items-center'>
                    <Loader2 className="h-10 w-10 animate-spin text-[white]" />
                </div>
            )

                : (<div className='xl:max-w-5xl lg:max-w-4xl md:max-w-2xl sm:max-w-lg w-[90%] mx-auto text-white py-8 lg:flex lg:gap-16'>
                    <div className='lg:w-[50%]'>
                        <LeftSection deal={deal}/>
                    </div>
                    <div className='lg:w-[50%]'>
                        <RightSection deal={deal}/>
                    </div>
                </div>)
        ) : (
            <div className="h-[90vh] flex items-center justify-center">
                <Banner
                    title={'Connect Your Wallet'}
                    subtitle={'Please connect your wallet to create and manage escrow deals.'}
                />
            </div>
        )
    )
}

export default page