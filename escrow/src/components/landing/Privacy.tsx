import Image from 'next/image'
import React from 'react'

const Privacy = () => {
    return (
        <div>
            <div className='mt-36 text-white flex items-center rounded-xl w-full'>
                <div className='md:w-2/3'>
                    <h1 className='lg:text-6xl sm:text-4xl text-3xl font-extrabold pb-8 '>Perfect privacy</h1>
                    <div className='md:hidden block  justify-items-center   '>
                        <Image src={'/privacy.svg'} alt='Perfect privacy' width={300} height={400} className='sm:h-72 sm:w-72 h-52 w-52' />
                    </div>
                    <div className=' md:w-[90%] lg:text-[18px] text-sm pt-5 leading-6 text-gray-300'>
                        <p className='pb-6'>When you make a contract, only you and your conterpart know its content. Even the Escryn doesn't know what your contract is about. The contract text is exchanged between you and your counterpart using Obyte's end-to-end encrypted messaging.</p>

                        <p className='pb-6'>If your contract completes successfully, nobody else learns its content (unless you or your counterpart decide to disclose it).</p>
                        <p className='pb-6'>If a dispute arises, the arbiter gets the unencrypted text of the contract from the claimant in order to be able to resolve the dispute. The arbiter is bound by their <span className='text-[#1d45fe]'>own privacy terms</span>.</p>
                        <p className='pb-6'>
                            Only if the losing party decides to appeal the arbiter's decision, only in this case will they disclose the contract text to the Escryn. The Escryn will never share it with any third parties unless required by law.</p>
                    </div>

                </div>
                <div className='md:w-1/3 md:block hidden justify-items-center md:mt-10 mt-8 '>
                    <Image src={'/privacy.svg'} alt='Perfect privacy' width={300} height={400} className='h-72 w-72' />
                </div>
            </div>

            <div>
                <div className='mb-24 mt-16  text-white flex items-center rounded-xl w-full'>
                    <div className='md:w-2/3'>
                        <h1 className='lg:text-6xl sm:text-4xl text-3xl font-extrabold pb-8 '>Decentralized custody</h1>
                        <div className='md:hidden block  justify-items-center   '>
                            <Image src={'/custody.svg'} alt='custody' width={300} height={400} className='sm:h-72 sm:w-72 h-52 w-52' />
                        </div>
                        <div className=' md:w-[90%] lg:text-[18px] text-sm pt-5 leading-6 text-gray-300'>
                            <p className='pb-6'>Neither the Escryn nor the arbiters custody the funds. The funds are escrowed by a smart contract deployed on a <span className='text-[#1d45fe]'>decentralized network</span>, and no third party can touch them, even the Escryn.</p>


                        </div>

                    </div>
                    <div className='md:w-1/3 md:block hidden justify-items-center md:mt-10 mt-8 '>
                        <Image src={'/custody.svg'} alt='custody' width={300} height={400} className='h-72 w-72' />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Privacy