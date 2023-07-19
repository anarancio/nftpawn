// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./interfaces/INFTAgreement.sol";
import "./interfaces/ILending.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NFTAgreement is ERC721, INFTAgreement {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    /*------------------
    - Start Variables -
    -------------------*/

    address public lendingAddress;

    /*----------------
    - End Variables -
    -----------------*/

    /*------------------
    - Start Mappings -
    -------------------*/

    /*
     * @dev Mapping to check if a basket is allowed to mint NFT Agreements | basketAddress => bool
     */
    mapping(address => bool) public allowedToMint;

    /*
     * @dev Mapping to store the NFT Agreements | agreementId => Agreement
     */
    mapping(uint256 => Agreement) public nftAgreements;

    /*------------------
    - Start Modifiers -
    -------------------*/

    /*
     * @dev Modifier to check if the sender is the lending contract
     */
    modifier onlyLending() {
        require(msg.sender == lendingAddress, "Only lending contract");
        _;
    }

    /*
     * @dev Modifier to check if the sender is allowed to mint NFT Agreements
     */
    modifier onlyAllowedToMint() {
        require(allowedToMint[msg.sender], "Only allowed to mint");
        _;
    }

    /*----------------
    - End Modifiers -
    -----------------*/

    /*------------------
    - Start Functions -
    -------------------*/

    /*
     * @dev Constructor of the NFT Agreement contract
     *
     * @param _name Name of the NFT Agreement
     * @param _symbol Symbol of the NFT Agreement
     * @param _lendingAddress Address of the lending contract
     */
    constructor(
        string memory _name,
        string memory _symbol,
        address _lendingAddress
    ) ERC721(_name, _symbol) {
        lendingAddress = _lendingAddress;
    }

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
    ) external override onlyAllowedToMint returns (uint256 _agreementId) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        AgreementType _typeAgreement = AgreementType.LENDER;

        if (_agreementType == AgreementType.BORROWER) {
            _typeAgreement = AgreementType.BORROWER;
        }

        nftAgreements[newItemId] = Agreement({
            id: newItemId,
            loanId: _loanId,
            basket: _basketAddress,
            agreementType: _typeAgreement
        });

        _mint(_to, newItemId);

        return newItemId;
    }

    /*
     * @dev Function to add a new Basket to the whitelist able to mint agreements
     *
     * @param _address Address of the Basket
     */
    function addToWhitelist(address _address) public onlyLending {
        allowedToMint[_address] = true;
    }

    /*
     * @dev Function to burn a NFT Agreement
     *  Only the Basket can burn the NFT Agreement
     *  The NFT Agreement is burned when the loan is paid
     *  The NFT Agreement is burned when the loan expires
     *
     * @param _agreementId Id of the NFT Agreement
     */
    function burn(uint256 _agreementId) external override {
        require(
            msg.sender == nftAgreements[_agreementId].basket,
            "Only basket can burn"
        );
        _burn(_agreementId);
    }

    /*----------------
    - End Functions -
    -----------------*/
}
