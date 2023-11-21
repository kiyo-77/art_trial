import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
function SidebarAdmin() {
  const sidebarStyle = {
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
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
    color: '#ecf0f1',
    textDecoration: 'none',
    margin: '20px 0',
    fontSize: '18px',
  };
  const navigate=useNavigate();
  const logout = async () => {
    await signOut(auth);
    navigate("/login");
    
  };

  return (
    <div style={sidebarStyle}>
        <Link to="/admin-dashboard" style={linkStyle}>
        Dashboard
      </Link>
      <Link to="/admin-submitted-artworks" style={linkStyle}>
        Submitted Artworks
      </Link>
      <Link to="/admin-uploaded-artworks" style={linkStyle}>
        Uploaded Artworks
      </Link>
      <Link to="/admin-artists" style={linkStyle}>
        Artists
      </Link>
      <Link to="/admin-offers" style={linkStyle}>
        Enquiries
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

export default SidebarAdmin;
