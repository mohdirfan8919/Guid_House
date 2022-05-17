import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import * as qs from 'query-string';
import * as parser from '../Common/SbCore';
import * as moment from 'moment';
import * as $ from 'jquery';
import { facets, facetFiltersOrder,customDateSettings, facet } from '../Common/Defaults';
import CustomDateFilters from './CustomDateFilters';
import '../css/facet_filters_component.css';
import {Collapse, Button, Label, Input, DropdownToggle,
DropdownMenu,
DropdownItem,
UncontrolledDropdown,
Dropdown } from 'reactstrap';
import { filter } from 'lodash';
import dateFormat from 'dateformat';

export default class FacetFilters extends Component{
    constructor(){
    super();
    this.orderedFacets = [];
    this.targetForMovableId  = "";
    this.toggleFilter = this.toggleFilter.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.dropdownClose = this.dropdownClose.bind(this);
    this.clearAllFilters = this.clearAllFilters.bind(this);
    this.facetToggle = this.facetToggle.bind(this);
    this.mobileFacets = this.mobileFacets.bind(this);
    this.changeSearchInput = this.changeSearchInput.bind(this);
    this.clearSearchInput = this.clearSearchInput.bind(this);
    this.showMore.bind(this);
    this.showLess.bind(this);
    this.state = {
      clearAllBtn:false,
      mobileFacets:false,
      dropdowntemp: false,
      query: ""
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
  }

  changeSearchInput(e){
    this.setState({
      query: e.target.value
    });
  }
  clearSearchInput(e) {
    e.preventDefault();
    this.setState({
      query: ""
    });
  }

  customizeOrderOfFacets(facetsInProps){
    // TO REORDER THE FACETS AS CONFIGURED IN FACET.JSON FILE
    let toBeOrder = [];
    let firstOrder = [];
    let nextOrder = [];
    this.urlParameters = Object.assign({}, qs.parse(window.location.search));
    let regex = /^f+\.[A-Za-z]+\.filter+$/g;
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
    let reorderedFacets = [];
    for (let i=0;i<this.orderedFacets.length;i++){
      for( let j=0;j<facets.length;j++){
        if(this.orderedFacets[i]!==undefined && this.orderedFacets[i].facetField===facets[j].field){
          reorderedFacets.push(this.orderedFacets[i]);
        }
      }
    }
    this.orderedFacets = reorderedFacets;
        // TO SET THE MINIMUM NIMBER OF FILTERS TO DISPLAY ON PAGE LOAD
        if(this.orderedFacets.length > 0){
          let showMoreLessTemp = {};
          for(let i = 0, len = this.orderedFacets.length; i< len;i++){
            showMoreLessTemp[Object.keys(this.orderedFacets[i])[0]] = 5;
          }
          let stateVariable = Object.assign({}, showMoreLessTemp);
          this.setState(stateVariable);
        }

    let filterApplied = false;
    Object.keys(this.urlParameters).map((paramItem,index) => {
     if(paramItem !== "f.Lang.filter" && paramItem !== "f.language.filter" && regex.test(paramItem)) {
       filterApplied = true;
       this.setState({
         clearAllBtn:true
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


  showMore(e,facetName) {
    e.preventDefault();
    this.setState({
      [facetName]: this.state[facetName]+5
    });
  }

  showLess (e,facetName) {
    e.preventDefault();
    this.setState({
      [facetName]: this.state[facetName] -5
    });
  }

  /* TOGGLES THE FILTERS
  | CHECKS IF FILTERS ALREADY EXIST. CHECKS ARE BASED ON CURRENT URL
  | IF FILTER EXIST THEN CHECKS ARE DONE IF ARRAY OR STRING AND EXISTING FILTERS ARE REMOVED
  | IF FILTER DOESNT EXIST THEN ADDED AS STRING. IF ALREADY DIFF FILTER EXIST IN SAME TYPE THEN ADDED TO ARRAY
  */

  toggleFilter(e,facetName, filterName){
    this.props.parentCallback(facetName,filterName);
    e.preventDefault();
    let parserDOM = new DOMParser();
    let regX = /^\[[0-9-]+T[0-9:]+TO([0-9-]+T[0-9:]+|\*)\]$/g;
    let facetFields = [];
    facetFields = Object.assign([], facets);

    this.urlParameters = Object.assign({}, qs.parse(window.location.search));
    if(this.urlParameters[`f.${facetName}.filter`]){
      if(regX.test(this.urlParameters[`f.${facetName}.filter`]) || facetName==customDateSettings.customDateField){
        if(this.urlParameters[`f.${facetName}.filter`] === filterName){
          delete this.urlParameters[`f.${facetName}.filter`];
          if(this.urlParameters.customDate){
            delete this.urlParameters.customDate;
          }
          delete this.urlParameters['facet.field'];
          delete this.urlParameters[`f.${customDateSettings.customDateField}.range`];
          this.urlParameters['facet.field'] = [];
          for(let i=0, len = facetFields.length; i<len; i++){
            this.urlParameters['facet.field'].push(facetFields[i].field);
            if(facetFields[i].dateRange){
              this.urlParameters[`f.${facetFields[i].field}.range`] = [];
              this.urlParameters[`f.${facetFields[i].field}.range`] = facetFields[i].dateRange.map((range)=>{
                return "[" + moment().subtract(range.value, range.calendar).format('YYYY-MM-DDTHH:mm:ss') + "TO*]";
              });
            }
          }
        }else{
          this.urlParameters[`f.${facetName}.filter`] = filterName;
          if(this.urlParameters.customDate){
            delete this.urlParameters.customDate;
          }
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
    parser.getResults(this.urlParameters);
    this.setState({mobileFacets:false});
  }

  // facetToggle(e) {
  //   e.preventDefault();
  //   $(e.target).next().slideToggle();
  // }
  mobileFacets(e) {
    this.setState({mobileFacets:!this.state.mobileFacets});
  }

  clearAllFilters(e) {
    e.preventDefault();
    // let urlParameters = Object.assign({}, qs.parse(window.location.search));
      let facetFields = [];
      facetFields = Object.assign([], facets);
      let customDateField = "";
      customDateField = customDateSettings.customDateField;
      delete this.urlParameters['facet.field'];
      this.urlParameters['facet.field'] = [];
      for(let i=0, len = facetFields.length; i<len; i++){
        this.urlParameters['facet.field'].push(facetFields[i].field);
        if(`${facetFields[i]['field']}` !== "Lang" && `${facetFields[i]['field']}` !== "language") {
          delete this.urlParameters[`f.${facetFields[i]['field']}.filter`];
        }
        if(this.urlParameters[`f.${customDateField}.filter`]){
          delete this.urlParameters[`f.${customDateField}.filter`];
          delete this.urlParameters[`f.${customDateField}.range`];
        }
        if(facetFields[i].dateRange){
          this.urlParameters[`f.${facetFields[i].field}.range`] = [];
          this.urlParameters[`f.${facetFields[i].field}.range`] = facetFields[i].dateRange.map((range)=>{
            return "[" + moment().subtract(range.value, range.calendar).format('YYYY-MM-DDTHH:mm:ss') + "TO*]";
          });
        }
      }

      if(this.urlParameters.customDate){
        delete this.urlParameters.customDate;
      }
      this.urlParameters.page=1;
      parser.getResults(this.urlParameters);
  }

  facetToggle(e) {
    e.preventDefault();
      if($(e.target).parent('.facetSubDiv').length){
        $(e.target).children(".upArrow").toggleClass("downArrow");
        $(e.target).parent(".facetSubDiv").siblings(".facetFiltersDiv").slideToggle();
      }
      else {
        $(e.target).toggleClass("downArrow");
        $(e.target).parents(".facetEachDiv").children(".facetFiltersDiv").slideToggle();
    }
  }

  dropdownToggle(){
    this.setState({
      dropdowntemp: !this.state.dropdowntemp
    });
  }

  dropdownClose(){
    this.setState({
      dropdowntemp: false
    });
  }

  render(){
    let { facets,allFacetsResponse } = this.props;
    let parameters = Object.assign({}, qs.parse(window.location.search));
    let queryTemp = "";
    let date = "";
    for(let i in facets){
      if(facets[i].dateRange !== undefined){
        date = facets[i].field;
      }
    }

    let datefilter = parameters['f.'+date+'.filter'];
    let datefilterTwo =parameters['f.'+date+'.filter'];
    let dataString = String(datefilter);
    let dataStringTwo = String(datefilterTwo);
    let dateconvert = dataString.substr(1,19);
    let dateconvertTwo = dataStringTwo.substr(22,19);
    if(parameters['f.'+date+'.filter'] && !parameters['f.'+date+'.filter'].includes("*"))
    parameters['f.'+date+'.filter']=dateFormat(dateconvert,"dd mmmm yyyy") + " - " +dateFormat(dateconvertTwo,"dd mmmm yyyy") ;
    console.log(this.orderedFacets)

    // RENDERS THE FACETS AND HAS <Facet /> COMPONENT FOR EACH FACET IN FACETS
    return(
      <Fragment>
      <div className="">
      <h3 className="mobileHeading" onClick={(e) => this.mobileFacets(e)}><i className="fa fa-bars" aria-hidden="true">{' '}</i> Filters </h3>
      </div>
      <div className="facetFilters" role="region">
        {
          this.orderedFacets.map((facet, index) => {
            let field = Object.keys(facet)[0];
            let displaynotdate = "";
            facet[field].map((filter, index) => {
              if(!filter.rangeField){
                displaynotdate = facet.display;
              }
            });
            return(
              <>
              {facet.display === "keywords" &&
              <Fragment key={index}>
              <div className="facetEachDiv">
                {
                  (facet.display && displaynotdate!=="") &&
                    <div className="facetSubDiv" onClick={(e) => this.facetToggle(e)}>
                      <a href="" className="facetHeading">{facet.display}
                      <i className="upArrow"/></a>
                    </div>
                }

                <div className="facetFiltersDiv">
                    <ul style={{listStyleType:'none'}}>
                      {
                        facet[field].map((filter, index) => {
                          if(!filter.rangeField){
                            return <li key={index} className={(this.state[field] < index+1)?"facetValue hideClass":"facetValue showClass"}>
                              <div  className={`facetChild ${filter.filterSelect ?'activeFilter':'inactiveFilter'} ${facet.facetField==="contenttype"?"contentType":"notcontentType"}`} title={filter.filterName}>
                            <p className="mb-0 d-flex">
                              {/* <label className="checkboxContainer">*/}
                                {/*<input type="checkbox" defaultChecked={filter.filterSelect} style={{marginRight:"5px",cursor:"pointer"}}/>*/}{' '}
                                <a href="" onClick={(e) => this.toggleFilter(e,field, filter.filterName)} title={filter.filterName}
                                ><span className="checkmark"/></a>
                              {/*</label> */}
                              {filter.filterName.replace(/&quot;/g, '"').replace(/&amp;/g, "&")}
                              {filter.filterName.length <=4 ? <span className="customtext" aria-hidden="true">facet</span>
                              :""
                              }
                            </p>
                            <p className="mb-0 d-flex">
                              <span className={[filter.filterSelect ?'activefacet-count':'inactivefacet-count'].join(" ")}>{filter.count}</span>
                            </p>
                            </div>
                            </li>;
                          }
                        })
                      }
                    </ul>
                    {
                          (facet[field].length+1 !== this.state[field] && facet[field].length !== this.state[field])
                          ?
                          ((facet[field].length+1 < this.state[field])?
                            ""
                            :
                            <a href="" className="more" onClick={(e) => this.showMore(e,field)}>More</a>
                          )
                          :
                          ""
                        }
                    {
                      (this.state[field] > 5)?
                      <a href="" className="less" onClick={(e) => this.showLess(e,field)}>Less</a>:""
                    }
                    </div>
                </div>
              </Fragment>
          }
              </>
            );
          })
        }
        {/* {
          (customDateSettings.customDateEnable) &&
          <ul style={{margin:"10px 0 0"}}>
            <Dropdown className="facetDropdown" nav isOpen={this.state.dropdowntemp} toggle={this.dropdownToggle} a11y={false}>
              <DropdownToggle
                aria-haspopup
                caret
                color="default"
                id="navbarCdate"
                nav>
                <img width="16" height="16" src={require('../../images/calendar.png')} alt="datepicker"/>
                {
                  (dateFormat(dateconvert,"dd mmmm yyyy").length > 10 && parameters['f.'+date+'.filter'] && !parameters['f.'+date+'.filter'].includes("*"))?
                    <span className="header-tabs-text">{parameters['f.'+date+'.filter']}</span>
                    :
                    <span className="header-tabs-text">{customDateSettings.customDateDisplayText}</span>
                }
              </DropdownToggle>
              <DropdownMenu aria-labelledby="navbarCdate" right tabIndex="0">
                <DropdownItem tag={"div"} toggle={false}>
                  <CustomDateFilters facets={this.props.facets?this.props.facets:[]} dropdownClose={this.dropdownClose}/>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </ul>

        } */}
      </div>
      {
      (window.innerWidth <= 767 && this.state.mobileFacets) &&
      <div className="mobileFacetFilters">
      <h3 className="filterBy">Filter By </h3>
        {
          this.orderedFacets.map((facet, index) => {
            let field = Object.keys(facet)[0];
            let displaynotdate = "";
            facet[field].map((filter, index) => {
              if(!filter.rangeField){
                displaynotdate = facet.display;
              }
            });
            return(
              <Fragment key={index}>
              <div className="facetEachDiv">
                {
                  (facet.display && displaynotdate!=="") &&
                    <div className="facetSubDiv" onClick={(e) => this.facetToggle(e)}>
                      <a href="" className="facetHeading">{facet.display}
                      <i className="upArrow"/></a>
                    </div>
                }

                <div className="facetFiltersDiv">
                    <ul style={{listStyleType:'none'}}>
                      {
                        facet[field].map((filter, index) => {
                          if(!filter.rangeField){
                            return <li key={index} className={(this.state[field] < index+1)?"facetValue hideClass":"facetValue showClass"}>
                              <a href="" onClick={(e) => this.toggleFilter(e,field, filter.filterName)}
                            className={`facetChild ${filter.filterSelect ?'activeFilter':'inactiveFilter'} ${facet.facetField==="contenttype"?"contentType":"notcontentType"}`}>
                            <p className="mb-0 d-flex">
                              <label className="checkboxContainer">
                                <input type="checkbox" defaultChecked={filter.filterSelect} style={{marginRight:"5px",cursor:"pointer"}}/>{' '}
                                <span className="checkmarkmobile"/>
                              </label>
                              {filter.filterName.replace(/&quot;/g, '"').replace(/&amp;/g, "&")}
                              {
                                filter.filterName.length <=4
                                ?
                                <span className="customtext" aria-hidden="true">facet</span>
                              :
                              ""
                              }
                            </p>
                            <p className="mb-0 d-flex">
                              <span className={[filter.filterSelect ?'activefacet-count':'inactivefacet-count'].join(" ")}>{filter.count}</span>
                            </p>
                            </a>
                            </li>;
                          }
                        })
                      }
                    </ul>
                    {
                          (facet[field].length+1 !== this.state[field] && facet[field].length !== this.state[field])
                          ?
                          ((facet[field].length+1 < this.state[field])?
                            ""
                            :
                            <a href="" className="more" onClick={(e) => this.showMore(e,field)}>More</a>
                          )
                          :
                          ""
                        }
                    {
                      (this.state[field] > 5)?
                      <a href="" className="less" onClick={(e) => this.showLess(e,field)}>Less</a>:""
                    }
                    </div>
                </div>
              </Fragment>
            );
          })
        }
       </div>
     }
      </Fragment>
    );
  }

}

FacetFilters.propTypes = {
  facets: PropTypes.array,
  allFacetsResponse: PropTypes.array,
  parentCallback: PropTypes.func
};
