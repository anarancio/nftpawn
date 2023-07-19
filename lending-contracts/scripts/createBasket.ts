import { ethers } from "hardhat";

let principal;
let lender1;
let lender2;
let lender3;
let borrower1;
let borrower2;
let borrower3;

async function main() {
  [principal, lender1, lender2, lender3, borrower1, borrower2, borrower3] =
    await ethers.getSigners();

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
  /*
   * List of _interestRanges 30days, 60days, 90days in milliseconds
   */
  const interestRanges = [2592000000, 5184000000, 7776000000];

  /*
   * List of _interestValues 30days, 60days, 90days
   */
  const interestValues = [1, 3, 7];

  console.log("Creating Baskets...");
  /*
   * Create Baskets
   */

  /* Basket 1 */
  await lending
    .connect(lender1)
    .createBasket(
      erc201.address,
      erc721_I.address,
      2,
      interestRanges,
      interestValues,
      true,
      true
    );

  /* Basket 2 */
  await lending
    .connect(lender2)
    .createBasket(
      erc202.address,
      erc721_II.address,
      2,
      interestRanges,
      interestValues,
      true,
      true
    );

  /* Basket 3 */
  await lending
    .connect(lender3)
    .createBasket(
      erc203.address,
      erc721_III.address,
      2,
      interestRanges,
      interestValues,
      true,
      false
    );

  /*
   * Basket 4
   */
  await lending
    .connect(lender3)
    .createBasket(
      erc203.address,
      erc721_III.address,
      2,
      interestRanges,
      interestValues,
      false,
      true
    );

  /*
   * Get Basket address by Id
   */
  const basket0 = await lending.baskets(0); // do not exist
  const basket1 = await lending.baskets(1); // created by Alice
  const basket2 = await lending.baskets(2); // created by Bob
  const basket3 = await lending.baskets(3); // created by Charlie
  const basket4 = await lending.baskets(4); // created by Charlie

  console.log("---------------------------------");
  console.log("LENDING ADDRESS:", lending.address);
  console.log("---------------------------------");
  console.log("ALICE ADDRESS:", lender1.address);
  console.log("BOB ADDRESS:", lender2.address);
  console.log("CHARLIE ADDRESS:", lender3.address);
  console.log("---------------------------------");
  console.log("BORROWER1 ADDRESS:", borrower1.address);
  console.log("BORROWER2 ADDRESS:", borrower2.address);
  console.log("BORROWER3 ADDRESS:", borrower3.address);
  console.log("---------------------------------");

  console.log("BASKET 0 ADDRESS:", basket0);
  console.log("BASKET 1 ADDRESS:", basket1);
  console.log("BASKET 2 ADDRESS:", basket2);
  console.log("BASKET 3 ADDRESS:", basket3);
  console.log("BASKET 4 ADDRESS:", basket4);
  console.log("---------------------------------");

  /*
   * Get Basket instance
   */

  const basketFactory = await ethers.getContractFactory("Basket");

  const basket1_contract = await basketFactory.attach(basket1);
  const basket2_contract = await basketFactory.attach(basket2);
  const basket3_contract = await basketFactory.attach(basket3);
  const basket4_contract = await basketFactory.attach(basket4);

  console.log("BASKET 1 OWNER", await basket1_contract.owner());
  console.log("BASKET 2 OWNER", await basket2_contract.owner());
  console.log("BASKET 3 OWNER", await basket3_contract.owner());
  console.log("BASKET 4 OWNER", await basket4_contract.owner());
  console.log("---------------------------------");
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
