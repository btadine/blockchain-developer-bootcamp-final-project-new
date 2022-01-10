import React, {useEffect} from "react";
import './Poll.css';

import 'antd/dist/antd.css';

import { Button } from 'antd';

const Poll = (props) => {
    return (
      <div className="poll-container">
        <div>
        { props.hackIdsVotes[props.hackIdsVoted.indexOf(props.hackId)] ?
         <Button className="buttonSelected voteButton" variant="outline-secondary" onClick={() => props.onVote(true, props.hackId)}><span className="thumbs" role="img" aria-label="Thumbs up">&#128077; </span><span> {props.upVotes}</span></Button>
         :
         <Button className="voteButton" variant="outline-secondary" onClick={() => props.onVote(true, props.hackId)}><span className="thumbs" role="img" aria-label="Thumbs up">&#128077; </span><span> {props.upVotes}</span></Button>
        }
        { props.hackIdsVotes[props.hackIdsVoted.indexOf(props.hackId)] === false ?
                   <Button className="buttonSelected voteButton" variant="outline-secondary" onClick={() => props.onVote(false, props.hackId)}><span className="thumbs" role="img" aria-label="Thumbs down">&#128078; </span><span> {props.downVotes}</span></Button>
         :
                   <Button className="voteButton" variant="outline-secondary" onClick={() => props.onVote(false, props.hackId)}><span role="img" className="thumbs" aria-label="Thumbs down">&#128078; </span><span> {props.downVotes}</span></Button>
        }
        </div>
      </div>
    )
  }

export default Poll;