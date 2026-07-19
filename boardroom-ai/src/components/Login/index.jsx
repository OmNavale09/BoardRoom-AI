import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie'
import './index.css';

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
      if(Cookies.get('token')){
      navigate('/')
    }
    }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle your authentication logic here
    console.log('Logging in with:', { email, password });
    const response = await fetch("http://localhost:5000/login",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email, password})
    })
    const data = await response.json();
    const {message, success, token} = data;
    if(success){
      Cookies.set('token', token, { expires: 20})
      toast.success(message || 'Welcome back!');
      navigate('/')
    } else {
      toast.error(message || 'Login failed.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header / Branding */}
        <div className="brand-header">
          <div className="brand-logo">
            <div className='logo-container'>
              <h3 className='logo-text' style={{marginBottom: '0px', fontSize: '22px'}}>BoardRoom AI</h3>
            </div>
          </div>
          <span className="badge-hackathon">Prototype Edition</span>
        </div>

        {/* Title text */}
        <div className="login-intro">
          <h1>Welcome Back</h1>
          <p>Access your AI Executive Board for Product & Startup Decisions</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <div className="password-label-row">
              <label htmlFor="password">Password</label>
              <a href="#forgot" className="forgot-link">Forgot?</a>
            </div>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => App.setPassword(e.target.value)} // Fallback standard:
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-submit">
            Sign In to Founder Mode
          </button>
        </form>

        {/* Footer info */}
        <div className="login-footer">
          <p>Don't have an account? <a href="/register">Request Access</a></p>
        </div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </div>
  );
};

export default Login;