import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as qs from 'query-string';
import * as $ from 'jquery';
import { getTrendingData } from '../Common/SbCore';
// import '../css/low_level_components/trending_component.css';

export default class TrendingComponent extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      autoSuggest: [],
      selectedAutosuggest: '',
      showAutoSuggest: false,
      index: -1,
      focusSuggest: false
    };
    this.keyDown = this.keyDown.bind(this);
    this.selectHover = this.selectHover.bind(this);
    this.trendingFunc = this.trendingFunc.bind(this);
  }

  componentDidMount(){
    document.body.addEventListener('click', this.myHandler);
      getTrendingData()
      .then((response)=>{
        // console.log(response,"getTrendingData Response");
        if(response.constructor !== Error){
          if(response.constructor !== Object || response.data.constructor !== Object){
            throw new Error("TrendingData error");
          }else{
            let keys = response.data.result;
            let autoSuggest = [];
            if(keys.length > 0){
              autoSuggest = keys.map(key => {
                return {"data":key.title,"img":key.imageurl};
              });
              this.setState({
                showAutoSuggest: true,
                index:-1
              });
            }
            this.setState({
              autoSuggest
            });
          }
        }
        else{
          throw new Error("TrendingData error");
        }
      }).catch(error=>{
        // console.log(error);
      });
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      focusSuggest: nextProps.focusSuggest
    });
  }

  componentDidUpdate(){
    this.trendingFunc();
  }

  componentWillUnmount () {
    document.body.removeEventListener('click', this.myHandler);
  }

  trendingFunc() {
    if(this.state.focusSuggest){
      ReactDOM.findDOMNode(this.refs.autosuggestContainer).focus();
      if(this.state.index === -1){
        this.setState({
          index: 0,
          selectedAutosuggest: this.state.autoSuggest[0].data,
        });
      }
    }
  }

  keyDown(e){
    e.preventDefault();
    let index = this.state.index;
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
      selectedAutosuggest: this.state.autoSuggest[index].data,
      index
    });
    if(e.keyCode === 13){
    window.trendingClick = true;
     this.props.searchOnEnter({
       target:{
         value:this.state.selectedAutosuggest
       },
       keyCode: 13
     });
   }
  }

  selectHover(index){
    this.setState({
      index,
      selectedAutosuggest: this.state.autoSuggest[index].data,
    });
  }

  myHandler(e) {
    if (!($(e.target).parents('#search').length > 0) && !($(e.target).parents('.trending-results-container').length > 0)) {
      $("#root .trending-results-container").css("display","none");
    }
  }

  render(){
    let urlParameters = Object.assign({}, qs.parse(window.location.search));

    // console.log(this.state.autoSuggest,"autoSuggest");
    if(this.state.showAutoSuggest){
      return(
        <React.Fragment>
        <div id="autosuggest-container" className={`trending-results-container ${!urlParameters.query?"autoSuggestLoad":""}`} ref="autosuggestContainer"
         tabIndex={this.state.focusSuggest?"0":""}
         onKeyDown={this.keyDown}
          >
           <ul>
           {
               this.state.autoSuggest.map((suggestion, index)=>{
                 return (
                     <li
                       key={index}
                       className={["autosuggestList", (this.state.selectedAutosuggest === suggestion.data)?'active':'inactive'].join(" ")}
                       onMouseOver={() =>this.selectHover(index)}
                       onClick={() => {
                         window.trendingClick = true;
                         this.props.searchOnEnter({target:{value:this.state.selectedAutosuggest},keyCode: 13});
                         }
                       }
                       >{suggestion.data}
                       {
                         (suggestion.img!==undefined && suggestion.img!==null)&&
                         <img src={suggestion.img} width="50px" height="50px"/>
                       }
                     </li>
                 );
               })
             }
           </ul>
        </div>
        </React.Fragment>
      );
    }
    else{
      return <div ref="autosuggestContainer" />;
    }
  }
}
TrendingComponent.propTypes = {
  q: PropTypes.string,
  showAutoSuggest: PropTypes.bool,
  focusSuggest: PropTypes.bool,
  searchOnEnter: PropTypes.func
};