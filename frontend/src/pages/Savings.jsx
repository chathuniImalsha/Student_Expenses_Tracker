import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Savings = () => {
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSaving, setEditingSaving] = useState(null);
  const [formData, setFormData] = useState({
    month: '',
    year: new Date().getFullYear(),
    targetAmount: '',
    savedAmount: '',
    description: ''
  });

  useEffect(() => {
    fetchSavings();
  }, []);

  const fetchSavings = async () => {
    try {
      const response = await api.get('/savings');
      setSavings(response.data.data);
    } catch (error) {
      console.error('Error fetching savings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (saving = null) => {
    if (saving) {
      setEditingSaving(saving);
      setFormData({
        month: saving.month,
        year: saving.year,
        targetAmount: saving.targetAmount,
        savedAmount: saving.savedAmount,
        description: saving.description || ''
      });
    } else {
      setEditingSaving(null);
      setFormData({
        month: new Date().toLocaleString('en-US', { month: 'long' }),
        year: new Date().getFullYear(),
        targetAmount: '',
        savedAmount: '',
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSaving(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSaving) {
        await api.put(`/savings/${editingSaving._id}`, formData);
      } else {
        await api.post('/savings', formData);
      }
      fetchSavings();
      handleCloseModal();
    } catch (error) {
      alert('Error saving saving goal');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this saving goal?')) {
      try {
        await api.delete(`/savings/${id}`);
        fetchSavings();
      } catch (error) {
        alert('Error deleting saving goal');
      }
    }
  };

  const handleAddSavings = async (id, amount) => {
    try {
      await api.post(`/savings/${id}/add`, { amount });
      fetchSavings();
    } catch (error) {
      alert('Error adding savings');
    }
  };

  const calculateProgress = (saved, target) => {
    if (target === 0) return 0;
    return Math.min((saved / target) * 100, 100);
  };

  const calculateTotalSavings = () => {
    return savings.reduce((total, saving) => total + saving.savedAmount, 0);
  };

  const calculateTotalTarget = () => {
    return savings.reduce((total, saving) => total + saving.targetAmount, 0);
  };

  const formatCurrency = (value) => {
    return `Rs. ${value.toLocaleString('en-LK')}`;
  };

  if (loading) {
    return <div className="loading">Loading savings...</div>;
  }

  return (
    <div className="savings-page">
      <div className="page-header">
        <h1 className="page-title">Monthly Savings</h1>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          + New Saving Goal
        </button>
      </div>

      {savings.length > 0 && (
        <div className="total-savings-summary card">
          <div className="total-savings-content">
            <div className="total-savings-item">
              <span className="total-savings-label">Total Saved</span>
              <span className="total-savings-value">{formatCurrency(calculateTotalSavings())}</span>
            </div>
            <div className="total-savings-item">
              <span className="total-savings-label">Total Target</span>
              <span className="total-savings-value">{formatCurrency(calculateTotalTarget())}</span>
            </div>
            <div className="total-savings-item">
              <span className="total-savings-label">Overall Progress</span>
              <span className="total-savings-value">
                {calculateTotalTarget() > 0 
                  ? `${calculateProgress(calculateTotalSavings(), calculateTotalTarget()).toFixed(1)}%` 
                  : '0%'}
              </span>
            </div>
          </div>
          <div className="total-savings-progress">
            <div
              className="progress-bar"
              style={{
                width: `${calculateTotalTarget() > 0 
                  ? calculateProgress(calculateTotalSavings(), calculateTotalTarget()) 
                  : 0}%`
              }}
            />
          </div>
        </div>
      )}

      {savings.length === 0 ? (
        <div className="empty-state">
          <p>No saving goals yet. Create your first saving goal!</p>
        </div>
      ) : (
        <div className="savings-grid">
          {savings.map((saving) => (
            <div key={saving._id} className="saving-card card">
              <div className="saving-card-header">
                <h3>{saving.month} {saving.year}</h3>
                <div className="saving-card-actions">
                  <button
                    onClick={() => handleOpenModal(saving)}
                    className="btn btn-secondary btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(saving._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {saving.description && (
                <p className="saving-description">{saving.description}</p>
              )}

              <div className="saving-progress-section">
                <div className="saving-amounts">
                  <div className="saving-amount">
                    <span className="label">Target</span>
                    <span className="value">{formatCurrency(saving.targetAmount)}</span>
                  </div>
                  <div className="saving-amount">
                    <span className="label">Saved</span>
                    <span className="value">{formatCurrency(saving.savedAmount)}</span>
                  </div>
                </div>

                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${calculateProgress(saving.savedAmount, saving.targetAmount)}%`
                    }}
                  />
                </div>

                <div className="saving-percentage">
                  {calculateProgress(saving.savedAmount, saving.targetAmount).toFixed(1)}% Complete
                </div>
              </div>

              <div className="quick-add-section">
                <input
                  type="number"
                  placeholder="Add amount"
                  className="quick-add-input"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value) {
                      handleAddSavings(saving._id, parseFloat(e.target.value));
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector('.quick-add-input');
                    if (input && input.value) {
                      handleAddSavings(saving._id, parseFloat(input.value));
                      input.value = '';
                    }
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingSaving ? 'Edit Saving Goal' : 'Create Saving Goal'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Month</label>
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  required
                >
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>

              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Target Amount</label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Initial Saved Amount</label>
                <input
                  type="number"
                  name="savedAmount"
                  value={formData.savedAmount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCloseModal} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSaving ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Savings;