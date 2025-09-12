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

const MyDeal = ({deals}:any ) => {
 
    return (
        <Card className="p-4 shadow-md rounded-2xl" >
            <Table>
                <TableCaption className="text-muted-foreground pb-2">
                    A list of your deals.
                </TableCaption>
                <TableHeader>
                    <TableRow className="bg-muted/30">
                        <TableHead className="w-[120px] font-semibold">#</TableHead>
                        <TableHead className="font-semibold">title</TableHead>
                        <TableHead className="font-semibold">Seller</TableHead>
                        <TableHead className="font-semibold">Amount (ETH)</TableHead>
                        <TableHead className="text-right font-semibold">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        deals.map((deal: any, index: number) => (
                            <TableRow className="hover:bg-muted/20 transition" key={index}>
                                <TableCell className="w-[120px] font-semibold">{index + 1}</TableCell>
                                <TableCell className="font-semibold capitalize">{deal?.deal?.title}</TableCell>
                                <TableCell className="font-semibold">{`${deal?.deal?.seller.slice(0, 10)}...${deal?.deal?.seller.slice(-10)}`} </TableCell>
                                <TableCell className="font-semibold">{`${deal?.deal?.amount / 1e18}`} </TableCell>
                                <TableCell className='text-right' >  <span
                                    className={`px-3 py-1 rounded-full text-right text-xs font-medium ${deal?.deal?.status == 1
                                        ? "bg-gray-600 text-white"
                                        : deal?.deal?.status == 2
                                            ? "bg-indigo-500 text-white"
                                            : deal?.deal?.status == 3
                                                ? "bg-slate-400 text-black"
                                                : deal?.deal?.status == 4
                                                    ? "bg-emerald-500 text-white"
                                                    : deal?.deal?.status == 5
                                                        ? "bg-rose-500 text-white"
                                                        : "bg-purple-800 text-white"
                                        }`}
                                >
                                    {deal?.deal?.status == 1
                                        ? "Created"
                                        : deal?.deal?.status == 2
                                            ? "Funded"
                                            : deal?.deal?.status == 3
                                                ? "Delivered"
                                                : deal?.deal?.status == 4
                                                    ? "Confirmed"
                                                    : deal?.deal?.status == 5
                                                        ? "Disputed"
                                                        : "Resolved"}
                                </span></TableCell>
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

export default MyDeal