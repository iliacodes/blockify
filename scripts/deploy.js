const main = async () => {
  // const [deployer] = await ethers.getSigners();
  // const accountBalance = await deployer.getBalance();

  // console.log("Deploying contracts with account:", deployer.address);
  // console.log("Account balance:", accountBalance.toString());

  const blockifyContractFactory = await hre.ethers.getContractFactory("BlockifyPortal");
  const blockifyContract = await blockifyContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.001")
  });


  await blockifyContract.deployed();

  console.log("BlockifyPortal address: ", blockifyContract.address);


};

const runMain = async() => {
  try {
    await main();
    process.exit(0);

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

runMain();