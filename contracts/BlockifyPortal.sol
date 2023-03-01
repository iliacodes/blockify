pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract BlockifyPortal {
  uint totalRecommendations;

    constructor() {
        console.log("Yo yo, I am the smartest contract.");
    }
    function recommend() public {
      totalRecommendations += 1;
      console.log("%s has recommended Blockify!", msg.sender);
    }

    function getTotalRecommendations() public view returns (uint) {
      console.log("We have %d total recommendations!", totalRecommendations);
      return totalRecommendations;
    }
}