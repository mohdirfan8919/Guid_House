import React, { Component, Fragment } from 'react';
import LogInComponent from './sb/Login/LogInComponent';
import * as qs from 'query-string';
import * as defaults from './sb/Common/Defaults';
import axios from 'axios';
import { history } from './sb/low_level_components/custom_history';
import './App.css';
import SearchUIComponent from './SearchUIComponent.js';
import SearchComponent from './sb/SearchInput/SearchInputComponent';
import VoiceContext from './VoiceContext';
import './fw/css/guideHouse.css'
import Header from './components/Header';
window.smartSuggest = {};


class App extends Component {
  constructor() {
    super();
    this.state = {
      searchTokenClickCount: false,
      response: {},
      isLoading: false,
      settingsResponse:{}
    };
    this.searchTokenClick = this.searchTokenClick.bind(this);
    this.isLoadingFunc = this.isLoadingFunc.bind(this);
    this.checkSecurity = this.checkSecurity.bind(this);
  }

  componentWillMount() {
    this.checkSecurity();
    this.updateSize();
    axios.get(defaults.pluginDomain+"/ui/v1/search/settings" )
     .then((response)=>{
       window.smartSuggest = response.data;
       this.setState({
         settingsResponse : response.data
       });
     })
     .catch(err=>err);
  }

  componentDidMount() {
    history.listen((route, action) => {
      this.checkSecurity();
      // return axios.get(defaults.pluginDomain+"/ui/v1/search/settings" )
      //  .then((response)=>{
      //    window.smartSuggest = response.data;
      //    return response;
      //  })
      //  .catch((error)=>{
      //    return error;
      //  });
    });
    window.addEventListener('resize', this.updateSize);
  }
  componentDidUpdate() {
    this.updateSize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize);
  }

  updateSize(event){
    let loginHeight = document.getElementById("loginDiv");
    if(loginHeight !== null) {
      let fixedHeight = document.getElementById("loginDiv").clientHeight;
      document.getElementById("result-facet-container").style.marginTop = fixedHeight + 10;
    }
  }

  searchTokenClick() {
    this.setState({
      searchTokenClickCount: !this.state.searchTokenClickCount
    });
  }

  checkSecurity() {
    this.setState({
      isLoading: true
    });
    return axios.get(defaults.pluginDomain + "/rest/v2/api/secured/enabled")
      .then((response) => {
        if (response && response.data) {
          this.setState({
            response: response.data,
            isLoading: false
          });
          if (response.data.type && response.data.type.toLowerCase() !== "none")
            localStorage.setItem("securityMethod", response.data.type);
        }
        else {
          this.setState({
            response: {
              error: true
            },
            isLoading: false
          });
        }
        return response;
      })
      .catch((error) => {
        this.setState({
          response: {
            error: true
          },
          isLoading: false
        });
        return error;
      });
  }

  isLoadingFunc() {
    this.setState({
      isLoading: false
    });
  }

  render() {
    let { response } = this.state;
    let securityCheck = "";
    let parameters = Object.assign({}, qs.parse(window.location.search));
    if (response && response.type === "none") {
      securityCheck = false;
    }
    else {
      securityCheck = true;
    }
    return (
      <Fragment>
        <Header/>
        {
          (this.state.isLoading && !localStorage.searchToken) &&
          <div className="search-spinner">
            <div className="col-md-12" style={{ textAlign: 'center', padding: '30px' }}>
              <div className="fa fa-2x">
                <i className="fa fa-spinner fa-spin" />
              </div>
            </div>
          </div>
        }
        {
          (response.error) &&
          <div className="errorDiv">
            <p> API Failed </p>
          </div>
        }
        {
          (response && response.type) &&
          <VoiceContext.Provider value={this.state.settingsResponse}>
              <Fragment>
              {
                ((!securityCheck) || (securityCheck && localStorage.searchToken && localStorage.getItem("searchToken") !== null && response.type === localStorage.getItem("securityMethod")))
                ?
                <SearchUIComponent searchTokenClickCount={this.state.searchTokenClickCount} isLoadingFunc={this.isLoadingFunc} securityResponse={this.state.response}/>
                :
                <LogInComponent searchTokenClick={this.searchTokenClick} securityResponse={this.state.response}/>
              }
              </Fragment>
          </VoiceContext.Provider>
        }
      </Fragment>
    );
  }
}

export default App;
