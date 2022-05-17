import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import * as qs from 'query-string';
import * as parser from '../Common/SbCore';
import * as moment from 'moment';
import * as $ from 'jquery';
import { facets, facetFiltersOrder } from '../Common/Defaults';
import '../css/facet_filters_component.css';
import {Collapse, Button } from 'reactstrap';
import dateFormat from 'dateformat';

export default class SelectedFilters extends Component{
    constructor(){
    super();
    this.orderedFacets = [];
    this.toggleFilter = this.toggleFilter.bind(this);
    this.clearAllFilters = this.clearAllFilters.bind(this);
    this.state = {
      mobileFacets:false,
      clearAllBtn:false,
      filterArrayCount:0,
    };
  }

  componentWillMount(){
    this.customizeOrderOfFacets(this.props.facets);
  }

  componentDidMount(){
    this.urlParameters = Object.assign({}, qs.parse(window.location.search));
  }

  componentWillReceiveProps(newProps){
    this.customizeOrderOfFacets(newProps.facets);
    this.urlParameters = Object.assign({}, qs.parse(window.location.search));
  }


  customizeOrderOfFacets(facetsInProps){
    // TO REORDER THE FACETS AS CONFIGURED IN FACET.JSON FILE
    let toBeOrder = [];
    let firstOrder = [];
    let nextOrder = [];
    this.urlParameters = Object.assign({}, qs.parse(window.location.search));
    let regex = /^f+\.[A-Za-z_]+\.filter+$/g;
    // if(sessionStorage.sessionFacetsOrder && sessionStorage.sessionFacetsOrder !== undefined && sessionStorage.sessionFacetsOrder !== null && sessionStorage.sessionFacetsOrder !== ""){
    //   toBeOrder = Object.assign([], JSON.parse(sessionStorage.sessionFacetsOrder));
    // }else{
    // }
    toBeOrder = Object.assign([], facetFiltersOrder);
    if(facetsInProps.constructor === Array){
      facetsInProps.forEach(function(key,val) {
        let index = toBeOrder.indexOf(Object.keys(key)[0]);
        (index !== -1)
        ?
        firstOrder[index] = facetsInProps[val]
        :
        nextOrder.push(facetsInProps[val]);
      });
      this.orderedFacets = firstOrder.concat(nextOrder);
    }else{
      this.orderedFacets.push(facetsInProps.facet);
    }
    let filterApplied = false;
    let filterArray = [];
    Object.keys(this.urlParameters).map((paramItem,index) => {
     if(paramItem !== "f.Lang.filter" && paramItem !== "f.language.filter" && regex.test(paramItem)) {
       filterArray.push(paramItem);
       filterApplied = true;
       this.setState({
         clearAllBtn:true,
         filterArrayCount:filterArray.length
       });
     }
     return <span key={index}/>;
   });
   if(!filterApplied) {
     this.setState({
       clearAllBtn:false
     });
   }
  }

  /* TOGGLES THE FILTERS
  | CHECKS IF FILTERS ALREADY EXIST. CHECKS ARE BASED ON CURRENT URL
  | IF FILTER EXIST THEN CHECKS ARE DONE IF ARRAY OR STRING AND EXISTING FILTERS ARE REMOVED
  | IF FILTER DOESNT EXIST THEN ADDED AS STRING. IF ALREADY DIFF FILTER EXIST IN SAME TYPE THEN ADDED TO ARRAY
  */

