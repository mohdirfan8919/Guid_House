/*
  CURRNET PAGE, LAST PAGE ARE THE REQUIRED PROPS FOR THIS COMPONENT
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as qs from 'query-string';
import * as parser from '../Common/SbCore.js';

import '../css/low_level_components/pagination/pagination_with_page_numbers.css';

export default class RandomPaginationNumbers extends Component{
  constructor(){
    super();
    this.state = {
      pagesArray: []
    };
    this.getPage = this.getPage.bind(this);
  }

  componentWillReceiveProps(){
    let pagesArray = [];
    if(this.props.currentpage <= 11){
      let i = 1;
      let max = this.props.currentpage + 9;
      while(i <= max && i<= this.props.lastpage){
        pagesArray.push(i);
        i++;
      }
    }
    else if(this.props.currentpage > 11){
      let i = this.props.currentpage - 10;
      let max = this.props.currentpage + 10;
      while(i < max && i<= this.props.lastpage){
        pagesArray.push(i);
        i++;
      }
    }
    this.setState({pagesArray});
  }

  getPage = (page)=>{
    let urlParameters = Object.assign({}, qs.parse(window.location.search));
    (urlParameters.mlt_id)?(urlParameters.XPC = page):(urlParameters.page = page);
    parser.getResults(urlParameters);
  }


    render(){
      let urlParameters = Object.assign({}, qs.parse(window.location.search));
      const active={
        backgroundColor: '#5474a4',
        color:'#fff'
      };
      const nonActive={
        color:'#2323cf'
      };
      return(
        <div className={(this.props.lastpage === 1)?"hidePagination":"showPagination"}>
          <div>
          <ul className="pagination">
            {
              (1 === this.props.currentpage)
              ?
              <li/>
              :
              <li><a className ="previous" title="Previous" onClick={()=>this.getPage(this.props.currentpage - 1)}>Previous</a></li>
            }
            {
              this.state.pagesArray.map((val)=>{
                return <li key={val}><a onClick={()=>this.getPage(val)} title={val} style={(urlParameters.page == val)?active :nonActive}>{val}</a></li>;
              })
            }
            {
              (this.props.lastpage === this.props.currentpage)
              ?
              <li/>
              :
              <li><a className="next" title="Next" onClick={()=>this.getPage(this.props.currentpage + 1)}>Next</a></li>
            }
          </ul>
          </div>
        </div>
      );
    }
}

RandomPaginationNumbers.propTypes = {
  currentpage: PropTypes.number,
  lastpage: PropTypes.number
};
