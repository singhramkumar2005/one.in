const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const { protect, authorize } = require('../middleware/auth');

// Create test (Admin only)
router.post('/tests', protect, authorize('admin'), async (req, res) => {
  try {
    const test = await Test.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      test
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Update test
router.put('/tests/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    res.json({
      success: true,
      test
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Delete test
router.delete('/tests/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    res.json({
      success: true,
      message: 'Test deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

module.exports = router;
