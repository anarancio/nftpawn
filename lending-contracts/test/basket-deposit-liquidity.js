const { expect } = require("chai");
const { ethers } = require("hardhat");

let principal;
let alice;
let bob;
let charlie;
let oracleAddress = "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"; // ETH/USD
let aggregator = "0x352f2Bc3039429fC2fe62004a1575aE74001CfcE"; // Bored Ape Yacht Club

describe("Basket | Deposit Liquidity", function () {
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

    console.log("NFTAgreement address ====> ", this.agreement.address);

    /*
     * Set NFTAgreement contract address in Lending contract
     */
    await this.lending.setAgreementAddress(this.agreement.address);

    console.log(
      "Lending has NFTAgreement address ====> ",
      await this.lending.agreementAddress()
    );

    // BasketDeployer Contract
    const basketDeployerFactory = await ethers.getContractFactory(
      "BasketDeployer"
    );
    this.basketDeployer = await basketDeployerFactory.deploy(
      this.lending.address
    );
    await this.basketDeployer.deployed();

    console.log("BasketDeployer address ====> ", this.basketDeployer.address);

    // set BasketDeployer contract address in Lending contract
    await this.lending.setBasketDeployerAddress(this.basketDeployer.address);

    console.log(
      "Lending has BasketDeployer address ====> ",
      await this.lending.basketDeployerAddress()
    );

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

    /*
     * List of _interestRanges 30days, 60days, 90days in milliseconds
     */
    const interestRanges = [2592000000, 5184000000, 7776000000];

    /*
     * List of _interestValues 30days, 60days, 90days
     */
    const interestValues = [1, 3, 7];

    /*
     * Create Baskets
     */

    /* Basket 1 */
    this.lending
      .connect(alice)
      .createBasket(
        this.erc201.address,
        this.erc721_I.address,
        2,
        interestRanges,
        interestValues,
        true,
        true
      );

    /* Basket 2 */
    this.lending
      .connect(bob)
      .createBasket(
        this.erc202.address,
        this.erc721_II.address,
        2,
        interestRanges,
        interestValues,
        true,
        true
      );

    /* Basket 3 */
    this.lending
      .connect(charlie)
      .createBasket(
        this.erc203.address,
        this.erc721_III.address,
        2,
        interestRanges,
        interestValues,
        true,
        false
      );

    /*
     * Basket 4
     */
    this.lending
      .connect(charlie)
      .createBasket(
        this.erc203.address,
        this.erc721_III.address,
        2,
        interestRanges,
        interestValues,
        false,
        true
      );

    /*
     * Get Basket address by Id
     */
    this.basket0 = await this.lending.baskets(0); // do not exist
    this.basket1 = await this.lending.baskets(1); // created by Alice
    this.basket2 = await this.lending.baskets(2); // created by Bob
    this.basket3 = await this.lending.baskets(3); // created by Charlie
    this.basket4 = await this.lending.baskets(4); // created by Charlie

    console.log("---------------------------------");
    console.log("LENDING ADDRESS:", this.lending.address);
    console.log("---------------------------------");
    console.log("ALICE ADDRESS:", alice.address);
    console.log("BOB ADDRESS:", bob.address);
    console.log("CHARLIE ADDRESS:", charlie.address);
    console.log("---------------------------------");

    console.log("BASKET 0 ADDRESS:", this.basket0);
    console.log("BASKET 1 ADDRESS:", this.basket1);
    console.log("BASKET 2 ADDRESS:", this.basket2);
    console.log("BASKET 3 ADDRESS:", this.basket3);
    console.log("BASKET 4 ADDRESS:", this.basket4);
    console.log("---------------------------------");

    /*
     * Get Basket instance
     */
    const basketFactory = await ethers.getContractFactory("Basket");

    this.basket1_contract = await basketFactory.attach(this.basket1);
    this.basket2_contract = await basketFactory.attach(this.basket2);
    this.basket3_contract = await basketFactory.attach(this.basket3);
    this.basket4_contract = await basketFactory.attach(this.basket4);

    console.log("BASKET 1 OWNER", await this.basket1_contract.owner());
    console.log("BASKET 2 OWNER", await this.basket2_contract.owner());
    console.log("BASKET 3 OWNER", await this.basket3_contract.owner());
    console.log("BASKET 4 OWNER", await this.basket4_contract.owner());
    console.log("---------------------------------");
  });

  describe("Deposit Liquidity", function () {
    it("Should revert if amount is 0", async function () {
      /*
       * Alice deposit liquidity
       */

      // Basket 1: erc201 = 0
      await this.erc201.transfer(alice.address, 1000000);
      await this.erc201
        .connect(alice)
        .approve(this.basket1_contract.address, 1000000);
      await expect(
        this.basket1_contract.connect(alice).depositLiquidity(0)
      ).to.be.revertedWithCustomError(this.basket1_contract, "AmountLessZero");
    });

    it("Should revert if has not enough balance", async function () {
      /*
       * Alice deposit liquidity
       */
      await this.erc201
        .connect(alice)
        .approve(this.basket1_contract.address, 9000000);
 
      await expect(
        this.basket1_contract.connect(alice).depositLiquidity(9000000)
      ).to.be.revertedWithCustomError(this.basket1_contract, "NotEnoughBalance");

    });

    it("Should revert if has not enough allowance", async function () {
      /*
       * Alice deposit liquidity
       */
      await this.erc201
        .connect(alice)
        .approve(this.basket1_contract.address, 1000);
      await expect(
        this.basket1_contract.connect(alice).depositLiquidity(100000)
      ).to.be.revertedWithCustomError(this.basket1_contract, "NotEnoughAllowance");
    });

    it("Should deposit liquidity", async function () {
      /*
       * Alice deposit liquidity
       */

      // Basket 1: erc201 = 1000000
      await this.erc201.transfer(alice.address, 1000000);
      await this.erc201
        .connect(alice)
        .approve(this.basket1_contract.address, 1000000);
      await this.basket1_contract.connect(alice).depositLiquidity(1000000);

      // ! Console
      console.log("---- DEPOSIT ALICE ----");
      console.log("----------------------------");
      console.log(
        "erc201 balance of Basket 1:",
        await this.erc201.balanceOf(this.basket1_contract.address)
      );
      console.log(
        "Basket 1 liquidity:",
        await this.basket1_contract.liquidity()
      );
      console.log("----------------------------");
      console.log("----------------------------");
      console.log(
        "erc202 balance of Basket 2:",
        await this.erc202.balanceOf(this.basket2_contract.address)
      );
      console.log(
        "Basket 2 liquidity:",
        await this.basket2_contract.liquidity()
      );
      console.log("----------------------------");
      console.log("----------------------------");
      console.log(
        "erc203 balance of Basket 3:",
        await this.erc203.balanceOf(this.basket3_contract.address)
      );
      console.log(
        "Basket 3 liquidity:",
        await this.basket3_contract.liquidity()
      );
      console.log("----------------------------");

      /*
       * Bob deposit liquidity
       */

      // Basket 1: erc201 = 1500000
      await this.erc201.transfer(bob.address, 3000000);
      await this.erc201
        .connect(bob)
        .approve(this.basket1_contract.address, 1500000);
      await this.basket1_contract.connect(bob).depositLiquidity(1500000);

      // Basket 2: erc202 = 1000000
      await this.erc202.transfer(bob.address, 1000000);
      await this.erc202
        .connect(bob)
        .approve(this.basket2_contract.address, 1000000);
      await this.basket2_contract.connect(bob).depositLiquidity(1000000);

      console.log("---- DEPOSIT BOB ----");
      console.log("----------------------------");
      console.log(
        "erc201 balance of Basket 1:",
        await this.erc201.balanceOf(this.basket1_contract.address)
      );
      console.log(
        "Basket 1 liquidity:",
        await this.basket1_contract.liquidity()
      );
      console.log("----------------------------");
      console.log("----------------------------");
      console.log(
        "erc202 balance of Basket 2:",
        await this.erc202.balanceOf(this.basket2_contract.address)
      );
      console.log(
        "Basket 2 liquidity:",
        await this.basket2_contract.liquidity()
      );
      console.log("----------------------------");
      console.log("----------------------------");
      console.log(
        "erc203 balance of Basket 3:",
        await this.erc203.balanceOf(this.basket3_contract.address)
      );
      console.log(
        "Basket 3 liquidity:",
        await this.basket3_contract.liquidity()
      );
      console.log("----------------------------");

      /*
       * Charlie deposit liquidity
       */

      // Basket 1: erc201 = 2000000
      await this.erc201.transfer(charlie.address, 2000000);
      await this.erc201
        .connect(charlie)
        .approve(this.basket1_contract.address, 2000000);
      await this.basket1_contract.connect(charlie).depositLiquidity(2000000);

      // Basket 2: erc202 = 3000000
      await this.erc202.transfer(charlie.address, 3000000);
      await this.erc202
        .connect(charlie)
        .approve(this.basket2_contract.address, 3000000);
      await this.basket2_contract.connect(charlie).depositLiquidity(3000000);

      // Basket 3: erc203 = 1000000
      await this.erc203.transfer(charlie.address, 1000000);
      await this.erc203
        .connect(charlie)
        .approve(this.basket3_contract.address, 1000000);
      await this.basket3_contract.connect(charlie).depositLiquidity(1000000);

      console.log("---- DEPOSIT CHARLIE ----");
      console.log("----------------------------");
      console.log(
        "erc201 balance of Basket 1:",
        await this.erc201.balanceOf(this.basket1_contract.address)
      );
      console.log(
        "Basket 1 liquidity:",
        await this.basket1_contract.liquidity()
      );
      console.log("----------------------------");
      console.log("----------------------------");
      console.log(
        "erc202 balance of Basket 2:",
        await this.erc202.balanceOf(this.basket2_contract.address)
      );
      console.log(
        "Basket 2 liquidity:",
        await this.basket2_contract.liquidity()
      );
      console.log("----------------------------");
      console.log("----------------------------");
      console.log(
        "erc203 balance of Basket 3:",
        await this.erc203.balanceOf(this.basket3_contract.address)
      );
      console.log(
        "Basket 3 liquidity:",
        await this.basket3_contract.liquidity()
      );
      console.log("----------------------------");
    });

    it("Should revert if Lending protocol is paused", async function () {
      /*
       * Pause Leaning protocol
       */
      await this.lending.pauseProtocol();

      /*
       * Alice deposit liquidity
       */
      await this.erc201.transfer(alice.address, 1000000);
      await this.erc201
        .connect(alice)
        .approve(this.basket1_contract.address, 1000000);
      // await expect(
      //   this.basket1_contract.connect(alice).depositLiquidity(1000000)
      // ).to.be.revertedWith("Lending protocol is paused");
      await expect(
        this.basket1_contract.connect(alice).depositLiquidity(1000000)
      ).to.be.revertedWithCustomError(
        this.basket1_contract,
        "LendingProtocolPaused"
      );
    });
  });
});
