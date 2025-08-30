import React from 'react'

type bannerType = {
    title: String;
    subtitle: String;
}

const Banner = ({title,subtitle}:bannerType) => {
  return (
    <div className='text-zinc-100'>
        <div className='md:text-5xl text-3xl font-extrabold pb-3 text-center'>
            {title}
        </div>
        <div className='md:text-xl font-bold text-center '>
            {subtitle}
        </div>
    </div>
  )
}

export default Banner