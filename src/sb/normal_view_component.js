import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import * as $ from 'jquery';
import * as qs from 'query-string';

import * as defaults from "./Common/Defaults";
import AdvancedFilters from './AdvancedFilters/AdvancedFiltersDefault';
import DefaultResultsComponent from './SearchResults/DefaultResultsComponent';//---
import AllresultsComponent from './SearchResults/AllresultsComponent';//---

import FacetFiltersComponent from './FacetFilters/FacetFiltersComponent';
import FacetFiltersMultipleSelectionComponent from './FacetFilters/FacetFiltersMultipleSelection/FacetFiltersMultipleSelectionComponent';

import SortComponent from './Sort/SortComponent';
// import RandomPaginationNumbers from './Pagination/RandomPaginationNumbers';
import TuningRangeSelector from './RangeSelector/TuningRangeSelector';
import { Button, Input } from 'reactstrap';

import './css/NormalViewComponent.css';

export default class NormalViewComponent extends Component{
  constructor(props){
    super(props);
    this.state = {
      facets: [],
      results: {},
    };
  }

  render(){
    let { facets, resultInfo, results,featuredResults } = this.props;
    // let startPage = parseInt(resultInfo.start) + 1;
    let urlParameters = Object.assign({}, qs.parse(window.location.search));

    return (
      <Fragment>
        {
          // (this.props.data.facets && defaults.facetFiltersType !== "OR") && <AdvancedFilters facets={this.props.data.facets}/>
          // <TuningRangeSelector/>
        }
        <div id="results-container">
          <div className="padding-0">

            {/*RESULTS COMPONENT*/}
            {/* <DefaultResultsComponent results={results} resultInfo={resultInfo}/> */}
            <AllresultsComponent facets={facets} resultInfo={resultInfo} results={results} featuredResults={featuredResults} />
          </div>
        </div>
      </Fragment>
    );
  }
}

NormalViewComponent.propTypes = {
  facets: PropTypes.array,
  resultInfo: PropTypes.object,
  results: PropTypes.array,
  featuredResults: PropTypes.array
};
