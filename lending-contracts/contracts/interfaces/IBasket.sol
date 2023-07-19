// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

/*
 * @dev Struct of the Basket initialization
 *
 * @param erc20 Address of the ERC20 token
 * @param nft Address of the NFT token
 * @param percentageOfFloorPrice Percentage of the floor price of the NFT
 * @param interestRanges Array of interest ranges
 * @param interestValues Array of interest values
 * @param automaticApproval Automatic approval of the basket
 * @param acceptRefinance Accept refinance of the basket
 */
struct BasketInit {
    address erc20;
    address nft;
    uint8 percentageOfFloorPrice;
    uint64[] interestRanges;
    uint8[] interestValues;
    bool automaticApproval;
    bool acceptRefinance;
}

interface IBasket {
    /*-----------------
    - Start Structs -
    -------------------*/

    /*
     * @dev Struct of the ProtocolParams
     *
     * @param isPaused Is the basket paused
     * @param platformFee Platform fee of the basket
     * @param erc20Active Is the ERC20 active
     * @param acceptedFloorPriceTime Accepted time of the floor price
     * @param acceptedERC20PriceTime Accepted time of the ERC20 price
     * @param nftActive Is the NFT active
     * @param erc20OracleAddress Address of the ERC20 price oracle
     * @param floorPriceOracleAddress Address of the floor price oracle
     */
    struct ProtocolParams {
        bool isPaused;
        uint8 platformFee;
        bool erc20Active;
        uint256 acceptedFloorPriceTime;
        uint256 acceptedERC20PriceTime;
        bool nftActive;
        address erc20OracleAddress;
        address floorPriceOracleAddress;
    }

    /*
     * @dev Struct of interest values
     *
     * @param interestValue Value of the interest
     * @param enabled Is the interest value enabled?
     */
    struct InterestValues {
        uint8 interestValue;
        bool enabled;
    }

    // - Loan -
    /*
     * @dev Struct of the loan
     *
     * @param id Id of the loan
     * @param nftId Id of the NFT to be used as collateral
     * @param amount Amount of the loan
     * @param amountPaid Amount paid of the loan
     * @param interestDuration Duration of the interest
     * @param interestValue Value of the interest
     * @param interestAmount Amount of the interest
     * @param borrowerNFTId Id of the NFT of the borrower
     * @param lenderNFTId Id of the NFT of the lender
     * @param status Status of the loan
     * @param creationDate Creation date of the loan
     */
    struct Loan {
        uint256 id;
        uint256 nftId;
        uint256 amount;
        uint256 amountPaid;
        uint64 interestDuration;
        uint8 interestValue;
        uint256 interestAmount;
        uint256 borrowerNFTId;
        uint256 lenderNFTId;
        LoanStatus status;
        uint256 creationDate;
    }

    /*---------------
    - End Structs -
    -----------------*/

    /*-----------------
    - Start Enums -
    -------------------*/

    /*
     * @dev Enum of the basket status
     */
    enum BasketStatus {
        ACTIVE,
        PAUSED
    }

    // - Loan -
    /*
     * @dev Enum of the loan status
     */
    enum LoanStatus {
        ACTIVE,
        CLAIMED
    }

    /*---------------
    - End Enums -
    -----------------*/

    /*-----------------
    - Start Events -
    -------------------*/

    /*
     * @dev Event emitted when a basket is paused or reactivated
     *
     * @param _basketId Id of the basket
     * @param _status Status of the basket
     */
    event BasketStatusChanged(uint256 _basketId, uint8 _status);

    /*
     * @dev Event emitted when deposit liquidity in the basket
     *
     * @param _amount Amount of the deposit
     * @param _newLiquidity New liquidity of the basket
     */
    event BasketDeposit(uint256 _amount, uint256 _newLiquidity);

    /*
     * @dev Event emitted when withdraw liquidity from the basket
     *
     * @param _amount Amount of the withdraw
     * @param _newLiquidity New liquidity of the basket
     */
    event BasketWithdraw(uint256 _basketId);

    /*
     * @dev Event emitted when update the interest rates of the basket
     *
     * @param _days Days of the interest rate
     * @param _interestValue Interest value of the interest rate
     * @param _enabled Is the interest rate enabled?
     */
    event BasketInterestRatesUpdated(
        uint64 _days,
        uint8 _interestValue,
        bool _enabled
    );

