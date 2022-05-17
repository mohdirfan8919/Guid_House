import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import * as $ from 'jquery';
import * as qs from 'query-string';
import * as defaults from '../Common/Defaults.js';
import * as parser from '../Common/SbCore';
import AdvancedSelectedFilters from './SelectedAdvancedFilters';
import '../css/advanced_filters.css';

export default class AdvancedFilters extends Component{

  constructor(props){
    super(props);
    let temp = Object.assign({}, this.getAdvancedInitialFilters());
    this.state = {
      selectFilters: [],
      inputFilters: [],
      dateFilters: [],
      ...temp,
      // urlParameters: Object.assign({}, qs.parse(window.location.search))
      appliedFilters: Object.assign({}, parser.parseAppliedFiltersFromUrl())
    };

    this.getAdvancedInitialFilters = this.getAdvancedInitialFilters.bind(this);
    this.takeInput = this.takeInput.bind(this);
    this.clearAdvancedFilters = this.clearAdvancedFilters.bind(this);
  }

  getAdvancedInitialFilters(){
    let initialFiltersObj = {};
    let selectFilters = [];
    let inputFilters = [];
    let dateFilters = [];
    for(let i = 0, len = this.props.facets.length; i < len; i++){
      for(let j = 0, lenIn = defaults.advancedFilters.select.length; j < lenIn; j++){
        if(this.props.facets[i]['name'] === defaults.advancedFilters.select[j].field){
          selectFilters.push(this.props.facets[i]);
          initialFiltersObj[this.props.facets[i]['name']] = [];
        }
      }
      for(let j = 0, lenIn = defaults.advancedFilters.input.length; j < lenIn; j++){
        if(this.props.facets[i]['name'] === defaults.advancedFilters.input[j].field){
          inputFilters.push(this.props.facets[i]);
          initialFiltersObj[this.props.facets[i]['name']] = "";
        }
      }
      for(let j = 0, lenIn = defaults.advancedFilters.date.length; j < lenIn; j++){
        if(this.props.facets[i]['name'] === defaults.advancedFilters.date[j].field){
          dateFilters.push(this.props.facets[i]['name']);
          initialFiltersObj[this.props.facets[i]['name']] = {
            from: "",
            to: ""
          };
        }
      }
    }
    this.setState({
      selectFilters,
      inputFilters,
      dateFilters
    });
    return initialFiltersObj;
  }

  takeInput(e){
    let field = $(e.target).attr('data-field');
    let type = $(e.target).attr('data-type');
    if(type === 'select'){
      let existingFilters = Object.assign([],this.state[field]);
      let index = existingFilters.indexOf(e.target.value);
      if(index === -1){
        existingFilters.push(e.target.value);
      }
      else{
        existingFilters.splice(index, 1);
      }
      this.setState({
        [field]: existingFilters
      });
    }
    else if(type === 'input'){
      this.setState({
        [field]: e.target.value
      });
    }else if(type === 'date'){
      if($(e.target).attr('data-date') === 'from'){
        this.setState({
          [field]: {
            from: e.target.value,
            to: this.state[field].to
          }
        });
      }else if($(e.target).attr('data-date') === 'to'){
        this.setState({
          [field]: {
            from: this.state[field].from,
            to: e.target.value
          }
        });
      }
    }
  }

  // componentWillReceiveProps(newProps){
  //   console.log(newProps, this.state);
  // }

  clearAdvancedFilters(){
    let resettedState = this.getAdvancedInitialFilters();
    parser.doAdvancedSearch(resettedState);
  }



  render(){
    return (
      <Fragment>
        <div className="advanced-search-button max-width-css">
          <button onClick={() => $(".filters-container").slideToggle()} title="Advanced Filters">Advanced Filters</button>
          {
            (this.state.appliedFilters.checkAdvancedFilters) && <button onClick={this.clearAdvancedFilters} title="Clear Advacned Filters">Clear Filters</button>
          }
        </div>
        <div>
          <AdvancedSelectedFilters />
        </div>
        <div className="filters-container max-width-css">
          <div className="select-filters">
            {
              this.state.selectFilters.map(filter=>{
                return (
                  <div key={filter['name']}>
                    <div className="filter-label">{filter['name']}</div>
                    <select multiple data-type="select" data-field={filter['name']} value={this.state[filter['name']]} onChange={this.takeInput}>
                    {
                      (filter.int)
                      ?
                        (filter.int.constructor === Array)
                        ?
                        filter.int.map((val)=>{
                          return <option key={val['name']}>{new DOMParser().parseFromString(val['name'], "text/html").body.textContent}</option>;
                        })
                        :
                        <option>{new DOMParser().parseFromString(filter.int['name'], "text/html").body.textContent}</option>

                      :
                      ""
                    }
                    </select>
                  </div>
                );
              })
            }
          </div>
          <div className="input-filters">
            {
              this.state.inputFilters.map(filter=>{
                return (
                  <div key={filter['name']}>
                    <div className="filter-label">{filter['name']}</div>
                    <input
                      list={`${filter['name']}_datalist`}
                      data-type="input"
                      data-field={filter['name']}
                      value={this.state[filter['name']]}
                      onChange={this.takeInput} />
                    <datalist id={`${filter['name']}_datalist`}>
                    {
                      (filter.int)
                      ?
                        (filter.int.constructor === Array)
                        ?
                        filter.int.map((val)=>{
                          return <option key={val['name']}>{new DOMParser().parseFromString(val['name'], "text/html").body.textContent}</option>;
                        })
                        :
                        <option>{new DOMParser().parseFromString(filter.int['name'], "text/html").body.textContent}</option>

                      :
                      ""
                    }
                    </datalist>
                  </div>
                );
              })
            }
          </div>
          <div className="date-filters">
            {
              this.state.dateFilters.map(filter=>{
                return (
                  <div key={filter}>
                    <div className="filter-label">{filter}</div>
                    <input
                      type="date"
                      id={`${filter}_from`}
                      data-date="from"
                      data-type="date"
                      data-field={filter}
                      value={this.state[filter].from}
                      onChange={this.takeInput}/>
                    <input
                      type="date"
                      id={`${filter}_to`}
                      data-date="to"
                      data-type="date"
                      data-field={filter}
                      value={this.state[filter].to}
                      onChange={this.takeInput}/>
                  </div>
                );
              })
            }
          </div>
          <button onClick={() => parser.doAdvancedSearch(this.state)}>Search</button>
        </div>
      </Fragment>
    );
  }
}

AdvancedFilters.propTypes = {
  facets: PropTypes.array
};
