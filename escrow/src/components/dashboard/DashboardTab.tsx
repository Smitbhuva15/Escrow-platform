"use client"
import React, { useEffect, useState } from 'react'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { loadDispute, LoadEscrow, loadStakeAndUnStakeHistory, loadTotalVotings, loadUnlockStake } from "@/lib/LoadData"
import { useActiveAccount } from 'thirdweb/react'
import { Loader2 } from 'lucide-react'
import MyDeal from './MyDeal'
import MyVotes from './MyVotes'
import MyStake from './MyStake'
import { DealVote, SingledealType, singledisputeType, stakeDetails } from '@/lib/types'


export default function DashboardTab() {
  const account = useActiveAccount();

  const [activeTab, setActiveTab] = useState("My Deals")
  const [deals, setDeals] = useState<SingledealType[]>([]);
  const [stakeHistory, setStakeHistory] = useState<stakeDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [totalVotes, setTotalVotes] = useState<any>([]);
  const dispatch = useDispatch();

  const escrowContract = useSelector((state: RootState) => state?.escrow?.EscrowContract);
  const provider = useSelector((state: RootState) => state?.escrow?.provider);
  const Deals = useSelector((state: RootState) => state?.escrow?.deals);
  const votes = useSelector((state: RootState) => state?.escrow?.votes);
  const disputes = useSelector((state: RootState) => state?.escrow?.disputes);
  const StakeHistory = useSelector((state: RootState) => state?.escrow?.StakeHistory);
  const unlockfunds = useSelector((state: RootState) => state?.escrow?.unlockfunds);



  const isReady = escrowContract && Object.keys(escrowContract).length > 0 &&
    provider && Object.keys(provider).length > 0;

  useEffect(() => {
    const fetchEscrow = async () => {
      try {
        setIsLoading(true);
        if (isReady) {
          await LoadEscrow(escrowContract, provider, dispatch);
          await loadTotalVotings({ dispatch, escrowContract, provider });
          await loadDispute({ dispatch, escrowContract, provider })
          await loadStakeAndUnStakeHistory({ dispatch, escrowContract, provider })
          await loadUnlockStake({ dispatch, escrowContract, provider })

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
      const updateDeal = Deals.filter((deal: SingledealType) => deal?.deal?.client == account?.address)
      setDeals(updateDeal)
    }
  }, [Deals, account])

  useEffect(() => {
    if (votes && votes.length > 0 && disputes && disputes.length > 0 && unlockfunds) {
      const updatedVoting = votes.map((vote: DealVote) => {
        const dispute = disputes.filter((dispute: singledisputeType) => dispute?.dispute?.disputedId == vote.disputedId);

        const isUnlock = unlockfunds.find((fund: any) => Number(fund?.disputedId) === Number(vote.disputedId))

        return {
          "dealId": vote?.dealId,
          "disputedId": vote?.disputedId,
          "support": vote?.support,
          "voterAddress": vote?.voterAddress,
          "weight": vote?.weight,
          dispute: dispute[0],
          isUnlock: !!isUnlock,
        }
      })
      const updatevotes = updatedVoting.filter((deal: any) => deal?.voterAddress == account?.address)
      setTotalVotes(updatevotes)
    }
  }, [votes, account, disputes, unlockfunds])

  useEffect(() => {
    if (StakeHistory && StakeHistory.length > 0) {
      const updateStakeHistory = StakeHistory.filter((deal: stakeDetails) => deal?.address == account?.address)
      setStakeHistory(updateStakeHistory)
    }
  }, [StakeHistory, account])


  return (
    <div className="p-6 space-y-6">
      {/* Tabs */}
      <Tabs
        defaultValue="account"
        value={activeTab} onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="flex-col gap-3 bg-muted/40 p-2 mt-10  sm:mt-0 sm:flex-row rounded-xl w-fit sm:m-0 mx-auto">
          <TabsTrigger
            value="My Deals"
            className={`rounded-lg px-4 py-2 :bg-primary ${activeTab == "My Deals" ? "bg-[#1d45fe]" : "border shadow-xs shadow-amber-50"} p-4  transition`}

          >
            My Deals
          </TabsTrigger>
          <TabsTrigger
            value="My Votes"
            className={`rounded-lg px-4 py-2 :bg-primary ${activeTab == "My Votes" ? "bg-[#1d45fe]" : "border shadow-xs shadow-amber-50"} p-4   transition`}
          >
            My Votes
          </TabsTrigger>
          <TabsTrigger
            value="Stake History"
            className={`rounded-lg px-4 py-2 :bg-primary ${activeTab == "Stake History" ? "bg-[#1d45fe]" : "border shadow-xs shadow-amber-50"} p-4  transition`}
          >
            Funds History
          </TabsTrigger>
        </TabsList>


        {isLoading ? (
          <div className='h-[65vh] flex justify-center items-center'>
            <Loader2 className="h-10 w-10 animate-spin text-[white]" />
          </div>
        ) : (
          <>
            {
              deals && deals.length > 0 ? (
                <TabsContent value="My Deals" className="sm:mt-6 mt-32 mb-72" >
                  <MyDeal deals={deals} />
                </TabsContent>

              ) : (
                <div className={`h-[55vh] flex flex-col justify-center  text-wrap text-center items-center text-zinc-200 ${activeTab == "My Deals" ? "" : "hidden"}`}>
                  <h1 className="text-lg md:text-xl font-medium">No Deals Available</h1>
                  <p className="text-sm md:text-base text-zinc-300 mt-2">
                    Create your first escrow deal to get started.
                  </p>
                </div>
              )
            }


            {
              totalVotes && totalVotes.length > 0 ? (

                <TabsContent value="My Votes" className="sm:mt-6 mt-32 mb-72">
                  <MyVotes totalVotes={totalVotes} />
                </TabsContent>

              ) : (
                <div className={`h-[55vh] flex flex-col justify-center  text-wrap text-center items-center text-zinc-200 ${activeTab == "My Votes" ? "" : "hidden"}`}>
                  <h1 className="text-lg md:text-xl font-medium">Cast Your First Vote</h1>
                  <p className="text-sm md:text-base text-zinc-300 mt-2">
                    Join the decision-making process by voting on a proposal to get started.
                  </p>
                </div>
              )
            }



            {
              stakeHistory && stakeHistory.length > 0 ? (

                <TabsContent value="Stake History" className="sm:mt-6 mt-32 mb-72">
                  <MyStake stakeHistory={stakeHistory} />
                </TabsContent>

              ) : (
                <div className={`h-[55vh] flex flex-col justify-center  text-wrap text-center items-center text-zinc-200 ${activeTab == "Stake History" ? "" : "hidden"}`}>
                  <h1 className="text-lg md:text-xl font-medium">Your Staking Journey Awaits</h1>
                  <p className="text-sm md:text-base text-zinc-300 mt-2">
                    Stake ETH now to begin your voting history.
                  </p>
                </div>
              )
            }

          </>
        )
        }

      </Tabs>
    </div>
  )
}
