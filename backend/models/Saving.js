const mongoose = require('mongoose');

const savingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  targetAmount: {
    type: Number,
    required: true,
    default: 0
  },
  savedAmount: {
    type: Number,
    required: true,
    default: 0
  },
  description: {
    type: String,
    trim: true
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

savingSchema.index({ userId: 1, month: 1, year: 1 });

savingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Saving', savingSchema);