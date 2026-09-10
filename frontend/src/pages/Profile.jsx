import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  const handleEdit = () => {
    setFormData({
      name: user.name,
      email: user.email
    });
    setIsEditing(true);
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.put('/auth/profile', formData);
      setUser(response.data.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <h1 className="page-title">Profile</h1>
      
      <div className="profile-card card">
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="profile-header-info">
            <h2>{user.name}</h2>
            {!isEditing && (
              <button onClick={handleEdit} className="btn btn-secondary btn-sm">
                Edit Profile
              </button>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-edit-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-outline"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
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
        )}
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
