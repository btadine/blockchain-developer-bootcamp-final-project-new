import React from 'react';
import { NETWORK_VERSION } from '../utils/Constants.js';
import './NetworkDetector.css';
const NetworkDetector = (props) => {
  const NETWORKS = {
    1: 'Ethereum Mainnet',
    2: 'Kovan Testnet',
    3: 'Ropsten Testnet',
    4: 'Rinkeby Testnet',
    5: 'Goerli Testnet',
    5777: 'Localhost',
  };

  const expectedNetwork = NETWORK_VERSION;

  return (
    <div className="footer-text">
      {!props.metamask
        ? `We only support Metamask at the moment. Sorry for the inconvenience.`
        : props.metamask &&
          props.networkVersion === expectedNetwork &&
          props.account &&
          props.account.length > 0
        ? `Post a hack (on ${NETWORKS[props.networkVersion]})`
        : props.networkVersion !== expectedNetwork
        ? `This only works on ${NETWORKS[NETWORK_VERSION]}, please change your Network and refresh the page.`
        : `You're not connected.`}
    </div>
  );
};

export default NetworkDetector;
