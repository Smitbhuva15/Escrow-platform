import { Loader2 } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'

const ProcessingLoader = () => {
    return (
        <button
            className=" bg-[#8f614c] hover:bg-[#a3694f] mt-3  px-4 cursor-not-allowed opacity-80 w-full  text-white font-semibold py-3 rounded-xl transition flex justify-center items-center gap-2"
            disabled
        >
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
        </button>
    )
}

export default ProcessingLoader