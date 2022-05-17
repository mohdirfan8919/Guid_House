import React, { useState,useEffect } from "react";

function AboutLinks() {
  const [links] = useState([
    { name: "About", url: "https://guidehouse.com/about" },
    { name: "Locations", url: "https://guidehouse.com/locations" },
    { name: "Careers", url: "https://guidehouse.com/careers" },
    { name: "News & Events", url: "https://guidehouse.com/news-and-events" },
    {
      name: "Deutsche Ressourcen",
      url: "https://guidehouse.com/deutsche-ressourcen",
    },
  ]);
  const [scrollPosition,setScrollPosition]=useState(0);
  return (
    <div className="abt-wrapper" id="h-w">
      <div>
        {links.map((link) => (
          <a href={link.url} target="_blank" key={link.name}>{link.name}</a>
        ))}
      </div>
    </div>
  );
}

export default AboutLinks;
