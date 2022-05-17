import React, { useEffect, useState } from 'react'
import AboutLinks from './AboutLinks'
import Nav from './Nav'

function Header() {
  const [scrollYPosition,setScrollYPosiotion]=useState(0);
  useEffect(()=>{
    let HW=document.getElementById("h-w");
    let NW=document.getElementById("n-w");
    window.onscroll = function(){
      // abtW.classList.add("height")  
         if(window.pageYOffset > scrollYPosition){
        // setScrollPosition(window.pageYOffset)
        
        HW.classList.add("height")
        NW.classList.add("nav-w-stick")
        setScrollYPosiotion(window.pageYOffset);
      }else if(window.pageYOffset < scrollYPosition){
        // setScrollPosition(window.pageYOffset)     
        HW.classList.remove("height")
        NW.classList.remove("nav-w-stick")
        setScrollYPosiotion(window.pageYOffset);
       }
      }
  },[scrollYPosition])
  return (
    <div>
        <div className="header-wrapper" id="h-w">
            <AboutLinks/>
            <Nav scrollYPosition={scrollYPosition}/>
        <div className="reslut-tag">Site Search Results</div>
        </div>
    </div>
  )
}

export default Header