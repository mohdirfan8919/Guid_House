import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import * as $ from 'jquery';
import * as qs from 'query-string';
import * as defaults from '../../Common/Defaults';
import * as parser from '../../Common/SbCore';
import _ from 'lodash';
import SelectedFiltersInMultipleSelectionComponent from './SelectedFiltersInMultipleSelection';
import '../../css/AdvancedFilters/FacetFiltersMultipleSelection.css';

export default class FacetFiltersMultipleSelectionComponent extends Component{
  // selectFilters = [];
  // inputFilters = [];
  // dateFilters = [];
  // urlParameters = {};
  // appliedFilters = {};
  // displayNamesFacetsObject = {};
  // updateFiltersView = {};
  // initialStateOfCheckboxes = {};
  // facetFields = {};
  constructor(props){
    super(props);
    // this.takeInput.bind(this);
    // this.urlParameters = Object.assign({}, qs.parse(window.location.search));
    // this.appliedFilters = Object.assign({}, parser.parseAppliedFiltersFromUrl());
    //
    // let initialStateOfCheckboxes = {
    //   initialStateOfCheckboxes: {}
    // }
    // let showCount = {
    //   showCount: {}
    // }
    // let mainFacetCheckbox = {
    //   mainFacetCheckbox: {}
    // }
    // for(let i =0, len = defaults.facets.length; i < len; i++){
    //   this.displayNamesFacetsObject[defaults.facets[i].field] = defaults.facets[i].display;
    //   this.updateFiltersView[defaults.facets[i].field] = false;
    //   initialStateOfCheckboxes.initialStateOfCheckboxes[defaults.facets[i].field] = false;
    //   showCount.showCount[defaults.facets[i].field] = 4;
    //   mainFacetCheckbox.mainFacetCheckbox[defaults.facets[i].field] = true;
    //   this.facetFields[defaults.facets[i].field] = [];
    // }
    //
    // this.state = Object.assign({}, showCount, initialStateOfCheckboxes, mainFacetCheckbox, {facetFilters: this.getAdvancedInitialFilters()});
    let selectAll = {};
    let facets = this.props.facets.map(facet => {
      selectAll[facet["name"]] = true;
      let facetObj = {};
      facetObj.facet = facet["name"];
      facetObj.count = facet["count"];
      if(facet.int.constructor === Array){
        facetObj.filters = facet.int.map(filter => {
          return {
            filterName: (filter["name"])?filter["name"]:(filter["from"]?filter["from"]:"NoFilter"),
            resultCount: filter["text"]
          };
        });
      }else if(facet.int.constructor === Object){
        facetObj.filters.push({
          filterName: (facet.int["name"])?facet.int["name"]:(facet.int["from"]?facet.int["from"]:"NoFilter"),
          resultCount: facet.int["text"]
        });
      }
      return facetObj;
    });
    this.state = {
      facets: facets,
      selectAll: selectAll,
      selectedFacets: {}
    };

    this.addToFilter = this.addToFilter.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.getAdvancedInitialFilters = this.getAdvancedInitialFilters.bind(this);
    this.takeInput = this.takeInput.bind(this);
    this.checkBoxChange = this.checkBoxChange.bind(this);
    this.checkCheckBoxesAndSearch = this.checkCheckBoxesAndSearch.bind(this);
    this.clearAdvancedFilters = this.clearAdvancedFilters.bind(this);
  }


  componentWillMount(){
    // if(this.appliedFilters.checkAdvancedFilters){
    //   this.setState({
    //     facetFilters: Object.assign(this.facetFields, this.appliedFilters.filters)
    //   });
    // }
  }

  componentWillReceiveProps(newProps){
    let filtersSelected = parser.parseAppliedFiltersFromUrl();
    this.setState({
      selectedFacets: {
        ...filtersSelected.filters
      }
    });
    // let appliedFilters = Object.assign({}, parser.parseAppliedFiltersFromUrl());
    // console.log(this.facetFields, appliedFilters.filters);
    // if(appliedFilters.checkAdvancedFilters){
    //   this.setState({
    //     facetFilters: Object.assign(this.facetFields, appliedFilters.filters)
    //   });
    // }
  }

