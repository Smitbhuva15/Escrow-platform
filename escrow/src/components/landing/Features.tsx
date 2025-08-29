import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Features = () => {
    return (
        <div>
            <div className='mb-24 mt-16  text-white flex items-center rounded-xl w-full'>
                <div className='md:w-2/3'>
                    <h1 className='lg:text-5xl sm:text-4xl text-3xl font-extrabold pb-8 md:leading-14'>Truly global and unstoppable, no borders, no middlemen</h1>
                    <div className='md:hidden block  justify-items-center   '>
                        <Image src={'/escrowboy.svg'} alt='custody' width={300} height={400} className='sm:h-72 sm:w-72 h-52 w-52' />
                    </div>
                    <div className=' md:w-[90%] lg:text-[18px] text-sm pt-5 leading-6 text-gray-300'>
                        <p className='pb-6'>Since the title:ArbStore works on top of a <span className='text-[#1d45fe]'>truly permissionless cryptocurrency platform</span>, nobody can ever stop, block, restrict, or intervene with your transactions. There are no intermediaries like banks, SWIFT, or credit card systems. Even the title:ArbStore itself is not an intermediary and can't intervene with your business.</p>
                        <p className='pb-6'>title:ArbStore takes a 1% cut from every contract it facilitates.</p>

                    </div>

                </div>
                <div className='md:w-1/3 md:block hidden justify-items-center md:mt-10 mt-8 '>
                    <Image src={'/escrowboy.svg'} alt='custody' width={300} height={400} className='h-72 w-72' />
                </div>
            </div>
            <div className='my-36 text-white items-center flex md:flex-row flex-col bg-[#24292e] p-10 rounded-xl w-full'>
                <div className='md:w-2/3 w-full'>
                    <h1 className='lg:text-6xl sm:text-4xl text-3xl font-extrabold pb-2 pl-3 '>If you want to become an arbiter</h1>

                    <h3 className='pl-3 md:w-[90%]  lg:text-3xl sm:text-2xl text-lg font-bold  pt-5'>Stake to secure your role as an arbiter in our network.</h3>
                    <button className="mt-7 bg-[#1d45fe] text-white font-semibold rounded-full px-6 py-3 hover:bg-[#1638d6] transition">
                        <Link href={'/stake'}>Join as Arbiter</Link>
                    </button>
                </div>
                <div className='md:w-1/3   justify-items-center md:mt-0 mt-8 '>
                    <Image src={'/coin.svg'} alt='escro wearth' width={300} height={200} className='h-72 w-72' />
                </div>
            </div>
        </div>
    )
}

export default Features

// 131519