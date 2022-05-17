import React, { Component } from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import DbOverlayComponent from '../low_level_components/db_overlay_component';
import EmailOverlayComponent from '../low_level_components/email_overlay_component';
import FileViewerComponent from '../low_level_components/FileViewer';
import * as defaults from '../Common/Defaults';
import * as qs from 'query-string';
import "../css/result_component.css";
import * as $ from 'jquery';
import * as moment from 'moment';
import * as parser from '../Common/SbCore';
let notFound = require("../../images/notFound1.png");

// COMPONENT WHICH HAS ALL RESULTS IN RESPONSE AND USES <Result /> COMPONENT TO DISPLAY EACH RESULT
export default class DefaultResultsComponent extends Component{

  constructor(){
    super();
    this.state = {
      showOverlay: false,
      showEmailOverlay: false,
      showPDFOverlay: false,
      result: {},
      emailViewObj:{},
      activeElement: ""
    };
    this.getDbResults = this.getDbResults.bind(this);
    this.getEmailViewerFunc = this.getEmailViewerFunc.bind(this);
    this.getPDFResults = this.getPDFResults.bind(this);
    this.handleImgError = this.handleImgError.bind(this);
    this.documentClick = this.documentClick.bind(this);
    this.morelikethisClick = this.morelikethisClick.bind(this);
    this.hideOverlay = this.hideOverlay.bind(this);
    this.hideEmailOverlay = this.hideEmailOverlay.bind(this);
    this.hidePDFOverlay = this.hidePDFOverlay.bind(this);
  }

  morelikethisClick(uid,col,e) {
    e.preventDefault();
    let urlParameters = Object.assign({}, qs.parse(window.location.search));
    urlParameters.mlt_id = uid;
    urlParameters.mlt_col = col;
    urlParameters.page = 1;
    urlParameters.XPC=1;
    parser.getResults(urlParameters);
  }

  getDbResults(result, e){
    e.preventDefault();
    this.setState({
     activeElement:document.activeElement
   });
    e.preventDefault();
    if(Object.keys(result).length > 0)
    {
      this.setState({
        result: Object.assign({}, result),
        showOverlay: true
      });
    }else{
      this.setState({
        showOverlay: false
      });
    }
  }

  getEmailViewerFunc(result, e){
    e.preventDefault();
    let emailObj = {
      url:result.uid,
      col:result.col
    };
    parser.getEmailViewer(emailObj)
    .then((response)=>{
      if(response.data === undefined){
        throw new Error("Email viewer error");
      }
      if(Object.keys(response.data).length > 0)
      {
        this.setState({
          emailViewObj: Object.assign({}, response.data),
          showEmailOverlay: true
        });
      }else{
        this.setState({
          showEmailOverlay: false
        });
      }
    }).catch(error=>{
      // console.log(error);
    });
  }

  getPDFResults(result, e){
    e.preventDefault();
    parser.getDocumentClickCount(result);
    this.setState({
     activeElement:document.activeElement
   });
    e.preventDefault();
    if(Object.keys(result).length > 0)
    {
      this.setState({
        result: Object.assign({}, result),
        showPDFOverlay: true
      });
    }else{
      this.setState({
        showPDFOverlay: false
      });
    }
  }

  handleImgError(e) {
    e.target.src = notFound;
  }

  hideOverlay(){
    this.setState({
      showOverlay: !this.state.showOverlay
    });
    this.state.activeElement.focus();
  }

  hideEmailOverlay(){
    this.setState({
      showEmailOverlay: !this.state.showEmailOverlay
    });
    this.state.activeElement.focus();
  }

  hidePDFOverlay(){
    this.setState({
      showPDFOverlay: !this.state.showPDFOverlay
    });
    this.state.activeElement.focus();
  }

  documentClick(result) {
    parser.getDocumentClickCount(result);
  }


  render(){
    let { results, resultInfo} = this.props;
    return (
      <div>
        {
          results.map((result)=>{
            return <Result key={result['no']} result={result} highlight={resultInfo.highlight} getDbResults={this.getDbResults} getEmailViewerFunc={this.getEmailViewerFunc} getPDFResults={this.getPDFResults} documentClick={this.documentClick} morelikethisClick={this.morelikethisClick}/>;
          })
        }
        {
          (this.state.showOverlay)?<DbOverlayComponent result={this.state.result} showOverlay={this.state.showOverlay} hideOverlay={this.hideOverlay}/>:""
        }
        {
          (this.state.showEmailOverlay)?<EmailOverlayComponent result={this.state.emailViewObj} showEmailOverlay={this.state.showEmailOverlay} hideEmailOverlay={this.hideEmailOverlay}/>:""
        }
        {
          (this.state.showPDFOverlay)?<FileViewerComponent result={this.state.result} showPDFOverlay={this.state.showPDFOverlay} hidePDFOverlay={this.hidePDFOverlay}/>:""
        }
      </div>
    );
  }
}

