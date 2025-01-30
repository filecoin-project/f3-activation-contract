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

task("queryActivationInformation", "Fetches the activation information from the contract")
  .addParam("contract", "The address of the contract")
  .setAction(async (taskArgs: { contract: string }, hre: HardhatRuntimeEnvironment) => {
    const contractAddress = taskArgs.contract;

    const F3Parameters = await hre.ethers.getContractFactory("F3Parameters");
    const contract = F3Parameters.attach(contractAddress);

    const [activationEpoch, manifestDataHex] = await contract.activationInformation();
    const manifestData = Buffer.from(manifestDataHex.slice(2), 'hex');
    let jsonData = "";
	console.log(manifestData.length, "data", manifestData)

    if (manifestData.length > 0) {
      jsonData = zlib.inflateSync(Buffer.from(manifestData)).toString();
      const jsonObject = JSON.parse(jsonData);
      const bootstrapEpoch = jsonObject.BootstrapEpoch;

      console.log(`Activation Epoch from Contract: ${activationEpoch}`);
      console.log(`Bootstrap Epoch from Manifest: ${bootstrapEpoch}`);

      if (activationEpoch !== bootstrapEpoch) {
        throw new Error(`Mismatch: Activation Epoch (${activationEpoch}) does not match Bootstrap Epoch (${bootstrapEpoch})`);
      }

      console.log(`Manifest Data: ${jsonData}`);
    } else {
      console.log("No manifest data available.");
    }
  });

task("setActivationInformation", "Sets the activation information on the contract")
  .addParam("contract", "The address of the contract")
  .addParam("manifest", "The path to the JSON file containing the manifest data")
  .addFlag("print", "Print the message data instead of sending the activation update")
  .addFlag("disable", "Disable activation by setting activationEpoch to maxUint64 and using empty manifest data")
  .setAction(async (taskArgs: { contract: string; manifest: string; print: boolean; disable: boolean }, hre: HardhatRuntimeEnvironment) => {
    const contractAddress = taskArgs.contract;
    const filePath = taskArgs.manifest;

    const F3Parameters = await hre.ethers.getContractFactory("F3Parameters");
    const contract = F3Parameters.attach(contractAddress);

    let activationEpoch: number;
    let manifestData: Buffer;

    if (taskArgs.disable) {
      activationEpoch = BigInt("0xFFFFFFFFFFFFFFFF"); // maxUint64
      manifestData = Buffer.from("");
    } else {
      const jsonData = fs.readFileSync(filePath, "utf8");
      const jsonObject = JSON.parse(jsonData);
      activationEpoch = jsonObject.BootstrapEpoch;
      manifestData = zlib.deflateSync(Buffer.from(jsonData));

      if (activationEpoch === undefined) {
        throw new Error("BootstrapEpoch not found in the manifest JSON");
      }
    }

    if (activationEpoch === undefined) {
      throw new Error("BootstrapEpoch not found in the manifest JSON");
    }

    if (taskArgs.print) {
      const abiEncodedData = hre.ethers.utils.defaultAbiCoder.encode(
        ["uint64", "bytes"],
        [activationEpoch, manifestData]
      );
      console.log(`ABI Encoded Activation Information: ${abiEncodedData}`);
    } else {
      console.log(`Setting activation information on contract at ${contractAddress}...`);
      const tx = await contract.updateActivationInformation(activationEpoch, manifestData);
      await tx.wait();

      console.log(`Activation information set with epoch ${activationEpoch}`);
    }
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
