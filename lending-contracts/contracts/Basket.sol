// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./NFTAgreement.sol";
import "./interfaces/IBasket.sol";
import "./interfaces/ILending.sol";
import "./interfaces/INFTAgreement.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// SafeERC20 library
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Basket is Pausable, ReentrancyGuard, IBasket {
    using Counters for Counters.Counter;
    Counters.Counter private _loanIds;

    using SafeERC20 for ERC20;

    /*-----------------
    - Start Variables -
    -------------------*/

    /*
     * @dev Id of the basket
     */
    uint256 public id;

    /*
     * @dev Address of the ERC20 token accepted by the basket
     */
    address public erc20;

    /*
     * @dev Address of the NFT collection accepted by the basket
     */
    address public nftCollection;

    /*
     * @dev Address of the owner of the basket
     */
    address public owner;

    /*
     * @dev Address of the Agreements contract
     */
    address public agreementAddress;

    /*
     * @dev Liquidity of the basket
     */
    uint256 public liquidity;

    /*
     * @dev Status of the basket
     */
    BasketStatus public status;

    /*
     * @dev Percentage of the floor price of the NFT to be used as collateral
     */
    uint8 public percentageOfFloorPrice;

    /*
     * @dev Automatic approval of the basket
     */
    bool public automaticApproval;

    /*
     * @dev Accept refinance of the basket
     */
    bool public acceptRefinance;

    /*
     * @dev Address of the LendingProtocolInspector contract
     */
    address public lendingProtocolInspector;

    /*---------------
    - End Variables -
    -----------------*/

    /*-----------------
    - Start Mappings -
    -------------------*/

    /*
     * @dev Mapping of all interest ranges | interest duration => interest value
     */
    mapping(uint64 => InterestValues) public interestRates;

    // - Loan -
    /*
     * @dev Mapping of all loans | loan id => loan
     */
    mapping(uint256 => Loan) public loans;

    /*---------------
    - End Mappings -
    -----------------*/

    /*-----------------
    - Start Modifiers -
    -------------------*/

    /*
     * @dev Modifier to check if Lending protocol is active
     */
    modifier protocolActive() {
        bool _isPaused = ILending(lendingProtocolInspector).isProtocolPaused();
        if (_isPaused) {
            revert LendingProtocolPaused();
        }
        _;
    }

    /*
     * @dev Modifier only basket owner can call the function
     */
    modifier onlyBasketOwner() {
        if (msg.sender != owner) {
            revert NotBasketOwner();
        }
        _;
    }

    /*---------------
    - End Modifiers -
    -----------------*/

    /*-----------------
    - Start Functions -
    -------------------*/

    /*
     * @dev Constructor of the basket
     */
    constructor() {}

    /*
     * @dev Initialize the basket
     *
     * @param _id Id of the basket
     * @param _owner Address of the owner of the basket
     * @param _lending Address of the LendingProtocolInspector contract
     * @param _erc20 Address of the ERC20 token
     * @param _nft Address of the NFT
     * @param _agreementAddress Address of the NFTAgreement contract
     * @param _percentageOfFloorPrice Percentage of the floor price
     * @param _interestRanges Array of interest ranges
     * @param _interestValues Array of interest values
     * @param _automaticApproval Is the basket automatically approved?
     * @param _acceptRefinance Is the basket accepting refinancing?
     */
    function init(
        uint256 _id,
        address _owner,
        address _lending,
        address _erc20,
        address _nft,
        address _agreementAddress,
        uint8 _percentageOfFloorPrice,
        uint64[] memory _interestRanges,
        uint8[] memory _interestValues,
        bool _automaticApproval,
        bool _acceptRefinance
    ) external {
        id = _id;
        lendingProtocolInspector = _lending;
        erc20 = _erc20;
        nftCollection = _nft;
        agreementAddress = _agreementAddress;
        percentageOfFloorPrice = _percentageOfFloorPrice;
        automaticApproval = _automaticApproval;
        acceptRefinance = _acceptRefinance;
        owner = _owner;
        status = BasketStatus.ACTIVE;

        uint256 length = _interestRanges.length;

        for (uint256 i = 0; i < length; i++) {
            interestRates[_interestRanges[i]] = InterestValues(
                _interestValues[i],
                true
            );
        }
    }

    /*
     * @dev Pause the basket
     */
    function pauseBasket() external override whenNotPaused onlyBasketOwner {
        _pause();
    }

    /*
     * @dev Activate the basket
     */
    function activateBasket() external override whenPaused onlyBasketOwner {
        _unpause();
    }

    /*
     * @dev Add liquidity to the basket
     *
     * @param _amount Amount of liquidity to add
     */
    function depositLiquidity(
        uint256 _amount
    ) external override nonReentrant protocolActive {
        ProtocolParams memory _protocolParams;

        (, , _protocolParams.erc20Active, , , , , ) = ILending(
            lendingProtocolInspector
        ).getProtocolParams(address(erc20), address(nftCollection));

        if (_amount <= 0) {
            revert AmountLessZero();
        }
  
        if (ERC20(erc20).allowance(msg.sender, address(this)) < _amount) {
            revert NotEnoughAllowance();
        }
    
        if (ERC20(erc20).balanceOf(msg.sender) < _amount) {
            revert NotEnoughBalance();
        }

        if (_protocolParams.erc20Active == false) {
            revert ERC20NotActive();
        }

        liquidity += _amount;

        ERC20(erc20).safeTransferFrom(msg.sender, address(this), _amount);

        emit BasketDeposit(_amount, liquidity);
    }

    /*
     * @dev Withdraw liquidity from the basket
     *
     * @param _to Address to withdraw the liquidity to
     */
    function withdrawLiquidity(
        address _to
    ) external override whenPaused nonReentrant onlyBasketOwner {
        // require(_to != address(0), "Address zero");
        if (_to == address(0)) {
            revert AddressZero(); 
        }
        // require(liquidity > 0, "No liquidity");
        if (liquidity <= 0) {
            revert NoLiquidity();
        }

        uint256 _amount = liquidity;
        liquidity = 0;

        status = BasketStatus.PAUSED;

        ERC20(erc20).safeTransfer(_to, _amount);

        emit BasketWithdraw(id);
    }

    /*
     * @dev Update the interest rates of the basket
     *
     * @param _days Days of the interest rate
     * @param _interestValue Interest value
     * @param _enabled Is the interest rate enabled?
     */
    function updateInterestRates(
        uint64 _days,
        uint8 _interestValue,
        bool _enabled
    ) external override whenNotPaused protocolActive onlyBasketOwner {
        // require(_interestValue > 0, "Interest <= 0");
        if (_interestValue <= 0) {
            revert InterestLessZero();
        }
        // require(_interestValue < 100, "Interest > 100");
        if (_interestValue >= 100) {
            revert InterestMoreOneHundred();
        }
        // require(_days > 0, "Days <= 0");
        if (_days <= 0) {
            revert DaysLessZero();
        }

        interestRates[_days] = InterestValues(_interestValue, _enabled);

        emit BasketInterestRatesUpdated(_days, _interestValue, _enabled);
    }

    /*
     * @dev Create a loan
     *
     * @param _interestDuration Duration of the interest
     * @param _amount Amount to be borrowed
     * @param _nftId Id of the NFT to be used as collateral
     */
    function createLoan(
        uint64 _interestDuration,
        uint256 _amount,
        uint256 _nftId
    ) external override whenNotPaused protocolActive {
        ProtocolParams memory _protocolParams;

        (
            _protocolParams.isPaused,
            _protocolParams.platformFee,
            _protocolParams.erc20Active,
            _protocolParams.acceptedFloorPriceTime,
            _protocolParams.acceptedERC20PriceTime,
            _protocolParams.nftActive,
            _protocolParams.erc20OracleAddress,
            _protocolParams.floorPriceOracleAddress
        ) = ILending(lendingProtocolInspector).getProtocolParams(
            address(erc20),
            address(nftCollection)
        );

        InterestValues memory _interestValue = interestRates[_interestDuration];

        if (_interestValue.enabled == false) {
            revert InterestRateNotEnabled({
                interestDuration: _interestDuration
            });
        }

        if (_protocolParams.erc20Active == false) {
            revert ERC20NotActive();
        }

        if (_protocolParams.nftActive == false) {
            revert NFTNotActive();
        }

        if (liquidity < _amount) {
            revert NotEnoughLiquidity({liquidity: liquidity, amount: _amount});
        }

        if (ERC721(nftCollection).ownerOf(_nftId) != msg.sender) {
            revert NotOwnerOfNFT({nftId: _nftId, owner: msg.sender});
        }

        if (ERC721(nftCollection).getApproved(_nftId) != address(this)) {
            revert NFTNotApproved({nftId: _nftId, approved: address(this)});
        }
        {
            (int priceERC20USD, uint timeStampERC20USD) = getData(
                _protocolParams.erc20OracleAddress
            );
            (int priceFloorETH, uint timeStampFloorETH) = getData(
                _protocolParams.floorPriceOracleAddress
            );

            uint8 _decimals = ERC20(erc20).decimals();
            uint256 _amountUSD = (uint256(priceERC20USD) * _amount) /
                (10 ** _decimals);
            uint256 _floorPriceUSDPercentaje = (uint256(priceFloorETH) *
                percentageOfFloorPrice) / 100;

            if (_amountUSD > _floorPriceUSDPercentaje) {
                revert AmountLessFloorPrice({
                    amount: _amountUSD,
                    floorPrice: _floorPriceUSDPercentaje
                });
            }

            if (
                block.timestamp - timeStampERC20USD >
                _protocolParams.acceptedERC20PriceTime
            ) {
                revert ERC20PriceOutdated({
                    timeStampERC20USD: timeStampERC20USD,
                    acceptedERC20PriceTime: _protocolParams
                        .acceptedERC20PriceTime
                });
            }

            if (
                block.timestamp - timeStampFloorETH >
                _protocolParams.acceptedFloorPriceTime
            ) {
                revert FloorPriceOutdated({
                    timeStampFloorETH: timeStampFloorETH,
                    acceptedFloorPriceTime: _protocolParams
                        .acceptedFloorPriceTime
                });
            }
        }
        _loanIds.increment();
        {
            uint256 _interestAmount = (_amount * _interestValue.interestValue) /
                100;

            // Mint NFTAgreement to lender
            uint256 _lenderNFTId = INFTAgreement(agreementAddress).mint(
                owner,
                _loanIds.current(),
                address(this),
                INFTAgreement.AgreementType.LENDER
            );

            // Mint NFTAgreement to borrower
            uint256 _borrowerNFTId = INFTAgreement(agreementAddress).mint(
                msg.sender,
                _loanIds.current(),
                address(this),
                INFTAgreement.AgreementType.BORROWER
            );

            loans[_loanIds.current()] = Loan({
                id: _loanIds.current(),
                nftId: _nftId,
                amount: _amount,
                amountPaid: 0,
                interestDuration: _interestDuration,
                interestValue: _interestValue.interestValue,
                interestAmount: _interestAmount,
                borrowerNFTId: _borrowerNFTId,
                lenderNFTId: _lenderNFTId,
                status: LoanStatus.ACTIVE,
                creationDate: block.timestamp
            });
        }
        {
            uint256 _feesToCharge = (_amount * _protocolParams.platformFee) /
                100;

            ERC721(nftCollection).transferFrom(
                msg.sender,
                address(this),
                _nftId
            );

            ERC20(erc20).safeTransfer(lendingProtocolInspector, _feesToCharge);

            ERC20(erc20).safeTransfer(msg.sender, _amount - _feesToCharge);
        }
        emit LoanCreated(
            id,
            address(this),
            _loanIds.current(),
            erc20,
            nftCollection,
            _nftId,
            msg.sender,
            owner,
            _interestDuration,
            _interestValue.interestValue
        );
    }

    /*
     * @dev Pay a loan
     *
     * @param _amount Amount to be paid
     * @param _agreementId Id of the agreement
     */
    function pay(
        uint256 _amount,
        uint256 _agreementId
    ) external override protocolActive {
        (
            uint256 _id,
            uint256 _loanId,
            address _basket,
            INFTAgreement.AgreementType _agreementType
        ) = NFTAgreement(agreementAddress).nftAgreements(_agreementId);

        Loan storage _loan = loans[_loanId];

        require(
            _agreementType == INFTAgreement.AgreementType.BORROWER,
            "Only BORROWER Agreement"
        );

        require(_id == _agreementId, "Agreement not found");

        require(_loan.status == LoanStatus.ACTIVE, "Loan not active");

        require(_basket == address(this), "Basket not found");

        require(_amount > 0, "Amount <= 0");

        require(
            block.timestamp <= _loan.creationDate + _loan.interestDuration,
            "Loan expired"
        );

        uint256 _amountToPay = Math.min(
            _amount,
            _loan.amount + _loan.interestAmount - _loan.amountPaid
        );

        require(
            ERC20(erc20).balanceOf(msg.sender) >= _amount,
            "Not enough balance"
        );

        require(
            ERC20(erc20).allowance(msg.sender, address(this)) >= _amount,
            "Not enough allowance"
        );

        _loan.amountPaid += _amountToPay;

        ERC20(erc20).safeTransferFrom(msg.sender, address(this), _amountToPay);

        uint256 remainingAmount = _loan.amount +
            _loan.interestAmount -
            _loan.amountPaid;

        address ownerOfAgreement = ERC721(agreementAddress).ownerOf(
            _agreementId
        );

        if (remainingAmount == 0) {
            _loan.status = LoanStatus.CLAIMED;

            ERC721(nftCollection).transferFrom(
                address(this),
                ownerOfAgreement,
                _loan.nftId
            );

            // Burn NFTAgreement to borrower
            INFTAgreement(agreementAddress).burn(_loan.borrowerNFTId);

            // Burn NFTAgreement to lender
            INFTAgreement(agreementAddress).burn(_loan.lenderNFTId);

            emit LoanNFTClaimed(id, address(this), _loanId, ownerOfAgreement);
        }

        emit LoanPayment(
            id,
            address(this),
            _loanId,
            ownerOfAgreement,
            _amountToPay,
            remainingAmount
        );
    }

    /*
     * @dev Claim the NFT of the loan
     *
     * @param _agreementId Id of the NFTAgreement to claim
     */
    function claimNFT(uint256 _agreementId) external override protocolActive {
        (
            uint256 _id,
            uint256 _loanId,
            address _basket,
            INFTAgreement.AgreementType _agreementType
        ) = NFTAgreement(agreementAddress).nftAgreements(_agreementId);

        Loan memory _loan = loans[_loanId];

        require(
            _agreementType == INFTAgreement.AgreementType.LENDER,
            "Only LENDER Agreement"
        );

        require(_id == _agreementId, "Agreement not found");

        require(_loan.status == LoanStatus.ACTIVE, "Loan not active");

        require(_basket == address(this), "Basket not found");

        require(
            block.timestamp > _loan.creationDate + _loan.interestDuration,
            "Loan not expired"
        );

        _loan.status = LoanStatus.CLAIMED;

        address ownerOfAgreement = ERC721(agreementAddress).ownerOf(
            _agreementId
        );

        ERC721(nftCollection).transferFrom(
            address(this),
            ownerOfAgreement,
            _loan.nftId
        );

        // Burn NFTAgreement to borrower
        INFTAgreement(agreementAddress).burn(_loan.borrowerNFTId);

        // Burn NFTAgreement to lender
        INFTAgreement(agreementAddress).burn(_loan.lenderNFTId);

        emit LoanNFTClaimed(id, address(this), _loanId, ownerOfAgreement);
    }

    /*
     * @dev Get the loan data
     *
     * @param _loanId Id of the loan
     */
    function getData(address _aggregaror) private view returns (int, uint) {
        AggregatorV3Interface nftFloorPriceFeed = AggregatorV3Interface(
            _aggregaror
        );

        (, int nftFloorPrice, , uint timeStamp, ) = nftFloorPriceFeed
            .latestRoundData();
        return (nftFloorPrice, timeStamp);
    }
}
