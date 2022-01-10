import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import abi from './utils/CityHacks.json';

import Popup from 'reactjs-popup';
import Moment from 'moment';
import TabComponent from './components/Tabs.js';
import PostView from './components/PostView.js';
import BrowseView from './components/BrowseView.js';
import PostHackPopup from './components/PostHackPopup.js';
import ReportedViewPopup from './components/ReportedViewPopup.js';

import 'reactjs-popup/dist/index.css';
import './App.css';

require('dotenv').config();

const App = () => {
  const [allHacks, setAllHacks] = useState([]);
  const [reportedHacks, setReportedHacks] = useState([]);
  const [currentAccount, setCurrentAccount] = useState('');
  const [connection, setConnection] = useState(false);
  const [provider, setProvider] = useState({});

  const [errorOcurred, setErrorOcurred] = useState(false);
  const [tipHackPressed, setTipHackPressed] = useState(false);
  const [tipValue, setTipValue] = useState('');
  const [hackId, setHackId] = useState(0);
  const [votedHacks, setVotedHacks] = useState([]);
  const [filters, setFilters] = useState({});
  const [openPostPopup, setOpenPostPopup] = useState(false);
  const [openReportedView, setOpenReportedView] = useState(false);
  const [walletIsOwner, setWalletIsOwner] = useState(false);

  const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
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

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const contractABI = abi.abi;

  async function getWeb3Modal() {
    const web3Modal = new Web3Modal({
      network: 'ropsten',
      cacheProvider: true,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: process.env.REACT_APP_INFURA_ID,
          },
        },
      },
    });
    return web3Modal;
  }

  async function connect() {
    const web3Modal = await getWeb3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const accounts = await provider.listAccounts();
    setConnection(connection);
    setProvider(provider);
    setCurrentAccount(accounts[0]);
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have metamas)k!');
        return;
      } else {
        /*We have the ethereum object"*/
      }
      const web3Modal = await getWeb3Modal();
      if (web3Modal.cachedProvider) {
        connectWallet();
      }

      //const accounts = await ethereum.request({ method: 'eth_accounts' });
      //console.log(accounts.length);
      //if (accounts.length !== 0) {
      //const account = accounts[0];
      /*Found an authorized account*/
      //console.log("Setting account", account);
      //setAccount(accounts[0]);
      //const newProvider = new ethers.providers.Web3Provider(ethereum);
      //console.log(newProvider);
      //setProvider(newProvider);
      //} else {
      /*No authorized account found. Show error*/

      //}
    } catch (error) {
      console.log(error);
    }
  };

  const setAccount = (account) => {
    console.log('Setting account', account);
    if (this.setState !== undefined) {
      this.setState({ currentAccount: account }, () => {
        fetchVotes();
      });
    }
  };

  const configWalletIsOwner = async (account) => {
    try {
      const newProvider = new ethers.providers.AlchemyProvider(
        'ropsten',
        alchemyKey
      );
      const cityHacksContract = new ethers.Contract(
        contractAddress,
        contractABI,
        newProvider
      );
      const owner = await cityHacksContract.owner();
      console.log('Owner', owner, account);
      setWalletIsOwner(owner == account);
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    console.log('function called');
    await connect();
    //try {
    //const { ethereum } = window;

    //if (!ethereum) {
    //alert("Get MetaMask!");
    //return;
    //}

    //const accounts = await ethereum.request({ method: "eth_requestAccounts" });

    /* Wallet Connected*/
    //setCurrentAccount(accounts[0]);
    //} catch (error) {
    //  console.log(error)
    //}
  };

  // const getReportedHacks = async () => {
  //   try {
  //     const signer = provider.getSigner();
  //     const cityHacksContract = new ethers.Contract(
  //       contractAddress,
  //       contractABI,
  //       signer
  //     );
  //     const owner = await cityHacksContract.owner();
  //     console.log('Contract owner is', owner);
  //     let hacksIds = await cityHacksContract.getReportedHacks();
  //     hacksIds = hacksIds.map((bigNumber) => bigNumber.toNumber());
  //     console.log(hacksIds);
  //     const hacks = allHacks.filter((a) => hacksIds.includes(a.id));
  //     console.log(hacks);
  //     setReportedHacks(hacks);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getAllHacks = async () => {
    try {
      const newProvider = new ethers.providers.AlchemyProvider(
        'ropsten',
        alchemyKey
      );
      const cityHacksContract = new ethers.Contract(
        contractAddress,
        contractABI,
        newProvider
      );

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

      let hacksFiltered = [];
      if (filters.city && filters.category) {
        hacksFiltered = hacksCleaned.filter(
          (a) => a.city === filters.city && a.category === filters.category
        );
        console.log('found city and category', hacksFiltered);
      } else if (filters.city) {
        hacksFiltered = hacksCleaned.filter((a) => a.city === filters.city);
        console.log('found city', hacksFiltered);
      } else {
        hacksFiltered = hacksCleaned;
        console.log('not found filters', hacksFiltered);
      }
      const hacksSorted = hacksFiltered.sort((a, b) => b.upvotes - a.upvotes);
      setAllHacks(hacksSorted);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllReportedHacks = async (account) => {
    try {
      const newProvider = new ethers.providers.AlchemyProvider(
        'ropsten',
        alchemyKey
      );

      const signer = provider.getSigner();
      const ens = new ethers.Contract(contractAddress, contractABI, signer);

      let latestBlockReport = await ens.getLatestReportBlock();
      latestBlockReport = latestBlockReport.toNumber();

      //let ens = new ethers.Contract(contractAddress, contractABI, newProvider);

      const query = await ens.queryFilter(
        ens.filters.TrustReport(
          null,
          null,
          null,
          latestBlockReport,
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
      const reported = await getAllReportedHacks(account);
      console.log(reported);
      const hacks = allHacks.filter((a) => reported.includes(a.id));
      console.log(hacks);
      setReportedHacks(hacks);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllVotes = async (account) => {
    try {
      const newProvider = new ethers.providers.AlchemyProvider(
        'ropsten',
        alchemyKey
      );

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
        console.log(voteObject);
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

      reported = reported.filter((e) => e != hackId);
      console.log('Unreported', reported, 'hackId:', hackId);

      const reportHackTxn = await cityHacksContract.unreportHack(
        hackId,
        reported
      );
      // Mining, insert an animation to inform user.

      await reportHackTxn.wait();
      // Txn mined
    } catch (error) {
      setErrorOcurred(true);
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

      reported = reported.filter((e) => e != hackId);

      const hideHackTxn = await cityHacksContract.hideAndUnreportHack(
        hackId,
        reported
      );
      // Mining, insert an animation to inform user.

      await hideHackTxn.wait();
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

      console.log('HEYYYY', hackId, reported);

      const reportHackTxn = await cityHacksContract.reportHack(
        hackId,
        reported
      );
      // Mining, insert an animation to inform user.

      await reportHackTxn.wait();
      // Txn mined
    } catch (error) {
      setErrorOcurred(true);
      console.log(error);
    }
  };

  const postHack = async (text, cityId, categoryId) => {
    try {
      //const provider = new ethers.providers.Web3Provider(connection);
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

      await hackTxn.wait();
      // Txn mined
    } catch (error) {
      setErrorOcurred(true);
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

      await hackTxn.wait();
      // Txn mined
    } catch (error) {
      setErrorOcurred(true);
      console.log(error);
    }
  };

  const tipHacker = async () => {
    setTipHackPressed(false);
    try {
      //const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const cityHacksContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      let overrides = { value: ethers.utils.parseEther(tipValue) };

      const hackTxn = await cityHacksContract.tipHacker(hackId, overrides);
      // Mining, insert an animation to inform user.

      await hackTxn.wait();
      // Txn mined
    } catch (error) {
      setErrorOcurred(true);
      console.log('tipHacker');
      console.log(error);
    }
  };

  const resetError = () => {
    setErrorOcurred(false);
  };

  const handleTip = (hackId) => {
    setHackId(hackId);
    setTipHackPressed(true);
  };

  const handleReport = (hackId) => {
    reportHack(hackId);
  };

  const handleUnReport = (hackId) => {
    unreportHack(hackId);
  };

  const handleHide = async (hackId) => {
    await hideCityHack(hackId);
    setOpenReportedView(false);
    getAllHacks();
  };

  const setTip = (event) => {
    setTipValue(event.target.value);
  };

  const fetchVotes = () => {
    getAllVotes(currentAccount);
  };

  useEffect(() => {
    getAllHacks();
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    configWalletIsOwner(currentAccount);
  }, [currentAccount]);

  useEffect(() => {
    getAllHacks();
  }, [filters]);

  useEffect(() => {
    setOpenReportedView(reportedHacks.length > 0);
  }, [reportedHacks]);

  const setFiltersAndReload = (filters) => {
    setFilters(filters);
  };

  const openPopup = () => {
    console.log('opening popup');
    setOpenPostPopup(true);
  };

  const closePopup = () => {
    console.log('closing popup');
    setOpenPostPopup(false);
  };

  const openReported = async () => {
    console.log('opening reported');
    console.log(await provider.listAccounts());
    getAndSetReportedHacks();
  };

  const closeReported = () => {
    setOpenReportedView(false);
  };

  const fix = () => {
    /*<Popup open={tipHackPressed}
       onClose={() => setTipHackPressed(false)}
       position="right center">
       {close => (
      <div className="modal">
        <button className="close" onClick={close}>
          &times;
        </button>
        <div className="header"> Tip cityhacker </div>
        <div className="content">
          {' '}
          Add the tip amount.
        </div>
                  <InputGroup className="inputGroup">
    <FormControl
      className="formControl"
      placeholder="Amount in ethers"
      aria-label="Tip amount"
      aria-describedby="basic-addon2"
      onChange={setTip}
      value={tipValue}
    />
        <Button className="postButton" variant="outline-secondary" id="button-addon2" onClick={tipHacker}>
      Tip
    </Button>
        </InputGroup>
        <div className="actions">
          <button
            className="button"
            onClick={() => {
              console.log('modal closed ');
              close();
            }}
          >
            Close
          </button>
        </div>
      </div>
    )}
  </Popup>*/
  };

  return (
    <div className="fullPage">
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
      <div className="banner">
        <PostView
          metamask={window.ethereum !== undefined}
          networkVersion={
            window.ethereum !== undefined
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
        />
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
                    console.log('modal closed ');
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
                  🏙️
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
          />
        </div>
      </div>
    </div>
  );
};

export default App;
