// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./ILendingProtocolInspector.sol";

interface ILending is ILendingProtocolInspector {
    /*-----------------
    - Start Structs -
    -------------------*/

    /*
     * @dev Struct of the ERC20Whitelisted
     *
     * @param erc20Address Address of the ERC20 token
     * @param enabled Is the ERC20 token enabled? If not, it can not be used for lending
     * @param platformFees Platform fees of the ERC20 token
     * @param priceOracle Address of the price oracle
     */
    struct ERC20Whitelisted {
        address erc20Address;
        bool enabled;
        uint8 platformFees;
        address priceOracle;
    }

    /*
     * @dev Struct of the ERC721Whitelisted
     *
     * @param nftAddress Address of the NFT
     * @param enabled Is the NFT enabled? If not, it can not be used for lending
     * @param aggregator Address of the aggregator to get the floor price of the NFT
     */
    struct ERC721Whitelisted {
        address nftAddress;
        bool enabled;
        address aggregator;
    }

    /*---------------
    - End Structs -
    -----------------*/

    /*-----------------
    - Start Events -
    -------------------*/

    /*
     * @dev Event emitted when a basket is created
     *
     * @param _id Id of the basket
     * @param _erc20 Address of the ERC20 token
     * @param _nft Address of the NFT
     * @param _automaticApproval Is the basket automatically approved
     * @param _acceptRefinance Is the basket accepting refinancing
     */
    event BasketCreated(
        uint256 _id,
        address _erc20,
        address _nft,
        uint64[] _interestRanges,
        bool _automaticApproval,
        bool _acceptRefinance
    );

    /*
     * @dev Event emitted when change an ERC20 whitelisted
     *
     * @param _enabled Is the ERC20 token enabled? If not, it can not be used for lending
     * @param _platformFees Platform fees of the ERC20 token
     * @param _erc20 Address of the ERC20 token
     * @param _priceOracle Address of the price oracle
     */
    event ERC20WhitelistedChanged(
        bool _enabled,
        uint8 _platformFees,
        address _erc20,
        address _priceOracle
    );

    /*
     * @dev Event emitted when change an NFT whitelisted
     *
     * @param _enabled Is the NFT enabled? If not, it can not be used for lending
     * @param _nft Address of the NFT
     */
    event NFTWhitelistedChanged(
        bool _enabled,
        address _nft,
        address _aggregator
    );

    /*
     * @dev Event emitted when change the agreement address
     *
     * @param _agreementAddress Address of the agreement
     */
    event AgreementAddressUpdated(address _agreementAddress);

    /*
     * @dev Event emitted when change the accepted floor price time
     *
     * @param _acceptedFloorPriceTime Accepted floor price time
     */
    event AcceptedFloorPriceTimeUpdated(uint256 _acceptedFloorPriceTime);

    /*
     * @dev Event emitted when change the accepted ERC20 price time
     *
     * @param _acceptedERC20PriceTime Accepted ERC20 price time
     */
    event AcceptedERC20PriceTimeUpdated(uint256 _acceptedERC20PriceTime);

    /*
     * @dev Event emitted when change the basket deployer address
     *
     * @param _basketDeployerAddress Address of the basket deployer
     */
    event BasketDeployerAddressUpdated(address _basketDeployerAddress);

    /*
     * @dev Event emitted when withdraw ERC20 from the lending protocol
     */
    event LendingWithdraw(address _erc20, address _to, uint256 _amount);

    /*---------------
    - End Events -
    -----------------*/

    /*-----------------
    - Start Functions -
    -------------------*/

    /*
     * @dev Create a basket
     *
     * @param _erc20 Address of the ERC20 token
     * @param _nft Address of the NFT
     * @param _percentageOfFloorPrice Percentage of the floor price
     * @param _interestRanges Array of interest ranges
     * @param _interestValues Array of interest values
     * @param _automaticApproval Is the basket automatically approved
     * @param _acceptRefinance Is the basket accepting refinancing
     */
    function createBasket(
        address _erc20,
        address _nft,
        uint8 _percentageOfFloorPrice,
        uint64[] memory _interestRanges,
        uint8[] memory _interestValues,
        bool _automaticApproval,
        bool _acceptRefinance
    ) external returns (uint256 basketId, address basketAddress);

