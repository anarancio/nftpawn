// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./interfaces/IBasketDeployer.sol";
import "./interfaces/INFTAgreement.sol";
import "./interfaces/ILending.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// SafeERC20 library
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


contract Lending is Ownable, Pausable, ReentrancyGuard, ILending {
    using Counters for Counters.Counter;
    Counters.Counter private _basketIds;

    using SafeERC20 for IERC20;

    /*-----------------
    - Start Variables -
    -------------------*/

    /*
     * @dev Address of the NFTAgreement contract
     */
    address public agreementAddress;

    /*
     * @dev Address of the BasketDeployer contract
     */
    address public basketDeployerAddress;

    /*
     * @dev How much time accepted floor price time is valid
     */
    uint256 public acceptedFloorPriceTime;

    /*
     * @dev How much time accepted ERC20 price time is valid
     */
    uint256 public acceptedERC20PriceTime;

    /*---------------
    - End Variables -
    -----------------*/

    /*-----------------
    - Start Mappings -
    -------------------*/

    /*
     * @dev Mapping of all allowed ERC20s for lending | erc20Address => ERC20Whitelisted struct
     */
    mapping(address => ERC20Whitelisted) public whitelistedERC20s;

    /*
     * @dev Mapping of all allowed NFTs for lending | nftAddress => ERC721Whitelisted struct
     */
    mapping(address => ERC721Whitelisted) public whitelistedNFTs;

    /*
     * @dev Mapping of all baskets | basketId => basketAddress
     */
    mapping(uint256 => address) public baskets;

    /*---------------
    - End Mappings -
    -----------------*/

    /*-----------------
    - Start Functions -
    -------------------*/

    /*
     * @dev Constructor of the Lending contract
     *
     */
    constructor() {}

    /*
     * @dev Create a basket
     *
     * @param _erc20 Address of the ERC20 token
     * @param _nft Address of the NFT
     * @param _percentageOfFloorPrice Percentage of the floor price
     * @param _interestRanges Array of interest ranges
     * @param _interestValues Array of interest values
     * @param _automaticApproval Is the basket automatically approved?
     * @param _acceptRefinance Is the basket accepting refinancing?
     *
     * @return basketId Id of the basket
     * @return basketAddress Address of the basket
     */
    function createBasket(
        address _erc20,
        address _nft,
        uint8 _percentageOfFloorPrice,
        uint64[] memory _interestRanges,
        uint8[] memory _interestValues,
        bool _automaticApproval,
        bool _acceptRefinance
    )
        external
        whenNotPaused
        nonReentrant
        returns (uint256 basketId, address basketAddress)
    {
        uint256 length = _interestRanges.length;

        if (whitelistedERC20s[_erc20].enabled == false) {
            revert ERC20NotEnabled({erc20: _erc20});
        }

        if (whitelistedNFTs[_nft].enabled == false) {
            revert NFTNotEnabled({nft: _nft});
        }

        if (_percentageOfFloorPrice <= 0) {
            revert PercentageOfFloorPriceTooLow();
        }

        if (_percentageOfFloorPrice > 100) {
            revert PercentageOfFloorPriceTooHighOneHundred();
        }

        if (length <= 0) {
            revert InterestRangesListEmpty();
        }

        if (length != _interestValues.length) {
            revert InterestRangesAndValuesLengthNotMatch({
                interestRangesLength: length,
                interestValuesLength: _interestValues.length
            });
        }

        if (agreementAddress == address(0)) {
            revert NFTAgreementAddressNotSet();
        }

        for (uint256 i = 0; i < length; i++) {
            if (_interestRanges[i] <= 0) {
                revert InterestRangesLowZero();
            }

            if (_interestValues[i] <= 0) {
                revert InterestValuesLowZero();
            }

            if (_interestValues[i] > 100) {
                revert InterestValuesTooHighOneHundred();
            }
        }

        _basketIds.increment();

        address basket = IBasketDeployer(basketDeployerAddress).deployBasket(
            msg.sender,
            agreementAddress,
            _basketIds.current(),
            _erc20,
            _nft,
            _percentageOfFloorPrice,
            _interestRanges,
            _interestValues,
            _automaticApproval,
            _acceptRefinance
        );

        baskets[_basketIds.current()] = basket;

        INFTAgreement(agreementAddress).addToWhitelist(basket);

        emit BasketCreated(
            _basketIds.current(),
            _erc20,
            _nft,
            _interestRanges,
            _automaticApproval,
            _acceptRefinance
        );

        return (_basketIds.current(), basket);
    }

    /*
     * @dev Change the ERC20 whitelist
     *
     * @param _enabled Is the ERC20 token enabled? If not, it can not be used for lending
     * @param _platformFee Platform fee of the ERC20 token
     * @param _erc20 Address of the ERC20 token
     * @param _priceOracle Address of the price oracle
     */
    function changeERC20Whitelist(
        // TODO: no faltaria chequear que el priceOracle sea un address valido? O no sea address(0)?
        bool _enabled,
        uint8 _platformFee,
        address _erc20,
        address _priceOracle
    ) external override nonReentrant onlyOwner {
        if (_platformFee <= 0) {
            revert PlatformFeeTooLowZero();
        }
        if (_platformFee > 100) {
            revert PlatformFeeTooHighOneHundred();
        }

        whitelistedERC20s[_erc20] = ERC20Whitelisted({
            erc20Address: _erc20,
            enabled: _enabled,
            platformFees: _platformFee,
            priceOracle: _priceOracle
        });

        emit ERC20WhitelistedChanged(
            _enabled,
            _platformFee,
            _erc20,
            _priceOracle
        );
    }

    /*
     * @dev Change the NFT whitelist
     *
     * @param _enabled Is the NFT enabled? If not, it can not be used for lending
     * @param _nft Address of the NFT
     * @param _aggregator Address of the aggregator to get the NFT floor price
     */
    function changeNFTWhitelist(
        // TODO: no faltaria chequear que el aggregator sea un address valido? O no sea address(0)?
        bool _enabled,
        address _nft,
        address _aggregator
    ) external override nonReentrant onlyOwner {
        whitelistedNFTs[_nft] = ERC721Whitelisted({
            nftAddress: _nft,
            enabled: _enabled,
            aggregator: _aggregator
        });

        emit NFTWhitelistedChanged(_enabled, _nft, _aggregator);
    }

    /*
     * @dev Pause the protocol
     */
    function pauseProtocol() external override whenNotPaused onlyOwner {
        _pause();
    }

    /*
     * @dev Re-enable the protocol
     */
    function reEnableProtocol() external override whenPaused onlyOwner {
        _unpause();
    }

    /*
     * @dev Get protocol parameters
     *
     * @param _erc20 Address of the ERC20 token
     * @param _nftCollection Address of the NFT collection
     *
     * @return _paused Is the protocol paused?
     * @return _platformFee Platform fee of the ERC20 token
     * @return _erc20Active Is the ERC20 token active?
     * @return _acceptedFloorPriceTime Time to accept the floor price
     * @return _acceptedERC20PriceTime Time to accept the ERC20 price
     * @return _nftActive Is the NFT active?
     * @return _erc20OracleAddress Address of the ERC20 price oracle
     * @return _floorPriceOracleAddress Address of the NFT floor price oracle
     */
    function getProtocolParams(
        address _erc20,
        address _nftCollection
    )
        external
        view
        override
        returns (
            bool _paused,
            uint8 _platformFee,
            bool _erc20Active,
            uint256 _acceptedFloorPriceTime,
            uint256 _acceptedERC20PriceTime,
            bool _nftActive,
            address _erc20OracleAddress,
            address _floorPriceOracleAddress
        )
    {
        ERC20Whitelisted storage erc20 = whitelistedERC20s[_erc20];
        ERC721Whitelisted storage nftCollection = whitelistedNFTs[
            _nftCollection
        ];
        return (
            paused(),
            erc20.platformFees,
            erc20.enabled,
            acceptedFloorPriceTime,
            acceptedERC20PriceTime,
            nftCollection.enabled,
            erc20.priceOracle,
            nftCollection.aggregator
        );
    }

    /*
     * @dev Update the agreement address
     *
     * @param _agreementAddress New agreement address
     */
    function setAgreementAddress(
        address _agreementAddress
    ) external override onlyOwner {
        if (_agreementAddress == address(0)) {
            revert AgreementAddressZero();
        }

        if (_agreementAddress == address(this)) {
            revert AgreementAddressNotLendingContract();
        }

        agreementAddress = _agreementAddress;

        emit AgreementAddressUpdated(_agreementAddress);
    }

    /*
     * @dev Update the accepted NFT floor price time
     *
     * @param _acceptedFloorPriceTime New accepted NFT floor price time
     */
    function setAcceptedFloorPriceTime(
        uint256 _acceptedFloorPriceTime
    ) external override onlyOwner {
        if (_acceptedFloorPriceTime <= 0) {
            revert AcceptedFloorPriceTimeLowZero();
        }

        acceptedFloorPriceTime = _acceptedFloorPriceTime;

        emit AcceptedFloorPriceTimeUpdated(_acceptedFloorPriceTime);
    }

    /*
     * @dev Update the accepted ERC20 price time
     *
     * @param _acceptedERC20PriceTime New accepted ERC20 price time
     */
    function setAcceptedERC20PriceTime(
        uint256 _acceptedERC20PriceTime
    ) external override onlyOwner {

        if (_acceptedERC20PriceTime <= 0) {
            revert AcceptedERC20PriceTimeLowZero();
        }

        acceptedERC20PriceTime = _acceptedERC20PriceTime;

        emit AcceptedERC20PriceTimeUpdated(_acceptedERC20PriceTime);
    }

    /*
     * @dev Update basketDeployerAddress address
     *
     * @param _basketDeployerAddress New basketDeployerAddress address
     */
    function setBasketDeployerAddress(
        address _basketDeployerAddress
    ) external override onlyOwner {
        if (_basketDeployerAddress == address(0)) {
            revert BasketDeployerAddressZero();
        }

        if (_basketDeployerAddress == address(this)) {
            revert BasketDeployerAddressNotLendingContract();
        }

        basketDeployerAddress = _basketDeployerAddress;

        emit BasketDeployerAddressUpdated(_basketDeployerAddress);
    }

    /*
     * @dev Withdraw funds from the lending protocol
     *
     * @param _erc20 Address of the ERC20 token
     * @param _to Address to send the funds
     * @param _amount Amount of funds to withdraw
     */
    function withdrawFees(
        address _erc20,
        address _to
    ) external override nonReentrant onlyOwner {

        if (_to == address(0)) {
            revert ToAddressZero();
        }

        if (IERC20(_erc20).balanceOf(address(this)) <= 0) {
            revert NotEnoughFundsToWithdraw();
        }

        uint256 _amount = IERC20(_erc20).balanceOf(address(this));

        IERC20(_erc20).safeTransfer(_to, _amount);

        emit LendingWithdraw(_erc20, _to, _amount);
    }

    /*
     * @dev Returns if the protocol is paused
     *
     * @return bool Is the protocol paused?
     */
    function isProtocolPaused() external view override returns (bool) {
        return paused();
    }
}
