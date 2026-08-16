const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const DailyRecord = require('../models/DailyRecord');
const { protect } = require('../middleware/auth');

// Helper to get formatted today string (YYYY-MM-DD)
const getTodayStr = () => new Date().toISOString().split('T')[0];

// 1. Get all todos or filter by targetDate
router.get('/', protect, async (req, res) => {
  try {
    const { date } = req.query;
    const filter = { userId: req.user._id };

    if (date) {
      filter.targetDate = date;
    }

    const todos = await Todo.find(filter)
      .populate('testId', 'title examType duration totalMarks')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: todos
    });
  } catch (error) {
    console.error('Fetch todos error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
      error: error.message
    });
  }
});

// 2. Get specific day records + daily journal log
router.get('/day/:date', protect, async (req, res) => {
  try {
    const targetDate = req.params.date;

    const [tasks, dailyLog] = await Promise.all([
      Todo.find({ userId: req.user._id, targetDate })
        .populate('testId', 'title examType duration totalMarks')
        .sort({ createdAt: -1 }),
      DailyRecord.findOne({ userId: req.user._id, date: targetDate })
    ]);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      success: true,
      data: {
        date: targetDate,
        tasks,
        dailyLog: dailyLog || {
          date: targetDate,
          studyMinutes: 0,
          focusRating: 4,
          dailyNotes: '',
          topicsCovered: [],
          status: 'productive'
        },
        stats: {
          totalTasks,
          completedTasks,
          completionRate
        }
      }
    });
  } catch (error) {
    console.error('Fetch day record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch day record',
      error: error.message
    });
  }
});

// 3. Save or update daily journal / study log for a specific date
router.post('/day/:date/log', protect, async (req, res) => {
  try {
    const targetDate = req.params.date;
    const { studyMinutes, focusRating, dailyNotes, topicsCovered, status } = req.body;

    let record = await DailyRecord.findOne({ userId: req.user._id, date: targetDate });

    if (record) {
      if (studyMinutes !== undefined) record.studyMinutes = studyMinutes;
      if (focusRating !== undefined) record.focusRating = focusRating;
      if (dailyNotes !== undefined) record.dailyNotes = dailyNotes;
      if (topicsCovered !== undefined) record.topicsCovered = topicsCovered;
      if (status !== undefined) record.status = status;
      await record.save();
    } else {
      record = await DailyRecord.create({
        userId: req.user._id,
        date: targetDate,
        studyMinutes: studyMinutes || 0,
        focusRating: focusRating || 4,
        dailyNotes: dailyNotes || '',
        topicsCovered: topicsCovered || [],
        status: status || 'productive'
      });
    }

    res.json({
      success: true,
      data: record,
      message: 'Daily study record saved successfully'
    });
  } catch (error) {
    console.error('Save daily record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save daily study record',
      error: error.message
    });
  }
});

// 4. Get previous records history (grouped by dates)
router.get('/history', protect, async (req, res) => {
  try {
    // Fetch all todos and daily records for user
    const [allTodos, allDailyLogs] = await Promise.all([
      Todo.find({ userId: req.user._id }).sort({ targetDate: -1 }),
      DailyRecord.find({ userId: req.user._id }).sort({ date: -1 })
    ]);

    // Build a map of all unique dates
    const dateMap = {};

    // Populate from todos
    allTodos.forEach(todo => {
      const d = todo.targetDate || (todo.createdAt ? new Date(todo.createdAt).toISOString().split('T')[0] : getTodayStr());
      if (!dateMap[d]) {
        dateMap[d] = {
          date: d,
          tasks: [],
          totalTasks: 0,
          completedTasks: 0,
          studyMinutes: 0,
          focusRating: 4,
          dailyNotes: '',
          topicsCovered: []
        };
      }
      dateMap[d].tasks.push(todo);
      dateMap[d].totalTasks += 1;
      if (todo.status === 'completed') {
        dateMap[d].completedTasks += 1;
      }
    });

    // Merge daily records
    allDailyLogs.forEach(log => {
      const d = log.date;
      if (!dateMap[d]) {
        dateMap[d] = {
          date: d,
          tasks: [],
          totalTasks: 0,
          completedTasks: 0,
          studyMinutes: log.studyMinutes || 0,
          focusRating: log.focusRating || 4,
          dailyNotes: log.dailyNotes || '',
          topicsCovered: log.topicsCovered || []
        };
      } else {
        dateMap[d].studyMinutes = log.studyMinutes || 0;
        dateMap[d].focusRating = log.focusRating || 4;
        dateMap[d].dailyNotes = log.dailyNotes || '';
        dateMap[d].topicsCovered = log.topicsCovered || [];
      }
    });

    // Convert map to sorted array
    const history = Object.values(dateMap).map(item => ({
      ...item,
      completionRate: item.totalTasks > 0 ? Math.round((item.completedTasks / item.totalTasks) * 100) : 0
    })).sort((a, b) => b.date.localeCompare(a.date));

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Fetch todos history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch study history',
      error: error.message
    });
  }
});

// 5. Create new todo
router.post('/', protect, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      priority, 
      status, 
      category, 
      tag, 
      targetDate, 
      dueDate, 
      testId, 
      subject,
      timeSpentMinutes 
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    const todo = await Todo.create({
      userId: req.user._id,
      title: title.trim(),
      description: description || '',
      priority: priority || 'Medium',
      status: status || 'todo',
      category: category || 'Study Plan',
      tag: tag || 'On Track',
      targetDate: targetDate || getTodayStr(),
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      timeSpentMinutes: timeSpentMinutes || 0,
      completedAt: status === 'completed' ? new Date() : undefined,
      testId: testId || undefined,
      subject: subject || 'General'
    });

    res.status(201).json({
      success: true,
      data: todo,
      message: 'Task created successfully'
    });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: error.message
    });
  }
});

// 6. Update todo
router.put('/:id', protect, async (req, res) => {
  try {
    let todo = await Todo.findOne({ _id: req.params.id, userId: req.user._id });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const updates = req.body;
    if (updates.status === 'completed' && todo.status !== 'completed') {
      todo.completedAt = new Date();
    } else if (updates.status && updates.status !== 'completed') {
      todo.completedAt = undefined;
    }

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        todo[key] = updates[key];
      }
    });

    await todo.save();

    res.json({
      success: true,
      data: todo,
      message: 'Task updated successfully'
    });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task',
      error: error.message
    });
  }
});

// 7. Delete todo
router.delete('/:id', protect, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: error.message
    });
  }
});

module.exports = router;
