import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function SidebarArtist() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('');

  const sidebarStyle = {
    backgroundColor: '#923cb5',
    backgroundImage: 'url(purple sky side1.jpeg)',
    height: '100%',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '300px',
  };

  const linkStyle = {
    color: '#e6ddd6',
    textDecoration: 'none',
    margin: '80px 0 40px',
    fontSize: '35px',
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
    
  };

  return (
    <div style={sidebarStyle}>
      <Link to="/artist-dashboard" className="text-white" style={linkStyle}>
        Dashboard
      </Link>
      <Link to="/artist-artwork" className="text-white" style={linkStyle}>
        Artworks
      </Link>
      <Link to="/artist-offers" className="text-white" style={linkStyle}>
        Offers
      </Link>
      <Link to="/artist-profile" className="text-white" style={linkStyle}>
        Profile
      </Link>
      <div
        style={linkStyle}
        onClick={logout}
        role="button"
        tabIndex={0}
      >
        Logout
      </div>
    </div>
  );
}

export default SidebarArtist;
