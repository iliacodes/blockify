const main = async() => {
  // const owners = []; // declare empty array
 
  // console.log("Owners:", owners); // print the array of owners

  // const [owner, randomPerson] = await hre.ethers.getSigners();
  // owners.push(owner.address); // push owner address into array
  // owners.push(randomPerson.address); // push randomPerson address into array

  const blockifyContractFactory = await hre.ethers.getContractFactory('BlockifyPortal');
  const blockifyContract = await blockifyContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await blockifyContract.deployed();
  console.log("Addy of contract: ", blockifyContract.address)

  // console.log("Contract deployed to:", blockifyContract.address);
  // console.log("Contract deployed by:", owner.address);

  let contractBalance = await hre.ethers.provider.getBalance(blockifyContract.address);
  console.log("Contract balace = :", hre.ethers.utils.formatEther(contractBalance));


  const blockifyTxn = await blockifyContract.recommend("This is the first song recommendation.");
  await blockifyTxn.wait();


  const blockifyTxn2 = await blockifyContract.recommend("This is the second recommendation.");
  await blockifyTxn2.wait();


  contractBalance = await hre.ethers.provider.getBalance(blockifyContract.address);
  console.log("Contract balance = :", hre.ethers.utils.formatEther(contractBalance));

  
  let allRecommendations = await blockifyContract.getAllRecommendations();
  console.log("All recommendations:", allRecommendations)


  // let blockifyCount;
  // blockifyCount = await blockifyContract.getTotalRecommendations();
  // console.log("Blockify count:", blockifyCount.toNumber());



  // let blockifyTxn = await blockifyContract.recommend("A message is here!");
  // await blockifyTxn.wait(); // wait until the transaction is mined

  // const [_, newPerson] = await hre.ethers.getSigners();
  // blockifyTxn = await blockifyContract.connect(newPerson).recommend("Sending another message...")
  // await blockifyTxn.wait(); // wait until the second transaction is mined


  // await blockifyContract.getTotalRecommendations();

  //first check
  // const firstBlockifyTxn = await blockifyContract.recommend();
  // await firstBlockifyTxn.wait();

  //second check
  // const secondBlockifyTxn = await blockifyContract.connect(randomPerson).recommend();
  // await secondBlockifyTxn.wait();

  // = await 
  // await blockifyContract.getTotalRecommendations();
  
  // console.log("Owners:", owners); // print the array of owners for total results
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