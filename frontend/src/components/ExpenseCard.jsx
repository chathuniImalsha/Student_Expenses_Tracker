import React from 'react';

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (value) => {
    return `Rs. ${value.toLocaleString('en-LK')}`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food': '#3B82F6',
      'Transport': '#10B981',
      'Entertainment': '#F59E0B',
      'Shopping': '#EF4444',
      'Bills': '#8B5CF6',
      'Health': '#EC4899',
      'Education': '#06B6D4',
      'Other': '#6B7280'
    };
    return colors[category] || '#6B7280';
  };

  const getPaymentIcon = (method) => {
    const icons = {
      'Cash': '💵',
      'Card': '💳',
      'Online': '📱',
      'Bank Transfer': '🏦'
    };
    return icons[method] || '💳';
  };

  return (
    <div className="expense-card">
      <div className="expense-card-header">
        <div className="expense-card-icon" style={{ backgroundColor: getCategoryColor(expense.category) }}>
          {getPaymentIcon(expense.paymentMethod)}
        </div>
        <div className="expense-card-amount">
          {formatCurrency(expense.amount)}
        </div>
      </div>
      
      <div className="expense-card-body">
        <h3 className="expense-card-description">{expense.description}</h3>
        <div className="expense-card-meta">
          <span className="expense-card-category" style={{ color: getCategoryColor(expense.category) }}>
            {expense.category}
          </span>
          <span className="expense-card-date">{formatDate(expense.date)}</span>
        </div>
      </div>
      
      <div className="expense-card-footer">
        <button
          onClick={() => onEdit(expense)}
          className="expense-card-btn expense-card-btn-edit"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(expense._id)}
          className="expense-card-btn expense-card-btn-delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const ExpenseCardGrid = ({ expenses, onEdit, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <p>No expenses found</p>
      </div>
    );
  }

  return (
    <div className="expense-card-grid">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense._id}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ExpenseCardGrid;