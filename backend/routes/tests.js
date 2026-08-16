const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const { protect, authorize } = require('../middleware/auth');

// Get all tests
router.get('/', protect, async (req, res) => {
  try {
    const { examType, difficulty, search, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };

    if (examType) query.examType = examType;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tests = await Test.find(query)
      .select('-sections.questions.correctAnswer -sections.questions.explanation')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Test.countDocuments(query);

    res.json({
      success: true,
      tests,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get single test (without answers)
router.get('/:id', protect, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .select('-sections.questions.correctAnswer -sections.questions.explanation -sections.questions.options.isCorrect');

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

// Get test instructions
router.get('/:id/instructions', protect, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .select('title description duration totalMarks sections instructions examType');

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    // Get section summary without questions
    const sectionSummary = test.sections.map(section => ({
      name: section.name,
      description: section.description,
      duration: section.duration,
      totalQuestions: section.questions.length
    }));

    res.json({
      success: true,
      test: {
        ...test.toObject(),
        sections: sectionSummary
      }
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
