const express = require('express');
const router = express.Router();
const ocrService = require('../services/ocrService');
const upload = require('../config/upload');
const { protect, authorize } = require('../middleware/auth');
const Test = require('../models/Test');
const fs = require('fs');

// Upload and extract questions from image or PDF
router.post('/upload-questions', protect, authorize('admin'), upload.single('questionSheet'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('Processing question sheet:', req.file.filename);
    console.log('File type:', req.file.mimetype);

    // Extract text using OCR (auto-detects PDF or image)
    const { text, confidence, pages } = await ocrService.extractTextFromFile(req.file.path);

    // Parse questions
    const questions = ocrService.parseQuestions(text);

    // Validate
    const validation = ocrService.validateQuestions(questions);

    // Clean up uploaded file (optional - keep for debugging)
    // fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      questions,
      extractedText: text,
      confidence,
      pages: pages || 1,
      fileType: req.file.mimetype,
      validation,
      totalQuestions: questions.length
    });

  } catch (error) {
    console.error('Upload questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process question sheet',
      error: error.message
    });
  }
});

// Upload and extract solutions from image or PDF
router.post('/upload-solutions', protect, authorize('admin'), upload.single('solutionSheet'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('Processing solution sheet:', req.file.filename);
    console.log('File type:', req.file.mimetype);

    // Extract text using OCR (auto-detects PDF or image)
    const { text, confidence, pages } = await ocrService.extractTextFromFile(req.file.path);

    // Parse solutions
    const solutions = ocrService.parseSolutions(text);

    // Clean up uploaded file (optional)
    // fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      solutions,
      extractedText: text,
      confidence,
      pages: pages || 1,
      fileType: req.file.mimetype,
      totalSolutions: solutions.length
    });

  } catch (error) {
    console.error('Upload solutions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process solution sheet',
      error: error.message
    });
  }
});

// Match questions with solutions
router.post('/match', protect, authorize('admin'), async (req, res) => {
  try {
    const { questions, solutions } = req.body;

    if (!questions || !solutions) {
      return res.status(400).json({
        success: false,
        message: 'Questions and solutions are required'
      });
    }

    // Match them
    const matched = ocrService.matchQuestionsWithSolutions(questions, solutions);

    // Validate
    const validation = ocrService.validateQuestions(matched);

    res.json({
      success: true,
      matched,
      validation,
      stats: {
        totalQuestions: matched.length,
        matchedCount: matched.filter(q => q.matched).length,
        unmatchedCount: matched.filter(q => !q.matched).length
      }
    });

  } catch (error) {
    console.error('Match error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to match questions with solutions',
      error: error.message
    });
  }
});

// Create test from OCR data
router.post('/create-test', protect, authorize('admin'), async (req, res) => {
  try {
    const { title, description, examType, duration, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title and questions are required'
      });
    }

    // Validate questions
    const validation = ocrService.validateQuestions(questions);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Question validation failed',
        errors: validation.errors
      });
    }

    // Transform questions to test format
    const formattedQuestions = questions.map((q, index) => ({
      questionNumber: index + 1,
      questionText: q.questionText,
      questionType: 'single',
      options: q.options.map(opt => ({
        optionText: opt.text,
        isCorrect: opt.isCorrect || false
      })),
      explanation: q.explanation || '',
      marks: {
        positive: 1,
        negative: 0.25
      },
      difficulty: 'medium',
      tags: q.examSource ? [q.examSource] : []
    }));

    // Calculate total marks
    const totalMarks = formattedQuestions.reduce((sum, q) => sum + q.marks.positive, 0);

    // Create test
    const test = await Test.create({
      title,
      description: description || `Imported from OCR - ${questions.length} questions`,
      examType: examType || 'Other',
      difficulty: 'mixed',
      duration: duration || 60,
      totalMarks,
      sections: [{
        name: 'Section 1',
        description: 'Main Section',
        questions: formattedQuestions,
        order: 1
      }],
      instructions: [
        'Read each question carefully',
        'Each question carries 1 mark',
        'Wrong answer will deduct 0.25 marks',
        'You can review and change answers before submission'
      ],
      createdBy: req.user.id,
      allowedAttempts: 999
    });

    res.status(201).json({
      success: true,
      message: 'Test created successfully from OCR data',
      test
    });

  } catch (error) {
    console.error('Create test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create test',
      error: error.message
    });
  }
});

// Get extracted text (for debugging)
router.post('/extract-text', protect, authorize('admin'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { text, confidence } = await ocrService.extractTextFromImage(req.file.path);

    res.json({
      success: true,
      text,
      confidence
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to extract text',
      error: error.message
    });
  }
});

module.exports = router;
