
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Guide1 from './Guide1'
import Guide2 from './Guide2'


const GuidSection1 = () => {
    return (
        <section className=" my-8 ">
            <div className="rounded-2xl bg-[#131519]   shadow-md">
                <p className="text-white md:text-xl leading-relaxed ">
                    Welcome to Escryn! Explore this guide to learn how to stake, vote, and resolve disputes with confidence.
                </p>
                <div className='border my-7 border-e-white'></div>
                <h2 className='text-white text-2xl md:text-4xl font-bold my-4'>Deal Flow</h2>
                <div className='flex justify-center'>
                    <Image
                        src="/DealFlowChart.png"
                        alt="Deals Flow"
                        width={850}
                        height={768}
                        className='mb-10 '
                    />
                </div>
                <div className='border my-7 border-e-white'></div>
                <div className=' text-white md:text-xl space-y-4 leading-relaxed my-6'>
                    <Guide1 />
                    <Guide2 />
                </div>
            </div>
        </section>
    )
}

export default GuidSection1