    /*
     * @dev Change the ERC20 whitelist
     *
     * @param _enabled Is the ERC20 token enabled? If not, it can not be used for lending
     * @param _platformFee Platform fee of the ERC20 token
     * @param _erc20 Address of the ERC20 token
     * @param _priceOracle Address of the price oracle
     */
    function changeERC20Whitelist(
        bool _enabled,
        uint8 _platformFee,
        address _erc20,
        address _priceOracle
    ) external;

    /*
     * @dev Change the NFT whitelist
     *
     * @param _enabled Is the NFT enabled? If not, it can not be used for lending
     * @param _nft Address of the NFT
     * @param _aggregator Address of the aggregator to get the floor price of the NFT
     */
    function changeNFTWhitelist(
        bool _enabled,
        address _nft,
        address _aggregator
    ) external;

    /*
     * @dev Pause lending protocol
     *
     */
    function pauseProtocol() external;

    /*
     * @dev Re-enable lending protocol
     *
     */
    function reEnableProtocol() external;

    /*
     * @dev Update the agreement address
     *
     * @param _agreementAddress New agreement address
     */
    function setAgreementAddress(address _agreementAddress) external;

    /*
     * @dev Update the accepted floor price time
     *
     * @param _acceptedFloorPriceTime New accepted floor price time
     */
    function setAcceptedFloorPriceTime(
        uint256 _acceptedFloorPriceTime
    ) external;

    /*
     * @dev Update the accepted ERC20 price time
     *
     * @param _acceptedERC20PriceTime New accepted ERC20 price time
     */
    function setAcceptedERC20PriceTime(
        uint256 _acceptedERC20PriceTime
    ) external;

    /*
     * @dev Update the basket deployer address
     *
     * @param _basketDeployerAddress New basket deployer address
     */
    function setBasketDeployerAddress(address _basketDeployerAddress) external;

    /*
     * @dev Withdraw funds from the lending protocol
     *
     * @param _erc20 Address of the ERC20 token
     * @param _to Address to send the funds
     * @param _amount Amount of funds to withdraw
     */
    function withdrawFees(address _erc20, address _to) external;

    /*---------------
    - End Functions -
    -----------------*/

    /*-----------------
    - Start Custom Errors -
    -------------------*/

    // createBasket errors
    error ERC20NotEnabled(address erc20);
    error NFTNotEnabled(address nft);
    error PercentageOfFloorPriceTooLow();
    error PercentageOfFloorPriceTooHighOneHundred();
    error InterestRangesListEmpty();
    error InterestRangesAndValuesLengthNotMatch(
        uint256 interestRangesLength,
        uint256 interestValuesLength
    );
    error NFTAgreementAddressNotSet();
    error InterestRangesLowZero();
    error InterestValuesLowZero();
    error InterestValuesTooHighOneHundred();

    // changeERC20Whitelist errors
    error PlatformFeeTooLowZero();
    error PlatformFeeTooHighOneHundred();

    // setAgreementAddress errors
    error AgreementAddressZero();
    error AgreementAddressNotLendingContract();

    // setAcceptedFloorPriceTime errors
    error AcceptedFloorPriceTimeLowZero();

    // setAcceptedERC20PriceTime errors
    error AcceptedERC20PriceTimeLowZero();

    // setBasketDeployerAddress errors
    error BasketDeployerAddressZero();
    error BasketDeployerAddressNotLendingContract();

    // withdrawFees errors
    error ToAddressZero();
    error NotEnoughFundsToWithdraw();

    /*---------------
    - End Custom Errors -
    -----------------*/
}
