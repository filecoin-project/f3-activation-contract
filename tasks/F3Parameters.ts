import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import fs from "fs";
import zlib from "zlib";

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

task("fetchActivationInformation", "Fetches the activation information from the contract")
  .addParam("contract", "The address of the contract")
  .setAction(async (taskArgs: { contract: string }, hre: HardhatRuntimeEnvironment) => {
    const contractAddress = taskArgs.contract;

    const F3Parameters = await hre.ethers.getContractFactory("F3Parameters");
    const contract = F3Parameters.attach(contractAddress);

    const [activationEpoch, manifestData] = await contract.activationInformation();
    const jsonData = zlib.inflateSync(Buffer.from(manifestData)).toString();

    console.log(`Activation Epoch: ${activationEpoch}`);
    console.log(`Manifest Data: ${jsonData}`);
  });

task("setActivationInformation", "Sets the activation information on the contract")
  .addParam("contract", "The address of the contract")
  .addParam("filepath", "The path to the JSON file containing the manifest data")
  .addParam("activationepoch", "The new activation epoch block number")
  .setAction(async (taskArgs: { contract: string; filepath: string; activationepoch: string }, hre: HardhatRuntimeEnvironment) => {
    const contractAddress = taskArgs.contract;
    const filePath = taskArgs.filepath;
    const activationEpoch = parseInt(taskArgs.activationepoch, 10);

    const F3Parameters = await hre.ethers.getContractFactory("F3Parameters");
    const contract = F3Parameters.attach(contractAddress);

    const jsonData = fs.readFileSync(filePath, "utf8");
    const manifestData = zlib.deflateSync(Buffer.from(jsonData));

    console.log(`Setting activation information on contract at ${contractAddress}...`);
    const tx = await contract.updateActivationInformation(activationEpoch, manifestData);
    await tx.wait();

    console.log(`Activation information set with epoch ${activationEpoch}`);
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
