// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ERC721TestToken is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string private _name;
    string private _symbol;

    constructor(string memory name_, string memory symbol_)
        ERC721(name_, symbol_)
    {
        _name = name_;
        _symbol = symbol_;
    }

    function mint(address recipient) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        return newItemId;
    }

    function getName() public view returns (string memory) {
        return _name;
    }

    function getSymbol() public view returns (string memory) {
        return _symbol;
    }
}
