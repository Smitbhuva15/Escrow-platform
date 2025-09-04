import { Loader2 } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'

const ProcessingLoader = () => {
    return (
        <Button
            className=" bg-[#1d45fe] hover:bg-[#1638d6] mt-3 py-5 px-4 rounded-lg  transition text-white cursor-not-allowed opacity-80 "
            disabled
        >
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
        </Button>
    )
}

export default ProcessingLoader