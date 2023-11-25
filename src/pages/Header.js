

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
    <body>
    <div>
    <h1 className="dream-artscapes ms-5">Dream Artscapes</h1>
   
          <div className="navbar ms-5">
            
            <nav className="home-parent">
              <div className="menu"><Link to="/">HOME</Link></div>
              <div className="menu"><Link to="/artworks-visitor">ARTWORKS</Link></div>
              <div className="menu"><Link to="/artists-visitor">ARTISTS</Link></div>
             
              <div className="menu"><Link to="/contact-visitor">CONTACT</Link></div>
            </nav>
         
        
          </div>
            <button className="button2 btn-2 hover-slide-up" onClick={handleClick}>
            <span>Login</span>
          </button>
          <button className="button1" onClick={handleSignup}>
            <div className="login">SIGN UP</div>
          </button>
  </div>
  </body>
       
  );
};

export default Header;
