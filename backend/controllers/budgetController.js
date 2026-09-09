const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

const createBudget = async (req, res) => {
  try {
    const { month, year, amount } = req.body;

    const existingBudget = await Budget.findOne({
      userId: req.user._id,
      month,
      year
    });

    if (existingBudget) {
      return res.status(400).json({ success: false, message: 'Budget for this month already exists' });
    }

    const budget = await Budget.create({
      userId: req.user._id,
      month,
      year,
      amount
    });

    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      data: budget
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id }).sort({ year: -1, month: -1 });

    res.json({
      success: true,
      data: budgets
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user._id });

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    const startDate = new Date(budget.year, budget.month - 1, 1);
    const endDate = new Date(budget.year, budget.month, 0);

    const spent = await Expense.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const totalSpent = spent.length > 0 ? spent[0].total : 0;
    const remaining = budget.amount - totalSpent;
    const usagePercentage = (totalSpent / budget.amount) * 100;

    res.json({
      success: true,
      data: {
        ...budget.toObject(),
        spent: totalSpent,
        remaining,
        usagePercentage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBudget = async (req, res) => {
  try {
    let budget = await Budget.findOne({ _id: req.params.id, userId: req.user._id });

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Budget updated successfully',
      data: budget
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createBudget, getBudgets, getBudget, updateBudget };
