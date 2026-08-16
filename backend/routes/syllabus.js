const express = require('express');
const router = express.Router();
const Syllabus = require('../models/Syllabus');
const { protect } = require('../middleware/auth');

// Get all syllabi for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const syllabi = await Syllabus.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: syllabi.length,
      data: syllabi
    });
  } catch (error) {
    console.error('Get syllabi error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch syllabi'
    });
  }
});

// Get single syllabus by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const syllabus = await Syllabus.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: 'Syllabus not found'
      });
    }
    
    res.json({
      success: true,
      data: syllabus
    });
  } catch (error) {
    console.error('Get syllabus error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch syllabus'
    });
  }
});

// Create new syllabus
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, subjects, targetDays, startDate } = req.body;
    
    // Validate required fields
    if (!title || !subjects || !targetDays) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, subjects, and target days'
      });
    }
    
    // Validate subjects array
    if (!Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one subject'
      });
    }
    
    const syllabus = await Syllabus.create({
      user: req.user._id,
      title,
      description,
      subjects,
      targetDays,
      startDate: startDate || Date.now()
    });
    
    res.status(201).json({
      success: true,
      data: syllabus,
      message: 'Syllabus created successfully'
    });
  } catch (error) {
    console.error('Create syllabus error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create syllabus'
    });
  }
});

// Update syllabus
router.put('/:id', protect, async (req, res) => {
  try {
    let syllabus = await Syllabus.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: 'Syllabus not found'
      });
    }
    
    const { title, description, subjects, targetDays, startDate, isActive } = req.body;
    
    if (title) syllabus.title = title;
    if (description !== undefined) syllabus.description = description;
    if (subjects) syllabus.subjects = subjects;
    if (targetDays) syllabus.targetDays = targetDays;
    if (startDate) syllabus.startDate = startDate;
    if (isActive !== undefined) syllabus.isActive = isActive;
    
    await syllabus.save();
    
    res.json({
      success: true,
      data: syllabus,
      message: 'Syllabus updated successfully'
    });
  } catch (error) {
    console.error('Update syllabus error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update syllabus'
    });
  }
});

// Update lecture progress for a subject
router.put('/:id/subject/:subjectId/progress', protect, async (req, res) => {
  try {
    const { completedLectures } = req.body;
    
    if (completedLectures === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide completed lectures count'
      });
    }
    
    const syllabus = await Syllabus.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: 'Syllabus not found'
      });
    }
    
    const subject = syllabus.subjects.id(req.params.subjectId);
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    // Validate completed lectures
    if (completedLectures < 0 || completedLectures > subject.totalLectures) {
      return res.status(400).json({
        success: false,
        message: `Completed lectures must be between 0 and ${subject.totalLectures}`
      });
    }
    
    const previousCompleted = subject.completedLectures;
    subject.completedLectures = completedLectures;
    
    // Update daily progress
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let dailyProgress = syllabus.dailyProgress.find(dp => 
      dp.date.toDateString() === today.toDateString()
    );
    
    if (!dailyProgress) {
      dailyProgress = {
        date: today,
        lecturesCompleted: 0,
        subjects: []
      };
      syllabus.dailyProgress.push(dailyProgress);
    }
    
    const lecturesDiff = completedLectures - previousCompleted;
    dailyProgress.lecturesCompleted += lecturesDiff;
    
    const subjectProgress = dailyProgress.subjects.find(s => 
      s.subjectId.toString() === req.params.subjectId
    );
    
    if (subjectProgress) {
      subjectProgress.lecturesCompleted += lecturesDiff;
    } else {
      dailyProgress.subjects.push({
        subjectId: req.params.subjectId,
        lecturesCompleted: lecturesDiff
      });
    }
    
    await syllabus.save();
    
    res.json({
      success: true,
      data: syllabus,
      message: 'Progress updated successfully'
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update progress'
    });
  }
});

// Update subtopic progress
router.put('/:id/subject/:subjectId/subtopic/:subTopicId/progress', protect, async (req, res) => {
  try {
    const { completedLectures } = req.body;
    
    if (completedLectures === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide completed lectures count'
      });
    }
    
    const syllabus = await Syllabus.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: 'Syllabus not found'
      });
    }
    
    const subject = syllabus.subjects.id(req.params.subjectId);
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    const subTopic = subject.subTopics.id(req.params.subTopicId);
    
    if (!subTopic) {
      return res.status(404).json({
        success: false,
        message: 'Sub-topic not found'
      });
    }
    
    if (completedLectures < 0 || completedLectures > subTopic.totalLectures) {
      return res.status(400).json({
        success: false,
        message: `Completed lectures must be between 0 and ${subTopic.totalLectures}`
      });
    }
    
    const previousCompleted = subTopic.completedLectures;
    subTopic.completedLectures = completedLectures;
    
    // Update subject's completed lectures
    const lecturesDiff = completedLectures - previousCompleted;
    subject.completedLectures += lecturesDiff;
    
    await syllabus.save();
    
    res.json({
      success: true,
      data: syllabus,
      message: 'Sub-topic progress updated successfully'
    });
  } catch (error) {
    console.error('Update subtopic progress error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update sub-topic progress'
    });
  }
});

// Get syllabus statistics
router.get('/:id/stats', protect, async (req, res) => {
  try {
    const syllabus = await Syllabus.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: 'Syllabus not found'
      });
    }
    
    const stats = {
      totalLectures: syllabus.totalLectures,
      completedLectures: syllabus.completedLectures,
      completionPercentage: syllabus.getCompletionPercentage(),
      daysElapsed: syllabus.getDaysElapsed(),
      daysRemaining: syllabus.getDaysRemaining(),
      dailyTarget: syllabus.dailyTarget,
      isOnTrack: syllabus.isOnTrack(),
      completionStatus: syllabus.completionStatus,
      subjectStats: syllabus.subjects.map(subject => ({
        id: subject._id,
        name: subject.name,
        totalLectures: subject.totalLectures,
        completedLectures: subject.completedLectures,
        completionPercentage: syllabus.getSubjectCompletionPercentage(subject._id),
        color: subject.color
      }))
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// Delete syllabus
router.delete('/:id', protect, async (req, res) => {
  try {
    const syllabus = await Syllabus.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: 'Syllabus not found'
      });
    }
    
    await syllabus.deleteOne();
    
    res.json({
      success: true,
      message: 'Syllabus deleted successfully'
    });
  } catch (error) {
    console.error('Delete syllabus error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete syllabus'
    });
  }
});

module.exports = router;
