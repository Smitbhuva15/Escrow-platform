import React from 'react'
import { Card } from "@/components/ui/card"
import {
    Table,
    TableCaption,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    TableFooter,
} from "@/components/ui/table"

const MyStake = ({ stakeHistory }: any) => {
    return (
        <Card className="p-4 shadow-md rounded-2xl max-w-2xl mx-auto">
            <Table>
                <TableCaption className="text-muted-foreground pb-2">
                    A list of my Funds History
                </TableCaption>
                <TableHeader>
                    <TableRow className="bg-muted/30">
                        <TableHead className="w-[120px] font-semibold">#</TableHead>
                        <TableHead className="font-semibold">Method</TableHead>
                        <TableHead className="font-semibold">Amount</TableHead>
                        <TableHead className="text-right font-semibold">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        stakeHistory.map((stake: any, index: number) => (
                            <TableRow
                                key={index}
                                className="hover:bg-muted/20 transition"
                            >
                                <TableCell className="w-[80px] font-semibold">
                                    {index + 1}
                                </TableCell>
                                <TableCell className=" font-semibold">
                                    {stake?.method}
                                </TableCell>
                                <TableCell className=" font-semibold py-3">
                                    {`${stake.amount / 1e18}  ETH`}
                                </TableCell>
                                <TableCell className='text-right'>
                                    <span className="px-3 py-1 rounded-full  text-xs font-medium
                                     bg-emerald-500 text-white  text-right ">
                                     completed
                                    </span>
                                   
                                </TableCell>
                            </TableRow>
                        ))
                    }

                </TableBody>
                <TableFooter>
                    <TableRow className="bg-muted/30 font-medium">

                    </TableRow>
                </TableFooter>
            </Table>
        </Card>
    )
}

export default MyStake