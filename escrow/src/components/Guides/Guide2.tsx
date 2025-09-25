import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Guide2 = () => {
    return (
        <div>
            <div >
                <span className='pr-2'>6.</span>
                Stake your ETH
                <Link href={'/stake'} className='text-[#1d45fe] hover:cursor-pointer'> here</Link>   to gain voting power, participate in decision-making, support the client or specialist, help shape dispute outcomes, and unstake your ETH directly from the Escryn platform
                <Image src={'/stake.png'} alt='stakeETH' width={3000} height={3000} className='my-5 hover:scale-105 duration-700 ' />
            </div>
            <div >
                <span className='pr-2'>7.</span>
                View all your deals
                <Link href={'/dashboard'} className='text-[#1d45fe] hover:cursor-pointer'> here</Link>  including those you’ve created in the past and those currently active, with detailed status updates to track every stage of each transaction on Escryn.
                <Image src={'/mydeal.png'} alt='mydeal' width={3000} height={3000} className='my-5 hover:scale-105 duration-700 ' />
            </div>
            <div >
                <span className='pr-2'>8.</span>
                View all the votes you’ve cast on specific disputes
                <Link href={'/dashboard'} className='text-[#1d45fe] hover:cursor-pointer'> here</Link>,   and once a dispute is resolved, unlock your staked funds directly from the Escryn platform.
                <Image src={'/myvotes.png'} alt='myvotes' width={3000} height={3000} className='my-5 hover:scale-105 duration-700 ' />
            </div>
            <div >
                <span className='pr-2'>9.</span>
                View your complete stake and unstake history
                <Link href={'/dashboard'} className='text-[#1d45fe] hover:cursor-pointer'> here</Link>,  to track every transaction, monitor your ETH movements, and stay informed about your participation on the Escryn.
                <Image src={'/stakehistory.png'} alt='mystake' width={3000} height={3000} className='my-5 hover:scale-105 duration-700 ' />
            </div>
            <div >
                <span className='pr-2'>10.</span>
                Admin can adjust the number of dispute voting days, modify the quorum threshold, and change the platform fee
                <Link href={'/admin'} className='text-[#1d45fe] hover:cursor-pointer'> here</Link>, providing flexibility to manage voting periods, participation requirements, and transaction charges across the entire system.
                <Image src={'/admin.png'} alt='mystake' width={3000} height={3000} className='my-5 hover:scale-105 duration-700 ' />
            </div>
        </div>
    )
}

export default Guide2