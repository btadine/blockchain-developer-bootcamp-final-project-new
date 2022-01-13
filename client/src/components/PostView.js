import React, { useState } from 'react';
import './PostView.css';
import { Button } from 'antd';
import 'antd/dist/antd.css';

//import { FormControl, FormSelect, Button, InputGroup } from 'react-bootstrap';
import NetworkDetector from './NetworkDetector.js';

const PostView = (props) => {
  const [textValue, setTextValue] = useState('');
  const [cityId, setCityId] = useState(0);
  const [categoryId, setCategoryId] = useState(0);

  const cities = [
    'Choose a city',
    'Barcelona',
    'Buenos Aires',
    'Lisboa',
    'Madrid',
    'London',
    'Tokyo',
    'New York',
    'San Francisco',
    'Berlin',
    'Paris',
    'Rome',
    'Athens',
  ];

  const categories = [
    'Choose a category',
    'Cheap',
    'Nice Spot',
    'Traditional',
    'Parking',
    'Coworking',
    'Misc',
  ];

  const handleClick = async (event) => {
    await props.postHack(textValue, cityId, categoryId);
    setTextValue('');
    props.getAllHacks();
  };

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
            {props.networkVersion !== '3'
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
                disabled={!props.metamask || props.networkVersion !== '3'}
              >
                Check Reported Hacks
              </Button>
            )}
            <Button
              className="connectWalletButton"
              onClick={props.openPostView}
              disabled={!props.metamask || props.networkVersion !== '3'}
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
