const mongoose = require('mongoose');

const subjectItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  color: { type: String, default: '#8E4CF6' },
  icon: { type: String, default: 'book' },
  dailyGoal: { type: Number, default: 1 }, // target units/sessions per day
  timingSlot: { type: String, default: '09:00 AM - 10:30 AM' },
  recurringDays: [{ type: Number }], // 0 (Sun) to 6 (Sat)
  totalLectures: { type: Number, default: 0 },
  completedLectures: { type: Number, default: 0 },
  durationMinutes: { type: Number, default: 45 },
  notes: { type: String, default: '' }
});

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'My Study & Attendance Timetable'
  },
  startDate: {
    type: String, // YYYY-MM-DD
    required: true
  },
  endDate: {
    type: String, // YYYY-MM-DD
    required: true
  },
  subjects: [subjectItemSchema],
  
  // Matrix data map: { "2026-05-01": { "subject_id_1": { checked: true, count: 1, notes: "" } } }
  logs: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // Lecture Plan Settings (if generated via Lecture Planner)
  lecturePlan: {
    targetDays: { type: Number, default: 200 },
    deadlineDate: { type: String },
    studyDaysPerWeek: { type: Number, default: 6 },
    strategy: { type: String, default: 'balanced' }, // 'balanced', 'heavy_first', 'rotation'
    avgLectureMinutes: { type: Number, default: 45 },
    totalLectures: { type: Number, default: 0 },
    dailyTargetRate: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Attendance', attendanceSchema);
