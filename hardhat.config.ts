import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition-ethers";
import "@starboardventures/hardhat-verify";
import * as dotenv from "dotenv";
import "./tasks/F3Parameters";

dotenv.config();


// fallback to dummy key
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; 


const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.23",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    localnet: {
      chainId: 31415926,
      url: "http://127.0.0.1:1234/rpc/v1",
      accounts: [PRIVATE_KEY],
    },
    calibrationnet: {
      chainId: 314159,
      url: "https://api.calibration.node.glif.io/rpc/v1",
      accounts: [PRIVATE_KEY],
    },
    filecoinmainnet: {
      chainId: 314,
      url: "https://api.node.glif.io",
      //url: 'https://rpc.ankr.com/filecoin',
      accounts: [PRIVATE_KEY],
    },
  },
  starboardConfig: {
    baseURL: 'https://fvm-calibration-api.starboard.ventures',
    network: 'Calibration' // if there's no baseURL, url will depend on the network.  Mainnet || Calibration
  },

  etherscan: {
    apiKey: {
      'calibrationnet': 'empty',
      'filecoinmainnet': 'empty',
    },
    customChains: [
      {
        network: "filecoinmainnet",
        chainId: 314,
        urls: {
          apiURL: "https://filecoin.blockscout.com/api",
          browserURL: "https://filecoin.blockscout.com"
        }
      },
      {
        network: "calibrationnet",
        chainId: 314159,
        urls: {
          apiURL: "https://filecoin-testnet.blockscout.com/api",
          browserURL: "https://filecoin-testnet.blockscout.com"
        }
      }
    ]
  },
  sourcify: {
    enabled: true,
    apiUrl: "https://sourcify.dev/server",
    browserUrl: "https://repo.sourcify.dev",
  }
};

export default config;
