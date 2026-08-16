const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Please add a task title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'completed'],
    default: 'todo'
  },
  category: {
    type: String,
    default: 'Exam Prep'
  },
  tag: {
    type: String,
    default: 'On Track'
  },
  targetDate: {
    type: String, // Format: YYYY-MM-DD
    required: true,
    index: true,
    default: () => new Date().toISOString().split('T')[0]
  },
  dueDate: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  timeSpentMinutes: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test'
  },
  subject: {
    type: String,
    default: 'General'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Todo', TodoSchema);
