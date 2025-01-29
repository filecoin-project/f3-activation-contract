const { task } = require("hardhat/config");

task("transferOwnership", "Transfers ownership of the contract to a new account")
  .addParam("contract", "The address of the contract")
  .addParam("newOwner", "The address of the new owner")
  .setAction(async (taskArgs, hre) => {
    const contractAddress = taskArgs.contract;
    const newOwnerAddress = taskArgs.newOwner;

    const F3Parameters = await hre.ethers.getContractFactory("F3Parameters");
    const contract = F3Parameters.attach(contractAddress);

    console.log(`Transferring ownership of contract at ${contractAddress} to ${newOwnerAddress}...`);
    const tx = await contract.transferOwnership(newOwnerAddress);
    await tx.wait();

    console.log(`Ownership transferred to ${newOwnerAddress}`);
  });
