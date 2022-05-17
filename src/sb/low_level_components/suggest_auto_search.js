import React from 'react';
import PropTypes from 'prop-types';
import * as qs from 'query-string';
import * as defaults from '../Common/Defaults';
import * as parser from '../Common/SbCore';

export default class SuggestAutoSearch extends React.Component{
  constructor(props){
    super(props);
    this.urlParameters = {};
    this.suggestCLick.bind(this);
    this.urlParameters = Object.assign({}, qs.parse(window.location.search));
  }
  suggestCLick(e) {
    e.preventDefault();
    this.props.resetActualQuery();
    this.urlParameters.query = this.props.resultquery;
    let params = parser.getInitialUrlParameters(this.urlParameters.query);
    params.page = 1;
    parser.getResults(params);
  }

  render(){
    let urlParameters = Object.assign({}, qs.parse(window.location.search));
    urlParameters.query = this.props.resultquery;
    return(
      <div className="col-sm-12" style={{padding: "0"}}>
      <p style={{color:"#d91a61"}}>Showing results for <a href={`?${qs.stringify(this.urlParameters)}`} onClick={(e) => this.suggestCLick(e)} title="Suggested query" style={{textDecoration:"underline",color:"#0a4a69",fontFamily:"IsidoraSansBold"}} dangerouslySetInnerHTML={{__html: this.props.resultquery}}>{ }</a> instead of <span style={{color:"#0a4a69"}}>{ this.props.actualquery}</span></p>
      </div>
    );
  }
}

SuggestAutoSearch.propTypes = {
  resultquery: PropTypes.string,
  resetActualQuery: PropTypes.func,
  actualquery: PropTypes.string
};
