const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  questionImage: String,
  questionType: {
    type: String,
    enum: ['single', 'multiple', 'numerical', 'descriptive'],
    default: 'single'
  },
  options: [{
    optionText: String,
    optionImage: String,
    isCorrect: Boolean
  }],
  correctAnswer: String, // For numerical/descriptive
  explanation: String,
  marks: {
    positive: {
      type: Number,
      default: 1
    },
    negative: {
      type: Number,
      default: 0.25
    }
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [String],
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section'
  }
});

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  duration: Number, // in minutes
  questions: [questionSchema],
  order: Number
});

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  examType: {
    type: String,
    required: true,
    enum: ['SSC', 'Banking', 'Railway', 'Teaching', 'Defense', 'Other']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'mixed'],
    default: 'medium'
  },
  duration: {
    type: Number,
    required: true // in minutes
  },
  totalMarks: {
    type: Number,
    required: true
  },
  sections: [sectionSchema],
  instructions: [String],
  isPaid: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    default: 0
  },
  thumbnail: String,
  language: {
    type: String,
    enum: ['English', 'Hindi', 'Both'],
    default: 'English'
  },
  allowedAttempts: {
    type: Number,
    default: 999 // Practically unlimited attempts by default
  },
  showAnswers: {
    type: Boolean,
    default: true
  },
  shuffleQuestions: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attemptedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  totalAttempts: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
testSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Test', testSchema);
