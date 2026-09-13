import React from 'react';

const SummaryCard = ({ title, amount, icon, color }) => {
  const formatCurrency = (value) => {
    return `Rs. ${value.toLocaleString('en-LK')}`;
  };

  return (
    <div className="summary-card">
      <div className="summary-card-header">
        <div className="summary-card-icon" style={{ 
          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` 
        }}>
          {icon}
        </div>
      </div>
      <div className="summary-card-content">
        <h3 className="summary-card-title">{title}</h3>
        <p className="summary-card-amount">{formatCurrency(amount)}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
