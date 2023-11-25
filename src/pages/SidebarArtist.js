import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function SidebarArtist() {
  const navigate = useNavigate();
  const [hoveredLink, setHoveredLink] = useState(null);

  const sidebarStyle = {
    backgroundColor: '#461B93',
    backgroundImage: 'url(purple sky side1.jpeg)',
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
    color: '#e6ddd6',
    textDecoration: 'none',
    margin: '10px 0', 
    fontSize: '25px',
    padding:'20px',
    width:'100%',
    transition: 'color 0.3s, background-color 0.3s',
  };

  const activeLinkStyle = {
    backgroundColor: '#8253D7',
    color: 'black',
  };

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
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Link
          to="/artist-dashboard"
          className="text-white"
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
          to="/artist-artwork"
          className="text-white"
          style={{
            ...linkStyle,
            ...(hoveredLink === 'artwork' && activeLinkStyle),
          }}
          onMouseEnter={() => handleMouseEnter('artwork')}
          onMouseLeave={handleMouseLeave}
        >
          Artworks
        </Link>
        <Link
          to="/artist-offers"
          className="text-white"
          style={{
            ...linkStyle,
            ...(hoveredLink === 'offers' && activeLinkStyle),
          }}
          onMouseEnter={() => handleMouseEnter('offers')}
          onMouseLeave={handleMouseLeave}
        >
          Offers
        </Link>
        <Link
          to="/artist-profile"
          className="text-white"
          style={{
            ...linkStyle,
            ...(hoveredLink === 'profile' && activeLinkStyle),
          }}
          onMouseEnter={() => handleMouseEnter('profile')}
          onMouseLeave={handleMouseLeave}
        >
          Profile
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

export default SidebarArtist;

