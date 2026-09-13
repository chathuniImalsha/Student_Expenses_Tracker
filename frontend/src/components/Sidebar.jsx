import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/expenses', label: 'Expenses', icon: '💰' },
    { path: '/budget', label: 'Budget', icon: '📈' },
    { path: '/savings', label: 'Savings', icon: '💎' },
    { path: '/reports', label: 'Reports', icon: '📋' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-user-profile">
        <div className="sidebar-avatar">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="sidebar-user-info">
          <h3 className="sidebar-user-name">{user?.name || 'User'}</h3>
          <p className="sidebar-user-email">{user?.email || 'user@example.com'}</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
