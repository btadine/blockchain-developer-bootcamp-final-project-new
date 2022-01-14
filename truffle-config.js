require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  contracts_build_directory: 'client/src/utils',
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          process.env.ALCHEMY_PROJECT_ID
        );
      },
      network_id: 3,
      networkCheckTimeout: 1000000,
    },
  },
  compilers: {
    solc: {
      version: '^0.8', // Fetch latest 0.8.x Solidity compiler
    },
  },
};