  getAdvancedInitialFilters(){
    // let initialFiltersObj = {};
    // for(let i = 0, len = this.props.facets.length; i < len; i++){
    //   initialFiltersObj[this.props.facets[i]['name']] = [];
    // }
    // return initialFiltersObj;
  }

  takeInput(e, facet, filterVal=""){
    // if($(e.target).attr('type') === 'checkbox')return;
    // let facetTemp = Object.assign({}, this.state.facetFilters);
    // if(filterVal !== "" && filterVal !== undefined){
    //   facetTemp[facet].push(filterVal);
    // }
    // console.log(facetTemp);
    // parser.doAdvancedSearch(facetTemp);
  }

  checkBoxChange(e, facet){
    // let prevStateMainCB = Object.assign({}, this.state.mainFacetCheckbox);
    // prevStateMainCB[facet]=  !prevStateMainCB[facet];
    // this.setState({
    //   initialStateOfCheckboxes:{
    //     [facet]: true
    //   },
    //   mainFacetCheckbox: prevStateMainCB
    // });
    // if(prevStateMainCB[facet]){
    //   $(`.${facet}_facet_title_checkbox`).prop('checked', true);
    // }else{
    //   $(`.${facet}_facet_title_checkbox`).prop('checked', false);
    // }

    //--------------------------------
    // let dataFilter = $(e.target).attr('data-filter');
    // let dataFacet = $(e.target).attr('data-facet');
    // this.updateFiltersView[dataFacet] = true;
    // let facetTempArray = Object.assign([], this.state[dataFacet]);
    // if(e.target.checked){
    //   facetTempArray.push(dataFilter);
    // }else{
    //   facetTempArray.splice(dataFilter, 1);
    // }
    // this.setState({
    //   [dataFacet]: facetTempArray
    // });
  }

  checkCheckBoxesAndSearch(facet){
    // var filtersTempArray = [];
    // var currentState = this.state.facetFilters;
    // $(`.${facet}_facet_title_checkbox`).each((index, val)=>{
    //   if($(val).prop('checked'))filtersTempArray.push($(val).attr("data-filter"));
    // });
    // if($(`.${facet}_facet_title_checkbox`).length > filtersTempArray.length){
    //   currentState[facet] = filtersTempArray;
    //   parser.doAdvancedSearch(currentState);
    // }
  }

  clearAdvancedFilters(){
    // let resettedState = this.getAdvancedInitialFilters();
    // parser.doAdvancedSearch(resettedState);
  }

  // updateShowCount= (facetName) => {
  //   let currentShowCount = Object.assign({}, this.state.showCount);
  //   if(currentShowCount[facetName] === 4){
  //   currentShowCount[facetName] = 100;
  //   }else{
  //     currentShowCount[facetName] = 4;
  //   }
  //   this.setState({
  //     showCount: currentShowCount
  //   });
  // }
  addToFilter(e){
    let selectedFacets = this.state.selectedFacets;
    let facetFilterArray = e.target.name.split(".");
    (selectedFacets[facetFilterArray[0]] === undefined) && (selectedFacets[facetFilterArray[0]] = []);
    let index = selectedFacets[facetFilterArray[0]].indexOf(facetFilterArray[1]);
    (index === -1 && e.target.checked === true)?selectedFacets[facetFilterArray[0]].push(facetFilterArray[1]):selectedFacets[facetFilterArray[0]].splice(index,1);
    this.setState({
      selectedFacets
    });
  }

  applyFilters(facet){
    parser.doAdvancedSearch({
      [facet]: this.state.selectedFacets[facet]
    });
  }

