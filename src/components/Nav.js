import React, { useState } from "react";
import "../fw/css/font-awesome.min.css";
import AbsSearch from "./AbsSearch";
function Nav(scrollYPosition) {
  const [show,setshow]=useState(false);
  const [industriesLinks] = useState([
    [
      {
        name: "Defense",
        url: "https://guidehouse.com/capabilities/industries/defense",
      },
      {
        name: "Energy, Sustainability, & Infrastructure",
        url: "https://guidehouse.com/capabilities/industries/energy-sustainability-infrastructure",
      },
      {
        name: "Financial Services",
        url: "https://guidehouse.com/capabilities/industries/financial-services",
      },
    ],
    [
      {
        name: "Health",
        url: "https://guidehouse.com/capabilities/industries/healthcare",
      },
      {
        name: "National Security",
        url: "https://guidehouse.com/capabilities/industries/national-security",
      },
      {
        name: "State & Local Government",
        url: "https://guidehouse.com/capabilities/industries/state-local-government",
      },
    ],
  ]);
  const [solution] = useState([
    [
      {
        name: "Cybersecurity",
        url: "https://guidehouse.com/capabilities/solutions/cybersecurity",
      },
      {
        name: "Finance Optimization",
        url: "https://guidehouse.com/capabilities/solutions/finance-optimization",
      },
      {
        name: "Financial Crime Solutions",
        url: "https://guidehouse.com/capabilities/solutions/finance-optimization",
      },
      {
        name: "Fraud, Waste & Abuse",
        url: "https://guidehouse.com/capabilities/solutions/fraud-waste-abuse-detection-prevention",
      },
      {
        name: "Operational Effectiveness",
        url: "https://guidehouse.com/capabilities/solutions/operational-effectiveness",
      },
      {
        name: "Portfolio Management",
        url: "https://guidehouse.com/capabilities/solutions/portfolio-management",
      },
    ],
    [
      {
        name: "Integrated Program Management Office ",
        url: "https://guidehouse.com/capabilities/solutions/integrated-program-management-office",
      },
      {
        name: "Managed Services",
        url: "https://guidehouse.com/capabilities/solutions/managed-services",
      },
      {
        name: "Risk, Regulatory, & Compliance",
        url: "https://guidehouse.com/capabilities/solutions/regulatory-risk-and-compliance",
      },
      {
        name: "Strategic Development",
        url: "https://guidehouse.com/capabilities/solutions/strategic-development",
      },
      {
        name: "Technology Solutions",
        url: "https://guidehouse.com/capabilities/solutions/technology-solutions",
      },
      {
        name: "Sustainability ",
        url: "https://guidehouse.com/capabilities/solutions/sustainability",
      },
    ],
  ]);
  const [insights] = useState([
    [
      {
        name: "Highlights",
        url: "https://guidehouse.com/insights-and-experience?tabName=Highlights",
      },
      {
        name: "All Things Financial Management",
        url: "https://guidehouse.com/insights/defense/2021/all-things-financial-management-podcast",
      },
      {
        name: "Don’t Wait to Optimize Fraud Technology",
        url: "https://guidehouse.com/insights/financial-crimes/2022/optimize-fraud-technology-american-banker-survey",
      },
      {
        name: "Navigating the Decarbonization Journey",
        url: "https://guidehouse.com/insights/energy/2021/navigating-the-decarbonization-journey",
      },
    ],
    [
      {
        name: "Defense",
        url: "https://guidehouse.com/insights-and-experience?tabName=Defense",
      },
      {
        name: "Center for Health Insights",
        url: "https://guidehouse.com/insights-and-experience/center-for-health-insights",
      },
      {
        name: "Energy, Sustainability, & Infrastructure",
        url: "https://guidehouse.com/insights-and-experience?tabName=Energy-Sustainability-and-Infrastructure",
      },
      {
        name: "Financial Services",
        url: "https://guidehouse.com/insights-and-experience?tabName=Financial-Services",
      },
      {
        name: "National Security",
        url: "https://guidehouse.com/insights-and-experience?tabName=National-Security",
      },
      {
        name: "State and Local Government",
        url: "https://guidehouse.com/insights-and-experience?tabName=State-and-Local-Government",
      },
    ],
  ]);
  const handleClick=()=>{
    setshow(!show)
  }
  // console.log(scrollYPosition)
  return (
    <div className="nav-wrapper" id="n-w">
      <img
        className="logo-img"
        src="https://guidehouse.com/-/media/www/site/images/logos/gh_logo_tag_stacked_rgb_stacked_rgb.svg?la=en&hash=66B038AEB6DE88727FF231C3C3822211A66A3B0B"
        alt="GuideHouse-logo"
      />
      <div className="nav-links">
        <ul>
          <li>
            <div>Industries</div>
            <div className="abs-links">
              <div className="links-left-div">
                <span className="extra-space" />
                {industriesLinks[0].map((link) => (
                  <div key={link.name}>
                    <a href={link.url} className="nav-link-m" target="_blank">
                      {link.name}
                    </a>
                  </div>
                ))}
              </div>
              <div className="links-right-div">
                <span className="extra-space" />
                {industriesLinks &&
                  industriesLinks[1].map((link) => (
                    <div key={link.name}>
                      <a href={link.url} className="nav-link-m" target="_blank">
                        {link.name}
                      </a>
                    </div>
                  ))}
              </div>
            </div>
          </li>
          <li>
            <div>Solutions</div>
            <div className="abs-links">
              <div className="links-left-div">
                <span className="extra-space" />
                {solution[0].map((link) => (
                  <div key={link.name}>
                    <a href={link.url} className="nav-link-m" target="_blank">
                      {link.name}
                    </a>
                  </div>
                ))}
              </div>
              <div className="links-right-div">
                <span className="extra-space" />
                {solution[1].map((link) => (
                  <div key={link.name}>
                    <a href={link.url} className="nav-link-m" target="_blank">
                      {link.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </li>
          <li>
            <div>People</div>
            <div className="abs-links"></div>
          </li>
          <li>
            <div>Insights & Experience</div>
            <div className="abs-links">
              <div className="links-left-div">
                <span className="extra-space">Editor's Pick</span>
                {insights[0].map((link) => (
                  <div key={link.name}>
                    <a href={link.url} className="nav-link-m" target="_blank">
                      {link.name}
                    </a>
                  </div>
                ))}
              </div>
              <div className="links-right-div">
                <span className="extra-space">Industries</span>
                {insights[1].map((link) => (
                    <div key={link.name}>
                      <a href={link.url} className="nav-link-m" target="_blank">
                        {link.name}
                      </a>
                    </div>
                  ))}
              </div>
            </div>
          </li>
        </ul>
        <div className={`nav-search-button ${scrollYPosition && scrollYPosition < window.pageYOffset ? "rm-pad":""} ${show?"change-bg":""}`} onClick={handleClick}>
       {show && show ? <i className="fa-solid fa-xmark"></i>: <i
              className="fa fa-search opacity-1"
                />
               }
                
        </div>
      </div>
      {show && <AbsSearch show={show}/>}
    </div>
  );
}

export default Nav;
