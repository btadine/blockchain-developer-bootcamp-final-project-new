import { getAccountPath } from 'ethers/lib/utils';
import React from 'react';
import './NetworkDetector.css';
const NetworkDetector = (props) => {
  const NETWORKS = {
    1: 'Ethereum Mainnet',
    2: 'Kovan Testnet',
    3: 'Ropsten Testnet',
    4: 'Rinkeby Testnet',
    5: 'Goerli Testnet',
  };

  const expectedNetwork = `3`;

  return (
    <div className="footer-text">
      {!props.metamask
        ? `Select a wallet provider. Some options may be available only with Metamask.`
        : props.metamask &&
          props.networkVersion === expectedNetwork &&
          props.account &&
          props.account.length > 0
        ? `Post a hack (on ${NETWORKS[props.networkVersion]})`
        : props.networkVersion !== expectedNetwork
        ? `This only works on ${NETWORKS[3]}, please change your Network and refresh the page.`
        : `You're not connected.`}
    </div>
  );
};

export default NetworkDetector;
