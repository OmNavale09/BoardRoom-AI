import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiLock, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import './index.css';
import Cookies from 'js-cookie'

const Register = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if(Cookies.get('token')){
    navigate('/')
  }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log( JSON.stringify({username: name, email, password}))
    const response = await fetch("https://boardroom-backend-k5un.onrender.com/register",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({username: name, email, password})
    })
    const data = await response.json();
    const {message, success} = data;
    if(success){
      toast.success(message || 'Welcome back!');
      navigate('/login')
    } else {
      toast.error(message || 'Login failed.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header / Branding */}
        <div className="brand-header">
          <div className="brand-logo">
            <div className='logo-container'>
              <h3 className='logo-text' style={{marginBottom: '0px', fontSize: '22px'}}>BoardRoom AI</h3>
            </div>
          </div>
          <span className="badge-hackathon">Prototype Edition</span>
        </div>

        {/* Intro */}
        <div className="auth-intro">
          <h1>Create Account</h1>
          <p>Deploy your custom AI Executive Board to simulate multi-agent startup choices.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <input
                type="text"
                id="name"
                placeholder="Sarah Jenkins"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                id="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-submit">
            Create Free Account <FiCheckCircle className="btn-icon" />
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <a href="/login">Sign In</a></p>
        </div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </div>
  );
};

export default Register;