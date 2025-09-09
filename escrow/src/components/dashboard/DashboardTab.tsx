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
import { LoadEscrow } from "@/lib/LoadData"
import { useActiveAccount } from 'thirdweb/react'
import { TableCellsMerge } from 'lucide-react'



export default function DashboardTab() {
  const account = useActiveAccount();

  const [activeTab, setActiveTab] = useState("My Deals")
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch();


  const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
  const provider = useSelector((state: RootState) => state?.escrow?.provider);
  const Deals = useSelector((state: RootState) => state?.escrow?.deals);


  const isReady = escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

  useEffect(() => {
    const fetchEscrow = async () => {
      try {
        setIsLoading(true);
        if (isReady) {
          await LoadEscrow(escrowContract, provider, dispatch);
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
console.log(deals)

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
        <TabsList className="flex-col gap-3 bg-muted/40 p-2 sm:flex-row rounded-xl w-fit">
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


        {/* Account Tab */}
        <TabsContent value="My Deals" className="sm:mt-6 mt-32" >
          <Card className="p-4 shadow-md rounded-2xl" >
            <Table>
              <TableCaption className="text-muted-foreground">
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
                  deals.map((deal: any,index:number) => (
                    <TableRow className="hover:bg-muted/20 transition" key={index}>
                      <TableCell className="w-[120px] font-semibold">{index+1}</TableCell>
                      <TableCell className="font-semibold capitalize">{deal?.deal?.title}</TableCell>
                      <TableCell className="font-semibold">{`${deal?.deal?.seller.slice(0, 10)}...${deal?.deal?.seller.slice(-10)}`} </TableCell>
                      <TableCell className="font-semibold">{`${deal?.deal?.amount/1e18}`} </TableCell>
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
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="My Votes" className="sm:mt-6 mt-32">
          <Card className="p-4 shadow-md rounded-2xl">
            <Table>
              <TableCaption className="text-muted-foreground">
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

        <TabsContent value="Stake History" className="sm:mt-6 mt-32">
          <Card className="p-4 shadow-md rounded-2xl">
            <Table>
              <TableCaption className="text-muted-foreground">
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

      </Tabs>
    </div>
  )
}
