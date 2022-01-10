import React from 'react';
import 'antd/dist/antd.css';
import './CityHack.css';
import Poll from './Poll.js';
import { Form, Input, Button, Select } from 'antd';

const CityHack = (props) => {
  return (
    <div
      className="cityHack"
      style={{
        backgroundColor: '#282828',
        marginTop: '16px',
        padding: '8px',
        borderRadius: 10 + 'px',
      }}
    >
      <div className="cityhackfield">
        <b>City:</b> {props.hack.city}
      </div>
      <div className="cityhackfield">
        <b>Category:</b> {props.hack.category}
      </div>
      <div className="cityhackfield">
        <b>Description:</b> {props.hack.description}
      </div>
      <div className="cityhackfield">
        <b>Time:</b> {props.hack.timestamp.toString()}
      </div>
      <div className="cityhackfield">
        <b>Address: </b>
        {props.hack.address}
      </div>
      {!props.reportedView && (
        <div className="actionsContainer">
          <Button
            className="tipButton"
            variant="outline-secondary"
            id="button-addon2"
            onClick={() => props.handleTip(props.hack.id)}
          >
            Tip
          </Button>
          <Button
            className="tipButton"
            variant="outline-secondary"
            id="button-addon2"
            onClick={() => props.handleReport(props.hack.id)}
          >
            Report
          </Button>
          <div className="poll">
            <Poll
              hackId={props.hack.id}
              onVote={props.handleVote}
              upVotes={props.hack.upvotes}
              downVotes={props.hack.downvotes}
              hackIdsVotes={props.hackIdsVotes}
              hackIdsVoted={props.hackIdsVoted}
            />
          </div>
        </div>
      )}
      {props.reportedView && (
        <div className="actionsContainer">
          <Button
            className="tipButton"
            variant="outline-secondary"
            id="button-addon2"
            onClick={() => props.handleUnReport(props.hack.id)}
          >
            Unreport
          </Button>
          <Button
            className="tipButton"
            variant="outline-secondary"
            id="button-addon2"
            onClick={() => props.handleHide(props.hack.id)}
          >
            Hide and Unreport
          </Button>
        </div>
      )}
    </div>
  );
};

export default CityHack;
