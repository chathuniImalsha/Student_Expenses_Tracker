const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const Saving = require('../models/Saving');

const getSummary = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const totalSpent = await Expense.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const thisMonthSpent = await Expense.aggregate([
      {
        $match: {
          userId: req.user._id,
          $expr: {
            $and: [
              { $eq: [{ $month: '$date' }, currentMonth] },
              { $eq: [{ $year: '$date' }, currentYear] }
            ]
          }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const todaySpent = await Expense.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: today }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const currentBudget = await Budget.findOne({
      userId: req.user._id,
      month: currentMonth,
      year: currentYear
    });

    let remainingBudget = 0;
    if (currentBudget) {
      const monthStart = new Date(currentYear, currentMonth - 1, 1);
      const monthEnd = new Date(currentYear, currentMonth, 0);
      const spentInMonth = await Expense.aggregate([
        {
          $match: {
            userId: req.user._id,
            date: { $gte: monthStart, $lte: monthEnd }
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const spent = spentInMonth.length > 0 ? spentInMonth[0].total : 0;
      remainingBudget = currentBudget.amount - spent;
    }

    const currentMonthSaving = await Saving.findOne({
      userId: req.user._id,
      month: now.toLocaleString('en-US', { month: 'long' }),
      year: currentYear
    });

    res.json({
      success: true,
      data: {
        totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0,
        thisMonth: thisMonthSpent.length > 0 ? thisMonthSpent[0].total : 0,
        today: todaySpent.length > 0 ? todaySpent[0].total : 0,
        remainingBudget,
        currentMonthSaving: currentMonthSaving || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCategorySummary = async (req, res) => {
  try {
    const categories = await Expense.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMonthlySummary = async (req, res) => {
  try {
    const monthlyData = await Expense.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: monthlyData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRecentExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(5);

    res.json({
      success: true,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSummary, getCategorySummary, getMonthlySummary, getRecentExpenses };
