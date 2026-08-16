const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

/**
 * Parse bulk English vocabulary questions
 * Format: Q1. [Question] Ans. [Answer] — [Hindi translation]
 * Automatically creates 4 options (1 correct + 3 wrong from other answers)
 */
router.post('/parse-bulk-english', protect, authorize('admin'), async (req, res) => {
  try {
    const { bulkText } = req.body;

    if (!bulkText || typeof bulkText !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Bulk text is required'
      });
    }

    // Parse questions using regex
    // Matches: Q1. [question text] Ans. [answer] — [hindi]
    const questionRegex = /Q\d+\.\s*(.+?)\s+Ans\.\s+([^—\n]+)(?:\s*—\s*([^\n]+))?/gi;
    const matches = [...bulkText.matchAll(questionRegex)];

    if (matches.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid questions found. Please use format: Q1. [Question] Ans. [Answer] — [Hindi]'
      });
    }

    // Extract all questions and answers
    const parsedQuestions = matches.map((match, index) => ({
      questionNumber: index + 1,
      questionText: match[1].trim(),
      correctAnswer: match[2].trim(),
      hindiTranslation: match[3] ? match[3].trim() : ''
    }));

    // Collect all answers for creating wrong options
    const allAnswers = parsedQuestions.map(q => q.correctAnswer);

    // Generate 4 options for each question (1 correct + 3 wrong)
    const questionsWithOptions = parsedQuestions.map((question, index) => {
      // Get the correct answer
      const correctAnswer = question.correctAnswer;

      // Get 3 random wrong answers from other questions
      const wrongAnswers = [];
      const availableAnswers = allAnswers.filter((ans, idx) => idx !== index);
      
      // Shuffle and pick 3 random wrong answers
      const shuffled = [...availableAnswers].sort(() => Math.random() - 0.5);
      for (let i = 0; i < Math.min(3, shuffled.length); i++) {
        wrongAnswers.push(shuffled[i]);
      }

      // If we don't have enough wrong answers, add generic placeholders
      while (wrongAnswers.length < 3) {
        wrongAnswers.push(`Option ${wrongAnswers.length + 1}`);
      }

      // Create all 4 options
      const allOptions = [
        { optionText: correctAnswer, isCorrect: true },
        { optionText: wrongAnswers[0], isCorrect: false },
        { optionText: wrongAnswers[1], isCorrect: false },
        { optionText: wrongAnswers[2], isCorrect: false }
      ];

      // Shuffle options so correct answer isn't always first
      const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

      return {
        questionNumber: question.questionNumber,
        questionText: question.questionText,
        questionType: 'single',
        options: shuffledOptions,
        marks: {
          positive: 1,
          negative: 0.25
        },
        difficulty: 'medium',
        tags: ['English', 'Vocabulary'],
        explanation: question.hindiTranslation ? `Hindi: ${question.hindiTranslation}` : ''
      };
    });

    res.json({
      success: true,
      message: `Successfully parsed ${questionsWithOptions.length} questions`,
      questions: questionsWithOptions,
      summary: {
        totalQuestions: questionsWithOptions.length,
        format: 'Multiple Choice (4 options)',
        subject: 'English Vocabulary'
      }
    });

  } catch (error) {
    console.error('Error parsing bulk English questions:', error);
    res.status(500).json({
      success: false,
      message: 'Error parsing questions',
      error: error.message
    });
  }
});

module.exports = router;
