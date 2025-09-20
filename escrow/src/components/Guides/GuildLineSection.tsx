import React from 'react'
import {messages} from './FAQ'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


const GuildLineSection = () => {

  
  return (
    <div className=" space-y-4 ">
                <h1 className='md:px-10 sm:text-3xl text-xl font-bold'>Guidelines & Help</h1>
                {
                  messages.map((message) => (
                        <div className='md:px-20 '>
                            <div className='border-b-2'>
                                <Accordion type="single" collapsible >
                                    <AccordionItem value="item-1" className={" "}>
                                        <AccordionTrigger className='md:text-[22px] text-lg'>{message?.que}</AccordionTrigger>
                                        <AccordionContent className={'md:text-lg'}>
                                          {message?.ans}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    ))
                }

            </div>
  )
}

export default GuildLineSection