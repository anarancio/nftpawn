// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InternalERC20Aggregator is AggregatorV3Interface, Ownable {

    
    int _latestAnswer;
    uint _latestTimestamp;
    address public lending;

    constructor(int _price, uint _timestamp) {
        _latestAnswer = _price;
        _latestTimestamp = _timestamp;
    }

    function decimals() external view returns (uint8) {
        return 8;
    }

    function description() external view returns (string memory) {
        return "Internal";
    }

    function version() external view returns (uint256) {
        return 0;
    }

    function getRoundData(
        uint80 _roundId
    )
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        revert();
    }

    /*
     * @dev Get the latest round data
     *
     * @return roundId Id of the round
     * @return answer Price of the round
     * @return startedAt Timestamp of the round start
     * @return updatedAt Timestamp of the round update
     * @return answeredInRound Id of the round answered
     */
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (0, _latestAnswer, 0, _latestTimestamp, 0);
    }

    /*
     * @dev Set the latest answer
     *
     * @param _price Price of the round
     * @param _timestamp Timestamp of the round
     */
    function setLatestAnswer(int _price, uint _timestamp) public onlyOwner {
        _latestAnswer = _price;
        _latestTimestamp = _timestamp;
    }
}
