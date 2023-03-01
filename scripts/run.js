const main = async() => {
  const owners = []; // declare empty array
 
  console.log("Owners:", owners); // print the array of owners

  const [owner, randomPerson] = await hre.ethers.getSigners();
  owners.push(owner.address); // push owner address into array
  owners.push(randomPerson.address); // push randomPerson address into array

  const blockifyContractFactory = await hre.ethers.getContractFactory('BlockifyPortal');
  const blockifyContract = await blockifyContractFactory.deploy();
  await blockifyContract.deployed();

  console.log("Contract deployed to:", blockifyContract.address);
  console.log("Contract deployed by:", owner.address);


  await blockifyContract.getTotalRecommendations();

  //first check
  const firstBlockifyTxn = await blockifyContract.recommend();
  await firstBlockifyTxn.wait();

  //second check
  const secondBlockifyTxn = await blockifyContract.connect(randomPerson).recommend();
  await secondBlockifyTxn.wait();

  // = await 
  await blockifyContract.getTotalRecommendations();
  
  console.log("Owners:", owners); // print the array of owners for total results
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

runMain();