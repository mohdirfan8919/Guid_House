import React from 'react';
import { Alert } from 'reactstrap';
import * as qs from 'query-string';
import {featuredResultsCount} from '../Common/Defaults';
import _ from 'lodash';
import '../css/low_level_components/featured_results_component.css';
import { getFeaturedResultClickCount } from '../Common/SbCore';

export default class FeaturedResultsComponent extends React.Component{
  constructor(){
    super();
    this.featuredResults = this.featuredResults.bind(this);
  }
  componentWillMount(){
    this.featuredResults(this.props);
  }

  componentWillReceiveProps(newProps){
    this.featuredResults(newProps);
  }

  featuredResults(featuredProps){
    let urlParameters = Object.assign({}, qs.parse(window.location.search));
    this.adData = [];
    if(featuredProps.featuredResults.constructor === Array){
      this.adData = Object.assign([], featuredProps.featuredResults);
      // this.adData = _.sortBy(this.adData, 'url');
    }else{
      this.adData.push(featuredProps.featuredResults
      );
    }
    // if(urlParameters.adsCount) {
    //   this.adData.length = urlParameters.adsCount;
    // }
    // else {
    //   this.adData.length = featuredResultsCount;
    // }
  }

  render(){
    return(
      <div className="col-sm-12 padding-0 featured-container">
        {
          this.adData.map((ad)=>{
            return (
              <Alert key={ad['id']} className="featured-result">
              <div className="clearfix">
                {
                  (ad['title']) &&
                  <a target="_blank" title={ad['title'].replace(/&amp;/g, "&")} onClick={() => getFeaturedResultClickCount(ad)} href={ad['url'].replace(/&amp;/g, "&")} >{ad['title'].replace(/&amp;/g, "&")}</a>
                }
                {
                  (ad['imageURL'] && ad['imageURL'] !== '')
                  ?
                  <div className="graphicUrlDiv">
                    <img src={ad['imageURL'].replace(/&amp;/g, "&")} width="100px" alt={ad['title'].replace(/&amp;/g, "&")+"_image"}/>
                  </div>
                  :
                  ""
                }
                <p className="adsDescription">{ad['description'].replace(/&amp;/g, "&")}</p>
                <p className="adsurl">{ad['url'].replace(/&amp;/g, "&")}</p>
              </div>
              </Alert>
            );
          })
        }
      </div>
    );
  }
}
