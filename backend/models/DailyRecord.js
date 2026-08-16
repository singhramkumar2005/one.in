const mongoose = require('mongoose');

const DailyRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
    index: true
  },
  studyMinutes: {
    type: Number,
    default: 0
  },
  focusRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4
  },
  dailyNotes: {
    type: String,
    default: ''
  },
  topicsCovered: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['productive', 'average', 'revision_day', 'rest_day'],
    default: 'productive'
  }
}, {
  timestamps: true
});

// Unique compound index for user + date
DailyRecordSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyRecord', DailyRecordSchema);
