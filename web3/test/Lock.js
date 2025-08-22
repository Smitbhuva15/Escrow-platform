const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EventExample", function () {
  let EventExample, contract, owner;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    EventExample = await ethers.getContractFactory("EventExample");
    contract = await EventExample.deploy();
   await contract.deployed();
   
  }); 


  

  it("should emit ValueChanged event", async () => {
    const tx = await contract.setValue(42);
  

    await expect(tx)
      .to.emit(contract, "ValueChanged")
      .withArgs(owner.address, 42);

    const storedValue = await contract.value();
    expect(storedValue).to.equal(42);
  });
});
