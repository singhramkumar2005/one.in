const express = require('express');
const router = express.Router();
const TestAttempt = require('../models/TestAttempt');
const Test = require('../models/Test');
const { protect } = require('../middleware/auth');

// Get user's test history
router.get('/my-tests', protect, async (req, res) => {
  try {
    const attempts = await TestAttempt.find({
      user: req.user.id,
      status: 'submitted'
    })
    .populate('test', 'title examType duration totalMarks')
    .sort({ submittedAt: -1 });

    res.json({
      success: true,
      attempts
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get detailed result with answers
router.get('/:attemptId/detailed', protect, async (req, res) => {
  try {
    const attempt = await TestAttempt.findOne({
      _id: req.params.attemptId,
      user: req.user.id,
      status: 'submitted'
    }).populate('test');

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    // Get test with correct answers
    const test = await Test.findById(attempt.test._id);

    // Prepare detailed result
    const detailedResult = {
      attempt,
      questions: []
    };

    test.sections.forEach(section => {
      section.questions.forEach(question => {
        const response = attempt.responses.find(
          r => r.questionId.toString() === question._id.toString()
        );

        detailedResult.questions.push({
          question: question,
          userAnswer: response ? response.selectedAnswer : null,
          isCorrect: response ? response.isCorrect : false,
          marksAwarded: response ? response.marksAwarded : 0,
          timeSpent: response ? response.timeSpent : 0,
          status: response ? response.status : 'not-visited'
        });
      });
    });

    res.json({
      success: true,
      result: detailedResult
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get all attempts for a specific test (for reattempt feature)
router.get('/test/:testId/attempts', protect, async (req, res) => {
  try {
    const attempts = await TestAttempt.find({
      user: req.user.id,
      test: req.params.testId,
      status: 'submitted'
    })
    .populate('test', 'title examType duration totalMarks allowedAttempts')
    .sort({ submittedAt: -1 });

    // Get test details to check allowed attempts
    const test = await Test.findById(req.params.testId);
    
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    // Check if user can attempt again
    const canReattempt = attempts.length < test.allowedAttempts;

    res.json({
      success: true,
      attempts,
      totalAttempts: attempts.length,
      allowedAttempts: test.allowedAttempts,
      canReattempt,
      test: {
        id: test._id,
        title: test.title,
        examType: test.examType,
        duration: test.duration,
        totalMarks: test.totalMarks
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

// Compare all attempts for a test (Analysis feature)
router.get('/test/:testId/analysis', protect, async (req, res) => {
  try {
    const attempts = await TestAttempt.find({
      user: req.user.id,
      test: req.params.testId,
      status: 'submitted'
    })
    .populate('test', 'title examType duration totalMarks')
    .sort({ submittedAt: 1 }); // Sort by oldest first for progression view

    if (attempts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No attempts found for this test'
      });
    }

    // Calculate analytics
    const analysis = {
      testInfo: {
        id: attempts[0].test._id,
        title: attempts[0].test.title,
        examType: attempts[0].test.examType,
        totalMarks: attempts[0].test.totalMarks
      },
      totalAttempts: attempts.length,
      attempts: attempts.map((attempt, index) => ({
        attemptNumber: attempt.attemptNumber,
        attemptId: attempt._id,
        submittedAt: attempt.submittedAt,
        score: attempt.score.total,
        percentage: attempt.score.percentage,
        timeSpent: attempt.totalTimeSpent,
        statistics: attempt.statistics
      })),
      overall: {
        bestScore: Math.max(...attempts.map(a => a.score.total)),
        worstScore: Math.min(...attempts.map(a => a.score.total)),
        averageScore: (attempts.reduce((sum, a) => sum + a.score.total, 0) / attempts.length).toFixed(2),
        bestPercentage: Math.max(...attempts.map(a => a.score.percentage)),
        averagePercentage: (attempts.reduce((sum, a) => sum + parseFloat(a.score.percentage), 0) / attempts.length).toFixed(2),
        improvement: attempts.length > 1 
          ? (attempts[attempts.length - 1].score.total - attempts[0].score.total).toFixed(2)
          : 0,
        improvementPercentage: attempts.length > 1 
          ? ((attempts[attempts.length - 1].score.percentage - attempts[0].score.percentage)).toFixed(2)
          : 0
      },
      trends: {
        scoreProgression: attempts.map(a => ({
          attempt: a.attemptNumber,
          score: a.score.total,
          percentage: a.score.percentage
        })),
        accuracyProgression: attempts.map(a => ({
          attempt: a.attemptNumber,
          accuracy: a.statistics.accuracy
        })),
        timeProgression: attempts.map(a => ({
          attempt: a.attemptNumber,
          timeSpent: a.totalTimeSpent
        }))
      },
      strengths: {
        bestAttempt: attempts.reduce((best, current) => 
          current.score.total > best.score.total ? current : best
        ),
        highestAccuracy: attempts.reduce((best, current) => 
          current.statistics.accuracy > best.statistics.accuracy ? current : best
        )
      }
    };

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get question-wise analysis across all attempts
router.get('/test/:testId/question-analysis', protect, async (req, res) => {
  try {
    const attempts = await TestAttempt.find({
      user: req.user.id,
      test: req.params.testId,
      status: 'submitted'
    }).populate('test');

    if (attempts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No attempts found for this test'
      });
    }

    const test = await Test.findById(req.params.testId);

    // Analyze each question across all attempts
    const questionAnalysis = [];

    test.sections.forEach(section => {
      section.questions.forEach(question => {
        const questionStats = {
          questionId: question._id,
          questionNumber: question.questionNumber,
          questionText: question.questionText,
          section: section.name,
          difficulty: question.difficulty,
          attempts: []
        };

        let correctCount = 0;
        let totalAttempted = 0;
        let totalTimeSpent = 0;

        attempts.forEach(attempt => {
          const response = attempt.responses.find(
            r => r.questionId.toString() === question._id.toString()
          );

          if (response) {
            const wasAttempted = response.status === 'answered' || response.status === 'marked-answered';
            
            if (wasAttempted) {
              totalAttempted++;
              if (response.isCorrect) correctCount++;
            }
            
            totalTimeSpent += response.timeSpent || 0;

            questionStats.attempts.push({
              attemptNumber: attempt.attemptNumber,
              wasAttempted,
              isCorrect: response.isCorrect,
              marksAwarded: response.marksAwarded,
              timeSpent: response.timeSpent,
              status: response.status
            });
          }
        });

        questionStats.summary = {
          timesAttempted: totalAttempted,
          timesCorrect: correctCount,
          timesIncorrect: totalAttempted - correctCount,
          successRate: totalAttempted > 0 ? ((correctCount / totalAttempted) * 100).toFixed(2) : 0,
          averageTimeSpent: totalAttempted > 0 ? (totalTimeSpent / totalAttempted).toFixed(2) : 0
        };

        questionAnalysis.push(questionStats);
      });
    });

    res.json({
      success: true,
      questionAnalysis,
      testInfo: {
        title: test.title,
        totalAttempts: attempts.length
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
