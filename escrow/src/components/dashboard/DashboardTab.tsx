"use client"

import React, { useEffect, useState } from 'react'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
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
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { LoadEscrow, loadTotalVotings } from "@/lib/LoadData"
import { useActiveAccount } from 'thirdweb/react'
import { Loader2, TableCellsMerge } from 'lucide-react'
import MyDeal from './MyDeal'
import MyVotes from './MyVotes'



export default function DashboardTab() {
  const account = useActiveAccount();

  const [activeTab, setActiveTab] = useState("My Deals")
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [totalVotes, setTotalVotes] = useState<any>([]);
  const dispatch = useDispatch();


  const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
  const provider = useSelector((state: RootState) => state?.escrow?.provider);
  const Deals = useSelector((state: RootState) => state?.escrow?.deals);
  const votes = useSelector((state: RootState) => state?.escrow?.votes);

  const isReady = escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

  useEffect(() => {
    const fetchEscrow = async () => {
      try {
        setIsLoading(true);
        if (isReady) {
          await LoadEscrow(escrowContract, provider, dispatch);
          await loadTotalVotings({ dispatch, escrowContract, provider });
        }
      } catch (err) {
        console.log("Failed to load escrow:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEscrow();
  }, [isReady]);

  useEffect(() => {
    if (Deals && Deals.length > 0) {
      const updateDeal = Deals.filter((deal: any) => deal?.deal?.buyer == account?.address)
      setDeals(updateDeal)
    }
  }, [Deals, account])

  useEffect(() => {
    if (votes && votes.length > 0) {
      const updatevotes = votes.filter((deal: any) => deal?.voterAddress == account?.address)
      setTotalVotes(updatevotes)
    }
  }, [votes, account])
 

  // const renderStatusBadge = (status: string) => {
  //   switch (status) {
  //     case "Paid":
  //       return <Badge className="bg-green-500/90 text-white px-3 py-1 rounded-full">Paid</Badge>
  //     case "Pending":
  //       return <Badge className="bg-yellow-500/90 text-white px-3 py-1 rounded-full">Pending</Badge>
  //     case "Failed":
  //       return <Badge className="bg-red-500/90 text-white px-3 py-1 rounded-full">Failed</Badge>
  //     default:
  //       return <Badge>{status}</Badge>
  //   }
  // }

  return (
    <div className="p-6 space-y-6">
      {/* Tabs */}
      <Tabs
        defaultValue="account"
        value={activeTab} onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="flex-col gap-3 bg-muted/40 p-2 mt-10  sm:mt-0 sm:flex-row rounded-xl w-fit">
          <TabsTrigger
            value="My Deals"
            className={`rounded-lg px-4 py-2 :bg-primary ${activeTab == "My Deals" && "bg-[#1d45fe]"} p-4  transition`}

          >
            My Deals
          </TabsTrigger>
          <TabsTrigger
            value="My Votes"
            className={`rounded-lg px-4 py-2 :bg-primary ${activeTab == "My Votes" && "bg-[#1d45fe]"} p-4  transition`}
          >
            My Votes
          </TabsTrigger>
          <TabsTrigger
            value="Stake History"
            className={`rounded-lg px-4 py-2 :bg-primary ${activeTab == "Stake History" && "bg-[#1d45fe]"} p-4  transition`}
          >
            Stake History
          </TabsTrigger>
        </TabsList>


        {isLoading ? (
          <div className='h-[65vh] flex justify-center items-center'>
            <Loader2 className="h-10 w-10 animate-spin text-[white]" />
          </div>
        ) : (
          <>
            <TabsContent value="My Deals" className="sm:mt-6 mt-32 mb-72" >
               <MyDeal deals={deals}/>
            </TabsContent>


            <TabsContent value="My Votes" className="sm:mt-6 mt-32 mb-72">
              <MyVotes totalVotes={totalVotes}/>
            </TabsContent>

            <TabsContent value="Stake History" className="sm:mt-6 mt-32 mb-72">
              <Card className="p-4 shadow-md rounded-2xl">
                <Table>
                  <TableCaption className="text-muted-foreground mb-5">
                    A list of placeholder invoices.
                  </TableCaption>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-[120px] font-semibold">#</TableHead>
                      <TableHead className="font-semibold">title</TableHead>
                      <TableHead className="font-semibold">Seller</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="text-right font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-muted/20 transition">
                      <TableCell className="w-[120px] font-semibold"> 1</TableCell>
                      <TableCell className="font-semibold"></TableCell>
                      <TableCell className="font-semibold">0x2D105F67EB276145f839153Dec67E46554a32Ea6 </TableCell>
                      <TableCell className="font-semibold">50 </TableCell>
                      <TableCell className="text-right font-semibold">completed </TableCell>
                    </TableRow>

                  </TableBody>
                  <TableFooter>
                    <TableRow className="bg-muted/30 font-medium">

                    </TableRow>
                  </TableFooter>
                </Table>
              </Card>
            </TabsContent>
          </>
        )
        }

      </Tabs>
    </div>
  )
}