  toggleFilter(e,facetName, filterName){
    e.preventDefault();
    let parserDOM = new DOMParser();
    let regX = /^\[[0-9-]+T[0-9:]+TO([0-9-]+T[0-9:]+|\*)\]$/g;
    this.urlParameters = Object.assign({}, qs.parse(window.location.search));
    if(this.urlParameters[`f.${facetName}.filter`]){
      if(regX.test(this.urlParameters[`f.${facetName}.filter`])){
        if(this.urlParameters[`f.${facetName}.filter`] === filterName){
          delete this.urlParameters[`f.${facetName}.filter`];
        }else{
          this.urlParameters[`f.${facetName}.filter`] = filterName;
        }
      }
      else if(this.urlParameters[`f.${facetName}.filter`].constructor === Array){
        let indexOfFilter = -1;
        for(let i = 0, len = this.urlParameters[`f.${facetName}.filter`].length; i < len; i++){
          if(encodeURIComponent(parserDOM.parseFromString(this.urlParameters[`f.${facetName}.filter`][i], 'text/html').body.textContent) === encodeURIComponent(parserDOM.parseFromString(filterName, 'text/html').body.textContent)){
            indexOfFilter = i;
          }
        }
        if(indexOfFilter === -1){
          this.urlParameters[`f.${facetName}.filter`].push(encodeURIComponent(parserDOM.parseFromString(filterName, 'text/html').body.textContent));
        }else{
          this.urlParameters[`f.${facetName}.filter`].splice(indexOfFilter, 1);
          if(this.urlParameters[`f.${facetName}.filter`].length === 0)delete this.urlParameters[`f.${facetName}.filter`];
        }
      }else{
        if(encodeURIComponent(parserDOM.parseFromString(this.urlParameters[`f.${facetName}.filter`], 'text/html').body.textContent) === encodeURIComponent(parserDOM.parseFromString(filterName, 'text/html').body.textContent)){
          delete this.urlParameters[`f.${facetName}.filter`];
        }else{
          let temp = this.urlParameters[`f.${facetName}.filter`];
          this.urlParameters[`f.${facetName}.filter`] = [];
          this.urlParameters[`f.${facetName}.filter`].push(temp, encodeURIComponent(parserDOM.parseFromString(filterName, 'text/html').body.textContent));
        }
      }
    }else{
      if(regX.test(filterName)){
        this.urlParameters[`f.${facetName}.filter`] = filterName;
      }else{
        this.urlParameters[`f.${facetName}.filter`] = encodeURIComponent(parserDOM.parseFromString(filterName, 'text/html').body.textContent);
      }
    }
    this.urlParameters.page=1;
    if(this.urlParameters.customDate){
      delete this.urlParameters.customDate;
    }
    parser.getResults(this.urlParameters);
    this.setState({mobileFacets:false});
  }

  clearAllFilters(e) {
    e.preventDefault();
      let facetFields = [];
      facetFields = Object.assign([], facets);
      for(let i=0, len = facetFields.length; i<len; i++){
        if(`${facetFields[i]['field']}` !== "Lang" && `${facetFields[i]['field']}` !== "language") {
          delete this.urlParameters[`f.${facetFields[i]['field']}.filter`];
        }
      }
      this.urlParameters.page=1;
      if(this.urlParameters.customDate){
        delete this.urlParameters.customDate;
      }
      parser.getResults(this.urlParameters);
  }

  render(){
    let { facets } = this.props;
    let urlParameters = Object.assign({}, qs.parse(window.location.search));
    //console.log(this.orderedFacets,"orderedFacets");
    // RENDERS THE FACETS AND HAS <Facet /> COMPONENT FOR EACH FACET IN FACETS
    return(
      <Fragment>
        {
          (this.state.filterArrayCount > 0) &&
          <div className="topFilters">
            {
              (this.state.clearAllBtn) &&
                  <a className="clearAllBtn" href="" title="Clear All" onClick={(e) => this.clearAllFilters(e)}>Clear All <span style={{marginLeft:"15px"}}><i className="fa fa-close"/></span></a>
            }
            <div className="selectedFitlerTopDiv">
              {
                this.orderedFacets.map((facet ,index)=>{
                  let field = Object.keys(facet)[0];
                    const variable = facet[field].map((filter, index) => {
                      if(filter.rangeField){
                        let tempdate = filter.filterName.split(" TO ");
                        let startDate = moment(tempdate[1]).utc().format("YYYY-MM-DD");
                        let endDate = moment(tempdate[0]).utc().format("YYYY-MM-DD");
                        return filter.filterSelect ? <a href="" key={index} className="cdatefilter" onClick={(e) => this.toggleFilter(e,field, filter.fromValue)} title={startDate+' To '+endDate}>{startDate} To {endDate}<span style={{marginLeft:"10px"}}><i className="fa fa-close"/></span></a> : null;
                      }
                      else {
                        return  filter.filterSelect ? <a href="" key={index} className="cdatefilter" onClick={(e) => this.toggleFilter(e,field, filter.filterName)} title={filter.filterName}>{filter.filterName.replace(/&quot;/g, '"').replace(/&amp;/g, "&")}<span style={{marginLeft:"10px"}}><i className="fa fa-close"/></span></a> : null;
                       }
                     }
                   );
                    return variable;
                })
              }
             </div>
          </div>
     }
      </Fragment>
    );
  }

}

SelectedFilters.propTypes = {
  facets: PropTypes.array
};
