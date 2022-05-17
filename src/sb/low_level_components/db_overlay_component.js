import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { dataToBeDisplayed } from '../Common/Defaults';
import '../css/db_overlay_component.css';
import * as $ from 'jquery';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from "reactstrap";

export default class DbOverlayComponent extends Component{
  constructor(){
    super();
    this.state = {
      displayFields: [],
      domParser: new DOMParser(),
      actualFields: []
    };
    this.handleKeyUp =this.handleKeyUp.bind(this);
  }
  componentWillMount(){
    let displayFields = [];
    let actualFields = Object.assign([], Object.keys(this.props.result));

    if(dataToBeDisplayed[this.props.result.col] !== undefined){
      let collectionId = this.props.result.col;
      let fieldNames = Object.assign([], Object.keys(dataToBeDisplayed[this.props.result.col]));
      displayFields = fieldNames.map((field)=>{
        return {
          field,
          display: dataToBeDisplayed[collectionId][field]
        };
      });
    }else{
      let fieldNames = Object.assign([], Object.keys(dataToBeDisplayed['other']));
      displayFields = fieldNames.map((field)=>{
        return {
          field,
          display: dataToBeDisplayed['other'][field]
        };
      });
    }

    if(dataToBeDisplayed.displayAll === true){
      for(let i = 0, len = actualFields.length; i < len; i++){
        let index = -1;
        for(let j = 0, lenI = displayFields.length; j < lenI; j++){
          if(displayFields[j].field !== actualFields[i]){
            index = -1;
          }else{
            index = j;
            break;
          }
        }
        if(index === -1 && actualFields[i] !== 'source'){
          displayFields.push({
              field: actualFields[i],
              display: actualFields[i]
          });
        }
      }
    }

    this.setState({
      displayFields,
      actualFields
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
    const { showOverlay ,hideOverlay} = this.props;
    return(
      <Modal isOpen={showOverlay} toggle={hideOverlay}  size="lg">
       <ModalHeader toggle={hideOverlay}>
          {this.state.domParser.parseFromString(this.props.result['title'], 'text/html').body.textContent}
       </ModalHeader>
       <ModalBody>
          {
          this.state.displayFields.map(row => {
            if((this.props.result.contenttype.toLowerCase() === "db" || this.props.result.contenttype.toLowerCase() === "mongodb") && (this.props.result.title === "" || this.props.result.title.length <= 0)) {
              this.props.result.title = this.props.result.uid;
            }
          return (
            <div className="field-row" key={row.field}>
             <div className="field-title">{row.display}</div>
             <div className="field-value" dangerouslySetInnerHTML={{__html: this.state.domParser.parseFromString((this.props.result[row.field] === 'db?url=' ? '' : this.props.result[row.field]), 'text/html').body.textContent}}/>
           </div>
          );
          })
          }
       </ModalBody>
      </Modal>
    );
  }
}

DbOverlayComponent.propTypes = {
  result: PropTypes.object,
  hideOverlay: PropTypes.func,
  showOverlay: PropTypes.bool
};
