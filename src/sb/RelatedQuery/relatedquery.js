import React, {Fragment } from 'react';
// import * as $ from 'jquery';
import axios from 'axios';
import * as qs from 'query-string';
import * as parser from '../Common/SbCore';
import {relatedQueryFields , pluginDomain} from '../Common/Defaults';
import '../css/relatedquery_component.css';

export default class RelatedQueryComponent extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      relatedquery: [],
      relatedQueryTitle :"",
      emptyContent:false
    };
    this.triggerrelatedSearch = this.triggerrelatedSearch.bind(this);
  }
  componentDidMount(){
  this.triggerrelatedSearch(this.props);
  }

  // componentWillReceiveProps(newProps){
  //  this.triggerrelatedSearch(newProps);
  // }

  triggerrelatedSearch(propsdata){
    axios({
        method: 'post',
        url: pluginDomain+'/rest/v2/api/related/related',
        data: {
              "apikey":relatedQueryFields.apikey,
              "field":relatedQueryFields.field,
              "col":relatedQueryFields.col,
              "type":relatedQueryFields.type,
              "operator":relatedQueryFields.operator,
              "limit":relatedQueryFields.limit,
              "terms":relatedQueryFields.terms,
              "query": propsdata.results
              },
        headers: {'Content-Type': 'application/json' ,'SB-PKEY':relatedQueryFields['SB-PKEY']}
        })
        .then((response)=>{
            //const relatedquery = response.data;
            //console.log(relatedquery)
            if(response.data !== ""){
              if(response.data.message === "Invalid Request"){
                this.setState({
                  relatedquery: [],
                  emptyContent:true
                //  relatedQueryTitle : "No Related Searches"
                });
              }
              else{
                this.setState({
                  relatedquery: response.data,
                  //relatedQueryTitle : "Related Searches"
                });
              }
            }
            else{
              this.setState({
                relatedquery: [],
                emptyContent:true
              //  relatedQueryTitle : "No Related Searches"
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
        (this.state.relatedquery && this.state.relatedquery.length > 0) &&
        <div className="relatedQuery-container col-xs-12">
           <span className="narrowsearch col-xs-12 padding-0">Related Queries</span>
           <div className="relatedresult col-xs-12 padding-0">
             {this.state.emptyContent === false ?
               <ul className="col-xs-12">
                 {
                   this.state.relatedquery.map((relatedquery,index) =>{
                   return (
                     <li key={index}>
                       <a className={`relatedquery-${index}`} href="" onClick={(e) => {e.preventDefault();let params = parser.getInitialUrlParameters(relatedquery); params.page = 1;parser.getResults(params);}}>{relatedquery.replace(/&amp;/g,"&")}</a>
                     </li>
                   );
                   }
                 )
                 }
              </ul>
              :
              <p style={{color:'#000000', fontSize:'14px'}}>No Related Queries</p>
            }
          </div>
        </div>
      }
    </Fragment>
   );
  }
}
