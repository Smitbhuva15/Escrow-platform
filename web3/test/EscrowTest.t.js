const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Escrow", () => {
  let transaction, result, deployer, seller, buyer, user;

  const tokens = (amount) => {
    return ethers.utils.parseEther(amount.toString());
  }

  beforeEach(async () => {
    [deployer, seller, buyer, user] = await ethers.getSigners();
    Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy();
    await escrow.deployed();

    transaction = await escrow.connect(buyer).dealCreation(seller.address, "ui design", "design ui for web3 webiste", tokens(1), 7);
    result = await transaction.wait();

  });

  // describe("onlyOwnerAceess", () => {
  //   it("check owner", async () => {
  //     const deploy = await escrow.connect(buyer).owner();
  //     expect(deploy).to.be.equal(deployer.address);
  //   })


  //   describe("success", () => {

  //     it("set voting days", async () => {
  //       transaction = await escrow.connect(deployer).setvotingDay(100);
  //       result = await transaction.wait();
  //       const votingday = await escrow.connect(deployer).votingDays();
  //       expect(votingday).to.be.equal(100 * 60 * 60 * 24);
  //     })

  //     it("set minmum vote weight Percentage", async () => {
  //       transaction = await escrow.connect(deployer).setminmumvotedweightPercentage(70);
  //       result = await transaction.wait();
  //       const Percentage = await escrow.connect(deployer).minmumvotedweightPercentage();
  //       expect(Percentage).to.be.equal(70);
  //     })

  //   })

  //   describe("faliure",()=>{
  //     it("handel only owner revert in set voting Day", async () => {
  //     await expect(escrow.connect(buyer).setvotingDay(100)).to.be.reverted;
  //     })

  //     it("handel only owner revert in set minmum vote weight Percentage", async () => {
  //     await expect(escrow.connect(buyer).setminmumvotedweightPercentage(100)).to.be.reverted;
  //     })
  //   })

  // })

  // describe("stake", () => {
  //   describe("success", () => {

  //     beforeEach(async () => {
  //       transaction = await escrow.connect(buyer).stake({ value: tokens(1) });
  //       result = await transaction.wait();

  //     })

  //     it("stake successfully", async () => {

  //       const totalStake = await escrow.connect(buyer).totalStake();
  //       expect(totalStake).to.be.equal(tokens(1));
  //       const staked = await escrow.connect(buyer).staked(buyer.address);
  //       expect(staked).to.be.equal(tokens(1));

  //     })

  //     it("Stake event", async () => {
  //       const event = result.events[0];
  //       const args = event.args;

  //       expect(event.event).to.be.equal("Staked");
  //       expect(args.depositer).to.be.equal(buyer.address);
  //       expect(args.amount).to.be.equal(tokens(1));
  //     })

  //   })

  //   describe("faliure", () => {


  //     it("handel invalidAmount faliure", async () => {
  //       await expect(escrow.connect(buyer).stake({ value: tokens(0) })).to.be.reverted
  //     })


  //   })
  // })


  // describe("unstake", () => {
  //   describe("success", () => {

  //     beforeEach(async () => {
  //       transaction = await escrow.connect(buyer).stake({ value: tokens(2) });
  //       result = await transaction.wait();

  //       transaction = await escrow.connect(buyer).unstake(tokens(0.5));
  //       result = await transaction.wait();
  //     })

  //     it("unstake successfully", async () => {

  //       const totalStake = await escrow.connect(buyer).totalStake();
  //       expect(totalStake).to.be.equal(tokens(1.5));
  //       const staked = await escrow.connect(buyer).staked(buyer.address);
  //       expect(staked).to.be.equal(tokens(1.5));

  //     })

  //     it("Stake event", async () => {
  //       const event = result.events[0];
  //       const args = event.args;

  //       expect(event.event).to.be.equal("Unstaked");
  //       expect(args.withdrawer).to.be.equal(buyer.address);
  //       expect(args.amount).to.be.equal(tokens(0.5));
  //     })

  //   })

  //   describe("faliure", () => {

  //     it("handel invalidAmount faliure", async () => {
  //       await expect(escrow.connect(buyer).unstake(tokens(0))).to.be.reverted;
  //     })

  //     it("handel insufficientStakeamount faliure", async () => {
  //       await expect(escrow.connect(buyer).unstake(tokens(1))).to.be.reverted;
  //     })


  //   })
  // })


  // describe("EscrowCreation", () => {

  //   describe("success", () => {

  //     let currentTimestamp, durationInSeconds, durationInDays;
  //     beforeEach(async () => {

  //       // Get current block timestamp
  //       const blockNum = await ethers.provider.getBlockNumber();
  //       const block = await ethers.provider.getBlock(blockNum);
  //       currentTimestamp = block.timestamp;
  //       durationInDays = 7;
  //       durationInSeconds = durationInDays * 24 * 60 * 60;


  //     })

  //     it("get Deal", async () => {
  //       const deal = await escrow.connect(buyer.address).getDeal(1);

  //       expect(deal.dealId).to.be.equal(1);
  //       expect(deal.buyer).to.be.equal(buyer.address);
  //       expect(deal.seller).to.be.equal(seller.address);
  //       expect(deal.amount).to.be.equal(tokens(1));
  //       expect(deal.title).to.be.equal("ui design");
  //       expect(deal.description).to.be.equal("design ui for web3 webiste");
  //       expect(deal.status).to.be.equal(1);
  //       expect(deal.createdAt).to.be.equal(currentTimestamp);
  //       expect(deal.deadline).to.be.equal(currentTimestamp + durationInSeconds);
  //       expect(deal.isDisputed).to.be.equal(false);


  //     })

  //     it("deal creation event", async () => {
  //       const event = result.events[0];
  //       const args = event.args;

  //       expect(event.event).to.be.equal("Deal");
  //       expect(args.dealId).to.be.equal(1);
  //       expect(args.buyer).to.be.equal(buyer.address);
  //       expect(args.seller).to.be.equal(seller.address);
  //       expect(args.amount).to.be.equal(tokens(1));
  //       expect(args.title).to.be.equal("ui design");
  //       expect(args.description).to.be.equal("design ui for web3 webiste");
  //       expect(args.status).to.be.equal("Created");
  //       expect(args.createdAt).to.be.equal(currentTimestamp);
  //       expect(args.deadline).to.be.equal(currentTimestamp + durationInSeconds);
  //       expect(args.isDisputed).to.be.equal(false);

  //     })

  //   })


  //   describe("faliure", () => {
  //     it("handel invalid seller address failure", async () => {
  //       await expect(escrow.connect(buyer).dealCreation("0x0000000000000000000000000000000000000000", "ui design", "design ui for web3 webiste", tokens(1), 7)).to.be.reverted
  //     })

  //     it("handel invalid amount failure", async () => {
  //       await expect(escrow.connect(buyer).dealCreation(seller.address, "ui design", "design ui for web3 webiste", tokens(0), 7)).to.be.reverted
  //     })

  //     it("handel invalid deadline failure", async () => {
  //       await expect(escrow.connect(buyer).dealCreation(seller.address, "ui design", "design ui for web3 webiste", tokens(1), 0)).to.be.reverted
  //     })

  //   })
  // });

  // describe("Deposit", async () => {


  //   describe("success", () => {

  //     let deal;
  //     beforeEach(async () => {

  //       transaction = await escrow.connect(buyer).deposit(1, { value: tokens(1) });
  //       result = await transaction.wait();
  //       deal = await escrow.connect(buyer).getDeal(1);
  //     })

  //     it("deposit success with change dealStatus", async () => {
  //       const deposited = await escrow.connect(buyer).getdeposited(buyer.address);
  //       expect(deposited).to.be.equal(tokens(1));
  //       expect(await escrow.connect(buyer).gettotalDepositAsBuyer(buyer.address)).to.be.equal(tokens(1));
  //       expect(await escrow.connect(buyer).totalAllTimeDeposit()).to.be.equal(tokens(1));
  //       expect(deal.status).to.be.equal(2);

  //     })

  //     it("deposit event", async () => {
  //       const event = result.events[0];
  //       const args = event.args;


  //       expect(event.event).to.be.equal("Deposit");
  //       expect(args.dealId).to.be.equal(1);
  //       expect(args.buyer).to.be.equal(buyer.address);
  //       expect(args.seller).to.be.equal(seller.address);
  //       expect(args.amount).to.be.equal(tokens(1));
  //       expect(args.title).to.be.equal("ui design");
  //       expect(args.description).to.be.equal("design ui for web3 webiste");
  //       expect(args.status).to.be.equal("Funded");
  //       expect(args.isDisputed).to.be.equal(false);

  //     })


  //   })


  //   describe("faliure", () => {
  //     it("handel dealId faliure", async () => {
  //       await expect(escrow.connect(buyer).deposit(9, { value: tokens(1) })).to.be.reverted;
  //     })

  //     it("handel buyer address faliure", async () => {
  //       await expect(escrow.connect(seller).deposit(1, { value: tokens(1) })).to.be.reverted;
  //     })

  //     it("handel amount faliure", async () => {
  //       await expect(escrow.connect(buyer).deposit(1, { value: tokens(2) })).to.be.reverted;
  //     })

  //     it("handel deadline faliure", async () => {

  //       // Fast forward time by 7 days
  //       await network.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
  //       await network.provider.send("evm_mine");


  //       await expect(escrow.connect(buyer).deposit(1, { value: tokens(1) })).to.be.reverted;
  //     })

  //   })
  // })

  // describe("Delivered", async () => {

  //   describe("success", () => {
  //     let deal;
  //     beforeEach(async () => {
  //       transaction = await escrow.connect(buyer).deposit(1, { value: tokens(1) });
  //       result = await transaction.wait();

  //       transaction = await escrow.connect(seller).markDelivered(1);
  //       result = await transaction.wait();

  //       deal = await escrow.connect(buyer).getDeal(1);
  //     })

  //     it("check change deal status", async () => {
  //       expect(deal.status).to.be.equal(3);
  //     })

  //     it("delivered event", async () => {
  //       const event = result.events[0];
  //       const args = event.args;


  //       expect(event.event).to.be.equal("Delivered");
  //       expect(args.dealId).to.be.equal(1);
  //       expect(args.buyer).to.be.equal(buyer.address);
  //       expect(args.seller).to.be.equal(seller.address);
  //       expect(args.amount).to.be.equal(tokens(1));
  //       expect(args.title).to.be.equal("ui design");
  //       expect(args.description).to.be.equal("design ui for web3 webiste");
  //       expect(args.status).to.be.equal("Delivered");
  //       expect(args.isDisputed).to.be.equal(false);

  //     })

  //   })

  //   describe("failure", () => {


  //     describe("amonut funded", () => {
  //       beforeEach(async () => {
  //         transaction = await escrow.connect(buyer).deposit(1, { value: tokens(1) });
  //         result = await transaction.wait()
  //       })

  //       it("handel dealId faliure", async () => {
  //         await expect(escrow.connect(seller).markDelivered(5)).to.be.reverted;
  //       })

  //       it("handel seller address faliure", async () => {
  //         await expect(escrow.connect(buyer).markDelivered(1)).to.be.reverted;
  //       })
  //     })

  //     describe("amount not funded", () => {
  //       it("handel amount funded faliure", async () => {
  //         await expect(escrow.connect(seller).markDelivered(1)).to.be.reverted;
  //       })
  //     })



  //   })

  // })


  // describe("confirmation", async () => {

  //   describe("success", () => {
  //     let deal,balanceBefore;
  //     beforeEach(async () => {
  //       transaction = await escrow.connect(buyer).deposit(1, { value: tokens(1) });
  //       result = await transaction.wait();

  //       transaction = await escrow.connect(seller).markDelivered(1);
  //       result = await transaction.wait();

  //       balanceBefore = await ethers.provider.getBalance(seller.address);

  //       transaction = await escrow.connect(buyer).confirmReceived(1);
  //       result = await transaction.wait();


  //       deal = await escrow.connect(buyer).getDeal(1);
  //     })

  //     it("check changes in deal", async () => {
  //       const deposited = await escrow.connect(buyer).getdeposited(buyer.address);
  //       expect(deposited).to.be.equal(tokens(0));
  //       expect(await escrow.connect(buyer).gettotalreciveAsSeller(seller.address)).to.be.equal(tokens(1));
  //       expect(deal.amount).to.be.equal(0);
  //       expect(deal.status).to.be.equal(6);

  //       const balanceafter=await ethers.provider.getBalance(seller.address)
  //        expect(balanceafter.sub(balanceBefore)).to.be.equal(tokens(1));


  //     })

  //     it("confirmation event", async () => {
  //       const event = result.events[0];
  //       const args = event.args;


  //       expect(event.event).to.be.equal("Confirmation");
  //       expect(args.dealId).to.be.equal(1);
  //       expect(args.buyer).to.be.equal(buyer.address);
  //       expect(args.seller).to.be.equal(seller.address);
  //       expect(args.amount).to.be.equal(tokens(0));
  //       expect(args.title).to.be.equal("ui design");
  //       expect(args.description).to.be.equal("design ui for web3 webiste");
  //       expect(args.status).to.be.equal("Resolved");
  //       expect(args.isDisputed).to.be.equal(false);

  //     })


  //   })

  //   describe("failure", () => {


  //     describe("amonut funded and delivered", () => {
  //       let deal;
  //       beforeEach(async () => {
  //         transaction = await escrow.connect(buyer).deposit(1, { value: tokens(1) });
  //         result = await transaction.wait()

  //         transaction = await escrow.connect(seller).markDelivered(1);
  //         result = await transaction.wait();

  //         deal = await escrow.connect(buyer).getDeal(1);


  //       })

  //       it("handel dealId faliure", async () => {
  //         await expect(escrow.connect(buyer).confirmReceived(5)).to.be.reverted;
  //       })

  //       it("handel buyer address faliure", async () => {
  //         await expect(escrow.connect(seller).confirmReceived(1)).to.be.reverted;
  //       })
  //     })

  //     describe("amount not funded and deliverd", () => {
  //       it("handel amount funded and delivered faliure", async () => {
  //         await expect(escrow.connect(buyer).confirmReceived(1)).to.be.reverted;
  //       })
  //     })

  //      describe("amount funded but not deliverd", () => {
  //       it("handel amount funded and delivered faliure", async () => {
  //         //deal funded
  //         transaction = await escrow.connect(buyer).deposit(1, { value: tokens(1) });
  //         result = await transaction.wait()

  //         await (escrow.connect(buyer).confirmReceived(1));
  //       })
  //     })


  //   })

  // })

  // describe("Open Dispute", async () => {
  //   describe("success", () => {

  //     let currentTimestamp, durationInSeconds;

  //     beforeEach(async () => {
  //       transaction = await escrow.connect(buyer).deposit(1, { value: tokens(1) });
  //       result = await transaction.wait();

  //       transaction = await escrow.connect(seller).markDelivered(1);
  //       result = await transaction.wait();

  //       transaction = await escrow.connect(buyer).openDispute(1);
  //       result = await transaction.wait();

  //       // Get current block timestamp
  //       const blockNum = await ethers.provider.getBlockNumber();
  //       const block = await ethers.provider.getBlock(blockNum);
  //       currentTimestamp = block.timestamp;
  //       let durationInDays = 7;
  //       durationInSeconds = durationInDays * 24 * 60 * 60;

  //     })

  //     it("create open Dispute", async () => {

  //       const dispute = await escrow.connect(buyer).disputes(1);
  //       expect(dispute.disputedId).to.be.equal(1);
  //       expect(dispute.votingEndTime).to.be.equal(currentTimestamp + durationInSeconds)
  //       expect(dispute.YesVoting).to.be.equal(0);
  //       expect(dispute.Novoting).to.be.equal(0);
  //       expect(dispute.quorumTarget).to.be.equal(tokens(0.1));
  //       expect(dispute.closed).to.be.equal(false);
  //       expect(dispute.dealId).to.be.equal(1);


  //     })

  //     it("Dispute event", async () => {

  //       const event = result.events[0];
  //       const args = event.args;


  //       expect(event.event).to.be.equal("Dispute");
  //       expect(args.disputedId).to.be.equal(1);
  //       expect(args.votingEndTime).to.be.equal(currentTimestamp + durationInSeconds);
  //       expect(args.YesVoting).to.be.equal(0);
  //       expect(args.Novoting).to.be.equal(0);
  //       expect(args.closed).to.be.equal(false);
  //       expect(args.quorumTarget).to.be.equal(tokens(0.1));
  //       expect(args.dealId).to.be.equal(1);

  //     })


  //   })

  //   describe("failure", () => {


  //     describe("amount funded and delivered", () => {
  //       let deal;
  //       beforeEach(async () => {
  //         transaction = await escrow.connect(buyer).deposit(1, { value: tokens(1) });
  //         result = await transaction.wait()

  //         transaction = await escrow.connect(seller).markDelivered(1);
  //         result = await transaction.wait();

  //         deal = await escrow.connect(buyer).getDeal(1);


  //       })

  //       it("handel dealId faliure", async () => {
  //         await expect(escrow.connect(buyer).openDispute(5)).to.be.reverted;
  //       })

  //       it("handel buyer and seller address faliure", async () => {
  //         await expect(escrow.connect(deployer).confirmReceived(1)).to.be.reverted;
  //       })

  //       it("handel dispute id faliure", async () => {
  //         transaction = await escrow.connect(buyer).openDispute(1);
  //         result = await transaction.wait()

  //         await expect(escrow.connect(buyer).openDispute(1)).to.be.reverted;
  //       })
  //     })

  //     describe("amount not funded and deliverd", () => {
  //       it("handel amount funded and delivered faliure", async () => {
  //         await expect(escrow.connect(buyer).openDispute(1)).to.be.reverted;
  //       })
  //     })

  //      describe("amount funded but not deliverd", () => {
  //       it("handel amount funded and delivered faliure", async () => {
  //         //deal funded
  //         transaction = await escrow.connect(buyer).deposit(1, { value: tokens(1) });
  //         result = await transaction.wait()

  //         await (escrow.connect(buyer).openDispute(1))
  //       })
  //     })


  //   })

  // })


  // describe("Dao Voting", async () => {
  //   describe("success", () => {

  //     let currentTimestamp, durationInSeconds, dispute;

  //     beforeEach(async () => {
  //       transaction = await escrow.connect(buyer).deposit(1, { value: tokens(1) });
  //       result = await transaction.wait();

  //       transaction = await escrow.connect(seller).markDelivered(1);
  //       result = await transaction.wait();

  //       transaction = await escrow.connect(user).stake({ value: tokens(1) });
  //       result = await transaction.wait();

  //       transaction = await escrow.connect(buyer).openDispute(1);
  //       result = await transaction.wait();

  //       // Get current block timestamp
  //       const blockNum = await ethers.provider.getBlockNumber();
  //       const block = await ethers.provider.getBlock(blockNum);
  //       currentTimestamp = block.timestamp;
  //       let durationInDays = 7;
  //       durationInSeconds = durationInDays * 24 * 60 * 60;

  //       transaction = await escrow.connect(user).vote(1, true, tokens(0.5));
  //       result = await transaction.wait();

  //       dispute = await escrow.connect(buyer).disputes(1);



  //     })

  //     it("check voting", async () => {

  //       expect(dispute.disputedId).to.be.equal(1);
  //       expect(dispute.votingEndTime).to.be.equal(currentTimestamp + durationInSeconds)
  //       expect(dispute.YesVoting).to.be.equal(tokens(0.5));
  //       expect(dispute.Novoting).to.be.equal(0);
  //       expect(dispute.quorumTarget).to.be.equal(tokens(0.1));
  //       expect(dispute.closed).to.be.equal(false);
  //       expect(dispute.dealId).to.be.equal(1);

  //       expect(await escrow.connect(buyer).getcurrentlyLocked(user.address)).to.be.equal(tokens(0.5));
  //       expect(await escrow.connect(buyer).getusedWeight(1, user.address)).to.be.equal(tokens(0.5));
  //       expect(await escrow.connect(buyer).gethashvoted(1, user.address)).to.be.equal(true);

  //     })

  //     it("Voted event", async () => {

  //       const event = result.events[0];
  //       const args = event.args;

  //       expect(event.event).to.be.equal("Voted");
  //       expect(args.disputedId).to.be.equal(1);
  //       expect(args.support).to.be.equal(true);
  //       expect(args.weight).to.be.equal(tokens(0.5));
  //       expect(args.voterAddress).to.be.equal(user.address);
  //       expect(args.dealId).to.be.equal(1);

  //     })


  //   })

  //   describe("failure", () => {


  //     describe("amount funded and delivered", () => {
  //       let deal;
  //       beforeEach(async () => {
  //         transaction = await escrow.connect(buyer).deposit(1, { value: tokens(1) });
  //         result = await transaction.wait()

  //         transaction = await escrow.connect(seller).markDelivered(1);
  //         result = await transaction.wait();

  //         transaction = await escrow.connect(buyer).openDispute(1);
  //         result = await transaction.wait();


  //         deal = await escrow.connect(buyer).getDeal(1);


  //       })

  //       it("handel disputeId faliure", async () => {
  //         await expect(escrow.connect(user).vote(4, true, tokens(0.5))).to.be.reverted;
  //       })

  //       it("handel buyer and seller address faliure", async () => {
  //         await expect(escrow.connect(buyer).vote(1, true, tokens(0.5))).to.be.reverted;
  //       })

  //       it("handel second time vote same dispute", async () => {
  //         transaction = await escrow.connect(user).stake({ value: tokens(1) });
  //         result = await transaction.wait();

  //         await escrow.connect(user).vote(1, true, tokens(0.5));

  //         await expect(escrow.connect(user).vote(1, true, tokens(0.5))).to.be.reverted;
  //       })

  //       it("handel voting time execeed", async () => {
  //         transaction = await escrow.connect(user).stake({ value: tokens(1) });
  //         result = await transaction.wait();

  //         // Fast forward time by 7 days
  //         await network.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
  //         await network.provider.send("evm_mine");

  //         await expect(escrow.connect(user).vote(1, true, tokens(0.5))).to.be.reverted;
  //       })

  //       it("handel weight zero", async () => {
  //         await expect(escrow.connect(user).vote(1, true, tokens(0))).to.be.reverted;
  //       })

  //        it("handel already use allstake", async () => {
  //         transaction = await escrow.connect(user).stake({ value: tokens(1) });
  //         result = await transaction.wait();

  //         await expect(escrow.connect(user).vote(1, true, tokens(1.5))).to.be.reverted;
  //       })


  //     })

  //   })

  // })

  // describe("close Dispute", () => {
  //   describe("success", () => {

  //     let balanceBefore, dispute, deal;

  //     beforeEach(async () => {
  //       transaction = await escrow.connect(buyer).deposit(1, { value: tokens(1) });
  //       result = await transaction.wait();

  //       transaction = await escrow.connect(seller).markDelivered(1);
  //       result = await transaction.wait();

  //       transaction = await escrow.connect(user).stake({ value: tokens(1) });
  //       result = await transaction.wait();

  //       transaction = await escrow.connect(buyer).openDispute(1);
  //       result = await transaction.wait();

  //       balanceBefore = await ethers.provider.getBalance(seller.address);

  //       transaction = await escrow.connect(user).vote(1, false, tokens(0.5));
  //       result = await transaction.wait();

  //       expect(await escrow.connect(buyer).getdeposited(buyer.address)).to.be.equal(tokens(1));


  //       // Fast forward time by 7 days
  //       await network.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
  //       await network.provider.send("evm_mine");

  //       transaction = await escrow.connect(buyer).closeDispute(1);
  //       result = await transaction.wait();

  //       dispute = await escrow.connect(buyer).disputes(1);

  //       deal = await escrow.connect(buyer).getDeal(1);


  //     })

  //     it("check voting", async () => {

  //       const balanceafter = await ethers.provider.getBalance(seller.address);

  //       expect(balanceafter.sub(balanceBefore)).to.be.equal(0);
  //       expect(await escrow.connect(buyer).gettotalreciveAsSeller(seller.address)).to.be.equal(0);
  //       expect(await escrow.connect(buyer).getdeposited(buyer.address)).to.be.equal(0);
  //       expect(deal.amount).to.be.equal(0);
  //       expect(deal.isDisputed).to.be.equal(false);
  //       expect(deal.status).to.be.equal(6);
  //       expect(dispute.closed).to.be.equal(true);

  //     })

  //     it("DisputeClosed event", async () => {

  //       const event = result.events[0];
  //       const args = event.args;

  //       expect(event.event).to.be.equal("DisputeClosed");
  //       expect(args.disputedId).to.be.equal(1);
  //       expect(args.YesVoting).to.be.equal(tokens(0));
  //       expect(args.Novoting).to.be.equal(tokens(0.5));
  //       expect(args.dealId).to.be.equal(1);
  //       expect(args.winner).to.be.equal(1);
  //       expect(args.winnerAddress).to.be.equal(buyer.address);

  //     })


  //   })

  //   describe("failure", () => {

  //     let deal;
  //     beforeEach(async () => {
  //       transaction = await escrow.connect(buyer).deposit(1, { value: tokens(1) });
  //       result = await transaction.wait()

  //       transaction = await escrow.connect(seller).markDelivered(1);
  //       result = await transaction.wait();

  //       transaction = await escrow.connect(buyer).openDispute(1);
  //       result = await transaction.wait();


  //       deal = await escrow.connect(buyer).getDeal(1);

  //     })

  //     it("handel disputeId faliure", async () => {
  //       await expect(escrow.connect(buyer).closeDispute(10)).to.be.reverted;
  //     })

  //     it("handel buyer and seller address faliure", async () => {
  //       await expect(escrow.connect(user).closeDispute(1)).to.be.reverted;
  //     })

  //     it("handel second time close dispute", async () => {

  //       // Fast forward time by 7 days
  //       await network.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
  //       await network.provider.send("evm_mine");

  //       transaction = await escrow.connect(buyer).closeDispute(1)
  //       result = await transaction.wait();

  //       await expect(escrow.connect(buyer).closeDispute(1)).to.be.reverted;
  //     })

  //     it("handel close time not execeed", async () => {
  //       await expect(escrow.connect(buyer).closeDispute(1)).to.be.reverted;
  //     })

  //      it("handel second time close dispute", async () => {

  //       // Fast forward time by 7 days
  //       await network.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
  //       await network.provider.send("evm_mine");

  //       transaction = await escrow.connect(buyer).closeDispute(1)
  //       result = await transaction.wait();     
  //     })

  //   })

  // })

  describe("unlock stake from dispute", () => {
    describe("success", () => {

      let balanceBefore, dispute, deal;

      beforeEach(async () => {
        transaction = await escrow.connect(buyer).deposit(1, { value: tokens(1) });
        result = await transaction.wait();

        transaction = await escrow.connect(seller).markDelivered(1);
        result = await transaction.wait();

        transaction = await escrow.connect(user).stake({ value: tokens(1) });
        result = await transaction.wait();

        transaction = await escrow.connect(buyer).openDispute(1);
        result = await transaction.wait();

        balanceBefore = await ethers.provider.getBalance(seller.address);

        transaction = await escrow.connect(user).vote(1, false, tokens(0.5));
        result = await transaction.wait();

        expect(await escrow.connect(buyer).getdeposited(buyer.address)).to.be.equal(tokens(1));


        // Fast forward time by 7 days
        await network.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
        await network.provider.send("evm_mine");

        transaction = await escrow.connect(buyer).closeDispute(1);
        result = await transaction.wait();

        expect(await escrow.connect(buyer).getcurrentlyLocked(user.address)).to.be.equal(tokens(0.5));
        expect(await escrow.connect(buyer).getusedWeight(1, user.address)).to.be.equal(tokens(0.5));
        transaction = await escrow.connect(user).unlockstakefromdispute(1);
        result = await transaction.wait();

        dispute = await escrow.connect(buyer).disputes(1);

        deal = await escrow.connect(buyer).getDeal(1);


      })

      it("check locked stake", async () => {

        expect(await escrow.connect(buyer).getcurrentlyLocked(user.address)).to.be.equal(0);
        expect(await escrow.connect(buyer).getusedWeight(1, user.address)).to.be.equal(0);

      })


    })

    describe("failure", () => {

      let deal;
      beforeEach(async () => {
        transaction = await escrow.connect(buyer).deposit(1, { value: tokens(1) });
        result = await transaction.wait()

        transaction = await escrow.connect(seller).markDelivered(1);
        result = await transaction.wait();

        transaction = await escrow.connect(buyer).openDispute(1);
        result = await transaction.wait();


        deal = await escrow.connect(buyer).getDeal(1);

      })

      it("handel disputeId faliure", async () => {
        await expect(escrow.connect(user).unlockstakefromdispute(10)).to.be.reverted;
      })


      it("handel unlock stake before close dispute", async () => {
        await expect(escrow.connect(user).unlockstakefromdispute(1)).to.be.reverted;
      })

      it("handel unlock stake without deposit", async () => {
   
           // Fast forward time by 7 days
        await network.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
        await network.provider.send("evm_mine");

        transaction = await escrow.connect(buyer).closeDispute(1)
        result = await transaction.wait();     

        await expect( escrow.connect(buyer).unlockstakefromdispute(1)).to.be.reverted;
      })

    })

  })


});
