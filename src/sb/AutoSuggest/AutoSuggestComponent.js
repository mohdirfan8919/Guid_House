import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as $ from 'jquery';
import axios from 'axios';
import { getAutoSuggest, getSuggestClickCount} from '../Common/SbCore';
import '../css/low_level_components/autosuggest_component.css';
import {topQueryFields , pluginDomain} from '../Common/Defaults';
import '../css/topquery_component.css';
const profits = require("../../images/Group-14620.png");

export default class AutoSuggestComponent extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      autoSuggest: [],
      selectedAutosuggest: '',
      showAutoSuggest: false,
      index: -1,
      focusSuggest: false,
      topquery: [],
      emptyContent:false
    };
    this.keyDown = this.keyDown.bind(this);
    this.selectHover = this.selectHover.bind(this);
    this.highlightFunc = this.highlightFunc.bind(this);
    this.temp = this.temp.bind(this);
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
                  emptyContent:true
                });
              }
              else{
                this.setState({
                  topquery: topqueryarray,
                });
              }
            }
            else{
              this.setState({
                topquery: [],
                emptyContent:true
              });
            }
        })
        .catch((error) => {
          return error;
        });

  }

  componentWillReceiveProps(nextProps){
    if(nextProps.q.length >= 3){
      this.setState({
        showAutoSuggest: nextProps.showAutoSuggest,
        index: -1
      });
      try{
        if(this.props.q !== nextProps.q){
          let autoSuggest = [];
          getAutoSuggest(nextProps.q)
          .then((response)=>{
            if(response.data === undefined){
              throw new Error("Autosuggest error");
            }
            if(response.data[0].constructor === Object) {
              let keys = Object.keys(response.data[0]);
              if(keys.length > 0){
                autoSuggest = keys.map(key => {
                  return response.data[0][key];
                });
              }
              this.setState({
                autoSuggest
              });
            }
            else {
                autoSuggest = response.data;
            }
            if(this.state.topquery.length>0){
              autoSuggest.push("POPULAR SEARCHES");
              this.state.topquery.map((key,index)=>{
                if(key!=="*"){
                  autoSuggest.push("img-"+key);
                }
              });
            }
            this.setState({
              autoSuggest
            });
          }).catch(error=>{
            // console.log(error);
          });
        }
      }
      catch(error){
        // console.log(error);
      }
    }else{
      this.setState({
        showAutoSuggest: false
      });
    }

    this.setState({
      focusSuggest: nextProps.focusSuggest
    });
  }

  componentDidUpdate(){
    this.temp();

  }
  temp() {
    if(this.state.focusSuggest){
      ReactDOM.findDOMNode(this.refs.autosuggestContainer).focus();
      if(this.state.index === -1){
        this.setState({
          index: 0,
          selectedAutosuggest: this.state.autoSuggest[0],
        });
      }
    }
  }

  keyDown(e){
    e.preventDefault();
    let index = this.state.index;
    if(e.shiftKey){
      document.getElementById("search-input").focus();
    }
    if(e.keyCode === 40){
      if((this.setState.index === -1) || (this.state.autoSuggest.length - 1) === index){
        index = 0;
      }else{
        index++;
      }
    }else if(e.keyCode === 38){
      if(this.setState.index === -1){
        index = 0;
      }else if(index === 0){
          index = this.state.autoSuggest.length - 1;
      }else{
        index--;
      }
    }
    this.setState({
      selectedAutosuggest: this.state.autoSuggest[index],
      index
    });
    if(e.keyCode === 13){
      let suggestSplit=this.state.selectedAutosuggest;
      if(suggestSplit.includes("img-")){
        suggestSplit = suggestSplit.split("img-")[1];
      }
      if(suggestSplit!=="POPULAR SEARCHES"){
        getSuggestClickCount({suggest: suggestSplit,query:this.props.q});
        this.props.searchOnEnter({
          target:{
             value: suggestSplit
          },
          keyCode: 13
        });
      }
    }
  }

   highlightFunc(text,search) {
      let regex = new RegExp("(" + RegExp.escape(search) + ")", "gi");
     return "<span>"+text.replace(regex, "<strong>$1</strong>")+"</span>";
   }

  selectHover(index){
    this.setState({
      index,
      selectedAutosuggest: this.state.autoSuggest[index],
    });
  }


  render(){

    if(this.state.showAutoSuggest){
      return(
        <div id="autosuggest-container" ref="autosuggestContainer" onKeyDown={this.keyDown} tabIndex={this.state.focusSuggest?"0":""} onBlur={() => this.props.searchInputBlur(true)}>
        <ul>
        {
            this.state.autoSuggest.map((suggestion, index)=>{
              let img = false;
              let suggestSplit = suggestion;
              if(suggestion.includes("img-")){
                suggestSplit = suggestion.split("img-")[1];
                img = true;
              }
              return (
                  <li
                    key={index}
                    title={suggestSplit}
                    className={["autosuggestList", (this.state.selectedAutosuggest === suggestion && this.state.selectedAutosuggest !== "POPULAR SEARCHES")?'active':'inactive'].join(" ")}
                    onMouseOver={() =>this.selectHover(index)}
                    onClick={() => {
                        if(suggestSplit!=="POPULAR SEARCHES"){
                          getSuggestClickCount({suggest: suggestSplit,query:this.props.q});
                          this.props.searchOnEnter({target:{value:suggestSplit},keyCode: 13});
                        }
                      }
                    }>
                    <span>
                    {
                      (img) &&
                      <img title="profits" alt="profitsImage" src={profits} style={{width:"10px",margin:"0 3px"}}/>
                    }
                    </span>
                    {
                      (suggestSplit==="POPULAR SEARCHES")
                      ?
                      <span><b>{suggestSplit}</b></span>
                      :
                      <span dangerouslySetInnerHTML={{__html: this.highlightFunc(suggestSplit.replace(/\\/g, ''), this.props.q)}}>{}</span>
                    }
                  </li>
              );
            })
          }
        </ul>
        </div>
      );
    }else{
      return <div ref="autosuggestContainer" />;
    }
  }
}

AutoSuggestComponent.propTypes = {
  q: PropTypes.string,
  showAutoSuggest: PropTypes.bool,
  focusSuggest: PropTypes.bool,
  searchOnEnter: PropTypes.func,
  searchInputBlur: PropTypes.func
};
