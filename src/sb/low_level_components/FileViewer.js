import React from "react";
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import FileViewer from "react-file-viewer";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";


// const file = "https://apcentral.collegeboard.org/pdf/ap-csp-web-banner-instructions.pdf";
const type = "pdf";

const onError = e => {
  // console.log(e, "error in file-viewer");
};

export default class FileViewerComponent extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      domParser: new DOMParser()
    };
    this.handleKeyUp =this.handleKeyUp.bind(this);
  }
  handleKeyUp(e) {
    if (e.keyCode == 9) {
      e.preventDefault();
    }
  }
  render(){
    const { showPDFOverlay ,hidePDFOverlay} = this.props;
    return(
      <Modal isOpen={showPDFOverlay} toggle={hidePDFOverlay}  size="lg" className="pdf_fileview_modal">
        <ModalHeader toggle={hidePDFOverlay}>
           {this.state.domParser.parseFromString(this.props.result['url'], 'text/html').body.textContent}
        </ModalHeader>
        <ModalBody>
           {
             ((this.props.result['url'] !== "" && this.props.result['url'] !== null) && (this.props.result['url'].split("/")[0] === location.protocol))
             ?
             <FileViewer fileType={type} filePath={this.props.result['url']} onError={onError} />
             :
             <p>Please <a href={this.props.result['url']} target="_blank" title={this.props.result['url']}>click here </a> to preview the file.</p>
           }
        </ModalBody>
      </Modal>
    );
  }
}

FileViewerComponent.propTypes = {
  result: PropTypes.object,
  hidePDFOverlay: PropTypes.func,
  showPDFOverlay: PropTypes.bool
};
