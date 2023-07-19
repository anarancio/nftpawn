// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface INFTAgreement {
    /*-----------------
    - Start Enums -
    -------------------*/

    /*
     * @dev Enum of the agreement type
     */
    enum AgreementType {
        LENDER,
        BORROWER
    }

    /*---------------
    - End Enums -
    -----------------*/

    /*-----------------
    - Start Structs -
    -------------------*/

    /*
     * @dev Struct of the agreement
     *
     * @param id Id of the agreement NFT
     * @param loanId Id of the loan
     * @param basket Address of the basket
     * @param agreementType Type of the agreement NFT
     */
    struct Agreement {
        uint256 id;
        uint256 loanId;
        address basket;
        AgreementType agreementType;
    }

    /*---------------
    - End Structs -
    -----------------*/

    /*-----------------
    - Start Events -
    -------------------*/

    /*
     * @dev Event to be emitted when a NFT is claimed by Lender or Borrower
     *
     * @param _basketId Id of the basket asociated to the loan
     * @param _basketAddress Address of the basket asociated to the loan
     * @param _loanId Id of the loan asociated to the NFT Agreement
     * @param _claimedBy Address of the user who claimed the NFT
     */
    event LoanNFTClaimed(
        uint256 _basketId,
        address _basketAddress,
        uint256 _loanId,
        address _claimedBy
    );

    /*
     * @dev Event to be emitted when a loan is paid
     *
     * @param _basketId Id of the basket asociated to the loan
     * @param _basketAddress Address of the basket asociated to the loan
     * @param _loanId Id of the loan asociated to the NFT Agreement
     * @param _paymentBy Address of the user who paid the loan
     * @param _amountPaid Amount paid by the user
     * @param _remainingToPay Remaining amount to pay
     */
    event LoanPayment(
        uint256 _basketId,
        address _basketAddress,
        uint256 _loanId,
        address _paymentBy,
        uint256 _amountPaid,
        uint256 _remainingToPay
    );

    /*-----------------
    - Start Functions -
    -------------------*/

    /*
     * @dev Function to mint a new agreement
     *
     * @param _to Address of the recipient
     * @param _loanId Id of the loan asociated to de NFT Agreement
     * @param _basketAddress Address of the basket asociated
     * @param _agreementType NFT Agreement BORROWER or LENDER
     * 
     * @return _agreementId Id of the NFT Agreement
     */
    function mint(
        address _to,
        uint256 _loanId,
        address _basketAddress,
        AgreementType _agreementType
    ) external returns (uint256 _agreementId);

    /*
     * @dev Function to add a new Basket to the whitelist able to mint agreements
     *
     * @param _address Address of the Basket
     */
    function addToWhitelist(address _address) external;

    /*
     * @dev Function to burn a NFT Agreement
     *  Only the Basket can burn the NFT Agreement
     *  The NFT Agreement is burned when the loan is paid
     *  The NFT Agreement is burned when the loan expires
     *
     * @param _agreementId Id of the NFT Agreement
     */
    function burn(uint256 _agreementId) external;
}
