import React from 'react';
import * as qs from 'query-string';
import { getResults } from '../Common/SbCore';

export default class TuningRangeSelector extends React.Component{
  constructor(){
    super();
    this.state = {
      tune: {
        enable: false,
        "tune.0": 0,
        "tune.1": 0,
        "tune.2": 0,
        "tune.3": 0,
        "tune.4": 0,
        "tune.5": 0
      }
    };
    this.handleRange = this.handleRange.bind(this);
    this.applyTuning = this.applyTuning.bind(this);
  }

  componentWillMount(){
    this.urlParams = qs.parse(window.location.search);
    let tune = this.state.tune;
    if(this.urlParams.tune){
      tune.enable = true;
      Object.keys(this.state.tune).map(key => {
        if(key !== "enable" && this.urlParams[key] !== undefined){
          tune[key] = parseInt(this.urlParams[key], 10);
        }
      });
    }
    this.setState({
      tune
    });
  }

  handleRange(e){
    let tune = this.state.tune;
    if(e.target.name === "tune-enable"){
      tune.enable = !tune.enable;
      tune["tune.0"] = 0;
      tune["tune.1"] = 0;
      tune["tune.2"] = 0;
      tune["tune.3"] = 0;
      tune["tune.4"] = 0;
      tune["tune.5"] = 0;
      this.applyTuning();
    }else{
      tune[e.target.name] = e.target.value;
    }
    this.setState({
      tune
    });
  }

  applyTuning(){
    this.urlParams = qs.parse(window.location.search);
    if(this.state.tune.enable){
      this.urlParams["tune"] = true;
      Object.keys(this.state.tune).map(key => {
        if(key !== "enable" && parseInt(this.state.tune[key], 10) !== 0){
          this.urlParams[key] = this.state.tune[key];
        }else if(key !== "enable" && parseInt(this.state.tune[key], 10) === 0){
          delete this.urlParams[key];
        }
      });
    }else{
      delete this.urlParams["tune"];
      delete this.urlParams["tune.0"];
      delete this.urlParams["tune.1"];
      delete this.urlParams["tune.2"];
      delete this.urlParams["tune.3"];
      delete this.urlParams["tune.4"];
      delete this.urlParams["tune.5"];
    }
    getResults(this.urlParams);
  }

  render(){
    return(
      <div className="tune-range-selector">
        <input type="checkbox"checked={this.state.tune.enable} name="tune-enable" onChange={this.handleRange}/> Tune
        {
          (this.state.tune.enable) &&
          <div>
            <div>
              <label>Tune Title</label>
              <input type="range" min="0" max="100" name="tune.0" value={this.state.tune["tune.0"]} step={5} onChange={this.handleRange} onInput={this.aaa}/>
              {this.state.tune["tune.0"]}
            </div>
            <div>
              <label>Tune Description</label>
              <input type="range" min="0" max="100" name="tune.1" value={this.state.tune["tune.1"]} step={5} onChange={this.handleRange}/>
              {this.state.tune["tune.1"]}
            </div>
            <div>
              <label>Tune Keywords</label>
              <input type="range" min="0" max="100" name="tune.2" value={this.state.tune["tune.2"]} step={5} onChange={this.handleRange}/>
              {this.state.tune["tune.2"]}
            </div>
            <div>
              <label>Tune Url</label>
              <input type="range" min="0" max="100" name="tune.3" value={this.state.tune["tune.3"]} step={5} onChange={this.handleRange}/>
              {this.state.tune["tune.3"]}
            </div>
            <div>
              <label>Tune Date</label>
              <input type="range" min="0" max="100" name="tune.4" value={this.state.tune["tune.4"]} step={5} onChange={this.handleRange}/>
              {this.state.tune["tune.4"]}
            </div>
            <div>
              <label>Tune Length</label>
              <input type="range" min="0" max="100" name="tune.5" value={this.state.tune["tune.5"]} step={5} onChange={this.handleRange}/>
              {this.state.tune["tune.5"]}
            </div>
            <button onClick={this.applyTuning}>Apply</button>
          </div>
        }
      </div>
    );
  }
}
