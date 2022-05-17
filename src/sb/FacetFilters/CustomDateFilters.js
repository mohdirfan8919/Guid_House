import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as qs from 'query-string';
import * as parser from '../Common/SbCore';
import DatePicker from "react-datepicker";
import { Button } from 'reactstrap';
import { parseISO } from 'date-fns';
import * as defaults from '../Common/Defaults';
import "react-datepicker/dist/react-datepicker.css";
import dateFormat from 'dateformat';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

export default class CustomDateFilters extends Component{
    constructor(){
    super();
    this.handleSelect = this.handleSelect.bind(this);
    this.customDateSearch = this.customDateSearch.bind(this);
    this.removeCustomDate = this.removeCustomDate.bind(this);
    this.triggerOnEnter = this.triggerOnEnter.bind(this);
    this.removeOnEnter = this.removeOnEnter.bind(this);
    this.state = {
      startDate: parseISO(moment(new Date()).subtract(1, 'day').format("YYYY-MM-DD")),
      endDate: parseISO(moment(new Date()).format("YYYY-MM-DD")),
      key: 'selection'
    };
  }

  handleSelect(dates){
    // console.log(dates,"dates");
    this.setState({
      startDate: dates.selection.startDate,
      endDate: dates.selection.endDate,
      key: dates.selection.key
    });
  }
  triggerOnEnter(e){
    if(e.keyCode === 13){
        this.customDateSearch();
      }
  }
  removeOnEnter(e){
    if(e.keyCode === 13){
        this.removeCustomDate(e);
      }
  }
  customDateSearch() {
    this.props.dropdownClose();
    let urlParameters = Object.assign({}, qs.parse(window.location.search));
    urlParameters['f.'+defaults.customDateSettings.customDateField+'.filter'] = "["+moment(this.state.startDate).format('YYYY-MM-DDTHH:mm:ss')+"TO"+moment(this.state.endDate).format('YYYY-MM-DD')+"T23:59:59]";
    urlParameters.customDate = true;
    let facetFields = [];
    facetFields = Object.assign([], defaults.facets);
    let customDateField = "";
    customDateField = defaults.customDateSettings.customDateField;
    urlParameters['facet.field'] = [];
    for(let i=0, len = facetFields.length; i<len; i++){
      urlParameters['facet.field'].push(facetFields[i].field);
      if(facetFields[i].dateRange){
        urlParameters[`f.${facetFields[i].field}.range`] = [];
        urlParameters[`f.${facetFields[i].field}.range`] = facetFields[i].dateRange.map((range)=>{
          return "[" + moment().subtract(range.value, range.calendar).format('YYYY-MM-DDTHH:mm:ss') + "TO*]";
        });
        if((facetFields[i]['field'] == customDateField) && urlParameters[`f.${customDateField}.filter`]){
            urlParameters[`f.${facetFields[i].field}.range`].push("["+moment(this.state.startDate).format('YYYY-MM-DDTHH:mm:ss')+"TO"+moment(this.state.endDate).format('YYYY-MM-DD')+"T23:59:59]");
        }
        else{
          urlParameters['f.'+defaults.customDateSettings.customDateField+'.range'] = "["+moment(this.state.startDate).format('YYYY-MM-DDTHH:mm:ss')+"TO"+moment(this.state.endDate).format('YYYY-MM-DD')+"T23:59:59]";
        }
      }
    }
    if(!urlParameters['facet.field'].includes(defaults.customDateSettings.customDateField)){
      urlParameters['facet.field'].push(defaults.customDateSettings.customDateField);
    }
    urlParameters.page = 1;
    parser.getResults(urlParameters);
  }
  removeCustomDate(e) {
    e.preventDefault();
    this.props.dropdownClose();
    let urlParameters = Object.assign({}, qs.parse(window.location.search));
    let facetFields = [];
    facetFields = Object.assign([], defaults.facets);
    let customDateField = "";
    customDateField = defaults.customDateSettings.customDateField;
    delete urlParameters['facet.field'];
    urlParameters['facet.field'] = [];
    for(let i=0, len = facetFields.length; i<len; i++){
      urlParameters['facet.field'].push(facetFields[i].field);
      if(urlParameters[`f.${customDateField}.filter`]){
        delete urlParameters[`f.${customDateField}.filter`];
        delete urlParameters[`f.${customDateField}.range`];
      }
      if(facetFields[i].dateRange){
        urlParameters[`f.${facetFields[i].field}.range`] = [];
        urlParameters[`f.${facetFields[i].field}.range`] = facetFields[i].dateRange.map((range)=>{
          return "[" + moment().subtract(range.value, range.calendar).format('YYYY-MM-DDTHH:mm:ss') + "TO*]";
        });
      }
    }
    delete urlParameters.customDate;
    urlParameters.page = 1;
    parser.getResults(urlParameters);
  }
  render(){
    let { facets } = this.props;
    let urlParameters = Object.assign({}, qs.parse(window.location.search));
    let date = "";
    for(let i in defaults.facets){
      if(defaults.facets[i].dateRange !== undefined){
        date = defaults.facets[i].field;
      }
    }

    let datefilter = urlParameters['f.'+date+'.filter'];
    let datefilterTwo =urlParameters['f.'+date+'.filter'];
    let dataString = String(datefilter);
    let dataStringTwo = String(datefilterTwo);
    let dateconvert = dataString.substr(1,19);
    let dateconvertTwo = dataStringTwo.substr(22,19);

   urlParameters['f.'+date+'.filter'] = dateFormat(dateconvert,"dd mmmm yyyy") + " - " +dateFormat(dateconvertTwo,"dd mmmm yyyy") ;

    // RENDERS THE FACETS AND HAS <Facet /> COMPONENT FOR EACH FACET IN FACETS
    return(
      <Fragment>
      <div className="">
        <div className="daterange_calender">
              <DateRangePicker
              onChange={this.handleSelect}
              showSelectionPreview
              moveRangeOnFirstSelection= {false}
              months={1}
              maxDate={parseISO(moment(new Date()).format("YYYY-MM-DD"))}
              ranges={[{startDate: this.state.startDate,endDate: this.state.endDate,key: 'selection'}]}
              direction="horizontal"
              />
        </div>
        <Button color="btn btn-dark float-right" style={{margin:"1em 0"}} onClick={this.customDateSearch} onKeyDown={(e)=>this.triggerOnEnter(e)} >Go</Button>
        {
          (urlParameters.customDate) &&
          <Button color="btn btn-secondary float-right" style={{margin:"1em 1em"}} onClick={(e) => this.removeCustomDate(e)} onKeyDown={(e)=>this.removeOnEnter(e)}>Clear Filter</Button>
        }
      </div>
      </Fragment>
    );
  }

}

CustomDateFilters.propTypes = {
  facets: PropTypes.array,
  dropdownClose: PropTypes.func
};
