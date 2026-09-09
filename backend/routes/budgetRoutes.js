const express = require('express');
const router = express.Router();
const { createBudget, getBudgets, getBudget, updateBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBudget);
router.get('/', protect, getBudgets);
router.get('/:id', protect, getBudget);
router.put('/:id', protect, updateBudget);

module.exports = router;
