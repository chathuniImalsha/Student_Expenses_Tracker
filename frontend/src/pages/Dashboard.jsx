import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SummaryCard from '../components/SummaryCard';
import { CategoryChart, MonthlyChart } from '../components/Charts';
import ExpenseTable from '../components/ExpenseTable';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, categoryRes, monthlyRes, recentRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/dashboard/category-summary'),
        api.get('/dashboard/monthly-summary'),
        api.get('/dashboard/recent-expenses')
      ]);

      setSummary(summaryRes.data.data);
      setCategoryData(categoryRes.data.data);
      setMonthlyData(monthlyRes.data.data);
      setRecentExpenses(recentRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/expenses/${id}`);
        fetchDashboardData();
      } catch (error) {
        alert('Error deleting expense');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Dashboard</h1>
      
      <div className="summary-cards">
        <SummaryCard
          title="Total Spent"
          amount={summary?.totalSpent || 0}
          icon="💰"
          color="#6366f1"
        />
        <SummaryCard
          title="This Month"
          amount={summary?.thisMonth || 0}
          icon="📅"
          color="#10b981"
        />
        <SummaryCard
          title="Today"
          amount={summary?.today || 0}
          icon="📆"
          color="#f59e0b"
        />
        <SummaryCard
          title="Remaining Budget"
          amount={summary?.remainingBudget || 0}
          icon="💵"
          color="#ef4444"
        />
      </div>

      <div className="dashboard-charts">
        <div className="chart-container card">
          <h2>Spending by Category</h2>
          {categoryData.length > 0 ? (
            <CategoryChart data={categoryData} />
          ) : (
            <p className="empty-state">No data available</p>
          )}
        </div>

        <div className="chart-container card">
          <h2>Monthly Spending</h2>
          {monthlyData.length > 0 ? (
            <MonthlyChart data={monthlyData} />
          ) : (
            <p className="empty-state">No data available</p>
          )}
        </div>
      </div>

      <div className="recent-expenses card">
        <h2>Recent Expenses</h2>
        {recentExpenses.length > 0 ? (
          <ExpenseTable
            expenses={recentExpenses}
            onEdit={() => {}}
            onDelete={handleDeleteExpense}
          />
        ) : (
          <p className="empty-state">No expenses yet</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
