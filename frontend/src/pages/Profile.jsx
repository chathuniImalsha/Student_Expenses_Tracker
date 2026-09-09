import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <h1 className="page-title">Profile</h1>
      
      <div className="profile-card card">
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <h2>{user.name}</h2>
        </div>
        
        <div className="profile-details">
          <div className="profile-item">
            <span className="profile-label">Name</span>
            <span className="profile-value">{user.name}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Email</span>
            <span className="profile-value">{user.email}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Member Since</span>
            <span className="profile-value">
              {new Date(user.createdAt).toLocaleDateString('en-GB')}
            </span>
          </div>
        </div>
      </div>

      <div className="app-info card">
        <h2>About Spendly</h2>
        <p className="tagline">Track. Save. Spend Smart.</p>
        <p>A simple and modern student expense tracker to help you manage your finances effectively.</p>
      </div>
    </div>
  );
};

export default Profile;
