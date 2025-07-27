require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  
  networks: {
    hardhat: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/your-project-id",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      verify: {
        etherscan: {
          apiKey: process.env.ETHERSCAN_API_KEY,
        },
      },
    },
    mainnet: {
      url: process.env.MAINNET_RPC_URL || "https://mainnet.infura.io/v3/your-project-id",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1,
      verify: {
        etherscan: {
          apiKey: process.env.ETHERSCAN_API_KEY,
        },
      },
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 137,
      verify: {
        etherscan: {
          apiKey: process.env.POLYGONSCAN_API_KEY,
        },
      },
    },
    bsc: {
      url: process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 56,
      verify: {
        etherscan: {
          apiKey: process.env.BSCSCAN_API_KEY,
        },
      },
    },
  },
  
  namedAccounts: {
    deployer: {
      default: 0,
    },
    creator: {
      default: "0x95BCeA7C05a85B8de810e00B9c42f5B268029272",
    },
    founder1: {
      default: "0x2D99d8BF0E6D2EA939ABF570Fc67DF2E106bAe97",
    },
    founder2: {
      default: "0x64FC52F582026d6cF2D30A7f2A9074Ee671585E8",
    },
    founder3: {
      default: "0x6aa148f6755Aa0CE69814955291DF76C50949e33",
    },
  },
  
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    deploy: "./scripts",
  },
  
  mocha: {
    timeout: 40000,
  },
  
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY,
      mainnet: process.env.ETHERSCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY,
      bsc: process.env.BSCSCAN_API_KEY,
    },
  },
  
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
}; 