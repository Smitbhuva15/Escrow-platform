"use client"

import * as React from "react"
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


  
export default function DecoratedTabbedTables() {
  const [activeTab, setActiveTab] = React.useState("account")

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge className="bg-green-500/90 text-white px-3 py-1 rounded-full">Paid</Badge>
      case "Pending":
        return <Badge className="bg-yellow-500/90 text-white px-3 py-1 rounded-full">Pending</Badge>
      case "Failed":
        return <Badge className="bg-red-500/90 text-white px-3 py-1 rounded-full">Failed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Tabs */}
      <Tabs
        defaultValue="account"
        onValueChange={(val) => setActiveTab(val)}
        className="w-full"
      >
        <TabsList className="flex-col gap-3 bg-muted/40 p-2 sm:flex-row rounded-xl w-fit">
          <TabsTrigger
            value="My Deals"
            className="rounded-lg px-4 py-2 :bg-primary bg-[#1d45fe] p-4  transition"
          >
            My Deals
          </TabsTrigger>
          <TabsTrigger
            value="My Votes"
            className="rounded-lg px-4 py-2 :bg-primary bg-[#1d45fe] p-4  transition"
          >
            My Votes
          </TabsTrigger>
           <TabsTrigger
            value="Stake History"
            className="rounded-lg px-4 py-2 :bg-primary bg-[#1d45fe] p-4 transition"
          >
            Stake History
          </TabsTrigger>
        </TabsList>


        {/* Account Tab */}
        <TabsContent value="My Deals" className="sm:mt-6 mt-32">
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
