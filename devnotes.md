## Build

To compile the project, run the following command:

```bash
npx hardhat compile
```


## Deploying

### Set Up Environment

Ensure your private key is set in the `.env` file:

```bash
PRIVATE_KEY="..."
```

### Deploy the Contract

To deploy the contract using the Safe multisig, execute:

```bash
npx hardhat ignition deploy ignition/modules/F3Parameters.ts --network filecoinmainnet \
  --parameters ignition/parameters_mainnet.json --deployment-id mainnet
```

## Validating Contract

1. Navigate to the BlockScout contract page and verify the contract.
2. Select `Solidity (Standard JSON Input)`.
3. Run the following command to prepare the validation input:

   ```bash
   jq .input ignition/deployments/chain-314/build-info/*.json> validation-input.json
   ```

4. Upload `validation-input.json` to BlockScout.

## End-to-End Testing with Node Implementation

This section describes how to perform end-to-end testing of the contract using a node implementation (e.g., Lotus, Forest, Venus). The node implementation includes similar functionality to `queryActivationInformation` but operates on a polling basis as discussed in [FRC-0099](https://github.com/filecoin-project/FIPs/blob/master/FRCs/frc-0099.md).

### Deployment

1. **Set Up Environment**: Ensure your private key is set in the `.env` file:
   ```
   PRIVATE_KEY="..."
   ```

2. **Deploy the Contract**: Deploy the contract using your private key. It is recommended to deploy on the mainnet for best results with BlockScout. Avoid specifying the `ignition/parameters_mainnet.json` file to use the deploying key as the owner:
   ```bash
   npx hardhat ignition deploy ignition/modules/F3Parameters.ts --network filecoinmainnet --deployment-id mainnet-scratchpad1
   ```
   The deployment process could occasionally fail, in that case re-try. On success, contract address will be printed.

### Updating Activation Information

1. **Set Activation Information**: Use the `setActivationInformation` task to update the manifest:
   ```bash
   npx hardhat --network filecoinmainnet setActivationInformation --contract <contract_address> --manifest <path_to_manifest>
   ```

2. **Modify and Update Manifest**: You can modify the manifest and update it again using the same command. To disable the manifest, use the `--disable` flag:
   ```bash
   npx hardhat --network filecoinmainnet setActivationInformation --contract <contract_address> --disable
   ```

## Validating Parameters in Safe Wallet

In the Safe UI, you will see a proposed message. Use the following command to cross-validate it with the manifest specified in this repository. This ensures that the parameters align with the expected values and helps prevent discrepancies.

### Example

If the Safe call is to contract `0xD68211Bf70c9791AE1c5307970D3ca9a43834B76` with hex-encoded data:

```plaintext
0x6529e95a00000000000000000000000000000000000000000000000000000000004c4b400000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000023d8554c172da3014bcf3150ce78e079b06486fc1d0363321a590b6874e0fb2fc8c35c8922bc90d6926ffde27d9c27620539f9eb52b7977df939f07c3e168432a0da30fc38c700defdc8a924652c9bf83d24c0ac4aedcfaad6086117e2bb42182da3d63b7be90d268a348b92a25cd2d7dec1e07de837994ea704f0abb6194310e54323172e0ea58724699d9c84750088b8af3fa537b2115ac620fb4e21a110e78200987eeb65816053306e04eca4342e801c1b0d6111343f36fe50d677b5180301669747aa99fca24b3ebcff882af4be086e0ebb4c7f2c0024fff9265e8408afab8a881bf568433f3e458eb8a1b861e9d89b021acc9d1ea233990742b2b916a1fb1d5991326b003a5d490de81d89bdc99f01fdf42a2244929d1c64a9059b620ae7f6732cf991db161307993b62b152ab3ed0dc2374968a2f7d131125feaa6c66d861b504cdaa326e3d7f23e32e17242f0ba1b2d79ea85e653b52e9740999dc846826fff4fc718b69e6c39bdf67514446d399ffa7a12cc425fbf0fe6a7add3209af97a165cb9ea5723e233e6d219adbe95bf568b51159c9288411996314a0cac8e3427620f6d34311a14660bbf2bd0e68115202b5377fa55503b507f409d11a767c43513aca88a8de478470dee22fc62f2d8ba0bbc30bad0cb4d95ecaaa4235a16381cda3661256cfca9bf9cad693bc0e776f1184d152b8ded5f9565a076756293a895e5f65e187a84fc5fe774734e57bbc6974c53893941ea0ed138799d1f55d873ff83a0edfff13a23df4929ba10a6ed099e509437cef0bc17e3e065f00f000000
```

For the mainnet manifest, run:

```bash
npx hardhat --network filecoinmainnet validateActivationMessage \
  --contract 0xD68211Bf70c9791AE1c5307970D3ca9a43834B76 --manifest tasks/mainnet-manifest.json \
  --data 0x6529e95a00000000000000000000000000000000000000000000000000000000004c4b400000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000023d8554c172da3014bcf3150ce78e079b06486fc1d0363321a590b6874e0fb2fc8c35c8922bc90d6926ffde27d9c27620539f9eb52b7977df939f07c3e168432a0da30fc38c700defdc8a924652c9bf83d24c0ac4aedcfaad6086117e2bb42182da3d63b7be90d268a348b92a25cd2d7dec1e07de837994ea704f0abb6194310e54323172e0ea58724699d9c84750088b8af3fa537b2115ac620fb4e21a110e78200987eeb65816053306e04eca4342e801c1b0d6111343f36fe50d677b5180301669747aa99fca24b3ebcff882af4be086e0ebb4c7f2c0024fff9265e8408afab8a881bf568433f3e458eb8a1b861e9d89b021acc9d1ea233990742b2b916a1fb1d5991326b003a5d490de81d89bdc99f01fdf42a2244929d1c64a9059b620ae7f6732cf991db161307993b62b152ab3ed0dc2374968a2f7d131125feaa6c66d861b504cdaa326e3d7f23e32e17242f0ba1b2d79ea85e653b52e9740999dc846826fff4fc718b69e6c39bdf67514446d399ffa7a12cc425fbf0fe6a7add3209af97a165cb9ea5723e233e6d219adbe95bf568b51159c9288411996314a0cac8e3427620f6d34311a14660bbf2bd0e68115202b5377fa55503b507f409d11a767c43513aca88a8de478470dee22fc62f2d8ba0bbc30bad0cb4d95ecaaa4235a16381cda3661256cfca9bf9cad693bc0e776f1184d152b8ded5f9565a076756293a895e5f65e187a84fc5fe774734e57bbc6974c53893941ea0ed138799d1f55d873ff83a0edfff13a23df4929ba10a6ed099e509437cef0bc17e3e065f00f000000
```

