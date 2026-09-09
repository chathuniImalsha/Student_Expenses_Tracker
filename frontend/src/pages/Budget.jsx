import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount: ''
  });
  const [loading, setLoading] = useState(true);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await api.get('/budgets');
      setBudgets(response.data.data);
      
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const current = response.data.data.find(
        b => b.month === currentMonth && b.year === currentYear
      );
      
      if (current) {
        const detailResponse = await api.get(`/budgets/${current._id}`);
        setCurrentBudget(detailResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budgets', formData);
      setShowForm(false);
      setFormData({ ...formData, amount: '' });
      fetchBudgets();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating budget');
    }
  };

  const handleUpdateBudget = async (id, newAmount) => {
    try {
      await api.put(`/budgets/${id}`, { amount: newAmount });
      fetchBudgets();
    } catch (error) {
      alert('Error updating budget');
    }
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 100) return '#ef4444';
    if (percentage >= 90) return '#f97316';
    if (percentage >= 80) return '#f59e0b';
    return '#10b981';
  };

  const getUsageMessage = (percentage) => {
    if (percentage >= 100) return 'Budget exceeded!';
    if (percentage >= 90) return 'Critical: 90%+ spent';
    if (percentage >= 80) return 'Warning: 80%+ spent';
    return '';
  };

  if (loading) {
    return <div className="loading">Loading budget...</div>;
  }

  return (
    <div className="budget-page">
      <div className="page-header">
        <h1 className="page-title">Monthly Budget</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Set Budget
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <h2>Set Monthly Budget</h2>
            <form onSubmit={handleCreateBudget}>
              <div className="form-group">
                <label>Month</label>
                <select
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                  required
                >
                  {months.map((month, index) => (
                    <option key={month} value={index + 1}>{month}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  min="2020"
                  max="2030"
                  required
                />
              </div>
              <div className="form-group">
                <label>Budget Amount (Rs.)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Save Budget</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {currentBudget && (
        <div className="current-budget card">
          <h2>Current Month Budget</h2>
          <div className="budget-details">
            <div className="budget-item">
              <span className="budget-label">Monthly Budget</span>
              <span className="budget-value">Rs. {currentBudget.amount.toLocaleString('en-LK')}</span>
            </div>
            <div className="budget-item">
              <span className="budget-label">Spent</span>
              <span className="budget-value">Rs. {currentBudget.spent.toLocaleString('en-LK')}</span>
            </div>
            <div className="budget-item">
              <span className="budget-label">Remaining</span>
              <span className="budget-value">Rs. {currentBudget.remaining.toLocaleString('en-LK')}</span>
            </div>
            <div className="budget-item">
              <span className="budget-label">Usage</span>
              <span className="budget-value">{currentBudget.usagePercentage.toFixed(1)}%</span>
            </div>
          </div>

          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{
                width: `${Math.min(currentBudget.usagePercentage, 100)}%`,
                backgroundColor: getUsageColor(currentBudget.usagePercentage)
              }}
            />
          </div>

          {getUsageMessage(currentBudget.usagePercentage) && (
            <div className="budget-alert" style={{ color: getUsageColor(currentBudget.usagePercentage) }}>
              {getUsageMessage(currentBudget.usagePercentage)}
            </div>
          )}
        </div>
      )}

      <div className="budget-history card">
        <h2>Budget History</h2>
        {budgets.length > 0 ? (
          <table className="budget-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Year</th>
                <th>Budget</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget) => (
                <tr key={budget._id}>
                  <td>{months[budget.month - 1]}</td>
                  <td>{budget.year}</td>
                  <td>Rs. {budget.amount.toLocaleString('en-LK')}</td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        const newAmount = prompt('Enter new budget amount:', budget.amount);
                        if (newAmount && !isNaN(newAmount)) {
                          handleUpdateBudget(budget._id, parseFloat(newAmount));
                        }
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-state">No budgets set yet</p>
        )}
      </div>
    </div>
  );
};

export default Budget;
