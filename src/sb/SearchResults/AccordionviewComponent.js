import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import * as defaults from '../Common/Defaults';
import * as qs from 'query-string';
import * as $ from 'jquery';
import * as parser from '../Common/SbCore';
import { Collapse } from 'antd';
const { Panel } = Collapse;
// import CustomFacetFiltersComponent from '../FacetFilters/CustomFacetFiltersComponent';
import "../css/accordionviewcomponent.css";
const chevronUp = require("../../images/arrow-up.png");
const chevronDown = require("../../images/arrow-down.png");

import PaginationWithPageNumbers from '../Pagination/PaginationWithNumbers';

// import AccordionResult from './AccordionResult';


// COMPONENT WHICH HAS ALL RESULTS IN RESPONSE AND USES <Result /> COMPONENT TO DISPLAY EACH RESULT
export default class AccordionviewComponent extends Component {

  // _isMounted = false;

  constructor() {
    super();
    this.state = {
      displayFacets: false,
      results: [],
      collapse: false
    };
    this.documentClick = this.documentClick.bind(this);
    this.highlightFunc = this.highlightFunc.bind(this);
  }

  async componentDidMount() {

    // fetching existing params
    let parameters = Object.assign({}, qs.parse(window.location.search));

    //to change the pagesize for faq as 5
    delete parameters.pagesize;
    delete parameters.col;

    // use faq collection id
    const faqparam = { ...parameters, col: 10, pagesize: 5 };

    this.fetchResults(faqparam);

  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.documentClick);
  }

  fetchResults(faqparam) {

    faqparam.isFaq = true;
    // if mlt is requested then faq request formation
    if (faqparam['XPC'] != undefined) {
      faqparam['f.colname.filter'] = 'faqs';
      delete faqparam.col;
    }

    // fetching faq data
    if (faqparam['f.colname.filter'] == undefined || (faqparam['f.colname.filter'] != undefined && faqparam['f.colname.filter'] == 'faqs')) {

      parser.getSBResponse(faqparam).then((response) => {
        this.setState({
          results: [...response.data.result]
        });
      });

    }

  }

  documentClick(result) {
    let urlParameters = Object.assign({}, qs.parse(window.location.search));
    parser.getDocumentClickCount(result, "faq");

    this.fetchExtraFAQs(result);
  }

  fetchExtraFAQs(result) {
    let parameters = Object.assign({}, qs.parse(window.location.search));

    if (result.no == this.state.results.length) {

      //to change the pagesize for faq as 5
      delete parameters.pagesize;

      // use faq collection id
      const faqparam = { ...parameters, col: 10, pagesize: this.state.results.length + 2 };

      this.fetchResults(faqparam);

    }
  }


  highlightFunc(text, search) {
    let regex = new RegExp("(" + RegExp.escape(search) + ")", "gi");
    return "<span>" + text.replace(regex, "<strong><i>$1</i></strong>") + "</span>";
  }


  render() {

    return (
      <Fragment>
        {this.state.results !== undefined && this.state.results.length > 0 &&
        <div className="faqs-container" role="tabpanel">
          <div className="content-wrapper">
            <div>
              <div className="section-header">
                <div className="accordionRow">
                  <h2 className="categorytext">SmartFAQs</h2>
                </div>
              </div>
              <Collapse accordion
                bordered={false}
                defaultActiveKey={[]}
                expandIcon={({ isActive }) => <img src={isActive ? chevronUp : chevronDown} alt="Open Accordion" className="fa fa-chevron-right updown_icon antd-arrow ant-collapse-arrow" />
                }
                className="site-collapse-custom-collapse"
              >

                {this.state.results.map((result) => {

                  // accordion question
                  if (result.title && result.title.length > 0) {
                    result.title = decodeURIComponent(result.title.replace(/%([^\d].)/g, "%25$1").replace(/&#0;/g, "").replace(/&amp;/g, "&"));
                  }
                  else {
                    result.title = "Untitled";
                  }

                  let tempdiv = document.createElement("div");
                  tempdiv.innerHTML = result.title;
                  let temptext = tempdiv.textContent || tempdiv.innerText || "";
                  const panelHeader = (
                    <h3 className="faq-title" onClick={() => { this.documentClick(result); }} dangerouslySetInnerHTML={{ __html: result.title }} />
                  );

                  // accordion answer
                  if (result.answer) {
                    result.answer = new DOMParser().parseFromString(result.answer, 'text/html').body.textContent;
                  }

                  // accordion description
                  if (result.context) {
                    result.descriptionContent = result.context.replace(/(&amp;amp;)|(amp;)|(&amp;nbsp;)|(&amp;)/g, "&").replace(/&amp;amp;amp;/g, "&").replace(/&quot;/g, "\"").replace(/&nbsp;/g, "");//new DOMParser().parseFromString(result.context.text, 'text/html').body;
                  } else if (result.description) {
                    result.descriptionContent = result.description;
                  }

                  if (result.descriptionContent && result.descriptionContent.length > 260) {
                    let descriptionContent = result.descriptionContent.substring(0, 260).split(" ");
                    descriptionContent.splice(descriptionContent.length - 1, 1);
                    result.descriptionContent = descriptionContent.join(" ") + " ...";
                  }

                  // accordion link
                  if (result.link) {
                    result.link = new DOMParser().parseFromString(result.link, 'text/html').body.textContent;
                  }

                  return <Panel
                    header={panelHeader}
                    key={String(result['no'])}
                    className="site-collapse-custom-panel"
                  >

                    {result.descriptionContent && result.descriptionContent.indexOf(result.answer) == -1 && <p className="accordion-answer" dangerouslySetInnerHTML={{ __html: result.answer }} />}

                    {/* accordion description */}
                    {result.descriptionContent && result.answer && <p className="accordion-description" dangerouslySetInnerHTML={{ __html: this.highlightFunc(result.descriptionContent.replace(/\\/g, ''), result.answer) }} />}

                    <a className="result-url" href={result.link} target="_blank" >{result.link} </a>

                    <div className="accordionFeedback">
                      <i className="fa fa-thumbs-up" id="upvote" title="Upvote" />
                      <i className="fa fa-thumbs-down" id="downvote" title="Downvote" style={{ marginTop: "6px" }} />
                    </div>
                  </Panel>;
                })}
              </Collapse>
            </div>
          </div>
        </div>
        }
      </Fragment>
    );
  }
}



AccordionviewComponent.propTypes = {
  parameters: PropTypes.object
};