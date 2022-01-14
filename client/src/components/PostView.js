import React from 'react';
import './PostView.css';
import { Button } from 'antd';
import 'antd/dist/antd.css';

//import { FormControl, FormSelect, Button, InputGroup } from 'react-bootstrap';
import NetworkDetector from './NetworkDetector.js';
import { NETWORK_VERSION } from '../utils/Constants.js';

const PostView = (props) => {
  return (
    <div className="postView">
      {props.accountNotFound ? (
        <div className="mainBannerContainer">
          <div className="networkDetector">
            <NetworkDetector
              metamask={props.metamask}
              networkVersion={props.networkVersion}
              account={props.account}
            />
          </div>
          <div className="connectWalletContainer">
            <Button
              className="connectWalletButton"
              onClick={props.connectWallet}
              disabled={!props.metamask}
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      ) : (
        <div className="postHackContainer">
          <div className="connected">
            {props.networkVersion !== NETWORK_VERSION
              ? 'Invalid Network'
              : props.isOwner
              ? 'Welcome, Admin'
              : 'Connected wallet:'}
            <br></br>
            {!props.isOwner && props.account ? `${props.account}` : ''}
          </div>
          <div className="connectWalletContainer">
            {props.isOwner && (
              <Button
                className="connectWalletButton"
                onClick={props.openReportedView}
                disabled={
                  !props.metamask || props.networkVersion !== NETWORK_VERSION
                }
              >
                Check Reported Hacks
              </Button>
            )}
            <Button
              className="connectWalletButton"
              onClick={props.openPostView}
              disabled={
                !props.metamask || props.networkVersion !== NETWORK_VERSION
              }
            >
              Post a hack
            </Button>
            <div className="feedbackMessage">
              {props.noReportedHacks ? 'No reported Hacks' : ''}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostView;
