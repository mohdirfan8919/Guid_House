import React from "react";
import ReactDOM from "react-dom";
import { Router, Route } from 'react-router-dom';
import { history } from './sb/low_level_components/custom_history';

import "./index.css";
import 'babel-polyfill';
import "./fw/css/font-awesome.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
// import "bootstrap/dist/js/bootstrap.min.js";
import App from "./App";
import { env } from "./env";


if(env.is_cf == "true"){

  if(window.sessionStorage.getItem("authenticated")){
    proceedToPlugin();

  }else{
    let res = prompt("Enter password to access page");

    let pwd = env.auth || "Searchblox@2022";


    if(res == pwd){
      window.sessionStorage.setItem("authenticated", true);
      proceedToPlugin();

    }else{
      ReactDOM.render(
        <p>Authentication Failed</p>, document.getElementById("root"));
    }
  }

}else{
  proceedToPlugin();
}
function proceedToPlugin(){
  ReactDOM.render(
    <Router history={history}>
      <Route path="*" component={App}/>
    </Router>, document.getElementById("root"));
}