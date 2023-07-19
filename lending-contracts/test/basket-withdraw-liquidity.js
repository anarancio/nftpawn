const { expect } = require("chai");
const { ethers } = require("hardhat");

let principal;
let alice;
let bob;
let charlie;
let oracleAddress = "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"; // ETH/USD
let aggregator = "0x352f2Bc3039429fC2fe62004a1575aE74001CfcE"; // Bored Ape Yacht Club

describe("Basket | Withdraw Liquidity", function () {
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

    /*
     * Set NFTAgreement contract address in Lending contract
     */
    await this.lending.setAgreementAddress(this.agreement.address);

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

  describe("Withdraw Liquidity", function () {
    it("Should revert if msg.sender is not the basket owner", async function () {
      /*
       * Pause Basket 1
       */
      await this.basket1_contract.connect(alice).pauseBasket();
      /*
       * Alice deposit liquidity
       */

      // Basket 1: erc201 = 1000000 |  created by Alice
      await this.erc201.transfer(alice.address, 1000000);
      await this.erc201
        .connect(alice)
        .approve(this.basket1_contract.address, 1000000);
      await this.basket1_contract.connect(alice).depositLiquidity(1000000);

      // ! Console
      console.log("---- WITHDRAW BOB ----");
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

      // await expect(
      //   this.basket1_contract.connect(bob).withdrawLiquidity(charlie.address)
      // ).to.be.revertedWith("Only owner can withdraw liquidity");

      await expect(
        this.basket1_contract.connect(bob).withdrawLiquidity(charlie.address)
      ).to.be.revertedWithCustomError(this.basket1_contract, "NotBasketOwner");
    });

    it("Should revert if basket has no liquidity", async function () {
      // ! Console
      console.log("---- WITHDRAW BOB ----");
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

      await this.basket2_contract.connect(bob).pauseBasket();

      await expect(
        this.basket2_contract.connect(bob).withdrawLiquidity(charlie.address)
      ).to.be.revertedWithCustomError(this.basket2_contract, "NoLiquidity");
    });

    it("Should revert if address 'to' is address(0)", async function () {
      // ! Console
      console.log("---- WITHDRAW BOB ----");
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

      await expect(
        this.basket1_contract
          .connect(alice)
          .withdrawLiquidity(ethers.constants.AddressZero)
      ).to.be.revertedWithCustomError(this.basket1_contract, "AddressZero");
    });

    it("Should withdraw liquidity", async function () {
      // ! Console
      console.log("---- WITHDRAW ALICE BEFORE----");
      console.log("----------------------------");
      console.log(
        "erc201 balance of Basket 1:",
        await this.erc201.balanceOf(this.basket1_contract.address)
      );
      console.log(
        "Basket 1 liquidity:",
        await this.basket1_contract.liquidity()
      );
      console.log(
        "Alice balance of erc201:",
        await this.erc201.balanceOf(alice.address)
      );
      console.log(
        "Charlie balance of erc201:",
        await this.erc201.balanceOf(charlie.address)
      );
      console.log("----------------------------");

      /*
       * Alice Withdraw liquidity
       */
      await expect(
        this.basket1_contract.connect(alice).withdrawLiquidity(charlie.address)
      )
        .to.emit(this.basket1_contract, "BasketWithdraw")
        .withArgs(1);

      // ! Console
      console.log("---- WITHDRAW ALICE AFTER----");
      console.log("----------------------------");
      console.log(
        "erc201 balance of Basket 1:",
        await this.erc201.balanceOf(this.basket1_contract.address)
      );
      console.log(
        "Basket 1 liquidity:",
        await this.basket1_contract.liquidity()
      );
      console.log(
        "Alice balance of erc201:",
        await this.erc201.balanceOf(alice.address)
      );
      console.log(
        "Charlie balance of erc201:",
        await this.erc201.balanceOf(charlie.address)
      );
      console.log("----------------------------");
    });
    it("Should revert if Basket is active", async function () {
      /*
       * Charlie deposit liquidity
       */

      // Basket 3: erc203 = 1000000 |  created by Charlie
      await this.erc203.transfer(charlie.address, 1000000);
      await this.erc203
        .connect(charlie)
        .approve(this.basket3_contract.address, 1000000);
      await this.basket3_contract.connect(charlie).depositLiquidity(1000000);

      // ! Console
      console.log("---- WITHDRAW CHARLIE ----");
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
       * Pause Basket 3
       */

      await expect(
        this.basket3_contract
          .connect(charlie)
          .withdrawLiquidity(charlie.address)
      ).to.be.revertedWith("Pausable: not paused");
    });

    it("Should withdraw if Lending protocol is paused", async function () {
      /*
       * Pause Basket 4
       */
      await this.basket4_contract.connect(charlie).pauseBasket();

      /*
       * Charlie deposit liquidity
       */

      // Basket 4: erc203 = 1000000 |  created by Charlie
      await this.erc203.transfer(charlie.address, 1000000);
      await this.erc203
        .connect(charlie)
        .approve(this.basket4_contract.address, 1000000);
      await this.basket4_contract.connect(charlie).depositLiquidity(1000000);

      /*
       * Pause Leaning protocol
       */
      await this.lending.pauseProtocol();

      await expect(
        this.basket4_contract
          .connect(charlie)
          .withdrawLiquidity(charlie.address)
      ).to.emit(this.basket4_contract, "BasketWithdraw").withArgs(4);
    });
  });
});
