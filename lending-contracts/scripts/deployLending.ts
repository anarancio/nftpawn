import { ethers } from "hardhat";

async function main() {
  const eighteenDecimals = ethers.BigNumber.from(10).pow(18);
  const eightDecimals = ethers.BigNumber.from(10).pow(8);

  /*
   * Deploy ERC20 tokens ================> FIRST
   */
  const erc20Factory = await ethers.getContractFactory("ERC20TestToken");
  const erc201 = await erc20Factory.deploy(
    "Test Token First",
    "TST1",
    eighteenDecimals.mul(100000000000)
  );
  await erc201.deployed();

  const erc202 = await erc20Factory.deploy(
    "Test Token Second",
    "TST2",
    eighteenDecimals.mul(100000000000)
  );
  await erc202.deployed();

  const erc203 = await erc20Factory.deploy(
    "Test Token Third",
    "TST3",
    eighteenDecimals.mul(100000000000)
  );
  await erc203.deployed();

  const ercFail = await erc20Factory.deploy(
    "Test Token Fail",
    "TSTFAIL",
    eighteenDecimals.mul(100000000000)
  );
  await ercFail.deployed();

  console.log("--- ERC20 Tokens ---");
  console.log("ERC20 Test Token First deployed to:", erc201.address);
  console.log("ERC20 Test Token Second deployed to:", erc202.address);
  console.log("ERC20 Test Token Third deployed to:", erc203.address);
  console.log("ERC20 Test Token Fail deployed to:", ercFail.address);
  console.log("--------------------");

  /*
   * Deploy ERC721 tokens ================> FIRST
   */
  const erc721Factory = await ethers.getContractFactory("ERC721TestToken");
  const erc721_I = await erc721Factory.deploy("Test NFT I", "TSTNFT_I");
  await erc721_I.deployed();

  const erc721_II = await erc721Factory.deploy("Test NFT II", "TSTNFT_II");
  await erc721_II.deployed();

  const erc721_III = await erc721Factory.deploy("Test NFT III", "TSTNFT_III");
  await erc721_III.deployed();

  const erc721_Fail = await erc721Factory.deploy(
    "Test NFT Fail",
    "TSTNFT_FAIL"
  );
  await erc721_Fail.deployed();

  console.log("--- ERC721 Tokens ---");
  console.log("ERC721 Test Token First deployed to:", erc721_I.address);
  console.log("ERC721 Test Token Second deployed to:", erc721_II.address);
  console.log("ERC721 Test Token Third deployed to:", erc721_III.address);
  console.log("ERC721 Test Token Fail deployed to:", erc721_Fail.address);
  console.log("--------------------");

  /*
   * Deploy Lending contract  ================> FIRST
   */
  const lendingFactory = await ethers.getContractFactory("Lending");
  const lending = await lendingFactory.deploy();
  await lending.deployed();

  console.log("--- Lending ---");
  console.log("Lending deployed to:", lending.address);
  console.log("--------------------");

  // ----------------- Aggregator Factory ----------------- //

  // Factory AggregatorV3Interface contract
  const aggregatorV3InterfaceFactory = await ethers.getContractFactory(
    "InternalERC20Aggregator"
  );

  // ----------------- Aggregator Contracts ----------------- //

  // getBlock
  const block = await ethers.provider.getBlock("latest");
  console.log("block.timestamp ====> ", block.timestamp);

  // ETH/USD =====================> FIRST
  const aggregatorETHUSD = await aggregatorV3InterfaceFactory.deploy(
    eightDecimals.mul(1600),
    block.timestamp - 1000
  );
  await aggregatorETHUSD.deployed();

  // Bored Ape Yacht Club / USD =====================> FIRST
  const aggregatorBoredApeUSD = await aggregatorV3InterfaceFactory.deploy(
    eightDecimals.mul(100000),
    block.timestamp - 1000
  );
  await aggregatorBoredApeUSD.deployed();

  console.log("--- Aggregator Contracts ---");
  console.log("Aggregator ETH/USD deployed to:", aggregatorETHUSD.address);
  console.log(
    "Aggregator Bored Ape Yacht Club / USD deployed to:",
    aggregatorBoredApeUSD.address
  );
  console.log("--------------------");

  /*
   * Deploy NFTAgreement contract ================> FIRST
   */
  const agreementFactory = await ethers.getContractFactory("NFTAgreement");
  const agreement = await agreementFactory.deploy(
    "NFT NFTAgreement",
    "NFTA",
    lending.address
  );
  await agreement.deployed();

  console.log("--- NFTAgreement ---");
  console.log("NFTAgreement deployed to:", agreement.address);
  console.log("--------------------");

  // -------------------------------------------------------- //

  console.log("Setting up Lending contract...");
  /*
   * Set Accepted Floor Price Time in Lending contract ================> FIRST SET
   */
  await lending.setAcceptedFloorPriceTime(1000 * 60);

  console.log(
    "Lending acceptedFloorPriceTime ====> ",
    await lending.acceptedFloorPriceTime()
  );

  /*
   * Set Accepted ERC20 Price Time in Lending contract ================> FIRST SET
   */
  await lending.setAcceptedERC20PriceTime(1000 * 6000);

  console.log(
    "Lending acceptedERC20PriceTime ====> ",
    await lending.acceptedERC20PriceTime()
  );

  /*
   * Set NFTAgreement contract address in Lending contract ================> FIRST SET
   */
  await lending.setAgreementAddress(agreement.address);

  console.log(
    "Lending agreementAddress ====> ",
    await lending.agreementAddress()
  );

  console.log("--------------------");

  // BasketDeployer Contract =====================> FIRST
  const basketDeployerFactory = await ethers.getContractFactory(
    "BasketDeployer"
  );
  const basketDeployer = await basketDeployerFactory.deploy(lending.address);
  await basketDeployer.deployed();

  console.log("--- BasketDeployer ---");
  console.log("BasketDeployer address ====> ", basketDeployer.address);
  console.log("--------------------");

  // set BasketDeployer contract address in Lending contract =====================> FIRST SET
  await lending.setBasketDeployerAddress(basketDeployer.address);

  console.log("Setting up BasketDeployer contract in Lending contract...");
  console.log(
    "Lending basketDeployerAddress ====> ",
    await lending.basketDeployerAddress()
  );
  console.log("--------------------");
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
