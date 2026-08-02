import boardroomImage from "../../assets/boardroom-ai.png";
import React from "react";
import "./Hero.css";
export default function Hero()
{return(
<section className='hero'>
    <div className='left'>
        <h1>Meet The <span>BoardRoom</span><br/>of Tomorrow</h1>
        <p>Bring together intelligent AI board members that think, strategize and collaborate with you. Turn ideas into execution from one powerful platform.</p>
        <button>Start with your idea →</button>
    </div>
    <div className="right">
       <img
         src={boardroomImage}
         alt="BoardRoom AI"
         className="boardroom-image"/>
    </div>
</section>);
}