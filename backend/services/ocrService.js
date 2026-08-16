const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

class OCRService {
  /**
   * Check if file is PDF
   */
  isPDF(filePath) {
    return path.extname(filePath).toLowerCase() === '.pdf';
  }

  /**
   * Extract text from image using Tesseract OCR
   */
  async extractTextFromImage(imagePath) {
    try {
      console.log('Starting OCR for:', imagePath);
      
      const result = await Tesseract.recognize(
        imagePath,
        'eng', // Language
        {
          logger: m => console.log(m) // Progress logger
        }
      );

      console.log('OCR completed. Confidence:', result.data.confidence);
      return {
        text: result.data.text,
        confidence: result.data.confidence
      };
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  /**
   * Extract text from file (auto-detect PDF or image)
   */
  async extractTextFromFile(filePath) {
    if (this.isPDF(filePath)) {
      throw new Error('PDF support coming soon. Please convert PDF to image (PNG/JPG) and upload again.');
    } else {
      return await this.extractTextFromImage(filePath);
    }
  }

  /**
   * Parse questions from extracted text
   */
  parseQuestions(text) {
    const questions = [];
    
    // Split by question numbers (Q.19, Q.20, etc.)
    const questionRegex = /Q\.(\d+)\.\s*(.*?)(?=Q\.\d+\.|$)/gs;
    const matches = [...text.matchAll(questionRegex)];

    matches.forEach(match => {
      const questionNumber = parseInt(match[1]);
      const questionBlock = match[2].trim();

      // Extract question text (everything before options)
      const optionsStart = questionBlock.search(/\([a-d]\)\s*\(/);
      const questionText = optionsStart > -1 
        ? questionBlock.substring(0, optionsStart).trim()
        : questionBlock.trim();

      // Extract options: (a) (1), (b) (2), (c) (3), (d) (4)
      const options = [];
      const optionRegex = /\(([a-d])\)\s*\((\d+)\)/g;
      let optionMatch;

      while ((optionMatch = optionRegex.exec(questionBlock)) !== null) {
        options.push({
          label: optionMatch[1],
          text: `(${optionMatch[2]})`,
          value: optionMatch[2]
        });
      }

      // Extract exam source (SSC CGL 15/09/2025)
      const sourceRegex = /(SSC|IBPS|RRB|Banking|Railway).*?(\d{2}\/\d{2}\/\d{4}).*?(?:\(Shift\s+\d+\))?/i;
      const sourceMatch = questionBlock.match(sourceRegex);
      const examSource = sourceMatch ? sourceMatch[0].trim() : '';

      if (questionText) {
        questions.push({
          questionNumber,
          questionText: this.cleanText(questionText),
          options: options.length > 0 ? options : this.createDefaultOptions(),
          examSource: examSource,
          raw: questionBlock // Keep raw text for manual editing
        });
      }
    });

    return questions;
  }

  /**
   * Parse solutions from extracted text
   */
  parseSolutions(text) {
    const solutions = [];
    
    // Split by solution numbers (Sol.19, Sol.20, etc.)
    const solutionRegex = /Sol\.(\d+)\.\s*\(([a-d])\)\s*\((\d+)\)\s*[-–]?\s*(.*?)(?=Sol\.\d+\.|$)/gs;
    const matches = [...text.matchAll(solutionRegex)];

    matches.forEach(match => {
      const questionNumber = parseInt(match[1]);
      const correctOption = match[2]; // a, b, c, or d
      const correctValue = match[3]; // 1, 2, 3, or 4
      const explanation = match[4].trim();

      solutions.push({
        questionNumber,
        correctAnswer: correctOption,
        correctValue: correctValue,
        explanation: this.cleanText(explanation),
        raw: match[0] // Keep raw text
      });
    });

    return solutions;
  }

  /**
   * Match questions with their solutions
   */
  matchQuestionsWithSolutions(questions, solutions) {
    const matched = questions.map(question => {
      const solution = solutions.find(s => s.questionNumber === question.questionNumber);
      
      if (solution) {
        // Mark the correct option
        const updatedOptions = question.options.map(opt => ({
          ...opt,
          isCorrect: opt.label === solution.correctAnswer
        }));

        return {
          ...question,
          options: updatedOptions,
          correctAnswer: solution.correctAnswer,
          explanation: solution.explanation,
          matched: true
        };
      }

      return {
        ...question,
        matched: false
      };
    });

    return matched;
  }

  /**
   * Clean and normalize text
   */
  cleanText(text) {
    return text
      .replace(/\s+/g, ' ') // Multiple spaces to single
      .replace(/\n+/g, ' ') // Newlines to space
      .replace(/[\/]{2,}/g, '/') // Multiple slashes
      .trim();
  }

  /**
   * Create default options if not detected
   */
  createDefaultOptions() {
    return [
      { label: 'a', text: '(1)', value: '1', isCorrect: false },
      { label: 'b', text: '(2)', value: '2', isCorrect: false },
      { label: 'c', text: '(3)', value: '3', isCorrect: false },
      { label: 'd', text: '(4)', value: '4', isCorrect: false }
    ];
  }

  /**
   * Validate parsed questions
   */
  validateQuestions(questions) {
    const errors = [];

    questions.forEach((q, index) => {
      if (!q.questionText) {
        errors.push(`Question ${q.questionNumber}: Missing question text`);
      }
      if (q.options.length !== 4) {
        errors.push(`Question ${q.questionNumber}: Should have 4 options, found ${q.options.length}`);
      }
      const correctOptions = q.options.filter(opt => opt.isCorrect);
      if (correctOptions.length === 0) {
        errors.push(`Question ${q.questionNumber}: No correct answer marked`);
      }
      if (correctOptions.length > 1) {
        errors.push(`Question ${q.questionNumber}: Multiple correct answers marked`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = new OCRService();
