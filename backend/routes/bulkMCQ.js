const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

/**
 * Parse bulk MCQ questions with answer sheet
 * Format: 
 * Questions: Q1. Question text? A) Option1 B) Option2 C) Option3 D) Option4
 * Answer Sheet: BBCACBBCCD (one letter per question)
 */
router.post('/parse-bulk-mcq', protect, authorize('admin'), async (req, res) => {
  try {
    const { bulkText, answerSheet, language } = req.body;

    if (!bulkText || typeof bulkText !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Question text is required'
      });
    }

    if (!answerSheet || typeof answerSheet !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Answer sheet is required'
      });
    }

    // Parse questions with options
    // Matches: Q1. Question text? A) Option B) Option C) Option D) Option
    const questionRegex = /Q(\d+)\.\s*(.+?)\s+A\)\s*(.+?)\s+B\)\s*(.+?)\s+C\)\s*(.+?)\s+D\)\s*(.+?)(?=Q\d+\.|$)/gis;
    const matches = [...bulkText.matchAll(questionRegex)];

    if (matches.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid questions found. Please use format: Q1. Question? A) Option B) Option C) Option D) Option'
      });
    }

    // Clean and parse answer sheet
    const cleanAnswerSheet = answerSheet
      .toUpperCase()
      .replace(/[^ABCD]/g, '') // Remove everything except A, B, C, D
      .split('');

    if (cleanAnswerSheet.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Answer sheet must contain letters A, B, C, or D'
      });
    }

    if (cleanAnswerSheet.length !== matches.length) {
      return res.status(400).json({
        success: false,
        message: `Mismatch: Found ${matches.length} questions but ${cleanAnswerSheet.length} answers. They must match.`
      });
    }

    // Map answers (A=0, B=1, C=2, D=3)
    const answerMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };

    // Parse questions with matched answers
    const questionsWithOptions = matches.map((match, index) => {
      const questionNumber = parseInt(match[1]);
      const questionText = match[2].trim();
      const optionA = match[3].trim();
      const optionB = match[4].trim();
      const optionC = match[5].trim();
      const optionD = match[6].trim();

      // Get correct answer for this question
      const correctAnswerLetter = cleanAnswerSheet[index];
      const correctAnswerIndex = answerMap[correctAnswerLetter];

      // Create options array with correct answer marked
      const options = [
        { optionText: optionA, isCorrect: correctAnswerIndex === 0 },
        { optionText: optionB, isCorrect: correctAnswerIndex === 1 },
        { optionText: optionC, isCorrect: correctAnswerIndex === 2 },
        { optionText: optionD, isCorrect: correctAnswerIndex === 3 }
      ];

      return {
        questionNumber: index + 1,
        questionText: questionText,
        questionType: 'single',
        options: options,
        marks: {
          positive: 1,
          negative: 0.25
        },
        difficulty: 'medium',
        tags: [language || 'General'],
        correctAnswerLetter: correctAnswerLetter // For preview
      };
    });

    res.json({
      success: true,
      message: `Successfully parsed ${questionsWithOptions.length} questions`,
      questions: questionsWithOptions,
      summary: {
        totalQuestions: questionsWithOptions.length,
        format: 'Multiple Choice (4 options)',
        language: language || 'General',
        answerSheet: cleanAnswerSheet.join('')
      }
    });

  } catch (error) {
    console.error('Error parsing bulk MCQ questions:', error);
    res.status(500).json({
      success: false,
      message: 'Error parsing questions',
      error: error.message
    });
  }
});

module.exports = router;
