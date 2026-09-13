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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSavings();
  }, []);

  const validateAmount = (value, fieldName) => {
    if (!value || parseFloat(value) < 0) {
      return `${fieldName} must be greater than or equal to 0`;
    }
    
    // Check if the value has more than 2 decimal places
    const decimalPlaces = (value.toString().split('.')[1] || '').length;
    if (decimalPlaces > 2) {
      return `${fieldName} can have maximum 2 decimal places (cents)`;
    }
    
    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate target amount
    const targetError = validateAmount(formData.targetAmount, 'Target amount');
    if (targetError) newErrors.targetAmount = targetError;
    
    // Validate saved amount
    const savedError = validateAmount(formData.savedAmount, 'Initial saved amount');
    if (savedError) newErrors.savedAmount = savedError;
    
    // Check if saved amount exceeds target amount
    if (formData.targetAmount && formData.savedAmount) {
      if (parseFloat(formData.savedAmount) > parseFloat(formData.targetAmount)) {
        newErrors.savedAmount = 'Initial saved amount cannot exceed target amount';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Real-time validation for amount fields
    if (name === 'targetAmount') {
      const error = validateAmount(value, 'Target amount');
      setErrors({ ...errors, targetAmount: error });
    } else if (name === 'savedAmount') {
      const error = validateAmount(value, 'Initial saved amount');
      setErrors({ ...errors, savedAmount: error });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    try {
      if (editingSaving) {
        await api.put(`/savings/${editingSaving._id}`, formData);
      } else {
        await api.post('/savings', formData);
      }
      fetchSavings();
      handleCloseModal();
      setErrors({});
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
    // Validate amount
    const amountError = validateAmount(amount, 'Amount to add');
    if (amountError) {
      alert(amountError);
      return;
    }
    
    try {
      await api.post(`/savings/${id}/add`, { amount: parseFloat(amount) });
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
    return `Rs. ${value.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
                  step="0.01"
                  min="0.01"
                  id={`quick-add-${saving._id}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value) {
                      handleAddSavings(saving._id, e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById(`quick-add-${saving._id}`);
                    if (input && input.value) {
                      handleAddSavings(saving._id, input.value);
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
          <div className="modal-content savings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSaving ? 'Edit Saving Goal' : 'Create Saving Goal'}</h2>
              <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="savings-form-grid">
                <div className="form-group label-with-icon">
                  <label htmlFor="month">
                    <span className="label-icon">📅</span>
                    Month
                  </label>
                  <select
                    id="month"
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Month</option>
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

                <div className="form-group label-with-icon">
                  <label htmlFor="year">
                    <span className="label-icon">📆</span>
                    Year
                  </label>
                  <input
                    id="year"
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    min="2020"
                    max="2030"
                    placeholder="2024"
                  />
                </div>
              </div>

              <div className="form-group label-with-icon">
                <label htmlFor="targetAmount">
                  <span className="label-icon">🎯</span>
                  Target Amount (Rs.)
                </label>
                <input
                  id="targetAmount"
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                  placeholder="Enter your savings target"
                />
                {errors.targetAmount && <div className="error">{errors.targetAmount}</div>}
              </div>

              <div className="form-group label-with-icon">
                <label htmlFor="savedAmount">
                  <span className="label-icon">💰</span>
                  Initial Saved Amount (Rs.)
                </label>
                <input
                  id="savedAmount"
                  type="number"
                  name="savedAmount"
                  value={formData.savedAmount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Enter initial amount saved (optional)"
                />
                {errors.savedAmount && <div className="error">{errors.savedAmount}</div>}
                <small className="form-hint">Leave empty if starting from zero</small>
              </div>

              <div className="form-group label-with-icon">
                <label htmlFor="description">
                  <span className="label-icon">📝</span>
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Add a description for your savings goal..."
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCloseModal} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSaving ? '💾 Update Goal' : '🚀 Create Goal'}
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