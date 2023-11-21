

import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login';
import "./Cover.css";
const Header = () => {
    const navigate =useNavigate();

    const handleClick = () => {
    
        navigate('/login');
      };
      const handleSignup = () => {
    
        navigate('/register-page');
      };
  return (
    <div>
    <h1 className="dream-artscapes">Dream Artscapes</h1>
   
          <div className="navbar">
            
            <nav className="home-parent">
              <div className="active-menu"><Link to="/">HOME</Link></div>
              <div className="menu"><Link to="/artworks-visitor">PAINTINGS</Link></div>
              <div className="menu"><Link to="/artists-visitor">PRINTMAKING</Link></div>
              <div className="menu"><Link to="#">SCULPTURES</Link></div>
              <div className="menu"><Link to="#">CONTACT</Link></div>
            </nav>
         
        
          </div>
            <button className="button2 btn-2 hover-slide-up" onClick={handleClick}>
            <span>Login</span>
          </button>
          <button className="button1" onClick={handleSignup}>
            <div className="login">SIGN UP</div>
          </button>
  </div>

       
  );
};

export default Header;
