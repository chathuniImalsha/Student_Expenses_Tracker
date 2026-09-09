import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    fetchReport();
  }, [selectedMonth, selectedYear]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await api.get('/reports/monthly', {
        params: { month: selectedMonth, year: selectedYear }
      });
      setReportData(response.data.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/reports/export', {
        params: { month: selectedMonth, year: selectedYear },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `expenses_${selectedMonth}_${selectedYear}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Error exporting CSV');
    }
  };

  const formatCurrency = (value) => {
    return `Rs. ${value.toLocaleString('en-LK')}`;
  };

  if (loading) {
    return <div className="loading">Loading report...</div>;
  }

  return (
    <div className="reports-page">
      <h1 className="page-title">Monthly Reports</h1>

      <div className="report-filters card">
        <div className="filter-group">
          <label>Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {months.map((month, index) => (
              <option key={month} value={index + 1}>{month}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {[2024, 2025, 2026, 2027].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-secondary" onClick={handleExportCSV}>
          Export CSV
        </button>
      </div>

      {reportData && (
        <div className="report-content">
          <div className="report-summary card">
            <h2>{months[selectedMonth - 1]} {selectedYear}</h2>
            
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Total Spending</span>
                <span className="summary-value">{formatCurrency(reportData.totalSpending)}</span>
              </div>
              
              <div className="summary-item">
                <span className="summary-label">Budget</span>
                <span className="summary-value">{formatCurrency(reportData.budget)}</span>
              </div>
              
              <div className="summary-item">
                <span className="summary-label">Remaining Budget</span>
                <span className="summary-value">{formatCurrency(reportData.remainingBudget)}</span>
              </div>
              
              <div className="summary-item">
                <span className="summary-label">Average Daily Spending</span>
                <span className="summary-value">{formatCurrency(reportData.averageDailySpending)}</span>
              </div>
            </div>

            {reportData.highestCategory && (
              <div className="highest-category">
                <h3>Highest Spending Category</h3>
                <p>
                  <strong>{reportData.highestCategory._id}</strong> – {formatCurrency(reportData.highestCategory.total)}
                </p>
              </div>
            )}
          </div>

          <div className="category-breakdown card">
            <h2>Category-wise Spending</h2>
            {reportData.categorySpending.length > 0 ? (
              <table className="category-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.categorySpending.map((item) => {
                    const percentage = reportData.totalSpending > 0
                      ? ((item.total / reportData.totalSpending) * 100).toFixed(1)
                      : 0;
                    return (
                      <tr key={item._id}>
                        <td>{item._id}</td>
                        <td>{formatCurrency(item.total)}</td>
                        <td>{percentage}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="empty-state">No expenses for this period</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
