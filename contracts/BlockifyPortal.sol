pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract BlockifyPortal {
  uint256 totalRecommendations;
  uint private seed;

  event NewRecommendation(address indexed from, uint256 timestamp, string message);

  struct Recommendation {
    address recommender; // address of recommender
    string message; //message of recommender
    uint256 timestamp; // timestamp of recommendation
  }

  mapping(address => uint256) public lastRecommendedAt;

  Recommendation[] recommendations;

    constructor() payable {
        console.log("Yo yo, I am the smartest contract.");

        seed = (block.timestamp + block.difficulty) % 100;
    }

    function recommend(string memory _message) public {

      require (
        lastRecommendedAt[msg.sender] + 90 minutes < block.timestamp,
        "Please Wait 1.5 hours before recommending again."
      );

      lastRecommendedAt[msg.sender] = block.timestamp;
      totalRecommendations += 1;
      console.log("%s recommended w/ message %s!", msg.sender, _message);

      recommendations.push(Recommendation(msg.sender, _message, block.timestamp));

      seed = (block.difficulty + block.timestamp + seed) % 100;

      if (seed <= 20) {
        console.log("%s won!", msg.sender);

        uint prizeAmount = 0.0069 ether;
        require(
          prizeAmount <= address(this).balance,
          "Trying to withdraw more money than the contract has."
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract.");
      }

      emit NewRecommendation(msg.sender, block.timestamp, _message);
    }

    function getAllRecommendations() public view returns (Recommendation[] memory) {
      return recommendations;
    }

    function getTotalRecommendations() public view returns (uint256) {
      return totalRecommendations;
    }
}