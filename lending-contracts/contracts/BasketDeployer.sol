// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Basket.sol";
import "./interfaces/IBasketDeployer.sol";

contract BasketDeployer is IBasketDeployer {
    /*-----------------
    - Start Variables -
    -------------------*/

    address public lending;

    /*-----------------
    - End Variables -
    -------------------*/

    /*-----------------
    - Start Modifiers -
    -------------------*/

    /*
     * @dev Modifier to make a function callable only by lending
     */
    modifier onlyLending() {
        require(
            msg.sender == lending,
            "BasketDeployer: Only lending can call this function"
        );
        _;
    }

    /*-----------------
    - End Modifiers -
    -------------------*/

    /*-----------------
    - Start Functions -
    -------------------*/

    /*
     * @dev Constructor
     *
     * @param _lending Address of lending contract
     */
    constructor(address _lending) {
        lending = _lending;
    }

    /*
     * @dev Deploy a new basket
     * @param owner Address of the owner of the basket
     * @param agreementAddress Address of the agreement contract
     * @param basketId Id of the basket
     * @param _erc20 Address of the erc20 token
     * @param _nft Address of the nft token
     * @param _percentageOfFloorPrice Percentage of the floor price
     * @param _interestRanges Array of interest ranges
     * @param _interestValues Array of interest values
     * @param _automaticApproval Automatic approval of the basket
     * @param _acceptRefinance Accept refinance of the basket
     *
     * @return Address of the new basket
     */
    function deployBasket(
        address owner,
        address agreementAddress,
        uint256 basketId,
        address _erc20,
        address _nft,
        uint8 _percentageOfFloorPrice,
        uint64[] memory _interestRanges,
        uint8[] memory _interestValues,
        bool _automaticApproval,
        bool _acceptRefinance
    ) external override onlyLending returns (address) {
        Basket basket = new Basket();

        BasketData memory basketData = BasketData(
            owner,
            agreementAddress,
            basketId,
            _erc20,
            _nft,
            _percentageOfFloorPrice,
            _interestRanges,
            _interestValues,
            _automaticApproval,
            _acceptRefinance
        );

        basket.init(
            basketData.basketId,
            basketData.owner,
            lending,
            basketData._erc20,
            basketData._nft,
            basketData.agreementAddress,
            basketData._percentageOfFloorPrice,
            basketData._interestRanges,
            basketData._interestValues,
            basketData._automaticApproval,
            basketData._acceptRefinance
        );

        delete basketData;

        return (address(basket));
    }

    /*-----------------
    - End Functions -
    -------------------*/
}
