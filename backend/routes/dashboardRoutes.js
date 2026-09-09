const express = require('express');
const router = express.Router();
const { getSummary, getCategorySummary, getMonthlySummary, getRecentExpenses } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/summary', protect, getSummary);
router.get('/category-summary', protect, getCategorySummary);
router.get('/monthly-summary', protect, getMonthlySummary);
router.get('/recent-expenses', protect, getRecentExpenses);

module.exports = router;
