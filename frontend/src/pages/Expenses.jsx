import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseTable from '../components/ExpenseTable';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    paymentMethod: 'All',
    month: '',
    sort: 'newest'
  });

  const categories = ['All', 'Food', 'Transport', 'Education', 'Accommodation', 'Mobile & Internet', 'Shopping', 'Entertainment', 'Health', 'Bills', 'Other'];
  const paymentMethods = ['All', 'Cash', 'Card', 'Bank Transfer', 'Online Payment'];
  const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  const fetchExpenses = async () => {
    try {
      const params = {};
      if (filters.category !== 'All') params.category = filters.category;
      if (filters.paymentMethod !== 'All') params.paymentMethod = filters.paymentMethod;
      if (filters.month) params.month = months.indexOf(filters.month);
      if (filters.sort) params.sort = filters.sort;

      const response = await api.get('/expenses', { params });
      let filteredExpenses = response.data.data;

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredExpenses = filteredExpenses.filter(exp =>
          exp.description.toLowerCase().includes(searchLower) ||
          exp.category.toLowerCase().includes(searchLower)
        );
      }

      setExpenses(filteredExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingExpense(null);
    fetchExpenses();
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/expenses/${id}`);
        fetchExpenses();
      } catch (error) {
        alert('Error deleting expense');
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="loading">Loading expenses...</div>;
  }

  return (
    <div className="expenses-page">
      <div className="page-header">
        <h1 className="page-title">Expenses</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Add Expense
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <h2>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>
            <ExpenseForm
              expense={editingExpense}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingExpense(null);
              }}
            />
          </div>
        </div>
      )}

      <div className="filters card">
        <div className="filter-group">
          <input
            type="text"
            name="search"
            placeholder="Search expenses..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter-group">
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <select name="paymentMethod" value={filters.paymentMethod} onChange={handleFilterChange}>
            {paymentMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <select name="month" value={filters.month} onChange={handleFilterChange}>
            <option value="">All Months</option>
            {months.slice(1).map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <select name="sort" value={filters.sort} onChange={handleFilterChange}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="expenses-list card">
        <ExpenseTable
          expenses={expenses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Expenses;
