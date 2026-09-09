const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: Number,
    required: [true, 'Please provide a month'],
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: [true, 'Please provide a year']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide a budget amount'],
    min: [0.01, 'Budget must be greater than 0']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

budgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
