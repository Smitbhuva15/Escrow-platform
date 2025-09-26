import { AlertTriangle, Handshake, HeartHandshake, Medal, Scale, ShieldCheck, Snail, UserLock } from 'lucide-react'
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
                            Yes, trust even strangers,because your transactions are secure.
                        </h3>
                    </div>
                    <div className='md:hidden block py-10 justify-items-center'>
                        <Image src={'/secureboy.png'} alt='Trust strangers' width={300} height={200} className='h-96 w-56' />

                    </div>
                    <div className='md:w-[90%] text-zinc-300 lg:text-[17px] text-sm'>
                        <p className='pt-10 pb-4'>
                            Whether you are an individual or a small business, dealing with unknown parties can feel risky. You might pay and not get the service, or deliver your work and not get paid-especially in cross-border deals. Traditional legal protections exist, but they are slow, costly, and often favor larger players.
                        </p>
                        <p>
                            Smart contracts solve this problem. They act as decentralized escrow, holding funds safely until the agreed work is completed. The client releases the payment only when satisfied. If a dispute occurs, an arbitrator examines the evidence and decides who receives the funds, just like a neutral judge.
                        </p>
                    </div>

                </div>
                <div className='md:w-1/2 justify-items-end md:block hidden'>
                    <Image src={'/secureboy.png'} alt='Trust strangers' width={300} height={400} />
                </div>
            </div>
            <div className='my-36 text-white items-center flex md:flex-row flex-col bg-[#24292e] p-10 rounded-xl w-full'>
                <div className='md:w-3/4'>
                    <h1 className='lg:text-6xl sm:text-4xl text-3xl font-extrabold pb-2 pl-3 '>For SMEs and peer-to-peer trade</h1>

                    <p className='pl-3 md:w-[90%] lg:text-[19px] text-sm pt-5'>Decentralized escrow is designed mainly for cross-border transactions between small and medium businesses, but it also works for domestic trade or high-value deals between individuals. Examples include domain names, vehicles, real estate, art, collectibles, game assets, freelance projects, and more.</p>
                </div>
                <div className='md:w-1/4  justify-items-center md:mt-0 mt-8 '>
                    <Image src={'/escrowearth.png'} alt='escro wearth' width={300} height={200} className='h-56 w-64' />
                </div>
            </div>

            {/* How to start */}
            <div className='text-white my-36'>
                <h1 className='md:text-5xl text-4xl font-extrabold lg:w-[50%] sm:w-[70%]  pb-10 md:leading-14'>How to start using decentralized escrow</h1>
                <div className='lg:w-[65%] text-sm sm:text-lg text-zinc-300' >
                    <div className='flex items-center my-8 font-bold '>
                        <div className='bg-[#24292e] p-2 rounded '>
                            <HeartHandshake />
                        </div>
                        <div className='pl-4 '>
                            Two counter parties agree on terms (price, delivery, deadline, arbiter).
                        </div>
                    </div>
                    <div className='flex items-center my-8 font-bold '>
                        <div className='bg-[#24292e] p-2 rounded '>
                            <UserLock />
                        </div>
                        <div className='pl-4 '>
                            Client deposits funds into the  smart contract, funds are locked securely.
                        </div>
                    </div>
                     <div className='flex items-center my-8 font-bold '>
                        <div className='bg-[#24292e] p-2 rounded '>
                              <Snail />
                        </div>
                        <div className='pl-4 '>
                          Specialist delivers goods or services as per the agreement.
                        </div>
                    </div>
                    <div className='flex items-center my-8 font-bold '>
                        <div className='bg-[#24292e] p-2 rounded '>
                        <ShieldCheck />
                        </div>
                        <div className='pl-4 '>
                            Success story: both parties are satisfied with the outcome, the client releases the funds locked on the contract to the specialist.
                        </div>
                    </div>
                    <div className='flex items-center my-8 font-bold'>
                        <div className='bg-[#24292e] p-2 rounded '>
                            <AlertTriangle />

                        </div>
                        <div className='pl-4 '>
                           If there is a dispute, either party can escalate and request resolution.
                        </div>
                    </div>
                    <div className='flex items-center my-8 font-bold '>
                        <div className='bg-[#24292e] p-2 rounded '>
                            <Scale />
                        </div>
                        <div className='pl-4 '>
                            After studying the evidence, the arbiter publicly posts their decision thus resolving the dispute.
                        </div>
                    </div>
                     <div className='flex items-center my-8 font-bold '>
                        <div className='bg-[#24292e] p-2 rounded '>
                            <Medal />
                        </div>
                        <div className='pl-4 '>
                          The winner side claims the funds from the contract.
                        </div>
                    </div>
                      <div>
                        <p className='mt-10 text-sm font-semibold text-gray-400'>See more detailed description of the workflow in the <span className='text-[#8f614c] hover:text-[#a3694f]'><a href="/guides">user guide.</a></span></p>
                      </div>
                </div>
            </div>
        </div>
    )
}

export default HowItWorks