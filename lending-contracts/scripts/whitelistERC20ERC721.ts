import { ethers } from "hardhat";

async function main() {
  const lendingAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
  const lendingFactory = await ethers.getContractFactory("Lending");
  const lending = lendingFactory.attach(lendingAddress);

  const erc201Address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const erc202Address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const erc203Address = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const erc20FailAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

  const erc20Factory = await ethers.getContractFactory("ERC20TestToken");

  const erc201 = erc20Factory.attach(erc201Address);
  const erc202 = erc20Factory.attach(erc202Address);
  const erc203 = erc20Factory.attach(erc203Address);
  const erc20Fail = erc20Factory.attach(erc20FailAddress);

  const erc721FirstAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const erc721SecondAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const erc721ThirdAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const erc721FailAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

  const erc721Factory = await ethers.getContractFactory("ERC721TestToken");

  const erc721_I = erc721Factory.attach(erc721FirstAddress);
  const erc721_II = erc721Factory.attach(erc721SecondAddress);
  const erc721_III = erc721Factory.attach(erc721ThirdAddress);
  const erc721_fail = erc721Factory.attach(erc721FailAddress);

  const aggregatorETHUSDAddress = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";

  const aggregatorETHUSDFactory = await ethers.getContractFactory(
    "InternalERC20Aggregator"
  );

  const aggregatorETHUSD = aggregatorETHUSDFactory.attach(
    aggregatorETHUSDAddress
  );

  const aggregatorBoredApeUSDAddress =
    "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

  const aggregatorBoredApeUSDFactory = await ethers.getContractFactory(
    "InternalERC20Aggregator"
  );

  const aggregatorBoredApeUSD = aggregatorBoredApeUSDFactory.attach(
    aggregatorBoredApeUSDAddress
  );

  /*
   * Whitelist ERC20 tokens ================> SECOND WHITELIST ERC20
   */
  await lending.changeERC20Whitelist(
    true,
    2,
    erc201.address,
    aggregatorETHUSD.address
  );
  await lending.changeERC20Whitelist(
    true,
    2,
    erc202.address,
    aggregatorETHUSD.address
  );
  await lending.changeERC20Whitelist(
    true,
    2,
    erc203.address,
    aggregatorETHUSD.address
  );

  console.log("---- ERC20 ----");
  console.log(
    "ERC201 is whitelisted: ",
    await lending.whitelistedERC20s(erc201.address)
  );
  console.log(
    "ERC202 is whitelisted: ",
    await lending.whitelistedERC20s(erc202.address)
  );
  console.log(
    "ERC203 is whitelisted: ",
    await lending.whitelistedERC20s(erc203.address)
  );
  console.log(
    "ERC20Fail is whitelisted: ",
    await lending.whitelistedERC20s(erc20Fail.address)
  );
    console.log("--------");

  /*
   * Whitelist ERC721 tokens ================> THIRD WHITELIST ERC721
   */
  await lending.changeNFTWhitelist(
    true,
    erc721_I.address,
    aggregatorBoredApeUSD.address
  );
  await lending.changeNFTWhitelist(
    true,
    erc721_II.address,
    aggregatorBoredApeUSD.address
  );
  await lending.changeNFTWhitelist(
    true,
    erc721_III.address,
    aggregatorBoredApeUSD.address
  );

  console.log("---- ERC721 ----")
  console.log(
    "ERC721_I is whitelisted: ",
    await lending.whitelistedNFTs(erc721_I.address)
  );
  console.log(
    "ERC721_II is whitelisted: ",
    await lending.whitelistedNFTs(erc721_II.address)
  );
  console.log(
    "ERC721_III is whitelisted: ",
    await lending.whitelistedNFTs(erc721_III.address)
  );
  console.log(
    "ERC721_fail is whitelisted: ",
    await lending.whitelistedNFTs(erc721_fail.address)
  );
    console.log("--------")
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
