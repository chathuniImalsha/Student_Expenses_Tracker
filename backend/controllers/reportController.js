const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

const getMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    const targetMonth = parseInt(month) || new Date().getMonth() + 1;
    const targetYear = parseInt(year) || new Date().getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0);

    const expenses = await Expense.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate }
    });

    const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const categorySpending = await Expense.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      { $sort: { total: -1 } }
    ]);

    const highestCategory = categorySpending.length > 0 ? categorySpending[0] : null;

    const daysInMonth = endDate.getDate();
    const averageDailySpending = totalSpending / daysInMonth;

    const budget = await Budget.findOne({
      userId: req.user._id,
      month: targetMonth,
      year: targetYear
    });

    const budgetAmount = budget ? budget.amount : 0;
    const remainingBudget = budgetAmount - totalSpending;

    res.json({
      success: true,
      data: {
        month: targetMonth,
        year: targetYear,
        totalSpending,
        highestCategory,
        averageDailySpending,
        budget: budgetAmount,
        remainingBudget,
        categorySpending
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const exportExpenses = async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = { userId: req.user._id };

    if (month && year) {
      const targetMonth = parseInt(month);
      const targetYear = parseInt(year);
      const startDate = new Date(targetYear, targetMonth - 1, 1);
      const endDate = new Date(targetYear, targetMonth, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    const csvHeader = 'Date,Category,Description,Amount,Payment Method\n';
    const csvRows = expenses.map(exp => {
      return `${exp.date.toISOString().split('T')[0]},${exp.category},"${exp.description}",${exp.amount},${exp.paymentMethod}`;
    }).join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=expenses.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMonthlyReport, exportExpenses };
