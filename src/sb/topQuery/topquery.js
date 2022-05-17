import React, {Fragment } from 'react';
import * as $ from 'jquery';
import axios from 'axios';
import * as qs from 'query-string';
import * as parser from '../Common/SbCore';
import {topQueryFields , pluginDomain} from '../Common/Defaults';
import '../css/topquery_component.css';

export default class TopQueryComponent extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      topquery: [],
      topQueryTitle:"",
      emptyContent:false
    };
  }

  componentDidMount(){
    axios({
        method: 'post',
        url: pluginDomain+'/rest/v2/api/query/topquery',
        data: {
              "apikey":topQueryFields.apikey,
              "col":topQueryFields.col,
              "limit":topQueryFields.limit
              },
        headers: {'Content-Type': 'application/json'}
        })
        .then((response)=>{
            let topqueryarray = [];
            topqueryarray=Object.keys(response.data);
            if(topqueryarray != ""){
              if(response.data.message === "Invalid Request"){
                this.setState({
                  topquery: [],
                  topQueryTitle:"No Popular Searches",
                  emptyContent:true
                });
              }
              else{
                this.setState({
                  topquery: topqueryarray,
                  topQueryTitle:"Popular Searches"
                });
              }
            }
            else{
              this.setState({
                topquery: [],
                topQueryTitle:"No Popular Searches",
                emptyContent:true
              });
            }
        })
        .catch((error) => {
          return error;
        });

  }

  render(){
    return(
      <Fragment>
      {
        (this.state.topquery && this.state.topquery.length > 0)&&
        <div className="topQuery-container col-xs-12">
        <span className="topsearch col-xs-12 padding-0">Popular Searches</span>
           <div className="topqueryresult col-xs-12 padding-0">
           {this.state.emptyContent === false ?
              <ul>
                {
                  this.state.topquery.map((topquery,index)=>{
                    return (
                        <li key={index}>
                          <a className={`topquery-${index}`} href="" onClick={(e) => {e.preventDefault();let params = parser.getInitialUrlParameters(topquery); params.page = 1;parser.getResults(params);}}>
                          {topquery.replace(/&amp;/g,"&").replace(/\\/g, '')}</a>
                        </li>
                    );
                  })
                }
              </ul>
              :
              <p style={{color:'#000000', fontSize:'14px'}}>No Popular Searches</p>
            }
          </div>
        </div>
      }
    </Fragment>
   );
  }
}
