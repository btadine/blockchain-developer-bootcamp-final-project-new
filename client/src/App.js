import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
//import WalletConnectProvider from '@walletconnect/web3-provider';
import abi from './utils/CityHacks.json';

import Popup from 'reactjs-popup';
import Moment from 'moment';
import PostView from './components/PostView.js';
import BrowseView from './components/BrowseView.js';
import PostHackPopup from './components/PostHackPopup.js';
import ReportedViewPopup from './components/ReportedViewPopup.js';
import TipPopup from './components/TipPopup.js';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

import { slide as Menu } from 'react-burger-menu';

import { LOCAL_DEPLOYMENT, NETWORK_VERSION } from './utils/Constants.js';

import 'reactjs-popup/dist/index.css';
import './App.css';

require('dotenv').config();

const App = () => {
  const [allHacks, setAllHacks] = useState([]);
  const [reportedHacks, setReportedHacks] = useState([]);
  const [currentAccount, setCurrentAccount] = useState('');
  const [provider, setProvider] = useState({});

  const [errorOcurred, setErrorOcurred] = useState(false);
  const [tipHackPressed, setTipHackPressed] = useState(false);
  const [hackId, setHackId] = useState(0);
  const [votedHacks, setVotedHacks] = useState([]);
  const [filters, setFilters] = useState({});
  const [openPostPopup, setOpenPostPopup] = useState(false);
  const [openReportedView, setOpenReportedView] = useState(false);
  const [walletIsOwner, setWalletIsOwner] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Checking');
  const [statusLoading, setStatusLoading] = useState(true);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [noReportedHacks, setNoReportedHacks] = useState(false);
  const [disabledVotes, setDisabledVotes] = useState([]);
  const [invalidNetwork, setInvalidNetwork] = useState(false);

  const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
  const cities = [
    'Choose a city',
    'Barcelona',
    'Buenos Aires',
    'Lisbon',
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
    'Cheap Places',
    'Nice Spots',
    'Traditional',
    'Parking',
    'Coworking',
    'Misc',
  ];

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const contractABI = abi.abi;

  async function getWeb3Modal() {
    const web3Modal = new Web3Modal({
      network: 'ropsten',
      cacheProvider: true,
      providerOptions: {
        // Disabled Wallet Connect until we have proper network detection and account handling.
        // walletconnect: {
        //   package: WalletConnectProvider,
        //   options: {
        //     infuraId: process.env.REACT_APP_INFURA_ID,
        //   },
        // },
      },
    });
    return web3Modal;
  }

  async function connect() {
    const web3Modal = await getWeb3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const accounts = await provider.listAccounts();
    setProvider(provider);
    setCurrentAccount(accounts[0]);
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        return;
      } else {
        /*We have the ethereum object"*/
      }
      const web3Modal = await getWeb3Modal();
      if (web3Modal.cachedProvider) {
        connectWallet();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const configWalletIsOwner = async (account) => {
    try {
      const newProvider = LOCAL_DEPLOYMENT
        ? new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545')
        : new ethers.providers.AlchemyProvider('ropsten', alchemyKey);
      const cityHacksContract = new ethers.Contract(
        contractAddress,
        contractABI,
        newProvider
      );
      const owner = await cityHacksContract.owner();
      setWalletIsOwner(owner.toLowerCase() === account.toLowerCase());
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    await connect();
  };

  const getAllHacks = async () => {
    try {
      const newProvider = LOCAL_DEPLOYMENT
        ? new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545')
        : new ethers.providers.AlchemyProvider('ropsten', alchemyKey);
      const cityHacksContract = new ethers.Contract(
        contractAddress,
        contractABI,
        newProvider
      );
      console.log('contract address', contractAddress);

      const hacks = await cityHacksContract.getAllHacks();

      let hacksCleaned = [];
      hacks.forEach((hack) => {
        if (!hack.hidden) {
          hacksCleaned.push({
            id: hack.id.toNumber(),
            address: hack.owner,
            timestamp: Moment(new Date(hack.timestamp * 1000)).format('LLL'),
            description: hack.description,
            city: cities[hack.cityId.toNumber()],
            category: categories[hack.categoryId.toNumber()],
            upvotes: hack.totalUpvotes.toNumber(),
            downvotes: hack.totalDownvotes.toNumber(),
          });
        }
      });
      let disabledVotes = hacksCleaned
        .filter((a) => a.address.toLowerCase() === currentAccount.toLowerCase())
        .map((a) => a.id);
      setDisabledVotes(disabledVotes);
      let hacksFiltered = [];
      if (filters.city && filters.category) {
        hacksFiltered = hacksCleaned.filter(
          (a) => a.city === filters.city && a.category === filters.category
        );
      } else if (filters.city) {
        hacksFiltered = hacksCleaned.filter((a) => a.city === filters.city);
      } else {
        hacksFiltered = hacksCleaned;
      }
      const hacksSorted = hacksFiltered.sort(
        (a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes)
      );
      setAllHacks(hacksSorted);
    } catch (error) {
      console.log(contractAddress);
      console.log(error);
    }
  };

  const getAllReportedHacks = async (account) => {
    try {
      const signer = provider.getSigner();
      const ens = new ethers.Contract(contractAddress, contractABI, signer);

      let latestReportNumber = await ens.getLatestReportNumber();
      latestReportNumber = latestReportNumber.toNumber();

      //let ens = new ethers.Contract(contractAddress, contractABI, newProvider);

      const query = await ens.queryFilter(
        ens.filters.TrustReport(
          null,
          null,
          null,
          latestReportNumber,
          null,
          null
        ),
        provider.getBlockNumber().then((b) => b - 10000),
        'latest'
      );

      const reported = query
        .map((event, index) => {
          return event.args[5].map((n) => n.toNumber());
        })
        .flat();

      return reported;
    } catch (error) {
      console.log(error);
    }
  };

  const getAndSetReportedHacks = async (account) => {
    try {
      setStatusLoading(true);
      setConnectionStatus('Fetching');
      const reported = await getAllReportedHacks(account);
      const hacks = allHacks.filter((a) => reported.includes(a.id));
      if (hacks.length === 0) {
        setNoReportedHacks(true);
      }
      setReportedHacks(hacks);
      setStatusLoading(false);
      setConnectionBaseState();
    } catch (error) {
      setStatusLoading(false);
      setConnectionBaseState();
      console.log(error);
    }
  };

  const getAllVotes = async (account) => {
    try {
      const newProvider = LOCAL_DEPLOYMENT
        ? new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545')
        : new ethers.providers.AlchemyProvider('ropsten', alchemyKey);

      let ens = new ethers.Contract(contractAddress, contractABI, newProvider);

      const query = await ens.queryFilter(
        ens.filters.VotedHack(account),
        provider.getBlockNumber().then((b) => b - 10000),
        'latest'
      );

      var voteIds = [];
      var votes = [];
      query.forEach((event, index) => {
        const hackId = event.args[1].toNumber();
        const vote = event.args[2];
        const timestamp = event.args[3].toNumber();
        const voteObject = { hackId: hackId, vote: vote, timestamp: timestamp };
        if (!voteIds.includes(hackId)) {
          votes.push(voteObject);
          voteIds.push(hackId);
        } else {
          const index = voteIds.indexOf(hackId);
          votes[index] =
            votes[index].timestamp < voteObject.timestamp
              ? voteObject
              : votes[index];
        }
      });
      setVotedHacks(votes);
    } catch (error) {
      console.log(error);
    }
  };

  const unreportHack = async (hackId) => {
    try {
      //const provider = new ethers.providers.Web3Provider(connection);
      let reported = await getAllReportedHacks();
      const signer = provider.getSigner();
      const cityHacksContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      reported = reported.filter((e) => e !== hackId);

      const reportHackTxn = await cityHacksContract.unreportHack(
        hackId,
        reported
      );
      // Mining, insert an animation to inform user.
      setStatusLoading(true);
      setConnectionStatus('Mining');
      await reportHackTxn.wait();
      setStatusLoading(false);
      setConnectionStatus('Mined!');
      // Txn mined
    } catch (error) {
      setErrorOcurred(true);
      setConnectionBaseState();
      console.log(error);
    }
  };

  const hideCityHack = async (hackId) => {
    try {
      //const provider = new ethers.providers.Web3Provider(connection);
      let reported = await getAllReportedHacks();
      const signer = provider.getSigner();
      const cityHacksContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      reported = reported.filter((e) => e !== hackId);

      const hideHackTxn = await cityHacksContract.hideAndUnreportHack(
        hackId,
        reported
      );
      // Mining, insert an animation to inform user.
      setStatusLoading(true);
      setConnectionStatus('Mining');
      await hideHackTxn.wait();
      setStatusLoading(false);
      setConnectionStatus('Mined!');
      // Txn mined
    } catch (error) {
      setErrorOcurred(true);
      console.log(error);
    }
  };

  const reportHack = async (hackId) => {
    try {
      //const provider = new ethers.providers.Web3Provider(connection);
      let reported = await getAllReportedHacks();
      const signer = provider.getSigner();
      const cityHacksContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      reported.push(hackId);

      const reportHackTxn = await cityHacksContract.reportHack(
        hackId,
        reported
      );
      // Mining, insert an animation to inform user.
      setStatusLoading(true);
      setConnectionStatus('Mining');
      await reportHackTxn.wait();
      setStatusLoading(false);
      setConnectionStatus('Mined!');
      // Txn mined
    } catch (error) {
      setErrorOcurred(true);
      setConnectionBaseState();
      console.log(error);
    }
  };

  const postHack = async (text, cityId, categoryId) => {
    try {
      //const provider = new ethers.providers.Web3Provider(connection);
      setMenuIsOpen(false);
      const signer = provider.getSigner();
      const cityHacksContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const hackTxn = await cityHacksContract.postHack(
        text,
        cityId,
        categoryId
      );
      // Mining, insert an animation to inform user.
      setStatusLoading(true);
      setConnectionStatus('Mining');

      await hackTxn.wait();
      setStatusLoading(false);
      setConnectionStatus('Mined!');
      // Txn mined
    } catch (error) {
      setErrorOcurred(true);
      setConnectionBaseState();
      console.log(error);
    }
  };

  const voteHack = async (hackId, vote) => {
    try {
      //const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const cityHacksContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const hackTxn = await cityHacksContract.voteHack(hackId, vote);
      // Mining, insert an animation to inform user.
      setStatusLoading(true);
      setConnectionStatus('Mining');

      await hackTxn.wait();
      setStatusLoading(false);
      setConnectionStatus('Mined!');
      // Txn mined
    } catch (error) {
      setErrorOcurred(true);
      setConnectionBaseState();
      console.log(error);
    }
  };

  const tipHacker = async (tipValue) => {
    setTipHackPressed(false);
    try {
      //const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const cityHacksContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      let overrides = { value: ethers.utils.parseEther(tipValue.toString()) };

      const hackTxn = await cityHacksContract.tipHacker(hackId, overrides);
      // Mining, insert an animation to inform user.
      setStatusLoading(true);
      setConnectionStatus('Mining');

      await hackTxn.wait();
      setStatusLoading(false);
      setConnectionStatus('Mined!');
      // Txn mined
    } catch (error) {
      setErrorOcurred(true);
      setConnectionBaseState();
      console.log(error);
    }
  };

  const setStatusToNewState = (newState, loading) => {
    setConnectionStatus(newState);
    setStatusLoading(loading);
  };

  const resetError = () => {
    setErrorOcurred(false);
  };

  const handleTip = (hackId) => {
    setHackId(hackId);
    setTipHackPressed(true);
  };

  const tipHack = (tipAmount) => {
    setTipHackPressed(false);
    tipHacker(tipAmount);
  };

  const handleReport = (hackId) => {
    reportHack(hackId);
  };

  const handleUnReport = (hackId) => {
    setOpenReportedView(false);
    unreportHack(hackId);
  };

  const handleHide = async (hackId) => {
    setOpenReportedView(false);
    await hideCityHack(hackId);
    getAllHacks();
  };

  const fetchVotes = () => {
    getAllVotes(currentAccount);
  };

  const handleAccountsChanged = async (accounts) => {
    const account = accounts[0];
    setCurrentAccount(account);
    configWalletIsOwner(account);
    if (accounts.length === 0) {
      const web3Modal = await getWeb3Modal();
      web3Modal.clearCachedProvider();
      setCurrentAccount('');
    }
  };

  const connectedToRopsten = () => {
    return (
      window.ethereum && window.ethereum.networkVersion === NETWORK_VERSION
    );
  };

  const metamaskMissing = () => {
    return window.ethereum === undefined;
  };

  const setConnectionBaseState = () => {
    let conectionStatus = connectedToRopsten()
      ? 'Connected'
      : 'Switch to Ropsten Network';
    setConnectionStatus(conectionStatus);
    setStatusLoading(connectedToRopsten() ? false : true);
    setInvalidNetwork(!currentAccount || !connectedToRopsten());
  };

  useEffect(() => {
    if (!window.ethereum) {
      return;
    }
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    // returned function will be called on component unmount
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.ethereum]);

  useEffect(() => {
    if (!window.ethereum) {
      return;
    }
    window.ethereum.on('chainChanged', (chainId) => {
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have good reason not to.
      window.location.reload();
    });
    // returned function will be called on component unmount
    return () => {
      window.ethereum.removeListener('chainChanged');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.ethereum]);

  useEffect(() => {
    getAllHacks();
    checkIfWalletIsConnected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentAccount && currentAccount.length > 0) {
      setConnectionBaseState();
      getAllHacks();
      fetchVotes();
    } else {
      let newState = metamaskMissing()
        ? 'Metamask not detected'
        : 'Not Connected';
      setStatusToNewState(newState);
      setInvalidNetwork(!currentAccount || !connectedToRopsten());
      setStatusLoading(false);
      setDisabledVotes([]);
      setVotedHacks([]);
    }
    configWalletIsOwner(currentAccount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount]);

  let timeOut;

  useEffect(() => {
    if (connectionStatus === 'Mined!') {
      // eslint-disable-next-line
      timeOut = setTimeout(() => setConnectionBaseState(), 3000);
    }
    return () => {
      clearTimeout(timeOut);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionStatus]);

  useEffect(() => {
    getAllHacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    setOpenReportedView(reportedHacks.length > 0);
  }, [reportedHacks]);

  const setFiltersAndReload = (filters) => {
    setFilters(filters);
  };

  const openPopup = () => {
    setOpenPostPopup(true);
  };

  const closePopup = () => {
    setOpenPostPopup(false);
  };

  const openReported = async () => {
    getAndSetReportedHacks();
  };

  const closeReported = () => {
    setOpenReportedView(false);
  };

  return (
    <div className="fullPage">
      <Menu
        noOverlay
        isOpen={menuIsOpen}
        onStateChange={(state) => setMenuIsOpen(state.isOpen)}
      >
        <PostView
          metamask={window.ethereum && window.ethereum !== undefined}
          networkVersion={
            window.ethereum && window.ethereum !== undefined
              ? window.ethereum.networkVersion
              : 'none'
          }
          postHack={postHack}
          getAllHacks={getAllHacks}
          connectWallet={connectWallet}
          accountNotFound={!currentAccount}
          openPostView={openPopup}
          openReportedView={openReported}
          closePopup={closePopup}
          isOwner={walletIsOwner}
          account={currentAccount}
          noReportedHacks={noReportedHacks}
        />
      </Menu>
      <PostHackPopup
        destroyOnClose={true}
        visible={openPostPopup}
        closePopup={closePopup}
        postHack={postHack}
        getAllHacks={getAllHacks}
      />
      <ReportedViewPopup
        destroyOnClose={true}
        visible={openReportedView}
        closePopup={closeReported}
        reportedHacks={reportedHacks}
        handleUnReport={handleUnReport}
        handleHide={handleHide}
      />
      <TipPopup
        visible={tipHackPressed}
        closePopup={() => setTipHackPressed(false)}
        tipHack={tipHack}
      />
      <div className="banner">
        <div className="elementContainer">
          <div className="leftSideContainer">
            {metamaskMissing() ? (
              <div className="whitehint">Select a wallet provider</div>
            ) : !connectedToRopsten() ? (
              <div className="whitehint">
                Switch your network to use Cityhacks
              </div>
            ) : currentAccount && currentAccount.length > 0 ? (
              <div className="whitehint">Tap on the menu to post a hack</div>
            ) : (
              <div className="whitehint">
                Tap on the menu to connect your wallet
              </div>
            )}
          </div>
        </div>
        <div className="elementContainer">
          <div className="rightSideContainer">
            <div className="statusTitle">Status:</div>
            <div className="statusName">
              <Loader
                visible={statusLoading}
                className="statusLoader"
                type="Rings"
                color="#00BFFF"
                height={25}
                width={25}
              />
              {connectionStatus}
            </div>
          </div>
        </div>
      </div>
      <div className="mainContainer">
        <Popup open={errorOcurred} onClose={resetError} position="right center">
          {(close) => (
            <div className="modal">
              <button className="close" onClick={close}>
                &times;
              </button>
              <div className="header"> Whoops! An error has ocurred </div>
              <div className="content">
                {' '}
                The smart contract rejected the operation. Have you selected a
                city, a category and filled the description?
              </div>
              <div className="actions">
                <button
                  className="button"
                  onClick={() => {
                    close();
                  }}
                >
                  Okay
                </button>
              </div>
            </div>
          )}
        </Popup>
        <div className="dataContainer">
          <div className="header">
            <div className="headerTitle">
              <h2 className="headerTitle">
                <span className="cityIcon" role="img" aria-label="City emoji">
                  ???????
                </span>
                Cityhacks
              </h2>
            </div>
          </div>
          <h2 className="headerTitle2">Your decentralized city guide.</h2>
          <div className="description">
            <h3 className="headerTitle3">
              Discover <b>the cool stuff</b> happening in your city!
            </h3>
          </div>
          <BrowseView
            hacks={allHacks}
            getAllHacks={getAllHacks}
            fetchEvents={fetchVotes}
            voteHack={voteHack}
            handleTip={handleTip}
            handleReport={handleReport}
            votedHacks={votedHacks}
            setFilters={setFiltersAndReload}
            disabledVotes={disabledVotes}
            invalidNetwork={invalidNetwork}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
