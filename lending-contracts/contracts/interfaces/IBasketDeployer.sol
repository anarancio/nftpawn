// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IBasketDeployer {
    /*
     * @dev Struct to store the basket data
     *
     * @param owner Address of the owner
     * @param agreementAddress Address of the agreement
     * @param basketId Id of the basket
     * @param _erc20 Address of the ERC20 token
     * @param _nft Address of the NFT
     * @param _percentageOfFloorPrice Percentage of the floor price
     * @param _interestRanges Interest ranges
     * @param _interestValues Interest values
     * @param _automaticApproval Is the basket automatically approved
     * @param _acceptRefinance Is the basket accepting refinancing
     */
    struct BasketData {
        address owner;
        address agreementAddress;
        uint256 basketId;
        address _erc20;
        address _nft;
        uint8 _percentageOfFloorPrice;
        uint64[] _interestRanges;
        uint8[] _interestValues;
        bool _automaticApproval;
        bool _acceptRefinance;
    }

    /*
     * @dev Function to deploy a basket
     *
     * @param _owner Address of the owner of the basket
     * @param _agreementAddress Address of the agreement
     * @param _basketId Id of the basket
     * @param _erc20 Address of the ERC20 token
     * @param _nft Address of the NFT
     * @param _percentageOfFloorPrice Percentage of the floor price
     * @param _interestRanges Interest ranges
     * @param _interestValues Interest values
     * @param _automaticApproval Is the basket automatically approved
     * @param _acceptRefinance Is the basket accepting refinancing
     */
    function deployBasket(
        address _owner,
        address _agreementAddress,
        uint256 _basketId,
        address _erc20,
        address _nft,
        uint8 _percentageOfFloorPrice,
        uint64[] memory _interestRanges,
        uint8[] memory _interestValues,
        bool _automaticApproval,
        bool _acceptRefinance
    ) external returns (address);
}
