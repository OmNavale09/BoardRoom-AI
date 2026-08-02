import React from "react";
import "./Navbar.css";
import './Navbar.css';
export default function Navbar(){
const items=['About','Features','AI Board Members','How It Works','Privacy Policy','Terms of Service'];
return <nav className='nav'><div className='logo'>BoardRoom <span>AI</span></div><ul>{items.map(i=><li key={i}>{i}</li>)}</ul></nav>}