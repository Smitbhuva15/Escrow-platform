import { dealStatus } from '@/config/config'
import React from 'react'


const TimeLine: React.FC<{ deal: any }> = ({ deal }) => {

    return (
        <div className='my-16'>
            <div className="w-full max-w-3xl mx-auto py-6">

                <h2 className="text-center sm:text-2xl text-xl font-semibold text-white mb-8">
                    Deal Progress Timeline
                </h2>
                {/* Desktop - Horizontal Timeline */}
                <div className="hidden md:flex items-center justify-between">
                    {
                        dealStatus.map((singalDeal, index) => (
                            <>
                                {
                                    singalDeal?.rank > 1 && (
                                        <div className="flex-1 h-[2px] bg-gray-600 mx-2" key={index} />
                                    )
                                }
                                <div className="flex items-center space-x-2" key={index}>
                                    {
                                        deal?.status >= singalDeal?.rank ? (
                                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500 text-white text-sm">✔</div>
                                        ) : (
                                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-700 text-gray-400">○</div>
                                        )
                                    }
                                    <span className="text-sm text-gray-300">{singalDeal?.name}</span>
                                </div>
                            </>
                        ))
                    }
                    {
                        deal?.status <= 4 ? (
                            <>
                                <div className="flex-1 h-[2px] bg-gray-600 mx-2" />
                                <div className="flex items-center space-x-2">
                                    {
                                        deal?.status >= 4 ? (
                                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500 text-white text-sm">✔</div>
                                        ) : (
                                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-700 text-gray-400">○</div>
                                        )
                                    }
                                    <span className="text-sm text-gray-300">Completed </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex-1 h-[2px] bg-gray-600 mx-2" />
                                <div className="flex items-start space-x-3">
                                    {
                                        deal?.status >= 5 ? (
                                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500 text-white text-sm">✔</div>
                                        ) : (
                                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-700 text-gray-400">○</div>
                                        )
                                    }
                                    <span className="text-sm text-gray-300"> Disputed</span>
                                </div>
                                <div className="flex-1 h-[2px] bg-gray-600 mx-2" />
                                <div className="flex items-start space-x-3">
                                    {
                                        deal?.status >= 6 ? (
                                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500 text-white text-sm">✔</div>
                                        ) : (
                                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-700 text-gray-400">○</div>
                                        )
                                    }
                                    <span className="text-sm text-gray-300">Resolved</span>
                                </div>
                            </>
                        )
                    }


                </div>

                {/* Mobile - Vertical Timeline */}
                <div className="flex flex-col justify-center items-center space-y-6 md:hidden">
                    {
                        dealStatus.map((singalDeal, index) => (
                            <>
                            {
                                singalDeal?.rank>1 &&(
                                      <div className="h-6 border-l-2 border-gray-600 ml-3" key={index}/>
                                )
                            }
                            <div className="flex items-start space-x-3" key={index}>
                                {
                                    deal?.status >= singalDeal?.rank ? (
                                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500 text-white text-sm">✔</div>
                                    ) : (
                                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-700 text-gray-400">○</div>
                                    )
                                }
                                <span className="text-sm text-gray-300">{singalDeal?.name}</span>
                            </div>
                            </>
                        ))
                    }      
                    {
                        deal?.status <= 4 ? (
                            <>
                                <div className="h-6 border-l-2 border-gray-600 ml-3" />
                                <div className="flex items-start space-x-3">
                                    {
                                        deal?.status >= 4 ? (
                                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500 text-white text-sm">✔</div>
                                        ) : (
                                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-700 text-gray-400">○</div>
                                        )
                                    }
                                    <span className="text-sm text-gray-300">Completed</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="h-6 border-l-2 border-gray-600 ml-3" />
                                <div className="flex items-start space-x-3">
                                    {
                                        deal?.status >= 5 ? (
                                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500 text-white text-sm">✔</div>
                                        ) : (
                                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-700 text-gray-400">○</div>
                                        )
                                    }
                                    <span className="text-sm text-gray-300">Disputed</span>
                                </div>
                                <div className="h-6 border-l-2 border-gray-600 ml-3" />
                                <div className="flex items-start space-x-3">
                                    {
                                        deal?.status >= 6 ? (
                                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500 text-white text-sm">✔</div>
                                        ) : (
                                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-700 text-gray-400">○</div>
                                        )
                                    }
                                    <span className="text-sm text-gray-300">Resolved</span>
                                </div>
                            </>
                        )
                    }


                </div>
            </div>

        </div>
    )
}

export default TimeLine