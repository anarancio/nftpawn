const { expect } = require("chai");
const { ethers } = require("hardhat");

let principal;
let lender1;
let lender2;
let lender3;
let borrower1;
let borrower2;
let borrower3;

describe("Basket | Pay Loan", function () {
  before(async function () {
    [principal, lender1, lender2, lender3, borrower1, borrower2, borrower3] =
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
      1600,
      block.timestamp - 1000
    );
    await this.aggregatorETHUSD.deployed();

    // Bored Ape Yacht Club / USD
    this.aggregatorBoredApeUSD = await aggregatorV3InterfaceFactory.deploy(
      100000,
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
    const interestValues = [10, 20, 70];

    /*
     * Create Baskets
     */

    /* Basket 1 */
    this.lending.connect(lender1).createBasket(
      this.erc201.address,
      this.erc721_I.address,
      30, // 30% of NFT
      interestRanges,
      interestValues,
      true,
      true
    );

    /* Basket 2 */
    this.lending.connect(lender2).createBasket(
      this.erc202.address,
      this.erc721_II.address,
      30, // 30% of NFT
      interestRanges,
      interestValues,
      true,
      true
    );

    /* Basket 3 */
    this.lending.connect(lender3).createBasket(
      this.erc203.address,
      this.erc721_III.address,
      30, // 30% of NFT
      interestRanges,
      interestValues,
      true,
      false
    );

    /*
     * Basket 4
     */
    this.lending.connect(lender3).createBasket(
      this.erc203.address,
      this.erc721_III.address,
      30, // 30% of NFT
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

    /*
     * Transfer ERC20 tokens to Lender1
     */
    await this.erc201.transfer(lender1.address, 1000000);

    /*
     * Approve ERC20 tokens to Basket1 contract
     */
    await this.erc201
      .connect(lender1)
      .approve(this.basket1_contract.address, 200000);

    /*
     * Deposit ERC20 tokens to Basket1 contract
     */
    await this.basket1_contract.connect(lender1).depositLiquidity(200000);

    /*
     * Approve ERC721 tokens to Basket1 contract
     */
    await this.erc721_I
      .connect(borrower1)
      .approve(this.basket1_contract.address, 1);

    /*
     * Borrower1 create a Loan
     */
    this.basket1_contract.connect(borrower1).createLoan(5184000000, 15, 1);

    console.log("Loan 1:", await this.basket1_contract.loans(1));
  });

  it("Should revert if not the BORROWER Agreement", async function () {
    /*
     * Transfer ERC20 tokens to Borrower1
     */
    await this.erc201.transfer(borrower1.address, 1000000);

    /*
     * Approve ERC20 tokens to Basket1 contract
     */
    await this.erc201
      .connect(borrower1)
      .approve(this.basket1_contract.address, 200000);

    /*
     * Pay Loan 1
     */
    await expect(
      this.basket1_contract.connect(borrower1).pay(1, 1)
    ).to.be.revertedWith("Only BORROWER Agreement");
  });

  it("Should revert if amount is 0 or less", async function () {
    /*
     * Pay Loan 1
     */
    await expect(
      this.basket1_contract.connect(borrower1).pay(0, 2)
    ).to.be.revertedWith("Amount <= 0");
  });

  it("Should revert Borrower not have enough balance", async function () {
    console.log(
      "Borrower2 balance:",
      await this.erc201.balanceOf(borrower2.address)
    );
    /*
     * Pay Loan 1
     */
    await expect(
      this.basket1_contract.connect(borrower2).pay(100000, 2)
    ).to.be.revertedWith("Not enough balance");
  });

  it("Should revert Borrower not have enough allowance", async function () {
    /*
     * Transfer ERC20 tokens to Borrower2
     */
    await this.erc201.transfer(borrower2.address, 1000000);

    console.log(
      "Borrower2 balance:",
      await this.erc201.balanceOf(borrower2.address)
    );
    /*
     * Pay Loan 1
     */
    await expect(
      this.basket1_contract.connect(borrower2).pay(100000, 2)
    ).to.be.revertedWith("Not enough allowance");
  });

  it("Should pay Loan 1", async function () {
    /*
     * Borrower1 pay Loan 1
     */
    await expect(this.basket1_contract.connect(borrower1).pay(4, 2))
      .to.emit(this.basket1_contract, "LoanPayment")
      .withArgs(1, this.basket1_contract.address, 1, borrower1.address, 4, 14);

    console.log("Loan 1:", await this.basket1_contract.loans(1));

    /*
     * Approve ERC20 tokens to Basket1 contract
     */
    await this.erc201
      .connect(borrower2)
      .approve(this.basket1_contract.address, 200000);

    /*
     * Borrower2 pay Loan 1
     */
    await expect(this.basket1_contract.connect(borrower2).pay(13, 2)).to.emit(
      this.basket1_contract,
      "LoanPayment"
    );

    console.log("Loan 1:", await this.basket1_contract.loans(1));
  });

  it("Should revert if Basket is not found", async function () {
    /*
     * Pay Loan 1
     */
    await expect(
      this.basket2_contract.connect(borrower1).pay(1, 2)
    ).to.be.revertedWith("Basket not found");
  });

  it("Should pay the total of the Loan", async function () {
    // Borrower1 Saldo = 1000000 SI + 15 Loan - 4 Payment = 1000011
    expect(await this.erc201.balanceOf(borrower1.address)).to.equal(1000011);

    /*
     * Loan: 15
     * InterestAmount: 3
     * Payment Borrower1: 4
     * Payment Borrower2: 13
     * Total Payment: 17
     * Remaining: 18 - 17 = 1
     */

    expect(await this.agreement.ownerOf(1)).to.equal(lender1.address);
    expect(await this.agreement.ownerOf(2)).to.equal(borrower1.address);
    /*
     * Pay Loan 1
     */
    await expect(this.basket1_contract.connect(borrower1).pay(6, 2))
      .to.emit(this.basket1_contract, "LoanNFTClaimed")
      .withArgs(1, this.basket1_contract.address, 1, borrower1.address);

    /*
     * Aunque el pago es de 6, el contrato solo se transfiere 1
     */

    expect(await this.erc201.balanceOf(borrower1.address)).to.equal(1000010);
  });

  it("Should revert if Loan is not active", async function () {
    /*
     * Pay Loan 1
     */
    await expect(
      this.basket1_contract.connect(borrower1).pay(1, 2)
    ).to.be.revertedWith("Loan not active");
  });

  it("Should revert if Loan has expired", async function () {
    /*
     * Approve ERC721 tokens to Basket1 contract
     */
    await this.erc721_I
      .connect(borrower2)
      .approve(this.basket1_contract.address, 2);

    this.basket1_contract.connect(borrower2).createLoan(5184000000, 13, 2);

    // Owner of NFT must be Basket contract
    expect(await this.erc721_I.ownerOf(2)).to.equal(
      this.basket1_contract.address
    );

    // Loan
    console.log("Loan 2:", await this.basket1_contract.loans(2));

    const provider = ethers.provider;

    // Increase timestamp by 5184000010 milliseconds | (60 days + 10 seconds)
    await provider.send("evm_increaseTime", [5184000010]);

    // Mine a new block
    await provider.send("evm_mine");

    /*
     * Pay Loan 1 Basket2
     */
    await expect(
      this.basket1_contract.connect(borrower2).pay(1, 4)
    ).to.be.revertedWith("Loan expired");

    // Owner of NFT must be Basket contract
    expect(await this.erc721_I.ownerOf(2)).to.equal(
      this.basket1_contract.address
    );
  });

  it("Should revert if ERC20 price is Outdated", async function () {
    // Owner of NFT must be Borrower3
    expect(await this.erc721_I.ownerOf(3)).to.equal(borrower3.address);

    /*
     * Approve ERC721 tokens to Basket1 contract
     */
    await this.erc721_I
      .connect(borrower3)
      .approve(this.basket1_contract.address, 3);

    await expect(
      this.basket1_contract.connect(borrower3).createLoan(5184000000, 13, 3)
    ).to.be.revertedWithCustomError(
      this.basket1_contract,
      "ERC20PriceOutdated"
    );
  });

  it("Should revert if NFT Floor price is Outdated", async function () {
    const block2 = await ethers.provider.getBlock("latest");
    const block2Timestamp = block2.timestamp;

    await this.aggregatorETHUSD.setLatestAnswer(1600, block2Timestamp);

    /*
     * Approve ERC721 tokens to Basket1 contract
     */
    await this.erc721_I
      .connect(borrower3)
      .approve(this.basket1_contract.address, 3);

    await expect(
      this.basket1_contract.connect(borrower3).createLoan(5184000000, 13, 3)
    ).to.be.revertedWithCustomError(
      this.basket1_contract,
      "FloorPriceOutdated"
    );
  });
});
