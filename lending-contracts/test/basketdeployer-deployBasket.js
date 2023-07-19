const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lending | Basketdeployer", function () {
  let principal;
  let alice;
  let bob;
  let charlie;
  let oracleAddress = "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"; // ETH/USD
  let aggregator = "0x352f2Bc3039429fC2fe62004a1575aE74001CfcE"; // Bored Ape Yacht Club

  async function basketFixture() {
    [principal, alice, bob, charlie, failERC20Address, failERC721Address] =
      await ethers.getSigners();

    /*
     * Deploy ERC20 tokens
     */
    const erc20Factory = await ethers.getContractFactory("ERC20TestToken");
    erc201 = await erc20Factory.deploy(
      "Test Token First",
      "TST1",
      1000000000000000
    );
    await erc201.deployed();

    erc202 = await erc20Factory.deploy(
      "Test Token Second",
      "TST2",
      1000000000000000
    );
    await erc202.deployed();

    erc203 = await erc20Factory.deploy(
      "Test Token Third",
      "TST3",
      1000000000000000
    );
    await erc203.deployed();

    ercFail = await erc20Factory.deploy(
      "Test Token Fail",
      "TSTFAIL",
      1000000000000000
    );

    /*
     * Deploy ERC721 tokens
     */
    const erc721Factory = await ethers.getContractFactory("ERC721TestToken");
    erc721_I = await erc721Factory.deploy("Test NFT I", "TSTNFT_I");
    await erc721_I.deployed();

    erc721_II = await erc721Factory.deploy("Test NFT II", "TSTNFT_II");
    await erc721_II.deployed();

    erc721_III = await erc721Factory.deploy("Test NFT III", "TSTNFT_III");
    await erc721_III.deployed();

    erc721_Fail = await erc721Factory.deploy("Test NFT Fail", "TSTNFT_FAIL");
    await erc721_Fail.deployed();

    /*
     * Mint ERC721 tokens
     */
    await erc721_I.mint(alice.address);
    await erc721_I.mint(bob.address);
    await erc721_I.mint(charlie.address);

    await erc721_II.mint(alice.address);
    await erc721_II.mint(bob.address);

    await erc721_III.mint(alice.address);

    /*
     * List of _interestRanges 30days, 60days, 90days in milliseconds
     */
    const interestRanges = [2592000000, 5184000000, 7776000000];

    /*
     * List of _interestValues 30days, 60days, 90days
     */
    const interestValues = [1, 3, 7];

    // ! Console
    console.log(
      "ERC20 tokens deployed to:",
      erc201.address,
      erc202.address,
      erc203.address,
      ercFail.address
    );
    console.log(
      "ERC721 tokens deployed to:",
      erc721_I.address,
      erc721_II.address,
      erc721_III.address,
      erc721_Fail.address
    );

    /*
     * Deploy Lending contract
     */
    const lendingFactory = await ethers.getContractFactory("Lending");
    lending = await lendingFactory.deploy();
    await lending.deployed();

    /*
     * Deploy NFTAgreement contract
     */
    const agreementFactory = await ethers.getContractFactory("NFTAgreement");
    this.agreement = await agreementFactory.deploy(
      "NFT NFTAgreement",
      "NFTA",
      this.lending.address
    );
    await this.agreement.deployed();

    /*
     * Whitelist ERC20 tokens
     */
    await this.lending.changeERC20Whitelist(
      true,
      2,
      this.erc201.address,
      oracleAddress
    );
    await this.lending.changeERC20Whitelist(
      true,
      2,
      this.erc202.address,
      oracleAddress
    );
    await this.lending.changeERC20Whitelist(
      true,
      2,
      this.erc203.address,
      oracleAddress
    );

    /*
     * Whitelist ERC721 tokens
     */
    await this.lending.changeNFTWhitelist(
      true,
      this.erc721_I.address,
      aggregator
    );
    await this.lending.changeNFTWhitelist(
      true,
      this.erc721_II.address,
      aggregator
    );
    await this.lending.changeNFTWhitelist(
      true,
      this.erc721_III.address,
      aggregator
    );

    this.basketDeployerFactory = await ethers.getContractFactory(
      "BasketDeployer"
    );
    this.basketDeployer = await this.basketDeployerFactory.deploy(
      this.lending.address
    );
    await this.basketDeployer.deployed();

    return {
      lending: lending,
      erc201: erc201,
      erc202: erc202,
      erc203: erc203,
      ercFail: ercFail,
      erc721_I: erc721_I,
      erc721_II: erc721_II,
      erc721_III: erc721_III,
      erc721_Fail: erc721_Fail,
      interestRanges,
      interestValues,
      principal,
      alice,
      bob,
      charlie,
      agreement: this.agreement,
      basketDeployer: this.basketDeployer,
    };
  }

  describe("Create Basket", function () {
    it("Should revert if caller is not Lending Protocol", async function () {
      const {
        lending,
        erc201,
        erc202,
        erc203,
        erc721_I,
        erc721_II,
        basketDeployer,
        agreement,
        interestRanges,
        interestValues,
        principal,
        alice,
        bob,
        charlie,
      } = await loadFixture(basketFixture);
      await loadFixture(basketFixture);

      await expect(
        basketDeployer.deployBasket(
          alice.address,
          agreement.address,
          1,
          erc201.address,
          erc721_I.address,
          50,
          interestRanges,
          interestValues,
          true,
          true
        )
      ).to.be.revertedWith(
        "BasketDeployer: Only lending can call this function"
      );
    });
  });
});
