/*
  CURRNET PAGE, LAST PAGE ARE THE REQUIRED PROPS FOR THIS COMPONENT
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as qs from 'query-string';
import * as parser from '../Common/SbCore.js';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

import '../css/low_level_components/pagination/pagination_with_page_numbers.css';

export default class PaginationWithPageNumbers extends Component{
  constructor(){
    super();
    this.state = {
      pagesArray: []
    };
    this.currentPage.bind(this);
    this.keydown.bind(this);
    this.getPage = this.getPage.bind(this);
  }

  static getDerivedStateFromProps(props, state){
    let pagesArray = [];
    if(props.currentpage <= 3){
      let i = 1;
      let max = 5;
      (props.lastpage > 5)?(max = 5):(max = props.lastpage);
      while(i <= max){
        pagesArray.push(i);
        i++;
      }
    }
    else if(props.currentpage >= (props.lastpage - 2)){
      let i = props.currentpage - 2;
      while(i <= props.lastpage){
        pagesArray.push(i);
        i++;
      }
    }
    else{
      let i = props.currentpage - 2;
      while(i < props.currentpage + 3){
        pagesArray.push(i);
        i++;
      }
    }
    return {
      ...state,
      pagesArray
    };
  }

  getPage(e,page) {
   e.preventDefault();
   let urlParameters = Object.assign({}, qs.parse(window.location.search));
   if(urlParameters.mlt_id){
     urlParameters.XPC = page;
   }
   urlParameters.page = page;
   parser.getResults(urlParameters);
 }

 keydown(e,page) {
  if(e.keyCode === 13){
    this.getPage(e,page);
  }
 }
 currentPage(e) {
   e.preventDefault();
   return false;
 }

  render(){
    let { lastpage, currentpage } = this.props;
    let urlParameters = Object.assign({}, qs.parse(window.location.search));
    if(lastpage !== 1){
      return(
        <Pagination aria-label="Page navigation example">
            {
              (1 === currentpage)
              ?
              <li/>
              :
              <PaginationItem>
                    <PaginationLink href="#" title="Previous"  onClick={(e)=>this.getPage(e,currentpage - 1)}>
                        Previous
                    </PaginationLink>
                </PaginationItem>
            }
            {
              this.state.pagesArray.map((val)=>{
                return <PaginationItem key={val} className={[(urlParameters.page === val || urlParameters.page === val.toString())?'active' :'',(!urlParameters.page && val === 1)?'active' :''].join(" ")}>
                  <PaginationLink href="#" aria-label={val.toString()} title={val} onKeyDown={(e)=> this.keydown(e,val)} onClick={(e)=>{(urlParameters.page === val || urlParameters.page === val.toString())? this.currentPage(e): this.getPage(e,val);}} tabIndex={`${(urlParameters.page === val || urlParameters.page === val.toString())?"-1" :"0"}`}>{val}
                  </PaginationLink>
                </PaginationItem>;
              })
            }
            {
              (lastpage === currentpage)
              ?
              <li/>
              :
              <PaginationItem>
                    <PaginationLink href="#"  title="Next" onClick={(e)=>this.getPage(e,currentpage + 1)}>
                        Next
                    </PaginationLink>
                </PaginationItem>
            }
          </Pagination>
      );
    }else{
      return null;
    }
  }
}

PaginationWithPageNumbers.propTypes = {
  currentpage: PropTypes.number,
  lastpage: PropTypes.number
};