function Result(props){
  let result = Object.assign({}, props.result);
  let contentType = "";
  let urlParameters = Object.assign({}, qs.parse(window.location.search));
  if(result.contenttype && result.contenttype !== "" && result.contenttype.length > 0) {
    contentType = result.contenttype.toLowerCase();
  }
  let kb = 1024;
  let mb = 1024*1024;
  let gb = 1024*1024*1024;
  if(result.size) {
    if(result.size >= kb) {
      if(result.size <= mb){
        result.size = parseInt(result.size/kb,10) + " KB";
      }
      else if(result.size <= gb){
        result.size = parseInt(result.size/mb,10) + " MB";
      }
      else if(result.size > gb){
        result.size = parseInt(result.size/kb,10) + " GB";
      }
    }
    else {
      result.size = "";
    }
  }
  if(result.url) {
    let pluginDomain = "";
    let pd = document.getElementById("sb_plugin_domain");
    if(pd !== undefined && pd !== null && pd !== ""){
      pluginDomain = pd.value;
    }
    else {
      pluginDomain = defaults.pluginDomain;
    }
    if(result.url.split[0] === 'http' || result.url.split[0] === 'https'){
      result.contentUrl = result.url;
    }
    else if(result.url[0] === '/' || result.url[1] === ':' || result.url[0] === '\\'){
      result.contentUrl =  pluginDomain + '/ui/v1/file/download?url=' + encodeURIComponent(result.url) + '&col=' + result.col;
    }
    else if(result.url.substring(0, 2) === 'db'){
      result.contentUrl = pluginDomain + '/ui/v1/db-viewer/get/?col=' + result.col + '&uid=' + result.uid;
    }
    // else if(result.url.split(':')[0] === 'eml'){
      // result.contentUrl = pluginDomain + '/servlet/EmailViewer?url=' + result.uid + '&col=' + result.col;
    // }
    else {
      result.contentUrl = result.url;
    }
    result.contentUrl = result.contentUrl.replace(/&amp;/g, "&");
 }
 // if(contentType === 'jpg' || contentType === "jpeg" || contentType === "png" || contentType === "gif" || contentType === "bmp") {
 //   if(result.url !== "" && result.url !== null) {
 //     let rest = result.url.substring(0, result.url.lastIndexOf("/") + 1);
 //     let last = result.url.substring(result.url.lastIndexOf("/") + 1, result.url.length);
 //     result.contentUrl = rest + encodeURIComponent(last);
 //   }
 // }
  if(result.lastmodified) {
    result.lastmodified =  moment(new Date(result.lastmodified)).utc().format("LL");
  }
  if(result.url){
    // result.displayUrl = decodeURIComponent(result.url.replace(/%([^\d].)/g, "%25$1").replace(/&amp;/g, "&"));
    result.displayUrl = new DOMParser().parseFromString(result.url, 'text/html').body.textContent;
  }
  if(result.title && result.title.length > 0) {
    try {
      result.title = decodeURIComponent(result.title.replace(/%([^\d].)/g, "%25$1").replace(/&#0;/g,"").replace(/&amp;/g, "&"));
    }catch(e){
      result.title = decodeURIComponent(unescape(unescape(result.title.replace(/%([^\d].)/g, "%25$1").replace(/&#0;/g,"").replace(/&amp;/g, "&"))));
    }
  }
  else if((contentType === "db" || contentType === "mongodb") && (result.title === "" || result.title.length <= 0)) {
    result.title = result.uid;
  }
  else {
    result.title = "Untitled";
  }
  if(result.context){
    result.descriptionContent = result.context.replace(/(&amp;amp;)|(amp;)|(&amp;nbsp;)|(&amp;)/g, "&").replace(/&amp;amp;amp;/g, "&").replace(/&quot;/g, "\"").replace(/&nbsp;/g,"");//new DOMParser().parseFromString(result.context.text, 'text/html').body;
  }else if(result.description){
    result.descriptionContent = result.description;
  }

  if(result.descriptionContent && result.descriptionContent.length > 260){
    let descriptionContent = result.descriptionContent.substring(0, 260).split(" ");
    descriptionContent.splice(descriptionContent.length - 1, 1);
    result.descriptionContent = descriptionContent.join(" ") + " ...";
  }

  // else{
  //   result.descriptionContent = decodeURIComponent(result.description).replace(/(&amp;amp;)|(amp;)|(&amp;nbsp;)|(&amp;)/g, "&").replace(/&amp;amp;amp;/g, "&").replace(/&quot;/g, "\"").replace(/&nbsp;/g,"");
  // }
  let expandImage = (e) => {
    if($(e.target).siblings().length === 1){
      let imageElement = $(e.target).siblings()[0];
      if($(imageElement).css('height') === '300px'){
        $(imageElement).css('height', '100px');
        $(e.target).html('View Large');
      }else{
        $(imageElement).css('height', '300px');
        $(e.target).html('View Small');
      }
    }
  };
 // RETURNIG THE VIEW TO BE RENDERED FOR EACH RESULT
 return (
  <div className={`single-result-container ${!props.highlight ? 'noHighlight' : ''}`}>
     <div className={contentType === "html"?"searchResult":""}>
       {
         (contentType === 'db' || contentType === 'csv' || contentType === 'mongodb')
           ?
           <React.Fragment>
             <a className="result-title" href="" title={result.title.replace(/(<([^>]+)>)/gi, "")} onClick={(e) => props.getDbResults(props.result, e)} target="_blank" dangerouslySetInnerHTML={{ __html: result.title }} />
           </React.Fragment>
           :
           <React.Fragment>
             {
               (contentType === "email")
               ?
               <React.Fragment>
                 <a className="result-title" href="" title={result.title.replace(/(<([^>]+)>)/gi, "")} onClick={(e) => props.getEmailViewerFunc(props.result, e)} target="_blank" dangerouslySetInnerHTML={{ __html: result.title }} />
               </React.Fragment>
               :
               (contentType === "pdf" && result.url[0] !== '/' && result.url[1] !== ':' && result.url[0] !== '\\' && result.url.substring(0, 2) !== 'db')
               ?
               <React.Fragment>
                 <a className="result-title" href="" title={result.title.replace(/(<([^>]+)>)/gi, "")} onClick={(e) => props.getPDFResults(props.result, e)} dangerouslySetInnerHTML={{ __html: result.title }} />
               </React.Fragment>
               :
               <React.Fragment>
                  <a className="result-title" title={result.title.replace(/(<([^>]+)>)/gi, "")} href={result.contentUrl} target="_blank" onClick={(e) => props.documentClick(result, e)} dangerouslySetInnerHTML={{ __html: result.title }} />
                </React.Fragment>
             }
           </React.Fragment>
       }
       {
         (contentType && contentType !== "") &&
         <span className="contentTypeHeading">{contentType}</span>
       }
       {
         (contentType === 'html' && urlParameters.query !== "*") &&
         <a href="" className="morelikethis" style={{margin: "0px 10px",textDecoration: "none"}} onClick={(e) => props.morelikethisClick(result.uid,result.col,e)} title="More like this"><i className="fa-solid fa-file-magnifying-glass"/></a>
       }
       <br />
       {
         (contentType === 'jpg' || contentType === "jpeg" || contentType === "png" || contentType === "gif" || contentType === "bmp") ?
           <span className="image-container-span">
             <a className="result-image" title={result.contentUrl}>
               <img src={result.contentUrl} alt={result.title} />
             </a>
           </span>
           : ""
       }
       {
         (contentType === 'mpeg' || contentType === "mp4" || contentType === "flv" || contentType === "mpg") ?
           <video className="result-video" width="320" height="240" controls>
             <source src={result.contentUrl} type="video/mp4" />
           </video> : ""
       }
       <p className="result-description" dangerouslySetInnerHTML={{ __html: result.descriptionContent }} />
       {
         (defaults.urlDisplay) &&
         <p className="result-url">{result.displayUrl} </p>
       }
       <span className="result-url">{result.displayUrl} </span>
       <div style={{marginTop:"10px"}}>
           {
             (result.lastmodified) &&
             <div className="d-inline-block mr-3">
             <i className="fa fa-calendar-check mr-2"/>
             <span className="result-lastmodified">{result.lastmodified}</span>
             </div>
           }
           {
             (result.colname) &&
             <div className="d-inline-block mr-3">
               <span className="result-colname" style={{color:"#77756e"}}>Collection: </span>
               <span className="result-colname">{result.colname}</span>
             </div>
           }
       </div>
     </div>
     {
       (contentType === "html") &&
         <div className="featuredImg">
         {
           (result['og:image'])
           ?
           <a href={result.contentUrl}  title={result.title} target="_blank"><img src={result['og:image']} alt={result['og:title']?result['og:title']:result.title}/></a>
           :
           ""
         }
         </div>
       }
  </div>
);
}

DefaultResultsComponent.propTypes = {
results: PropTypes.array,
resultInfo: PropTypes.object
};

Result.propTypes = {
result: PropTypes.object,
highlight: PropTypes.bool,
getDbResults: PropTypes.func,
getPDFResults: PropTypes.func,
getEmailViewerFunc: PropTypes.func,
handleImgError: PropTypes.func,
documentClick: PropTypes.func,
morelikethisClick: PropTypes.func
};
