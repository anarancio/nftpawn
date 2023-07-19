// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface ILendingProtocolInspector {
    /*-----------------
    - Start Functions -
    -------------------*/

    /*
     * @dev Get the protocol parameters for a given ERC20 and NFT collection
     *
     * @param _erc20 The ERC20 address
     * @param _nftCollection The NFT collection address
     *
     * @return _paused Is the protocol paused?
     * @return _platformFee Platform fee of the ERC20 token
     * @return _erc20Active Is the ERC20 token active?
     * @return _acceptedFloorPriceTime Time to accept the floor price
     * @return _acceptedERC20PriceTime Time to accept the ERC20 price
     * @return _nftActive Is the NFT active?
     * @return _erc20OracleAddress Address of the ERC20 price oracle
     * @return _floorPriceOracleAddress Address of the floor price oracle
     */
    function getProtocolParams(
        address _erc20,
        address _nftCollection
    )
        external
        returns (
            bool _paused,
            uint8 _platformFee,
            bool _erc20Active,
            uint256 _acceptedFloorPriceTime,
            uint256 _acceptedERC20PriceTime,
            bool _nftActive,
            address _erc20OracleAddress,
            address _floorPriceOracleAddress
        );

    /*
     * @dev Returns if the protocol is paused
     *
     * @return bool Is the protocol paused?
     */
    function isProtocolPaused() external returns (bool);

    /*---------------
    - End Functions -
    -----------------*/
}
