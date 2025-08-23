const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Escrow", () => {
  let transaction, result, deployer, seller, buyer;

  const tokens = (amount) => {
    return ethers.utils.parseEther(amount.toString());
  }

  beforeEach(async () => {
    [deployer, seller, buyer] = await ethers.getSigners();
    Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy();
    await escrow.deployed();

    transaction = await escrow.connect(buyer).dealCreation(seller.address, "ui design", "design ui for web3 webiste", tokens(1), 7);
    result = await transaction.wait();

  });

  describe("stake", () => {
    describe("success", () => {

      beforeEach(async () => {
        transaction = await escrow.connect(buyer).stake({ value: tokens(1) });
        result = await transaction.wait();

      })

      it("stake successfully", async () => {

        const totalStake = await escrow.connect(buyer).totalStake();
        expect(totalStake).to.be.equal(tokens(1));
        const staked = await escrow.connect(buyer).staked(buyer.address);
        expect(staked).to.be.equal(tokens(1));

      })

      it("Stake event", async () => {
        const event = result.events[0];
        const args = event.args;

        expect(event.event).to.be.equal("Staked");
        expect(args.depositer).to.be.equal(buyer.address);
        expect(args.amount).to.be.equal(tokens(1));
      })

    })

    describe("faliure", () => {


      it("handel invalidAmount faliure", async () => {
        await expect(escrow.connect(buyer).stake({ value: tokens(0) })).to.be.reverted
      })


    })
  })


  describe("unstake", () => {
    describe("success", () => {

      beforeEach(async () => {
        transaction = await escrow.connect(buyer).stake({ value: tokens(2) });
        result = await transaction.wait();

        transaction = await escrow.connect(buyer).unstake(tokens(0.5));
        result = await transaction.wait();
      })

      it("unstake successfully", async () => {

        const totalStake = await escrow.connect(buyer).totalStake();
        expect(totalStake).to.be.equal(tokens(1.5));
        const staked = await escrow.connect(buyer).staked(buyer.address);
        expect(staked).to.be.equal(tokens(1.5));

      })

      it("Stake event", async () => {
        const event = result.events[0];
        const args = event.args;

        expect(event.event).to.be.equal("Unstaked");
        expect(args.withdrawer).to.be.equal(buyer.address);
        expect(args.amount).to.be.equal(tokens(0.5));
      })

    })

    describe("faliure", () => {

      it("handel invalidAmount faliure", async () => {
        await expect(escrow.connect(buyer).unstake(tokens(0))).to.be.reverted;
      })

      it("handel insufficientStakeamount faliure", async () => {
        await expect(escrow.connect(buyer).unstake(tokens(1))).to.be.reverted;
      })


    })
  })


  describe("EscrowCreation", () => {

    describe("success", () => {

      let currentTimestamp, durationInSeconds, durationInDays;
      beforeEach(async () => {

        // Get current block timestamp
        const blockNum = await ethers.provider.getBlockNumber();
        const block = await ethers.provider.getBlock(blockNum);
        currentTimestamp = block.timestamp;
        durationInDays = 7;
        durationInSeconds = durationInDays * 24 * 60 * 60;


      })

      it("get Deal", async () => {
        const deal = await escrow.connect(buyer.address).getDeal(1);

        expect(deal.dealId).to.be.equal(1);
        expect(deal.buyer).to.be.equal(buyer.address);
        expect(deal.seller).to.be.equal(seller.address);
        expect(deal.amount).to.be.equal(tokens(1));
        expect(deal.title).to.be.equal("ui design");
        expect(deal.description).to.be.equal("design ui for web3 webiste");
        expect(deal.status).to.be.equal(1);
        expect(deal.createdAt).to.be.equal(currentTimestamp);
        expect(deal.deadline).to.be.equal(currentTimestamp + durationInSeconds);
        expect(deal.isDisputed).to.be.equal(false);


      })

      it("deal creation event", async () => {
        const event = result.events[0];
        const args = event.args;

        expect(event.event).to.be.equal("Deal");
        expect(args.dealId).to.be.equal(1);
        expect(args.buyer).to.be.equal(buyer.address);
        expect(args.seller).to.be.equal(seller.address);
        expect(args.amount).to.be.equal(tokens(1));
        expect(args.title).to.be.equal("ui design");
        expect(args.description).to.be.equal("design ui for web3 webiste");
        expect(args.status).to.be.equal("Created");
        expect(args.createdAt).to.be.equal(currentTimestamp);
        expect(args.deadline).to.be.equal(currentTimestamp + durationInSeconds);
        expect(args.isDisputed).to.be.equal(false);

      })

    })


    describe("faliure", () => {
      it("handel invalid seller address failure", async () => {
        await expect(escrow.connect(buyer).dealCreation("0x0000000000000000000000000000000000000000", "ui design", "design ui for web3 webiste", tokens(1), 7)).to.be.reverted
      })

      it("handel invalid amount failure", async () => {
        await expect(escrow.connect(buyer).dealCreation(seller.address, "ui design", "design ui for web3 webiste", tokens(0), 7)).to.be.reverted
      })

      it("handel invalid deadline failure", async () => {
        await expect(escrow.connect(buyer).dealCreation(seller.address, "ui design", "design ui for web3 webiste", tokens(1), 0)).to.be.reverted
      })

    })
  });

  describe("Deposit", async () => {


    describe("success", () => {

      let deal;
      beforeEach(async () => {
        transaction = await escrow.connect(buyer).deposit(1, { value: tokens(1) });
        result = await transaction.wait();
        deal = await escrow.connect(buyer).getDeal(1);
      })

      it("deposit success with change dealStatus", async () => {
        const deposited = await escrow.connect(buyer).getdeposited(buyer.address);
        expect(deposited).to.be.equal(tokens(1));
        expect(await escrow.connect(buyer).gettotalDepositAsBuyer(buyer.address)).to.be.equal(tokens(1));
        expect(await escrow.connect(buyer).totalAllTimeDeposit()).to.be.equal(tokens(1));
        expect(deal.status).to.be.equal(2);

      })

      it("deposit event", async () => {
        const event = result.events[0];
        const args = event.args;


        expect(event.event).to.be.equal("Deposit");
        expect(args.dealId).to.be.equal(1);
        expect(args.buyer).to.be.equal(buyer.address);
        expect(args.seller).to.be.equal(seller.address);
        expect(args.amount).to.be.equal(tokens(1));
        expect(args.title).to.be.equal("ui design");
        expect(args.description).to.be.equal("design ui for web3 webiste");
        expect(args.status).to.be.equal("Funded");
        expect(args.isDisputed).to.be.equal(false);

      })


    })


    describe("faliure", () => {
      it("handel dealId faliure", async () => {
        await expect(escrow.connect(buyer).deposit(9, { value: tokens(1) })).to.be.reverted;
      })

      it("handel buyer address faliure", async () => {
        await expect(escrow.connect(seller).deposit(1, { value: tokens(1) })).to.be.reverted;
      })

      it("handel amount faliure", async () => {
        await expect(escrow.connect(buyer).deposit(1, { value: tokens(2) })).to.be.reverted;
      })

      it("handel deadline faliure", async () => {

        // Fast forward time by 7 days
        await network.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
        await network.provider.send("evm_mine");


        await expect(escrow.connect(buyer).deposit(1, { value: tokens(1) })).to.be.reverted;
      })

    })
  })

  describe("Delivered", async () => {

    describe("success", () => {
      let deal;
      beforeEach(async () => {
        transaction = await escrow.connect(buyer).deposit(1, { value: tokens(1) });
        result = await transaction.wait();

        transaction = await escrow.connect(seller).markDelivered(1);
        result = await transaction.wait();

        deal = await escrow.connect(buyer).getDeal(1);
      })

      it("change deal status", async () => {
        expect(deal.status).to.be.equal(3);
      })

      it("delivered event", async () => {
        const event = result.events[0];
        const args = event.args;


        expect(event.event).to.be.equal("Delivered");
        expect(args.dealId).to.be.equal(1);
        expect(args.buyer).to.be.equal(buyer.address);
        expect(args.seller).to.be.equal(seller.address);
        expect(args.amount).to.be.equal(tokens(1));
        expect(args.title).to.be.equal("ui design");
        expect(args.description).to.be.equal("design ui for web3 webiste");
        expect(args.status).to.be.equal("Delivered");
        expect(args.isDisputed).to.be.equal(false);

      })

    })

    describe("failure", () => {


      describe("amonut funded", () => {
        beforeEach(async () => {
          transaction = await escrow.connect(buyer).deposit(1, { value: tokens(1) });
          result = await transaction.wait()
        })

        it("handel dealId faliure", async () => {
          await expect(escrow.connect(seller).markDelivered(5)).to.be.reverted;
        })

        it("handel seller address faliure", async () => {
          await expect(escrow.connect(buyer).markDelivered(1)).to.be.reverted;
        })
      })

      describe("amount not funded", () => {
        it("handel amount funded faliure", async () => {
          await expect(escrow.connect(seller).markDelivered(1)).to.be.reverted;
        })
      })



    })

  })

});
