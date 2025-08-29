import Image from 'next/image'
import React from 'react'

const HowItWorks = () => {
    return (
        <div>

            {/* strangers section */}
            <div className='my-36 text-white flex justify-end'>
                <div className='md:w-1/2'>
                    <div className='md:w-[70%]'>
                        <h1 className=' lg:text-5xl text-4xl  font-extrabold pb-5'>
                            Trust strangers
                        </h1>
                        <h3 className='lg:text-2xl text-xl font-bold'>
                            Yes, trust even strangers, because you are protected
                        </h3>
                    </div>
                    <div className='md:hidden block py-10 justify-items-center'>
                        <Image src={'/lockcontract.png'} alt='Trust strangers' width={300} height={200} className='h-96 w-56' />

                    </div>
                    <div className='md:w-[90%] text-zinc-300 lg:text-[17px] text-sm'>
                        <p className='pt-10 pb-4'>
                            If you are a small business or an individual, you are normally cautious about dealing with companies or people you don't know. It can happen that you pay and they don't deliver, or you deliver and they don't pay, and the risks are especially high for cross-border deals. Legal protections exist but they are slow, cumbersome, and expensive. They really work only for the big guys.

                        </p>
                        <p>
                            Smart contracts are the solution. They provide a decentralized escrow where the funds are locked by the buyer for the full duration of the contract, and the buyer releases the funds to the seller only once they have received what they had paid for. If a dispute arises, the parties can invoke an arbriter who will study the evidence like a judge and release the funds to the winning party.
                        </p>
                    </div>

                </div>
                <div className='md:w-1/2 justify-items-end md:block hidden'>
                    <Image src={'/lockcontract.png'} alt='Trust strangers' width={300} height={400} />
                </div>
            </div>
            <div className='my-36 text-white flex md:flex-row flex-col bg-[#24292e] p-10 rounded-xl w-full'>
                <div className='md:w-3/4'>
                     <h1 className='lg:text-6xl sm:text-4xl text-3xl font-extrabold pb-2 pl-3 '>For small/medium businesses and P2P trade</h1>
                
                     <p className='pl-3 md:w-[90%] lg:text-[19px] text-sm pt-5'>Decentralized escrow is meant primarily for cross-border trade between small/medium businesses but it also works for domestic trade or trading high-value items between individuals, such as domain names, vehicles, real estate, art, collectibles, game assets, freelance work, etc.</p>
                </div>
                 <div className='md:w-1/4 md:justify-items-end justify-items-center md:mt-0 mt-8 '>
                     <Image src={'/escrowearth.svg'} alt='escro wearth' width={300} height={200} className='h-56 w-64' />
                 </div>
            </div>
        </div>
    )
}

export default HowItWorks