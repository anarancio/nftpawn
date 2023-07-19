const { expect } = require("chai");
const { ethers } = require("hardhat");

let principal;
let lender1;
let lender2;
let lender3;
let borrower1;
let borrower2;
let borrower3;

describe("Border Cases", function () {
  before(async function () {
    [principal, lender1, lender2, lender3, borrower1, borrower2, borrower3] =
      await ethers.getSigners();

    this.eighteenDecimals = ethers.BigNumber.from(10).pow(18);
    this.eightDecimals = ethers.BigNumber.from(10).pow(8);

    /*
     * Deploy ERC20 tokens
     */
    const erc20Factory = await ethers.getContractFactory("ERC20TestToken");
    this.erc201 = await erc20Factory.deploy(
      "Test Token First",
      "TST1",
      this.eighteenDecimals.mul(100000000000)
    );
    await this.erc201.deployed();

    this.erc202 = await erc20Factory.deploy(
      "Test Token Second",
      "TST2",
      this.eighteenDecimals.mul(100000000000)
    );
    await this.erc202.deployed();

    this.erc203 = await erc20Factory.deploy(
      "Test Token Third",
      "TST3",
      this.eighteenDecimals.mul(100000000000)
    );
    await this.erc203.deployed();

    this.ercFail = await erc20Factory.deploy(
      "Test Token Fail",
      "TSTFAIL",
      this.eighteenDecimals.mul(100000000000)
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
    await this.erc721_I.mint(borrower1.address);
    await this.erc721_I.mint(borrower2.address);
    await this.erc721_I.mint(borrower3.address);

    await this.erc721_II.mint(borrower1.address);
    await this.erc721_II.mint(borrower2.address);

    await this.erc721_III.mint(borrower1.address);

    /*
     * Owner of ERC721 tokens
     */
    console.log("--- NFT Owners --- ");
    console.log("Token ID erc721_I 1 ====> ", await this.erc721_I.ownerOf(1));
    console.log("Token ID erc721_I 2 ====> ", await this.erc721_I.ownerOf(2));
    console.log("Token ID erc721_I 3 ====> ", await this.erc721_I.ownerOf(3));
    console.log("Token ID erc721_II 1 ====> ", await this.erc721_II.ownerOf(1));
    console.log("Token ID erc721_II 2 ====> ", await this.erc721_II.ownerOf(2));
    console.log(
      "Token ID erc721_III 1 ====> ",
      await this.erc721_III.ownerOf(1)
    );

    /*
     * Deploy Lending contract
     */
    const lendingFactory = await ethers.getContractFactory("Lending");
    this.lending = await lendingFactory.deploy();
    await this.lending.deployed();

    // ----------------- Aggregator Factory ----------------- //

    // Factory AggregatorV3Interface contract
    const aggregatorV3InterfaceFactory = await ethers.getContractFactory(
      "InternalERC20Aggregator"
    );

    // ----------------- Aggregator Contracts ----------------- //

    // getBlock
    const block = await ethers.provider.getBlock("latest");
    console.log("block.timestamp ====> ", block.timestamp);

    // ETH/USD
    this.aggregatorETHUSD = await aggregatorV3InterfaceFactory.deploy(
      this.eightDecimals.mul(1600),
      block.timestamp - 1000
    );
    await this.aggregatorETHUSD.deployed();

    // Bored Ape Yacht Club / USD
    this.aggregatorBoredApeUSD = await aggregatorV3InterfaceFactory.deploy(
      this.eightDecimals.mul(100000),
      block.timestamp - 1000
    );
    await this.aggregatorBoredApeUSD.deployed();

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

    // -------------------------------------------------------- //

    /*
     * Set Accepted Floor Price Time in Lending contract
     */
    await this.lending.setAcceptedFloorPriceTime(1000 * 60);

    /*
     * Set Accepted ERC20 Price Time in Lending contract
     */
    await this.lending.setAcceptedERC20PriceTime(1000 * 6000);

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
      this.aggregatorETHUSD.address
    );
    await this.lending.changeERC20Whitelist(
      true,
      2,
      this.erc202.address,
      this.aggregatorETHUSD.address
    );
    await this.lending.changeERC20Whitelist(
      true,
      2,
      this.erc203.address,
      this.aggregatorETHUSD.address
    );

    /*
     * Whitelist ERC721 tokens
     */
    await this.lending.changeNFTWhitelist(
      true,
      this.erc721_I.address,
      this.aggregatorBoredApeUSD.address
    );
    await this.lending.changeNFTWhitelist(
      true,
      this.erc721_II.address,
      this.aggregatorBoredApeUSD.address
    );
    await this.lending.changeNFTWhitelist(
      true,
      this.erc721_III.address,
      this.aggregatorBoredApeUSD.address
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
    await this.lending
      .connect(lender1)
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
    await this.lending
      .connect(lender2)
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
    await this.lending
      .connect(lender3)
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
    await this.lending
      .connect(lender3)
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
    console.log("ALICE ADDRESS:", lender1.address);
    console.log("BOB ADDRESS:", lender2.address);
    console.log("CHARLIE ADDRESS:", lender3.address);
    console.log("---------------------------------");
    console.log("BORROWER1 ADDRESS:", borrower1.address);
    console.log("BORROWER2 ADDRESS:", borrower2.address);
    console.log("BORROWER3 ADDRESS:", borrower3.address);
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

  // CASE 1: Try to create a new Loan with deactivated ERC20 token

  it("Should revert if try to create a new Loan with deactivated ERC20 token", async function () {
    /*
     * Transfer ERC20 tokens to Lender1
     */
    await this.erc201.transfer(
      lender1.address,
      this.eighteenDecimals.mul(1000000)
    );

    /*
     * Approve ERC20 tokens to Basket1 contract
     */
    await this.erc201
      .connect(lender1)
      .approve(
        this.basket1_contract.address,
        this.eighteenDecimals.mul(1000000)
      );

    /*
     * Deposit ERC20 tokens to Basket1 contract
     */
    await this.basket1_contract
      .connect(lender1)
      .depositLiquidity(this.eighteenDecimals.mul(10000));

    /*
     * Deactivate ERC20 token
     */
    await this.lending.changeERC20Whitelist(
      false,
      2,
      this.erc201.address,
      this.aggregatorETHUSD.address
    );

    /*
     * Approve ERC721 tokens to Basket1 contract
     */
    await this.erc721_I
      .connect(borrower1)
      .approve(this.basket1_contract.address, 1);

    /*
     * Borrower1 try to create a new Loan
     */
    await expect(
      this.basket1_contract
        .connect(borrower1)
        .createLoan(2592000000, this.eighteenDecimals.mul(1), 1)
    ).to.be.revertedWithCustomError(this.basket1_contract, "ERC20NotActive");
  });

  // CASE 2: Try to deposit ERC20 tokens to Basket with deactivated ERC20 token

  it("Should revert if try to deposit ERC20 tokens to Basket with deactivated ERC20 token", async function () {
    /*
     * Approve ERC20 tokens to Basket1 contract
     */
    await this.erc201
      .connect(lender1)
      .approve(this.basket1_contract.address, this.eighteenDecimals.mul(10000));

    /*
     * Deactivate ERC20 token
     */
    await this.lending.changeERC20Whitelist(
      false,
      2,
      this.erc201.address,
      this.aggregatorETHUSD.address
    );

    /*
     * Try to deposit ERC20 tokens to Basket1 contract
     */
    await expect(
      this.basket1_contract
        .connect(lender1)
        .depositLiquidity(this.eighteenDecimals.mul(10000))
    ).to.be.revertedWithCustomError(this.basket1_contract, "ERC20NotActive");
  });

  // CASE 3: Try to withdraw ERC20 tokens from Basket with deactivated ERC20 token

  it("Should withdraw ERC20 tokens from Basket with deactivated ERC20 token", async function () {
    /*
     * Lender1 balance must be 990000, because 10000 was deposited to Basket1
     */
    expect(await this.erc201.balanceOf(lender1.address)).to.equal(
      this.eighteenDecimals.mul(990000)
    );

    /*
     * Deactivate ERC20 token
     */
    await this.lending.changeERC20Whitelist(
      false,
      2,
      this.erc201.address,
      this.aggregatorETHUSD.address
    );

    /*
     * Pause Basket1
     */
    await this.basket1_contract.connect(lender1).pauseBasket();

    await expect(
      this.basket1_contract.connect(lender1).withdrawLiquidity(lender1.address)
    )
      .to.emit(this.basket1_contract, "BasketWithdraw")
      .withArgs(this.basket1_contract.id);

    /*
     * Lender1 balance must be 1000000, because 10000 was withdrawn from Basket1
     */
    expect(await this.erc201.balanceOf(lender1.address)).to.equal(
      this.eighteenDecimals.mul(1000000)
    );
  });
});
