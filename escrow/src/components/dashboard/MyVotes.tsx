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

const handelUnstake = (disputedId: string) => {
  console.log(disputedId)
}

const MyVotes = ({ totalVotes }: any) => {
  console.log(totalVotes)
  return (
    <Card className="p-4 shadow-md rounded-2xl">
      <Table>
        <TableCaption className="text-muted-foreground pb-2">
          A list of my votes
        </TableCaption>

        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-[80px] font-semibold">#</TableHead>
            <TableHead className="font-semibold">Voted For</TableHead>
            <TableHead className=" font-semibold">Staked Amount</TableHead>
            <TableHead className=" font-semibold">Dispute Status</TableHead>
            <TableHead className=" font-semibold text-right" >Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {totalVotes.map((vote: any, index: number) => (
            <TableRow
              key={index}
              className="hover:bg-muted/20 transition"
            >
              <TableCell className="w-[80px] font-semibold">
                {index + 1}
              </TableCell>

              <TableCell className="font-semibold">
                {vote.support === true ? "Seller" : "Buyer"}
              </TableCell>

              <TableCell className=" font-semibold">
                {`${vote.weight / 1e18 }  ETH`}   
              </TableCell>

              {/* <TableCell className=" font-semibold">
              {vote?.dispute?.dispute?.closed==1 ?}
              </TableCell> */}
              <TableCell className='' >  <span
                className={`px-3 py-1 rounded-full text-right text-xs font-medium ${vote?.dispute?.dispute?.closed == 1 ? "bg-rose-500 text-white"
                  : "bg-emerald-500 text-white"
                  }`}
              >
                {vote?.dispute?.dispute?.closed == 1
                  ? "Closed" : "Open"}
              </span></TableCell>

              <TableCell className="text-right">
                <button
                  className="px-3 py-1 text-sm font-medium rounded-lg bg-[#1d45fe] hover:bg-[#1638d6] text-white transition-colors"
                  onClick={() => { handelUnstake(vote?.disputedId) }}
                >
                  Unlock Stake
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow className="bg-muted/30 font-medium" />
        </TableFooter>
      </Table>
    </Card>

  )
}

export default MyVotes