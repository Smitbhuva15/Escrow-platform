

async function main() {
  // fetch contract
  const Escrow=await ethers.getContractFactory("Escrow");

  // deploy Escrow contract
  const escrow=await Escrow.deploy();
  await escrow.deployed();

  console.log("Escrow Contract Address:", escrow.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
