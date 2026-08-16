const mongoose = require('mongoose');

const subTopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  totalLectures: {
    type: Number,
    required: true,
    min: 1
  },
  completedLectures: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    default: ''
  }
});

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  totalLectures: {
    type: Number,
    required: true,
    min: 1
  },
  completedLectures: {
    type: Number,
    default: 0,
    min: 0
  },
  color: {
    type: String,
    default: '#3B82F6' // Blue color as default
  },
  subTopics: [subTopicSchema],
  notes: {
    type: String,
    default: ''
  }
});

const dailyProgressSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  lecturesCompleted: {
    type: Number,
    default: 0
  },
  subjects: [{
    subjectId: mongoose.Schema.Types.ObjectId,
    lecturesCompleted: Number
  }]
});

const syllabusSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  subjects: [subjectSchema],
  targetDays: {
    type: Number,
    required: [true, 'Please provide target days'],
    min: 1
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  dailyProgress: [dailyProgressSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  completionStatus: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'overdue'],
    default: 'not_started'
  },
  totalLectures: {
    type: Number,
    default: 0
  },
  completedLectures: {
    type: Number,
    default: 0
  },
  dailyTarget: {
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

// Update timestamps on save
syllabusSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate total lectures from all subjects
  this.totalLectures = this.subjects.reduce((total, subject) => total + subject.totalLectures, 0);
  
  // Calculate completed lectures from all subjects
  this.completedLectures = this.subjects.reduce((total, subject) => total + subject.completedLectures, 0);
  
  // Calculate daily target
  if (this.targetDays && this.totalLectures) {
    this.dailyTarget = Math.ceil(this.totalLectures / this.targetDays);
  }
  
  // Set end date
  if (this.startDate && this.targetDays) {
    this.endDate = new Date(this.startDate);
    this.endDate.setDate(this.endDate.getDate() + this.targetDays);
  }
  
  // Update completion status
  if (this.completedLectures === 0) {
    this.completionStatus = 'not_started';
  } else if (this.completedLectures >= this.totalLectures) {
    this.completionStatus = 'completed';
  } else if (new Date() > this.endDate) {
    this.completionStatus = 'overdue';
  } else {
    this.completionStatus = 'in_progress';
  }
  
  next();
});

// Method to calculate completion percentage
syllabusSchema.methods.getCompletionPercentage = function() {
  if (this.totalLectures === 0) return 0;
  return Math.round((this.completedLectures / this.totalLectures) * 100);
};

// Method to get subject completion percentage
syllabusSchema.methods.getSubjectCompletionPercentage = function(subjectId) {
  const subject = this.subjects.id(subjectId);
  if (!subject || subject.totalLectures === 0) return 0;
  return Math.round((subject.completedLectures / subject.totalLectures) * 100);
};

// Method to calculate days remaining
syllabusSchema.methods.getDaysRemaining = function() {
  const today = new Date();
  const diffTime = this.endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// Method to calculate days elapsed
syllabusSchema.methods.getDaysElapsed = function() {
  const today = new Date();
  const diffTime = today - this.startDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// Method to check if on track
syllabusSchema.methods.isOnTrack = function() {
  const daysElapsed = this.getDaysElapsed();
  const expectedCompleted = daysElapsed * this.dailyTarget;
  return this.completedLectures >= expectedCompleted;
};

module.exports = mongoose.model('Syllabus', syllabusSchema);
