require('dotenv').config();

module.exports = {
  contracts_build_directory: 'client/src/utils',
  networks: {
    local: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
    },
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_KEY}`,
      accounts: [`0x${process.env.ROPSTEN_PRIVATE_KEY}`],
    },
  },
  compilers: {
    solc: {
      version: '^0.8', // Fetch latest 0.8.x Solidity compiler
    },
  },
};
