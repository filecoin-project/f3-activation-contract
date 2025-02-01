### Build
`npx hardhat compile`


### Deploying

Set your private key in `.env`:
```
PRIVATE_KEY="..."
```

Deploy the contract
```
npx hardhat ignition deploy ignition/modules/F3Parameters.ts --network filecoinmainnet \
  --expiration 2025-08-01 [--owner address]
```
If owner address is not set it will use the sender address.

You might have to wipe the existing deployment (chain-314 for mainnet, chain-314159 for calibraiton):
```
rm -rf ignition/deployments/chain-314/
```

### Validating

Go to BlockScout contract page, verify, then get select `Solidity (Standard JSON Input)`
run:
`jq .input ignition/deployments/chain-314/build-info/[there is single json file here] > validation-input.json`

Upload this file to BlockScout

