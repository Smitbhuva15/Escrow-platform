import GuidSection1 from '@/components/Guides/GuidSection1'
import GuildLineSection from '@/components/Guides/GuildLineSection'
import React from 'react'



const Guides = () => {
  return (
    <div className='xl:max-w-5xl lg:max-w-4xl md:max-w-2xl sm:max-w-lg w-[90%] mx-auto text-white py-8'>
      <div className="text-4xl md:text-5xl text-[#1d45fe] font-extrabold mb-6">
       Escrow
      </div>
      <div>
        <GuidSection1 />
         <div className='border my-18 border-e-white'></div>
        <GuildLineSection />
      </div>
    </div>
  )
}

export default Guides