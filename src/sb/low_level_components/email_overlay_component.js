import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { dataToBeDisplayed } from '../Common/Defaults';
import '../css/db_overlay_component.css';
import * as $ from 'jquery';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from "reactstrap";

export default class EmailOverlayComponent extends Component{
  constructor(){
    super();
    this.state = {
      displayFields: [],
      domParser: new DOMParser(),
      actualFields: []
    };
    this.handleKeyUp =this.handleKeyUp.bind(this);
  }

  state = { showing: false };

  componentWillMount(){
    this.setState({
      actualFields : this.props.result
    });
  }

  componentDidMount(){
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    setTimeout(function(){
      $("#close-button").focus();
    },100);
  }

  componentWillUnmount(){
    document.getElementsByTagName('body')[0].style.overflow = 'initial';
  }
  handleKeyUp(e) {
    if (e.keyCode == 9) {
      e.preventDefault();
    }
  }

  render(){
    const { showEmailOverlay ,hideEmailOverlay} = this.props;
    const { showing } = this.state;
    const headers = this.state.domParser.parseFromString(this.state.actualFields['headers'], 'text/html').body.textContent;
    const contents = this.state.domParser.parseFromString(this.state.actualFields['content'], 'text/html').body.textContent;

    return(
      <Modal isOpen={showEmailOverlay} toggle={hideEmailOverlay}  size="lg">
       <ModalHeader toggle={hideEmailOverlay}>
          {this.state.domParser.parseFromString(this.props.result['subject'], 'text/html').body.textContent}
       </ModalHeader>
       <ModalBody>
       <button className="btn btn-info m-2" onClick={() => this.setState({ showing:!showing })}>
        {(showing)?"Show Header":"Hide Header"}
       </button>
       {/* <button className="btn btn-info">Export PDF</button> */}

       <table className="table table-borderless">
       <thead>
        <tr>
        <th className="th_header" scope="row">Sent date</th>
        <td className="th_data" dangerouslySetInnerHTML={{__html: this.state.domParser.parseFromString(this.state.actualFields['sdate'], 'text/html').body.textContent}}>{}</td>
        </tr>
        <tr>
        <th className="th_header" scope="row">From</th>
        <td className="th_data" dangerouslySetInnerHTML={{__html: this.state.domParser.parseFromString(this.state.actualFields['from'], 'text/html').body.textContent}}>{}</td>
        </tr>
        <tr>
        <th className="th_header" scope="row">To</th>
        <td className="th_data" dangerouslySetInnerHTML={{__html: this.state.domParser.parseFromString(this.state.actualFields['to'], 'text/html').body.textContent}}>{}</td>
        </tr>
        <tr>
        <th className="th_header"scope="row">CC</th>
        <td className="th_data" dangerouslySetInnerHTML={{__html: this.state.domParser.parseFromString(this.state.actualFields['cc'], 'text/html').body.textContent}}>{ }</td>
        </tr>
        <tr>
        <th className="th_header" scope="row">BCC</th>
        <td className="th_data" dangerouslySetInnerHTML={{__html: this.state.domParser.parseFromString(this.state.actualFields['bcc'], 'text/html').body.textContent}}>{ }</td>
        </tr>
        <tr>
        <th className="th_header"scope="row">Subject</th>
        <td className="th_data" dangerouslySetInnerHTML={{__html: this.state.domParser.parseFromString(this.state.actualFields['subject'], 'text/html').body.textContent}}>{}</td>
        </tr>
        { (!showing) ?
        <tr>
        <th className="th_header align-top" scope="row">Headers</th>
        <td>
        {
          headers.split('\n').map(function(item,index){
            return(
              <p className="mb-0" key={index} style={{width:'100%'}}>{item}</p>
            );
          })
        }
        </td>
        </tr>
        :
        null
        }
        <tr>
        <th className="th_header" scope="row">Attatchments</th>
        <td style={{width:'100%'}} className="field-value" dangerouslySetInnerHTML={{__html: this.state.domParser.parseFromString(this.state.actualFields['attatchments'], 'text/html').body.textContent}}>{ }</td>
        </tr>
        <tr>
        <th className="th_header align-top" scope="row">Contents</th>
        <td>
        {/* <td style={{width:'100%'}} className="field-value" dangerouslySetInnerHTML={{__html: this.state.domParser.parseFromString(this.state.actualFields['content'], 'text/html').body.textContent}}></td> */}
        {
          contents.split('\n').map(function(item,index){
            return(
              <p className="mb-0" key={index} style={{width:'100%'}}>{item}</p>
            );
          })
        }
        </td>
        </tr>
        </thead>
         </table>
          {/* {
          Object.keys(this.state.actualFields).map((field,index)=>{
            return (
              <div className="field-row" key={field}>
               <div className="field-title">{field}</div>
               <div className="field-value" dangerouslySetInnerHTML={{__html: this.state.domParser.parseFromString(this.state.actualFields[field], 'text/html').body.textContent}}/>
             </div>
            );
          })
          } */}
       </ModalBody>
      </Modal>
    );
  }
}

EmailOverlayComponent.propTypes = {
  result: PropTypes.object,
  hideEmailOverlay: PropTypes.func,
  showEmailOverlay: PropTypes.bool
};
