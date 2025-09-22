import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Guide1 = () => {
    return (
        <div>
            <div>
                <span className='pr-2'>1.</span>
                Escrow secures your deals with trustless transactions.
                <Link href={'/escrows'} className='text-[#1d45fe] hover:cursor-pointer'> Connect</Link> your wallet to start managing and creating escrow agreements effortlessly.
            </div>
            <div >
                <span className='pr-2'>2.</span>
                Explore all active deals
                <Link href={'/escrows'} className='text-[#1d45fe] hover:cursor-pointer'> here</Link>  and effortlessly manage your personal escrow agreements securely on Escrow platform.
                <Image src={'/deals.png'} alt='deal' width={3000} height={3000} className='my-5 hover:scale-105 duration-700 ' />
            </div>
            <div >
                <span className='pr-2'>3.</span>
                Securely deposit your funds into Escrow, wait for the specialist to deliver the product or service, confirm receipt once satisfied, and open a dispute if any issue arises
                <Image src={'/escrowdetail.png'} alt='deal' width={3000} height={3000} className='my-5 hover:scale-105  duration-700' />
            </div>
            <div >
                <span className='pr-2'>4.</span>
                Explore all open and closed disputes
                <Link href={'/arbitration'} className='text-[#1d45fe] hover:cursor-pointer'> here</Link>,  track the progress of each case, and review outcomes to stay informed about the status of every transaction
                <div className='flex justify-center'>
                    <Image src={'/dispute.png'} alt='dispute' width={300} height={300} className='my-5 hover:scale-105 duration-700 ' />
                </div>
            </div>
            <div >
                <span className='pr-2'>5.</span>
                Participate in the DAO and cast your vote for the client or specialist, assigning a specific weight to your decision.
                <Image src={'/disputedetail.png'} alt='disputre' width={3000} height={3000} className='my-5 hover:scale-105  duration-700' />
            </div>
        </div>
    )
}

export default Guide1