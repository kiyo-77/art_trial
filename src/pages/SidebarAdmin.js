import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

function SidebarAdmin() {
  const [hoveredLink, setHoveredLink] = useState(null);
  const sidebarStyle = {
    backgroundColor: '#4B0082',
    color: 'white',
    height: '100%',
  
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '200px',
  };

  const linkStyle = {
    textDecoration: 'none',
    margin: '10px 0', 
    fontSize: '21px',
    padding: '20px',
    borderRadius: '5px',
    transition: 'color 0.3s, background-color 0.3s',
    color:'white',
    
  };

  const activeLinkStyle = {
    backgroundColor: '#9457eb',
    color: 'black',
    width:'100%',
    padding:'20px'
  };

  const navigate = useNavigate();

  const handleMouseEnter = (link) => {
    setHoveredLink(link);
  };

  const handleMouseLeave = () => {
    setHoveredLink(null);
  };

  const logout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div style={sidebarStyle}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Link
          to="/admin-dashboard"
          style={{
            ...linkStyle,
            ...(hoveredLink === 'dashboard' && activeLinkStyle),
          }}
          onMouseEnter={() => handleMouseEnter('dashboard')}
          onMouseLeave={handleMouseLeave}
        >
          Dashboard
        </Link>
        <Link
          to="/admin-submitted-artworks"
          style={{
            ...linkStyle,
            ...(hoveredLink === 'submitted-artworks' && activeLinkStyle),
          }}
          onMouseEnter={() => handleMouseEnter('submitted-artworks')}
          onMouseLeave={handleMouseLeave}
        >
          Submitted Artworks
        </Link>
        <Link
          to="/admin-uploaded-artworks"
          style={{
            ...linkStyle,
            ...(hoveredLink === 'uploaded-artworks' && activeLinkStyle),
          }}
          onMouseEnter={() => handleMouseEnter('uploaded-artworks')}
          onMouseLeave={handleMouseLeave}
        >
          Uploaded Artworks
        </Link>
        <Link
          to="/admin-artists"
          style={{
            ...linkStyle,
            ...(hoveredLink === 'artists' && activeLinkStyle),
          }}
          onMouseEnter={() => handleMouseEnter('artists')}
          onMouseLeave={handleMouseLeave}
        >
          Artists
        </Link>
        <Link
          to="/admin-offers"
          style={{
            ...linkStyle,
            ...(hoveredLink === 'offers' && activeLinkStyle),
          }}
          onMouseEnter={() => handleMouseEnter('offers')}
          onMouseLeave={handleMouseLeave}
        >
          Offers
        </Link>
        <div
          style={{
            ...linkStyle,
            ...(hoveredLink === 'logout' && activeLinkStyle),
          }}
          onClick={logout}
          role="button"
          tabIndex={0}
          onMouseEnter={() => handleMouseEnter('logout')}
          onMouseLeave={handleMouseLeave}
        >
          Logout
        </div>
      </div>
    </div>
  );
}

export default SidebarAdmin;
