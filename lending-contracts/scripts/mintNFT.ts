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

  const erc721FirstAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  const erc721SecondAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  const erc721ThirdAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
  const erc721FailAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";

  const erc721Factory = await ethers.getContractFactory("ERC721TestToken");

  const erc721_I = erc721Factory.attach(erc721FirstAddress);
  const erc721_II = erc721Factory.attach(erc721SecondAddress);
  const erc721_III = erc721Factory.attach(erc721ThirdAddress);
  const erc721_fail = erc721Factory.attach(erc721FailAddress);

  console.log("--- NFT Addresses --- ");
  console.log("ERC721_I address: ", erc721_I.address);
  console.log("ERC721_II address: ", erc721_II.address);
  console.log("ERC721_III address: ", erc721_III.address);
  console.log("ERC721_fail address: ", erc721_fail.address);
  console.log("--------------------- ");

  console.log("--- BORROWERS --- ");
  console.log("Borrower 1 address: ", borrower1.address);
  console.log("Borrower 2 address: ", borrower2.address);
  console.log("Borrower 3 address: ", borrower3.address);
  console.log("--------------------- ");

  /*
   * Mint ERC721 tokens
   */
    await erc721_I.mint(borrower1.address, { gasLimit: 30000000 });
    await erc721_I.mint(borrower2.address, { gasLimit: 30000000 });
    await erc721_I.mint(borrower3.address, { gasLimit: 30000000 });

    await erc721_II.mint(borrower1.address, { gasLimit: 30000000 });
    await erc721_II.mint(borrower2.address, { gasLimit: 30000000 });

    await erc721_III.mint(borrower1.address, { gasLimit: 30000000 });

  /*
   * Owner of ERC721 tokens
   */
    console.log("--- NFT Owners --- ");
    console.log("Token ID erc721_I 1 ====> ", await erc721_I.ownerOf(1));
    console.log("Token ID erc721_I 2 ====> ", await erc721_I.ownerOf(2));
    console.log("Token ID erc721_I 3 ====> ", await erc721_I.ownerOf(3));
    console.log("Token ID erc721_II 1 ====> ", await erc721_II.ownerOf(1));
    console.log("Token ID erc721_II 2 ====> ", await erc721_II.ownerOf(2));
    console.log("Token ID erc721_III 1 ====> ", await erc721_III.ownerOf(1));
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
