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
   --parameters ignition/parameters_mainnet.json --deployment-id mainnet
```

### Validating

Go to BlockScout contract page, verify, then get select `Solidity (Standard JSON Input)`
run:
`jq .input ignition/deployments/chain-314/build-info/[there is single json file here] > validation-input.json`

Upload this file to BlockScout

