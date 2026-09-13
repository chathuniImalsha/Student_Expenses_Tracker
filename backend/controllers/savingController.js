const Saving = require('../models/Saving');

const createSaving = async (req, res) => {
  try {
    const { month, year, targetAmount, savedAmount, description } = req.body;
    
    const saving = await Saving.create({
      userId: req.user._id,
      month,
      year,
      targetAmount,
      savedAmount: savedAmount || 0,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Saving goal created successfully',
      data: saving
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSavings = async (req, res) => {
  try {
    const savings = await Saving.find({ userId: req.user._id })
      .sort({ year: -1, month: -1 });

    res.json({
      success: true,
      data: savings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSavingById = async (req, res) => {
  try {
    const saving = await Saving.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!saving) {
      return res.status(404).json({ success: false, message: 'Saving goal not found' });
    }

    res.json({
      success: true,
      data: saving
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSaving = async (req, res) => {
  try {
    const { month, year, targetAmount, savedAmount, description } = req.body;

    const saving = await Saving.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { month, year, targetAmount, savedAmount, description },
      { new: true, runValidators: true }
    );

    if (!saving) {
      return res.status(404).json({ success: false, message: 'Saving goal not found' });
    }

    res.json({
      success: true,
      message: 'Saving goal updated successfully',
      data: saving
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSaving = async (req, res) => {
  try {
    const saving = await Saving.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!saving) {
      return res.status(404).json({ success: false, message: 'Saving goal not found' });
    }

    res.json({
      success: true,
      message: 'Saving goal deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCurrentMonthSaving = async (req, res) => {
  try {
    const now = new Date();
    const month = now.toLocaleString('en-US', { month: 'long' });
    const year = now.getFullYear();

    const saving = await Saving.findOne({
      userId: req.user._id,
      month,
      year
    });

    res.json({
      success: true,
      data: saving || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addSavings = async (req, res) => {
  try {
    const { amount } = req.body;
    const { id } = req.params;

    const saving = await Saving.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $inc: { savedAmount: amount } },
      { new: true }
    );

    if (!saving) {
      return res.status(404).json({ success: false, message: 'Saving goal not found' });
    }

    res.json({
      success: true,
      message: 'Savings added successfully',
      data: saving
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSaving,
  getSavings,
  getSavingById,
  updateSaving,
  deleteSaving,
  getCurrentMonthSaving,
  addSavings
};