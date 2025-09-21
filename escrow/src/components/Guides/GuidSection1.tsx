import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const GuidSection1 = () => {
    return (
        <section className=" my-8 ">
            <div className="rounded-2xl bg-[#131519]   shadow-md">

                <p className="text-gray-300 md:text-xl leading-relaxed ">
                    Welcome to Escrow! Explore this guide to learn how to stake, vote, and resolve disputes with confidence.
                </p>
                <div className='border my-7 border-e-white'></div>
                <div className=' text-gray-300 md:text-xl space-y-4 leading-relaxed my-6'>
                    <div>
                        <span className='pr-2'>1.</span>
                        Escrow secures your deals with trustless transactions.
                        <Link href={'/escrows'} className='text-[#1d45fe] hover:cursor-pointer'> Connect</Link> your wallet to start managing and creating escrow agreements effortlessly.
                    </div>
                    <div >
                        <span className='pr-2'>2.</span>
                        Explore all active deals
                        <Link href={'/escrows'} className='text-[#1d45fe] hover:cursor-pointer'> here</Link>  and effortlessly manage your personal escrow agreements securely on Escrow platform.
                        <Image src={'/deals.png'} alt='deal' width={3000} height={3000} className='my-5'/>
                    </div> 
                </div>

            </div>
        </section>
    )
}

export default GuidSection1