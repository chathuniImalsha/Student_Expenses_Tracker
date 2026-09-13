const express = require('express');
const router = express.Router();
const {
  createSaving,
  getSavings,
  getSavingById,
  updateSaving,
  deleteSaving,
  getCurrentMonthSaving,
  addSavings
} = require('../controllers/savingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getSavings)
  .post(protect, createSaving);

router.route('/current')
  .get(protect, getCurrentMonthSaving);

router.route('/:id')
  .get(protect, getSavingById)
  .put(protect, updateSaving)
  .delete(protect, deleteSaving);

router.route('/:id/add')
  .post(protect, addSavings);

module.exports = router;