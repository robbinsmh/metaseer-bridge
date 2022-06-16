require('dotenv').config();
const path = require('path');

const HDWalletProvider = require("@truffle/hdwallet-provider");
// glance rabbit weather spread parade client rocket cat art also order reunion
const mnemonic = "mnemonic here !";

module.exports = {
  networks: {
    dev: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    het: {
      provider: () => new HDWalletProvider(mnemonic, 'https://http-testnet.hecochain.com', 0, 2),
      network_id: 256,
      gasPrice: 10e9, // 10 gwei
      gas: 6900000
    },
    testnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://data-seed-prebsc-1-s1.binance.org:8545`),
      network_id: 97,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    bsc: {
      provider: () => new HDWalletProvider(mnemonic, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },
  compilers: {
    solc: {
      version: '0.8.4', // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    },
  },
  api_keys: {
    etherscan: 'J7879VGNFNBFU7JURY9QJX3AWCPPAD4WVH'
  },
  contracts_directory: path.resolve(__dirname, 'contracts'),
  plugins: ["truffle-plugin-verify"],
};
