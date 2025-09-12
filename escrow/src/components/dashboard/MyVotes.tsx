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

const MyVotes = ({totalVotes}:any) => {
  return (
    <Card className="p-4 shadow-md rounded-2xl">
                <Table>
                  <TableCaption className="text-muted-foreground mb-5">
                    A list of my votes.
                  </TableCaption>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-[120px] font-semibold">#</TableHead>
                      <TableHead className="font-semibold">Vote</TableHead>
                      <TableHead className="text-right font-semibold">Stake(ETH)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      totalVotes.map((vote: any, index: number) => (
                        <TableRow className="hover:bg-muted/20 transition">
                          <TableCell className="w-[120px] font-semibold">{index + 1}</TableCell>

                          <TableCell className="font-semibold">{vote.support == true ? "Seller" : "Buyer"}</TableCell>
                          <TableCell className="text-right font-semibold">{vote.weight/1e18 } </TableCell>
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

export default MyVotes