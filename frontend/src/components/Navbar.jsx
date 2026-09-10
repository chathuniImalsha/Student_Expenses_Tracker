import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="navbar-left">
          <Link to="/dashboard" className="navbar-brand">
            <Logo size={40} showText={true} />
          </Link>
        </div>
        
        {user && (
          <div className="navbar-right">
            <div className="navbar-icons">
              <button className="navbar-icon-btn" title="Notifications">
                🔔
              </button>
              <button className="navbar-icon-btn" title="Settings">
                ⚙️
              </button>
            </div>
            <div className="navbar-profile">
              <div className="navbar-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            <div className="navbar-user">
              <button onClick={handleLogout} className="btn btn-outline">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
