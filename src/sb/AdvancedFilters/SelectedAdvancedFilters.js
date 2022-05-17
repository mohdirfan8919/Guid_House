import React from 'react';
import * as parser from '../Common/SbCore';
import * as moment from 'moment';
import '../css/low_level_components/advanced_filters/display_selected_filters.css';
import '../../fw/css/font-awesome.min.css';

export default class AdvancedSelectedFilters extends React.Component{
  constructor(props){
    super(props);
    this.state = {};

    this.removeAdvancedFilter = this.removeAdvancedFilter.bind(this);
  }

  componentDidMount(){
    let appliedFiltersObj = parser.parseAppliedFiltersFromUrl();
    if(appliedFiltersObj.checkAdvancedFilters){
      this.setState(appliedFiltersObj.filters);
    }
  }

  // componentDidUpdate(){
  //   let appliedFiltersObj = parser.parseAppliedFiltersFromUrl();
  //   if(appliedFiltersObj.checkAdvancedFilters){
  //     this.state = appliedFiltersObj.filters;
  //   }
  // }

  removeAdvancedFilter(field, value){
    let currentState = Object.assign({}, this.state);
    if(this.state[field].constructor === String){
      delete currentState[field];
    }
    else if(this.state[field].constructor === Array){
      let index = this.state[field].indexOf(value);
      currentState[field].splice(index, 1);
      if(currentState[field].length === 0){
        delete currentState[field];
      }
    }
    else if(this.state[field].constructor === Object){
      currentState[field] = {from: "", to: ""};
    }
    parser.doAdvancedSearch(currentState);
  }

  render(){
    let filterKeys = Object.keys(this.state);
    return(
      <div className="max-width-css" style={{padding: "0em 0.5em"}}>
        <span>
          {
            filterKeys.map(val => {
              if(this.state[val].constructor === String){
                return(
                  <span className="selected-advanced-filter" key={val}>
                    <button onClick={() => this.removeAdvancedFilter(val, this.state[val])}>
                      {this.state[val]} &nbsp; <i className="fa fa-close"/>
                    </button>
                  </span>
                );
              }else if(this.state[val].constructor === Array){
                return(
                  <span className="selected-advanced-filter" key={val}>
                    {
                      this.state[val].map(filter => {
                        return <button key={filter} onClick={() => this.removeAdvancedFilter(val, filter)}>
                          {filter} &nbsp; <i className="fa fa-close"/>
                        </button>;
                      })
                    }
                  </span>
                );
              }else if(this.state[val].constructor === Object){
                return(
                  <span className="selected-advanced-filter" key={val}>
                    {
                      <button onClick={() => this.removeAdvancedFilter(val, null)}>
                        {moment(this.state[val].from).format('DD MMM YYYY') + " to " + moment(this.state[val].to).format('DD MMM YYYY')} &nbsp; <i className="fa fa-close"/>
                      </button>
                    }
                  </span>
                );
              }
            })
          }
        </span>
      </div>
    );
  }
}