  render(){
    return (
      <Fragment>
        <div className="facet-multiple-selection-container">
          {
            this.state.facets.map(singleFacetObject => {
              return(
                <Fragment key={singleFacetObject.facet}>
                  <div>
                    {singleFacetObject.facet}
                    <input type="checkbox" checked={this.state.selectAll[singleFacetObject.facet]} onChange={() => this.setState({selectAll:{...this.state.selectAll, [singleFacetObject.facet]: !this.state.selectAll[singleFacetObject.facet]}})}/>
                    <button onClick={() => this.applyFilters(singleFacetObject.facet)}>search</button>
                  </div>
                  <div>
                    <ul>
                      {
                        singleFacetObject.filters.map((filter, index) => {
                          return(
                            <li key={index}>
                              {
                                (!this.state.selectAll[singleFacetObject.facet]) &&
                                <input type="checkbox" name={`${singleFacetObject.facet}.${filter.filterName}`} checked={(this.state.selectedFacets[singleFacetObject.facet] !== undefined)?((this.state.selectedFacets[singleFacetObject.facet].indexOf(filter.filterName) > -1)?true:false):false} onChange={this.addToFilter}/>
                              }
                              <a>
                                {filter.filterName} ({filter.resultCount})
                              </a>
                            </li>
                          );
                        })
                      }
                    </ul>
                  </div>
                </Fragment>
              );
            })
          }
        </div>
      </Fragment>
      // <Fragment>
      //   <div className="facet-multiple-selection-container">
      //     <div>
      //       <SelectedFiltersInMultipleSelectionComponent />
      //     </div>
      //     <div>
      //       {
      //         this.props.facets.map((facet, index) => {
      //         return  (this.state.facetFilters[facet['name']].length == 0 || this.updateFiltersView[facet['name']])
      //                 ?
      //                 <Fragment key={index}>
      //                   <div className="advanced-OR-facet-title">
      //                     <span>{this.displayNamesFacetsObject[facet['name']]}</span>
      //                     <span>
      //                       <input type="checkbox" checked={this.state['mainFacetCheckbox'][facet['name']]} onChange={(e) => this.checkBoxChange(e, facet['name'])}/>
      //                       <button onClick={() => this.checkCheckBoxesAndSearch(facet['name'])}>
      //                         <img src={`${process.env.PUBLIC_URL}/images/search.png`}  alt="search"/>
      //                       </button>
      //                     </span>
      //                   </div>
      //                   <div className="advanced-OR-facet-filters-div">
      //                     {
      //                       (facet['int']) && (
      //                         (facet['int'].constructor === Array)
      //                         ?
      //                         facet['int'].map((filterVal, index) => {
      //                           // if(index < this.state.showCount[facet['name']])
      //                           return(
      //                             <a onClick={(e)=>this.takeInput(e, facet['name'], filterVal['name'])} key={index}>
      //                               <input type="checkbox" className={[`${facet['name']}_facet_title_checkbox`, (this.state.initialStateOfCheckboxes[facet['name']])?"showCheckBoxes":"hideCheckBoxes"].join(" ")} data-facet={facet['name']} data-filter={filterVal['name']}/>
      //                               <span>{filterVal['name']}({filterVal['text']})</span>
      //                             </a>
      //                           )
      //                         })
      //                         :
      //                         <a onClick={(e)=>this.takeInput(e, facet['name'], facet['int']['name'])}>
      //                           <input type="checkbox" className={[`${facet['name']}_facet_title_checkbox`, (this.state.initialStateOfCheckboxes[facet['name']])?"showCheckBoxes":"hideCheckBoxes"].join(" ")} data-facet={facet['name']} data-filter={facet['int']['name']} />
      //                           <span>{facet['int']['name']}({facet['int']['text']})</span>
      //                         </a>
      //                       )
      //                     }
      //                     {
      //                       // (facet['int']) && (
      //                       //   (facet['int'].length > 4) &&
      //                       //   <a onClick={() => this.updateShowCount(facet['name'])}>
      //                       //     {
      //                       //       (this.state['showCount'][facet['name']] === 4)?<span>...More</span>:<span>...Fewer</span>
      //                       //     }
      //                       //   </a>
      //                       // )
      //                     }
      //                   </div>
      //                 </Fragment>
      //                 :
      //                 <div key={facet['name']}></div>
      //             })
      //       }
      //     </div>
      //   </div>
      // </Fragment>
    );
  }
}

FacetFiltersMultipleSelectionComponent.propTypes = {
  facets: PropTypes.array
};
