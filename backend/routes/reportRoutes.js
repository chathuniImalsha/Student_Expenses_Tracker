const express = require('express');
const router = express.Router();
const { getMonthlyReport, exportExpenses } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/monthly', protect, getMonthlyReport);
router.get('/export', protect, exportExpenses);

module.exports = router;
