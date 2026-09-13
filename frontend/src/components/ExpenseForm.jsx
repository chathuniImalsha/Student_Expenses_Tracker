import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ExpenseForm = ({ expense, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash'
  });
  const [errors, setErrors] = useState({});

  const categories = ['Food', 'Transport', 'Education', 'Accommodation', 'Mobile & Internet', 'Shopping', 'Entertainment', 'Health', 'Bills', 'Other'];
  const paymentMethods = ['Cash', 'Card', 'Bank Transfer', 'Online Payment'];

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: new Date(expense.date).toISOString().split('T')[0],
        paymentMethod: expense.paymentMethod
      });
    }
  }, [expense]);

  const validateAmount = (value) => {
    if (!value || parseFloat(value) <= 0) {
      return 'Amount must be greater than 0';
    }
    
    // Check if the value has more than 2 decimal places
    const decimalPlaces = (value.toString().split('.')[1] || '').length;
    if (decimalPlaces > 2) {
      return 'Amount can have maximum 2 decimal places (cents)';
    }
    
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate amount field
    if (name === 'amount') {
      const error = validateAmount(value);
      setErrors({
        ...errors,
        amount: error
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const amountError = validateAmount(formData.amount);
    if (amountError) {
      setErrors({ amount: amountError });
      alert(amountError);
      return;
    }

    try {
      if (expense) {
        await api.put(`/expenses/${expense._id}`, formData);
      } else {
        await api.post('/expenses', formData);
      }
      onSubmit();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving expense');
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Amount (Rs.)</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          step="0.01"
          min="0.01"
          required
        />
        {errors.amount && <div className="error">{errors.amount}</div>}
      </div>

      <div className="form-group">
        <label>Category</label>
        <select name="category" value={formData.category} onChange={handleChange} required>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Payment Method</label>
        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
          {paymentMethods.map((method) => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {expense ? 'Update Expense' : 'Save Expense'}
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
