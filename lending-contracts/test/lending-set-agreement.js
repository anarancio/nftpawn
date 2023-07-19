const { expect } = require("chai");
const { ethers } = require("hardhat");

let principal;
let alice;
let bob;
let charlie;
let oracleAddress = "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"; // ETH/USD
let aggregator = "0x352f2Bc3039429fC2fe62004a1575aE74001CfcE"; // Bored Ape Yacht Club

describe("Lending | Set Agreement", function () {
  before(async function () {
    [principal, alice, bob, charlie, failERC20Address, failERC721Address] =
      await ethers.getSigners();

    /*
     * Deploy ERC20 tokens
     */
    const erc20Factory = await ethers.getContractFactory("ERC20TestToken");
    this.erc201 = await erc20Factory.deploy(
      "Test Token First",
      "TST1",
      1000000000000000
    );
    await this.erc201.deployed();

    this.erc202 = await erc20Factory.deploy(
      "Test Token Second",
      "TST2",
      1000000000000000
    );
    await this.erc202.deployed();

    this.erc203 = await erc20Factory.deploy(
      "Test Token Third",
      "TST3",
      1000000000000000
    );
    await this.erc203.deployed();

    this.ercFail = await erc20Factory.deploy(
      "Test Token Fail",
      "TSTFAIL",
      1000000000000000
    );
    await this.ercFail.deployed();

    /*
     * Deploy ERC721 tokens
     */
    const erc721Factory = await ethers.getContractFactory("ERC721TestToken");
    this.erc721_I = await erc721Factory.deploy("Test NFT I", "TSTNFT_I");
    await this.erc721_I.deployed();

    this.erc721_II = await erc721Factory.deploy("Test NFT II", "TSTNFT_II");
    await this.erc721_II.deployed();

    this.erc721_III = await erc721Factory.deploy("Test NFT III", "TSTNFT_III");
    await this.erc721_III.deployed();

    this.erc721_Fail = await erc721Factory.deploy(
      "Test NFT Fail",
      "TSTNFT_FAIL"
    );
    await this.erc721_Fail.deployed();

    /*
     * Mint ERC721 tokens
     */
    await this.erc721_I.mint(alice.address);
    await this.erc721_I.mint(bob.address);
    await this.erc721_I.mint(charlie.address);

    await this.erc721_II.mint(alice.address);
    await this.erc721_II.mint(bob.address);

    await this.erc721_III.mint(alice.address);

    // ! Console
    console.log(
      "ERC20 tokens deployed to:",
      this.erc201.address,
      this.erc202.address,
      this.erc203.address,
      this.ercFail.address
    );
    console.log(
      "ERC721 tokens deployed to:",
      this.erc721_I.address,
      this.erc721_II.address,
      this.erc721_III.address,
      this.erc721_Fail.address
    );

    /*
     * Deploy Lending contract
     */
    const lendingFactory = await ethers.getContractFactory("Lending");
    this.lending = await lendingFactory.deploy();
    await this.lending.deployed();

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

    // /*
    //  * Set NFTAgreement contract address in Lending contract
    //  */
    // await this.lending.setAgreementAddress(this.agreement.address);

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
  });

  describe("Lending", function () {
    it("Should revert if setAgreementAddress not called by the owner", async function () {
      await expect(
        this.lending.connect(alice).setAgreementAddress(this.agreement.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Should revert if setAgreementAddress called by the owner with address(0)", async function () {
      await expect(
        this.lending.setAgreementAddress(ethers.constants.AddressZero)
      ).to.be.revertedWithCustomError(this.lending, "AgreementAddressZero");
    });
    it("Should revert if setAgreementAddress called by the owner with address(this)", async function () {
      await expect(
        this.lending.setAgreementAddress(this.lending.address)
      ).to.be.revertedWithCustomError(
        this.lending,
        "AgreementAddressNotLendingContract"
      );
    });
    it("Should set NFTAgreement address", async function () {
      await expect(this.lending.setAgreementAddress(this.agreement.address))
        .to.emit(this.lending, "AgreementAddressUpdated")
        .withArgs(this.agreement.address);
    });
  });
});