    /*
     * @dev Event emitted when a loan is created
     *
     * @param _basketId Id of the basket
     * @param _basketAddress Address of the basket
     * @param _loanId Id of the loan
     * @param _erc20 Address of the ERC20 token admitted in the basket
     * @param _nftCollection Address of the NFT collection used as collateral
     * @param _nftId Id of the NFT used as collateral
     * @param _borrower Address of the borrower
     * @param _lender Address of the lender
     * @param _duration Duration of the loan
     * @param _interest Interest of the loan
     */
    event LoanCreated(
        uint256 _basketId,
        address _basketAddress,
        uint256 _loanId,
        address _erc20,
        address _nftCollection,
        uint256 _nftId,
        address _borrower,
        address _lender,
        uint64 _duration,
        uint8 _interest
    );

    /*
     * @dev Event emitted when a loan is claimed
     *
     * @param _basketId Id of the basket
     * @param _basketAddress Address of the basket
     * @param _loanId Id of the loan
     * @param _claimedBy Address of the borrower or lender
     */
    event LoanNFTClaimed(
        uint256 _basketId,
        address _basketAddress,
        uint256 _loanId,
        address _claimedBy
    );

    /*
     * @dev Event emitted when a loan is paid
     *
     * @param _basketId Id of the basket
     * @param _basketAddress Address of the basket
     * @param _loanId Id of the loan
     * @param _paymentBy Address of the borrower or lender
     * @param _amountPaid Amount paid of the loan
     * @param _remainingToPay Remaining to pay of the loan
     */
    event LoanPayment(
        uint256 _basketId,
        address _basketAddress,
        uint256 _loanId,
        address _paymentBy,
        uint256 _amountPaid,
        uint256 _remainingToPay
    );

    /*---------------
    - End Events -
    -----------------*/

    /*-----------------
    - Start Functions -
    -------------------*/

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
     * @param _automaticApproval Is the basket automatically approved
     * @param _acceptRefinance Is the basket accepting refinancing
     */
    function init(
        uint256 _id,
        address _owner,
        address _lending,
        address _erc20,
        address _nft,
        address _agreement,
        uint8 _percentageOfFloorPrice,
        uint64[] memory _interestRanges,
        uint8[] memory _interestValues,
        bool _automaticApproval,
        bool _acceptRefinance
    ) external;

    /*
     * @dev Pause the basket
     */
    function pauseBasket() external;

    /*
     * @dev Activate the basket
     */
    function activateBasket() external;

    /*
     * @dev Add liquidity to the basket
     *
     * @param _amount Amount of the deposit in the basket
     */
    function depositLiquidity(uint256 _amount) external;

    /*
     * @dev Withdraw liquidity from the basket
     *
     * @param _to Address to receive the liquidity
     */
    function withdrawLiquidity(address _to) external;

    /*
     * @dev Update the interest rates of the basket
     *
     * @param _days Days of the interest rate
     * @param _interestValue Interest value of the interest rate
     * @param _enabled Is the interest rate enabled?
     */
    function updateInterestRates(
        uint64 _days,
        uint8 _interestValue,
        bool _enabled
    ) external;

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
    ) external;

    /*
     * @dev Pay the loan
     *
     * @param _amount Amount to be paid
     * @param _agreementId Id of the NFTAgreement to pay
     */
    function pay(uint256 _amount, uint256 _agreementId) external;

    /*
     * @dev Claim the NFT of the loan
     *
     * @param _agreementId Id of the NFTAgreement to claim
     */
    function claimNFT(uint256 _agreementId) external;

    /*---------------
    - End Functions -
    -----------------*/

    /*-----------------
    - Start Custom Errors -
    -------------------*/

    error LendingProtocolPaused();
    error NotBasketOwner();
    error AmountLessFloorPrice(uint256 amount, uint256 floorPrice);
    error InterestRateNotEnabled(uint64 interestDuration);
    error ERC20NotActive();
    error NFTNotActive();
    error NotEnoughLiquidity(uint256 liquidity, uint256 amount);
    error NotOwnerOfNFT(uint256 nftId, address owner);
    error NFTNotApproved(uint256 nftId, address approved);
    error ERC20PriceOutdated(
        uint256 timeStampERC20USD,
        uint256 acceptedERC20PriceTime
    );
    error FloorPriceOutdated(
        uint256 timeStampFloorETH,
        uint256 acceptedFloorPriceTime
    );

    // depositLiquidity errors
    error AmountLessZero();
    error NotEnoughAllowance();
    error NotEnoughBalance();

    // withdrawLiquidity errors
    error AddressZero();
    error NoLiquidity();

    // updateInterestRates errors
    error InterestLessZero();
    error InterestMoreOneHundred();
    error DaysLessZero();

    /*---------------
    - End Custom Errors -
    -----------------*/
}
