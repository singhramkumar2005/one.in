const express = require('express');
const router = express.Router();
const TestAttempt = require('../models/TestAttempt');
const Test = require('../models/Test');
const { protect } = require('../middleware/auth');

// Start a new test attempt
router.post('/start/:testId', protect, async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId);
    
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    // Check existing attempts
    const existingAttempts = await TestAttempt.countDocuments({
      user: req.user.id,
      test: test._id,
      status: { $in: ['completed', 'submitted'] }
    });

    if (existingAttempts >= test.allowedAttempts) {
      return res.status(400).json({
        success: false,
        message: 'Maximum attempts reached for this test'
      });
    }

    // Check for in-progress attempt
    let attempt = await TestAttempt.findOne({
      user: req.user.id,
      test: test._id,
      status: 'in-progress'
    });

    if (attempt) {
      return res.json({
        success: true,
        message: 'Resuming existing attempt',
        attempt
      });
    }

    // Initialize responses for all questions
    const responses = [];
    test.sections.forEach((section, sectionIndex) => {
      section.questions.forEach((question, questionIndex) => {
        responses.push({
          questionId: question._id,
          questionNumber: question.questionNumber,
          status: 'not-visited',
          timeSpent: 0,
          visitCount: 0
        });
      });
    });

    // Create new attempt
    attempt = await TestAttempt.create({
      user: req.user.id,
      test: test._id,
      attemptNumber: existingAttempts + 1,
      responses,
      score: {
        totalMarks: test.totalMarks
      },
      deviceInfo: {
        browser: req.headers['user-agent'],
        ip: req.ip
      }
    });

    res.status(201).json({
      success: true,
      attempt
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Update answer
router.put('/:attemptId/answer', protect, async (req, res) => {
  try {
    const { questionId, selectedAnswer, timeSpent, isMarkedForReview, status } = req.body;

    const attempt = await TestAttempt.findOne({
      _id: req.params.attemptId,
      user: req.user.id,
      status: 'in-progress'
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Test attempt not found or already submitted'
      });
    }

    // Find and update the response
    const responseIndex = attempt.responses.findIndex(
      r => r.questionId.toString() === questionId
    );

    if (responseIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Question not found in this attempt'
      });
    }

    attempt.responses[responseIndex].selectedAnswer = selectedAnswer;
    attempt.responses[responseIndex].timeSpent = timeSpent || 0;
    attempt.responses[responseIndex].isMarkedForReview = isMarkedForReview || false;
    attempt.responses[responseIndex].status = status || 'answered';
    attempt.responses[responseIndex].visitCount += 1;

    await attempt.save();

    res.json({
      success: true,
      message: 'Answer saved successfully',
      attempt
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Submit test
router.post('/:attemptId/submit', protect, async (req, res) => {
  try {
    const attempt = await TestAttempt.findOne({
      _id: req.params.attemptId,
      user: req.user.id
    }).populate('test');

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Test attempt not found'
      });
    }

    if (attempt.status === 'submitted') {
      return res.status(400).json({
        success: false,
        message: 'Test already submitted'
      });
    }

    // Calculate score
    const test = await Test.findById(attempt.test._id);
    
    attempt.responses.forEach((response, index) => {
      const section = test.sections.find(s => 
        s.questions.some(q => q._id.toString() === response.questionId.toString())
      );
      
      if (section) {
        const question = section.questions.find(
          q => q._id.toString() === response.questionId.toString()
        );
        
        if (question && response.selectedAnswer) {
          if (question.questionType === 'single') {
            const correctOption = question.options.find(o => o.isCorrect);
            if (correctOption && correctOption._id.toString() === response.selectedAnswer) {
              response.isCorrect = true;
              response.marksAwarded = question.marks.positive;
            } else {
              response.isCorrect = false;
              response.marksAwarded = -question.marks.negative;
            }
          } else if (question.questionType === 'multiple') {
            const correctOptionIds = question.options
              .filter(o => o.isCorrect)
              .map(o => o._id.toString());
            const selectedIds = Array.isArray(response.selectedAnswer) 
              ? response.selectedAnswer 
              : [response.selectedAnswer];
            
            const isCorrect = correctOptionIds.length === selectedIds.length &&
              correctOptionIds.every(id => selectedIds.includes(id));
            
            response.isCorrect = isCorrect;
            response.marksAwarded = isCorrect 
              ? question.marks.positive 
              : -question.marks.negative;
          }
        }
      }
    });

    // Calculate statistics
    attempt.calculateScore();
    attempt.status = 'submitted';
    attempt.endTime = new Date();
    attempt.submittedAt = new Date();

    await attempt.save();

    res.json({
      success: true,
      message: 'Test submitted successfully',
      attempt
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get attempt details
router.get('/:attemptId', protect, async (req, res) => {
  try {
    const attempt = await TestAttempt.findOne({
      _id: req.params.attemptId,
      user: req.user.id
    }).populate('test');

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Test attempt not found'
      });
    }

    res.json({
      success: true,
      attempt
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Log violation (tab switching, etc.)
router.post('/:attemptId/log-violation', protect, async (req, res) => {
  try {
    const { violationType, timestamp } = req.body;

    const attempt = await TestAttempt.findOne({
      _id: req.params.attemptId,
      user: req.user.id
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Test attempt not found'
      });
    }

    // Initialize violations array if not exists
    if (!attempt.violations) {
      attempt.violations = [];
    }

    // Add violation
    attempt.violations.push({
      type: violationType,
      timestamp: timestamp || new Date()
    });

    await attempt.save();

    res.json({
      success: true,
      message: 'Violation logged'
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
