import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import * as $ from 'jquery';
import * as qs from 'query-string';
import * as parser from '../Common/SbCore';
import * as defaults from '../Common/Defaults';
import { InputGroup, InputGroupAddon, Button, Input,Modal, ModalHeader, ModalBody, ModalFooter,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Form,
  FormGroup,
  Container,
  Col,
  NavLink,
  Row,
  Label,
  FormFeedback
 } from 'reactstrap';
import '../css/login_component.css';
import axios from 'axios';
import { history } from '../low_level_components/custom_history';
import Notify from "react-notification-alert";
import * as moment from 'moment';
const logoImg = require("../../images/sb_banner.png");
class LogInComponent extends React.Component{
  constructor(){
    super();
    this.state = {
      loginDetails:{
        email:"",
        password:"",
      },
      userInputErrors:{
        mailErr:false,
        passwordErr:false
      },
      showPassword: false
    };
    this.login = this.login.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.handleLoginInputs = this.handleLoginInputs.bind(this);
  }

  handleLoginInputs(e) {
    e.preventDefault();
      this.setState({
        loginDetails: {
            ...this.state.loginDetails,
          [e.target.name] : e.target.value.trim()
        }
      });
    this.setState({
      userInputErrors:{
        mailErr:false,
        passwordErr:false
      }
    });
  }

  validateEmail(email){
    let emailRegex = /^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return emailRegex.test(email);
  }

  login() {
    let errorExist = false;
    let userInputErrors = {};
    let userName = "";
    if(this.state.loginDetails.email === ""){
        userInputErrors.mailErr = true;
        errorExist = true;
    }
    if(this.state.loginDetails.password === ""){
      userInputErrors.passwordErr = true;
      errorExist = true;
    }
    if(!errorExist){
    window.scrollTo(0, 0);
    let userObj = {
      // apikey:defaults.apikey,
      username:this.state.loginDetails.email,
      password:this.state.loginDetails.password,
    };
    if(this.state.loginDetails.email.indexOf("\\") > -1){
      userName = this.state.loginDetails.email.split("\\")[1];
    }
    else if(this.state.loginDetails.email.indexOf("@") > -1){
      userName = this.state.loginDetails.email.split("@")[0];
    }
    else {
      userName = this.state.loginDetails.email;
    }
    localStorage.setItem("loginUserName",userName);
      return axios.post(defaults.pluginDomain+"/rest/v2/api/secured/authenticate",userObj)
      .then((response)=>{
          if(response.data != ""){
            if(response.data.message){
              this.refs.notify_activate.notificationAlert({
                 place: "tr",
                 message: response.data.message,
                 type: "danger",
                 autoDismiss: 2,
                 icon: "icon"
               });
            }
            else{
              localStorage.setItem("searchToken",response.data.token);
              localStorage.setItem("loginTime",moment(new Date()));
              if(defaults.autologout){
                localStorage.setItem("inactiveTime",moment(new Date()));
              }
              this.props.searchTokenClick();
              // localStorage.setItem("loginUserName",response.data.token);
              // history.push("/search");
            }
          }
        return response;
      })
      .catch((error) => {
        // console.log("error");
        return error;
      });
    }
    else{
      this.setState({
        userInputErrors
      });
    }
  }

  keyPress(e){
      if(e.keyCode === 13){
         this.login();
      }
   }

