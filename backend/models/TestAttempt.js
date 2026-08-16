const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  questionNumber: Number,
  selectedAnswer: mongoose.Schema.Types.Mixed, // Can be string, array, or number
  isCorrect: Boolean,
  marksAwarded: Number,
  timeSpent: Number, // in seconds
  isMarkedForReview: {
    type: Boolean,
    default: false
  },
  visitCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['not-visited', 'not-answered', 'answered', 'marked', 'marked-answered'],
    default: 'not-visited'
  }
});

const sectionAttemptSchema = new mongoose.Schema({
  sectionId: mongoose.Schema.Types.ObjectId,
  sectionName: String,
  timeSpent: Number, // in seconds
  answers: [answerSchema],
  score: Number,
  accuracy: Number,
  attempted: Number,
  correct: Number,
  incorrect: Number,
  skipped: Number
});

const testAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  attemptNumber: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['in-progress', 'paused', 'completed', 'submitted', 'expired'],
    default: 'in-progress'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  pausedTime: Number, // Total paused time in seconds
  pauseCount: {
    type: Number,
    default: 0
  },
  totalTimeSpent: Number, // in seconds
  sections: [sectionAttemptSchema],
  currentSection: {
    type: Number,
    default: 0
  },
  currentQuestion: {
    type: Number,
    default: 1
  },
  score: {
    total: Number,
    percentage: Number,
    rank: Number,
    totalMarks: Number
  },
  statistics: {
    totalQuestions: Number,
    attempted: Number,
    correct: Number,
    incorrect: Number,
    skipped: Number,
    markedForReview: Number,
    accuracy: Number,
    speed: Number // questions per minute
  },
  responses: [answerSchema],
  snapshots: [{
    timestamp: Date,
    currentQuestion: Number,
    answers: [answerSchema]
  }],
  deviceInfo: {
    browser: String,
    os: String,
    ip: String
  },
  violations: [{
    type: String,
    timestamp: Date,
    description: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  submittedAt: Date
});

// Calculate score before saving
testAttemptSchema.methods.calculateScore = function() {
  let totalScore = 0;
  let correct = 0;
  let incorrect = 0;
  let attempted = 0;

  this.responses.forEach(response => {
    if (response.status === 'answered' || response.status === 'marked-answered') {
      attempted++;
      if (response.isCorrect) {
        correct++;
        totalScore += response.marksAwarded;
      } else {
        incorrect++;
        totalScore += response.marksAwarded; // Will be negative
      }
    }
  });

  this.statistics = {
    totalQuestions: this.responses.length,
    attempted,
    correct,
    incorrect,
    skipped: this.responses.length - attempted,
    accuracy: attempted > 0 ? (correct / attempted * 100).toFixed(2) : 0
  };

  this.score.total = totalScore;
  this.score.percentage = ((totalScore / this.score.totalMarks) * 100).toFixed(2);
};

module.exports = mongoose.model('TestAttempt', testAttemptSchema);
