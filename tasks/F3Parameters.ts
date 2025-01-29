import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("transferOwnership", "Transfers ownership of the contract to a new account")
  .addParam("contract", "The address of the contract")
  .addParam("newowner", "The address of the new owner")
  .setAction(async (taskArgs: { contract: string; newowner: string }, hre: HardhatRuntimeEnvironment) => {
    const contractAddress = taskArgs.contract;
    const newOwnerAddress = taskArgs.newowner;

    const F3Parameters = await hre.ethers.getContractFactory("F3Parameters");
    const contract = F3Parameters.attach(contractAddress);

    console.log(`Transferring ownership of contract at ${contractAddress} to ${newOwnerAddress}...`);
    const tx = await contract.transferOwnership(newOwnerAddress);
    await tx.wait();

    console.log(`Ownership transferred to ${newOwnerAddress}`);
  });

task("queryOwnership", "Queries the current owner of the contract")
  .addParam("contract", "The address of the contract")
  .setAction(async (taskArgs: { contract: string }, hre: HardhatRuntimeEnvironment) => {
    const contractAddress = taskArgs.contract;

    const F3Parameters = await hre.ethers.getContractFactory("F3Parameters");
    const contract = F3Parameters.attach(contractAddress);

    const ownerAddress = await contract.owner();
    console.log(`The current owner of the contract at ${contractAddress} is ${ownerAddress}`);
  });
