const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Escrow", () => {
  let transaction, result, signer, deployer, seller, buyer;

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
        const deal =await escrow.connect(buyer.address).getDeal(1);
  
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
   
       it("deal creation event",async()=>{
        const event=result.events[0];
        const args=event.args;
        

        //   uint256 dealId,
        // address buyer,
        // address seller,
        // uint256 amount,
        // string title,
        // string description,
        // string status,
        // uint256 createdAt,
        // uint256 deadline,
        // bool isDisputed
        expect(event.event).to.be.equal("Deal");
        expect(args.dealId).to.be.equal(1);
        expect(args.buyer).to.be.equal(buyer.address);
        expect(args.seller).to.be.equal(seller.address);
        expect(args.amount).to.be.equal(tokens(1));
        expect(args.title).to.be.equal("ui design");
        expect(args.description).to.be.equal("design ui for web3 webiste");
        expect(args.status).to.be.equal("Created");
        expect(args.createdAt).to.be.equal(currentTimestamp);
        expect(args.deadline).to.be.equal(currentTimestamp+durationInSeconds);
        expect(args.isDisputed).to.be.equal(false);

       })

    })
  });


});
