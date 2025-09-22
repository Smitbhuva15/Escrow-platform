import React, { useState } from 'react'
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
import { handelUnlockStake } from '@/lib/LoadData'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Loader2 } from 'lucide-react'
import { Toaster } from 'react-hot-toast'


const MyVotes = ({ totalVotes }: any) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(-1)

  const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
  const provider = useSelector((state: RootState) => state?.escrow?.provider);


  const handelUnstake = async (disputedId: string, index: Number) => {
    await handelUnlockStake({
      dispatch,
      escrowContract,
      provider,
      disputeId: Number(disputedId),
      setIsLoading,
      index
    })
  }
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
            <TableHead className=" font-semibold">Vote Weight</TableHead>
            <TableHead className=" font-semibold"> Quorum Target</TableHead>
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
                {vote.support === true ? "Specialist" : "Client"}
              </TableCell>

              <TableCell className=" font-semibold py-3">
                {`${vote.weight / 1e18}  ETH`}
              </TableCell>
              <TableCell className=" font-semibold">
                {`${vote?.dispute?.dispute?.quorumTarget / 1e18}  ETH`}
              </TableCell>
              <TableCell className='' >  <span
                className={`px-3 py-1 rounded-full text-right text-xs font-medium ${vote?.dispute?.dispute?.closed == 1 ? "bg-rose-500 text-white"
                  : "bg-emerald-500 text-white"
                  }`}
              >
                {vote?.dispute?.dispute?.closed == 1
                  ? "Closed" : "Open"}
              </span>
              </TableCell>

              <TableCell>
                <div className="flex justify-end items-center gap-2">
                  {isLoading == index ? (
                    <>
                      <div className='flex text-white bg-[#1d45fe] hover:bg-[#1638d6] font-semibold py-1 px-3 cursor-not-allowed opacity-80 gap-2 text-sm rounded-lg disabled shadow-md transition-all'>
                        <Loader2 className="h-5 w-5 animate-spin " />
                        <span className='flex'>Processing...</span>
                      </div>

                    </>
                  ) : (
                    <button
                      className="px-3 py-1 text-sm font-medium rounded-lg bg-[#1d45fe] hover:bg-[#1638d6] text-white transition-colors"
                      onClick={() => handelUnstake(vote?.disputedId, index)}
                    >
                      Unlock Stake
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow className="bg-muted/30 font-medium" />
        </TableFooter>
      </Table>
      <Toaster position="bottom-right" reverseOrder={false} />
    </Card>

  )
}

export default MyVotes