  render(){
    return (
      <Fragment>
        <Row className="m-0 login-firstbar">
          <Col sm="12" className="px-4">
            <Row className="justify-content-between height-50">
              <div>
                <a href="https://www.searchblox.com" title="SearchBlox Home" target="_blank"><img width="162px" height="34px" style={{margin:"8px 0"}} alt="SearchBlox Home" src={require('../../images/sb-logomain-rgb-1@2x.png')}/></a>
              </div>
              <div>
                <div className="topbar-nav d-flex" style={{minHeight:"50px"}}>
                  <a href="https://searchblox.zendesk.com" target="_blank" title="Help" style={{margin:"14px 0"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-help-circle"><circle cx="12" cy="12" r="10">{}</circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3">{}</path><line x1="12" y1="17" x2="12.01" y2="17">{}</line></svg>
                  </a>
                </div>
              </div>
            </Row>
          </Col>
        </Row>
        <div style={{background:"#F9FAFB",flexDirection:"column"}} className="min-vh-100 align-items-center d-flex justify-content-center">
          <div className="container" style={{margin:"auto",paddingTop:"50px"}}>
            <Row className="m-0 login-container" style={{padding:"50px"}}>
                  <Col lg="12" className="align-items-center d-flex justify-content-center">
                      <Form>
                          <div className="logo-container">
                            <img width="40px" height="40px" src={require('./SB_LogoMark_RGB.png')}/>
                            <div className="logo-text-container">
                              <div className="heading">
                                <span className="font-class-2 font-size-20"><span>SearchBlox</span> <span style={{color:"#69717c"}}>Secure Search</span></span>
                              </div>
                              {/*<div className="version">
                                <span>V 9.3</span>
                              </div> */}
                            </div>
                          </div>
                          <div className="text-center">
                            <h4 className="font-class-2 font-size-20">Log In</h4>
                          </div>

                          <FormGroup>
                            <Label htmlFor="username">Username</Label>
                            <InputGroup>
                              <Input className="" autoComplete="off" style={{padding:"12px 40px",zIndex:"1"}}
                                  name="email"
                                  value={this.state.loginDetails.email}
                                  onChange={this.handleLoginInputs}
                              />
                              <div className="formcontrol-icons">
                                <span><i className="far fa-user"/></span>
                            </div>
                            </InputGroup>
                            {
                              (this.state.userInputErrors.mailErr) &&
                              <p className={`${this.state.userInputErrors.mailErr?"errorMsgText font-size-14 color-red":""}`}>
                                <span>Please Enter Valid User Name</span>
                              </p>
                            }
                          </FormGroup>
                          <FormGroup>
                            <Label htmlFor="password">Password</Label>
                            <InputGroup>
                              <Input style={{padding:"12px 40px",zIndex:"1"}}
                                  type={this.state.showPassword?"text":"password"}
                                  name="password"
                                  value={this.state.loginDetails.password}
                                  onChange={this.handleLoginInputs}
                                  onKeyDown={this.keyPress}
                              />
                              <div className="formcontrol-icons">
                                  <span>
                                    <svg focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M4 5v-.8C4 1.88 5.79 0 8 0s4 1.88 4 4.2V5h1.143c.473 0 .857.448.857 1v9c0 .552-.384 1-.857 1H2.857C2.384 16 2 15.552 2 15V6c0-.552.384-1 .857-1H4zM3 15h10V6H3v9zm5.998-3.706L9.5 12.5h-3l.502-1.206A1.644 1.644 0 0 1 6.5 10.1c0-.883.672-1.6 1.5-1.6s1.5.717 1.5 1.6c0 .475-.194.901-.502 1.194zM11 4.36C11 2.504 9.657 1 8 1S5 2.504 5 4.36V5h6v-.64z">{}</path></svg>
                                  </span>
                              </div>
                              <div className="passwordeye-icon">
                                  <span>
                                    <button type="button" style={{background: "none",border: "none",cursor: "pointer",color: "grey", outline: "none"}} onClick={() => this.setState({showPassword: !this.state.showPassword})}>
                                      {
                                        (this.state.showPassword)
                                        ?
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" color="#000" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z">{}</path><circle cx="12" cy="12" r="3">{}</circle></svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" color="#000" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye-off"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24">{}</path><line x1="1" y1="1" x2="23" y2="23">{}</line></svg>
                                      }
                                    </button>
                                  </span>
                                </div>
                            </InputGroup>
                            {
                              (this.state.userInputErrors.passwordErr) &&
                              <p className={`${this.state.userInputErrors.passwordErr?"errorMsgText font-size-14 color-red":""}`}>
                                <span>Please Enter Valid Password</span>
                              </p>
                            }
                          </FormGroup>
                          <FormGroup className="text-center" style={{marginTop:"35px"}}>
                            <Button className="w-100 shadow-none border-none font-size-14" type="Button" color="primary" onClick={this.login}>Log In</Button>
                          </FormGroup>
                          <footer>Need help getting started? <a href="https://developer.searchblox.com/" target="_blank" >Visit the documentation</a></footer>


                      </Form>
                  </Col>
            </Row>
          </div>
          {/*<div style={{marginTop:"10px",top:"20px"}}>
              <div className="container login-footer-container d-flex justify-content-center">
                <Row>
                  <Col sm="12">
                    <p className="font-class-4 font-size-12">© {new Date().getFullYear()}. All Rights Reserved. SearchBlox Software, Inc.</p>
                  </Col>
                </Row>
              </div>
          </div> */}
        </div>
        <Notify ref="notify_activate"/>
      </Fragment>
    );
  }
}

export default LogInComponent;

LogInComponent.propTypes = {
  searchTokenClick:PropTypes.func
};
