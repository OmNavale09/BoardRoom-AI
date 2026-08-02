import boardroomImage from "../../assets/boardroom-ai.png";
import {useNavigate} from 'react-router-dom'
import React from "react";
import "./Hero.css";
export default function Hero()
{
    const navigate = useNavigate();
    const go = () => {
        navigate('/')
    }
    return(
<section className='hero' id="About">
    <div className='left'>
        <h1>Meet The <span>BoardRoom</span><br/>of Tomorrow</h1>
        <p>Bring together intelligent AI board members that think, strategize and collaborate with you. Turn ideas into execution from one powerful platform.</p>
        <button onClick={go}>Start with your idea →</button>
    </div>
    <div className="right">
       <img
         src={boardroomImage}
         alt="BoardRoom AI"
         className="boardroom-image"/>
    </div>
</section>);
}