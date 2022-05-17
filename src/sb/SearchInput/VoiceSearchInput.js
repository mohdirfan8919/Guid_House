import React,{ useEffect } from 'react';

import useSpeechToText from '../Hooks';

import micIcon from '../../images/mic.svg';
let microphoneOff = require("../../images/mic-off.png");
let microphoneOn = require("../../images/mic-on.png");
import * as defaults from '../../sb/Common/Defaults';
import PropTypes from 'prop-types';
import { UncontrolledTooltip } from 'reactstrap';

// import './App.css';

export default function VoiceSearch(props) {
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText
  } = useSpeechToText({
    continuous: false,
    crossBrowser: true,
    speechRecognitionProperties: { interimResults: true },
    timeout: 5000
  });


  useEffect(() => {
    // console.log(results,error,interimResult,startSpeechToText,stopSpeechToText,"results");
    props.voiceSearch(results);
    },
  [results]);

  useEffect(() => {
    props.isRecording(isRecording);
  },[isRecording]);

  if (error) return <>
  {/*<p id="voiceError"><img src={microphoneOff} width="20px" height="20px"/>‍</p>
  <UncontrolledTooltip placement="bottom" target="voiceError">
        {error}
  </UncontrolledTooltip>*/}
  </>;

  return (
    <React.Fragment>
      <button className="VoiceSearch_Button"  aria-label="voicesearch button" onClick={isRecording ? stopSpeechToText : startSpeechToText}>
        <img src={(isRecording) ? microphoneOn : microphoneOff} width="20px" height="20px" alt="microphone"/>
      </button>

    </React.Fragment>
  );
}

VoiceSearch.propTypes = {
  isRecording:PropTypes.func,
  voiceSearch:PropTypes.func
};
