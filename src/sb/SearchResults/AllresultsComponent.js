import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import * as $ from 'jquery';
import * as qs from 'query-string';

import DefaultResultsComponent from './DefaultResultsComponent';//---
import AccordionviewComponent from './AccordionviewComponent';//--

import { Button, Input } from 'reactstrap';

// import LazyLoad   from 'react-lazyload';

export default class AllresultsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      facets: [],
      results: {},
    };
  }

  render() {
    let { facets, resultInfo, results,featuredResults} = this.props;
    let urlParameters = Object.assign({}, qs.parse(window.location.search));

    return (
      <Fragment>
        <div id="results-container">
          <div className="padding-0 parentDiv">

          {/* to show accordion in first page */}
            {/* <LazyLoad  placeholder={<PlaceholderComponent />} debounce={500}> */}
            {urlParameters.page == 1 &&
                  <Fragment>
                     <AccordionviewComponent/>
                  </Fragment>
            }
            {/* </LazyLoad> */}
            {
              // <LazyLoad  placeholder={<PlaceholderComponent />} debounce={500}>
                  <Fragment>
                  {/* <DefaultResultsComponent parameters={parameters}/> */}
                  <DefaultResultsComponent results={results} resultInfo={resultInfo}/>
                  </Fragment>
              // </LazyLoad>
            }


          </div>
        </div>
      </Fragment>
    );
  }
}

const PlaceholderComponent = ()=>{
  return  <div className="placeholder">
      <div className="spinner">
        <div className="rect1">{ }</div>
        <div className="rect2">{ }</div>
        <div className="rect3">{ }</div>
        <div className="rect4">{ }</div>
        <div className="rect5">{ }</div>
      </div>
    </div>;
};
AllresultsComponent.propTypes = {
  parameters: PropTypes.object,
  facets: PropTypes.array,
  resultInfo: PropTypes.object,
  results: PropTypes.array,
  featuredResults: PropTypes.array,
};