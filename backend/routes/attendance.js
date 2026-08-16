const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { protect } = require('../middleware/auth');

// @route   GET /api/attendance
// @desc    Get user's current attendance timetable and matrix logs
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let attendance = await Attendance.findOne({ userId: req.user._id });
    
    if (!attendance) {
      return res.json({
        success: true,
        data: null
      });
    }


    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance data',
      error: error.message
    });
  }
});

// @route   POST /api/attendance/save
// @desc    Create or update full attendance timetable & subjects
// @access  Private
router.post('/save', protect, async (req, res) => {
  try {
    const { title, startDate, endDate, subjects, logs, lecturePlan } = req.body;

    let attendance = await Attendance.findOne({ userId: req.user._id });

    if (!attendance) {
      attendance = new Attendance({
        userId: req.user._id,
        title: title || 'My Attendance & Study Matrix',
        startDate,
        endDate,
        subjects: subjects || [],
        logs: logs || {},
        lecturePlan: lecturePlan || {}
      });
    } else {
      if (title !== undefined) attendance.title = title;
      if (startDate !== undefined) attendance.startDate = startDate;
      if (endDate !== undefined) attendance.endDate = endDate;
      if (subjects !== undefined) attendance.subjects = subjects;
      if (logs !== undefined) attendance.logs = logs;
      if (lecturePlan !== undefined) attendance.lecturePlan = lecturePlan;
    }

    await attendance.save();

    res.json({
      success: true,
      message: 'Timetable saved successfully',
      data: attendance
    });
  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save timetable',
      error: error.message
    });
  }
});

// @route   POST /api/attendance/toggle-cell
// @desc    Fast atomic toggle for a single date & subject checkmark
// @access  Private
router.post('/toggle-cell', protect, async (req, res) => {
  try {
    const { date, subjectId, checked, count, slotIndex, notes } = req.body;
    if (!date || !subjectId) {
      return res.status(400).json({ success: false, message: 'Date and subjectId are required' });
    }

    let attendance = await Attendance.findOne({ userId: req.user._id });
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    const currentLogs = attendance.logs ? (attendance.logs instanceof Map ? Object.fromEntries(attendance.logs) : attendance.logs) : {};
    if (!currentLogs[date]) {
      currentLogs[date] = {};
    }

    const currentEntry = currentLogs[date][subjectId] || { count: 0, checked: false, sessions: [] };
    const subject = attendance.subjects.find(s => s.id === subjectId);
    const targetGoal = subject?.dailyGoal || 1;

    let sessions = Array.isArray(currentEntry.sessions) ? [...currentEntry.sessions] : [];
    while (sessions.length < targetGoal) {
      sessions.push(false);
    }

    if (slotIndex !== undefined && slotIndex >= 0 && slotIndex < targetGoal) {
      sessions[slotIndex] = checked !== undefined ? checked : !sessions[slotIndex];
    } else {
      // Toggle all or increment
      const newChecked = checked !== undefined ? checked : !currentEntry.checked;
      sessions = sessions.map(() => newChecked);
    }

    const completedCount = sessions.filter(Boolean).length;
    const isFullyChecked = completedCount >= targetGoal;

    currentLogs[date][subjectId] = {
      checked: isFullyChecked,
      count: count !== undefined ? count : completedCount,
      sessions,
      notes: notes !== undefined ? notes : (currentEntry.notes || '')
    };

    // Recalculate total completedLectures for the subject
    if (subject) {
      let totalComp = 0;
      Object.keys(currentLogs).forEach(d => {
        if (currentLogs[d] && currentLogs[d][subjectId]) {
          totalComp += (currentLogs[d][subjectId].count || (currentLogs[d][subjectId].checked ? 1 : 0));
        }
      });
      subject.completedLectures = totalComp;
    }

    attendance.logs = currentLogs;
    attendance.markModified('logs');
    attendance.markModified('subjects');
    await attendance.save();

    res.json({
      success: true,
      data: {
        date,
        subjectId,
        entry: currentLogs[date][subjectId],
        subject
      }
    });
  } catch (error) {
    console.error('Error toggling cell:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update attendance cell',
      error: error.message
    });
  }
});

// @route   POST /api/attendance/batch-fill
// @desc    Batch fill or clear day/all checkmarks
// @access  Private
router.post('/batch-fill', protect, async (req, res) => {
  try {
    const { dates, subjectIds, checked } = req.body;
    let attendance = await Attendance.findOne({ userId: req.user._id });
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    const currentLogs = attendance.logs ? (attendance.logs instanceof Map ? Object.fromEntries(attendance.logs) : attendance.logs) : {};

    (dates || []).forEach(date => {
      if (!currentLogs[date]) currentLogs[date] = {};
      (subjectIds || []).forEach(subId => {
        currentLogs[date][subId] = {
          checked: !!checked,
          count: checked ? 1 : 0,
          notes: ''
        };
      });
    });

    // Recalculate totals
    attendance.subjects.forEach(subject => {
      let completedCount = 0;
      Object.keys(currentLogs).forEach(d => {
        if (currentLogs[d] && currentLogs[d][subject.id] && currentLogs[d][subject.id].checked) {
          completedCount += (currentLogs[d][subject.id].count || 1);
        }
      });
      subject.completedLectures = completedCount;
    });

    attendance.logs = currentLogs;
    attendance.markModified('logs');
    attendance.markModified('subjects');
    await attendance.save();

    res.json({
      success: true,
      message: 'Batch update applied',
      data: attendance
    });
  } catch (error) {
    console.error('Error in batch fill:', error);
    res.status(500).json({ success: false, message: 'Failed to batch fill', error: error.message });
  }
});

// @route   GET /api/attendance/master-syllabus
// @desc    Get configured subjects & curriculum list
// @access  Private
router.get('/master-syllabus', protect, async (req, res) => {
  try {
    let attendance = await Attendance.findOne({ userId: req.user._id });
    const subjects = attendance?.subjects || [];
    res.json({
      success: true,
      data: subjects
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get master syllabus', error: error.message });
  }
});

// @route   POST /api/attendance/master-syllabus
// @desc    Save/update master syllabus subjects
// @access  Private
router.post('/master-syllabus', protect, async (req, res) => {
  try {
    const { subjects } = req.body;
    let attendance = await Attendance.findOne({ userId: req.user._id });
    if (!attendance) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      attendance = new Attendance({
        userId: req.user._id,
        startDate: `${year}-${month}-01`,
        endDate: `${year}-${month}-28`,
        subjects: subjects || []
      });
    } else {
      attendance.subjects = subjects || [];
    }

    attendance.markModified('subjects');
    await attendance.save();

    res.json({
      success: true,
      message: 'Master syllabus subjects saved',
      data: attendance.subjects
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save master syllabus', error: error.message });
  }
});

// @route   DELETE /api/attendance/reset
// @desc    Clear / reset attendance timetable
// @access  Private
router.delete('/reset', protect, async (req, res) => {
  try {
    await Attendance.findOneAndDelete({ userId: req.user._id });
    res.json({
      success: true,
      message: 'Attendance timetable cleared'
    });
  } catch (error) {
    console.error('Error resetting attendance:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

