const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const StudentLibrary = require('../models/StudentLibrary');
const { protect } = require('../middleware/auth');

// Helper to find folder by MongoDB _id or custom folderId string
const findFolderInLibrary = (library, folderId) => {
  if (!library || !library.folders) return null;
  let folder = null;
  
  if (mongoose.Types.ObjectId.isValid(folderId)) {
    folder = library.folders.id(folderId);
  }
  
  if (!folder) {
    folder = library.folders.find(f => f.folderId === folderId || f._id?.toString() === folderId);
  }
  
  return folder;
};

// Helper to find file in folder root files or nested subfolders
const findFileInFolder = (folder, fileId) => {
  if (!folder) return null;
  let file = null;

  if (folder.files) {
    if (mongoose.Types.ObjectId.isValid(fileId)) {
      file = folder.files.id ? folder.files.id(fileId) : null;
    }
    if (!file) {
      file = folder.files.find(f => f._id?.toString() === fileId || f.id === fileId || f.name === fileId);
    }
  }

  // Search inside subfolders if not in root files
  if (!file && folder.subfolders && folder.subfolders.length > 0) {
    for (const sub of folder.subfolders) {
      if (sub.files) {
        if (mongoose.Types.ObjectId.isValid(fileId)) {
          file = sub.files.id ? sub.files.id(fileId) : null;
        }
        if (!file) {
          file = sub.files.find(f => f._id?.toString() === fileId || f.id === fileId || f.name === fileId);
        }
        if (file) break;
      }
    }
  }

  return file;
};

// Get user's library
router.get('/', protect, async (req, res) => {
  try {
    console.log('📖 Fetching library for user:', req.user._id);
    
    let library = await StudentLibrary.findOne({ userId: req.user._id });
    
    if (!library) {
      console.log('📚 No library found, creating new one');
      library = await StudentLibrary.create({ userId: req.user._id, folders: [] });
    }

    console.log('✅ Library fetched successfully, folders:', library.folders.length);

    res.json({
      success: true,
      data: library
    });
  } catch (error) {
    console.error('❌ Get library error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch library',
      error: error.message
    });
  }
});

// Add or update folder
router.post('/folder', protect, async (req, res) => {
  try {
    const { name, path, files, color, icon, tags, folderId, subfolders, subjectId, subjectName } = req.body;

    console.log('📁 Adding folder:', { name, path, filesCount: files?.length, subfoldersCount: subfolders?.length });

    let library = await StudentLibrary.findOne({ userId: req.user._id });
    
    if (!library) {
      console.log('📚 Creating new library for user:', req.user._id);
      library = await StudentLibrary.create({ userId: req.user._id, folders: [] });
    }

    // Calculate statistics for root files
    const rootVideos = (files || []).filter(f => f.type === 'video');
    const rootPDFs = (files || []).filter(f => f.type === 'pdf');
    
    // Calculate total statistics (including subfolders)
    let totalVideos = rootVideos.length;
    let totalPDFs = rootPDFs.length;
    let totalSize = (files || []).reduce((sum, f) => sum + (f.size || 0), 0);
    let totalDuration = rootVideos.reduce((sum, f) => sum + (f.duration || 0), 0);
    let totalPages = rootPDFs.reduce((sum, f) => sum + (f.pages || 0), 0);

    // Add subfolder statistics
    if (subfolders && subfolders.length > 0) {
      subfolders.forEach(subfolder => {
        totalVideos += subfolder.totalVideos || 0;
        totalPDFs += subfolder.totalPDFs || 0;
        totalSize += subfolder.totalSize || 0;
        totalDuration += subfolder.totalDuration || 0;
      });
    }

    // Generate unique folder ID if not provided
    const uniqueFolderId = folderId || `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const folderData = {
      name,
      path,
      folderId: uniqueFolderId,
      totalVideos,
      totalPDFs,
      totalSize,
      totalDuration,
      totalPages,
      files: files || [],
      subfolders: subfolders || [],
      color: color || '#6366f1',
      icon: icon || 'folder',
      subjectId: subjectId || undefined,
      subjectName: subjectName || undefined,
      tags: tags || [],
      lastScanned: new Date(),
      needsAccess: false
    };

    // Check if folder already exists by folderId
    const existingFolderIndex = library.folders.findIndex(f => f.folderId === uniqueFolderId);
    
    if (existingFolderIndex !== -1) {
      console.log('♻️ Updating existing folder at index:', existingFolderIndex);
      library.folders[existingFolderIndex] = {
        ...library.folders[existingFolderIndex].toObject(),
        ...folderData
      };
    } else {
      console.log('➕ Adding new folder');
      library.folders.push(folderData);
    }

    await library.save();
    console.log('✅ Folder saved successfully');

    // Auto-sync with Attendance Syllabus if linked to a subject
    try {
      const Attendance = require('../models/Attendance');
      let attendance = await Attendance.findOne({ userId: req.user._id });
      if (attendance && subjectId) {
        const subject = attendance.subjects.find(s => s.id === subjectId || s.name.toLowerCase() === (subjectName || '').toLowerCase());
        const avgMins = totalVideos > 0 && totalDuration > 0 ? Math.round(totalDuration / (totalVideos * 60)) : 45;
        if (subject) {
          subject.totalLectures = totalVideos;
          if (avgMins > 0) subject.durationMinutes = avgMins;
          attendance.markModified('subjects');
          await attendance.save();
          console.log('🔄 Synced with attendance');
        }
      }
    } catch (syncErr) {
      console.warn('⚠️ Attendance auto-sync non-critical error:', syncErr.message);
    }

    res.json({
      success: true,
      message: existingFolderIndex !== -1 ? 'Folder updated' : 'Folder added',
      data: library,
      folderId: uniqueFolderId
    });
  } catch (error) {
    console.error('❌ Add folder error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to add folder',
      error: error.message
    });
  }
});

// Get specific folder by folderId
router.get('/folder/:folderId', protect, async (req, res) => {
  try {
    const library = await StudentLibrary.findOne({ userId: req.user._id });
    
    if (!library) {
      return res.status(404).json({
        success: false,
        message: 'Library not found'
      });
    }

    const folder = findFolderInLibrary(library, req.params.folderId);
    
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }

    res.json({
      success: true,
      data: folder
    });
  } catch (error) {
    console.error('Get folder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch folder'
    });
  }
});

// Progress update handler (supporting both PUT and POST)
const handleProgressUpdate = async (req, res) => {
  try {
    const { progress, isCompleted, notes } = req.body;
    
    const library = await StudentLibrary.findOne({ userId: req.user._id });
    
    if (!library) {
      return res.status(404).json({
        success: false,
        message: 'Library not found'
      });
    }

    const folder = findFolderInLibrary(library, req.params.folderId);
    
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }

    const file = findFileInFolder(folder, req.params.fileId);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Update file
    if (progress !== undefined) file.progress = progress;
    if (isCompleted !== undefined) file.isCompleted = isCompleted;
    if (notes !== undefined) file.notes = notes;
    file.lastAccessed = new Date();

    // Update folder stats
    const allFolderFiles = [...(folder.files || [])];
    if (folder.subfolders) {
      folder.subfolders.forEach(sub => {
        if (sub.files) allFolderFiles.push(...sub.files);
      });
    }

    folder.completedVideos = allFolderFiles.filter(f => f.type === 'video' && f.isCompleted).length;
    folder.completedPDFs = allFolderFiles.filter(f => f.type === 'pdf' && f.isCompleted).length;

    library.markModified('folders');
    await library.save();

    res.json({
      success: true,
      message: 'Progress updated',
      data: library,
      fileProgress: {
        fileId: req.params.fileId,
        progress: file.progress,
        isCompleted: file.isCompleted
      }
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update progress',
      error: error.message
    });
  }
};

// Route for PUT progress
router.put('/folder/:folderId/file/:fileId/progress', protect, handleProgressUpdate);

// Route for POST progress
router.post('/folder/:folderId/file/:fileId/progress', protect, handleProgressUpdate);

// Delete folder
router.delete('/folder/:folderId', protect, async (req, res) => {
  try {
    const library = await StudentLibrary.findOne({ userId: req.user._id });
    
    if (!library) {
      return res.status(404).json({
        success: false,
        message: 'Library not found'
      });
    }

    const folderIndex = library.folders.findIndex(
      f => f.folderId === req.params.folderId || f._id?.toString() === req.params.folderId
    );

    if (folderIndex !== -1) {
      library.folders.splice(folderIndex, 1);
      library.markModified('folders');
      await library.save();
    }

    res.json({
      success: true,
      message: 'Folder deleted',
      data: library
    });
  } catch (error) {
    console.error('Delete folder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete folder'
    });
  }
});

// Get library statistics
router.get('/stats', protect, async (req, res) => {
  try {
    const library = await StudentLibrary.findOne({ userId: req.user._id || req.user.id });
    
    if (!library) {
      return res.json({
        success: true,
        data: {
          totalFolders: 0,
          totalVideos: 0,
          totalPDFs: 0,
          totalSize: 0,
          totalDuration: 0,
          totalPages: 0,
          completedVideos: 0,
          completedPDFs: 0
        }
      });
    }

    const stats = {
      totalFolders: library.folders.length,
      totalVideos: library.folders.reduce((sum, f) => sum + (f.totalVideos || 0), 0),
      totalPDFs: library.folders.reduce((sum, f) => sum + (f.totalPDFs || 0), 0),
      totalSize: library.folders.reduce((sum, f) => sum + (f.totalSize || 0), 0),
      totalDuration: library.folders.reduce((sum, f) => sum + (f.totalDuration || 0), 0),
      totalPages: library.folders.reduce((sum, f) => sum + (f.totalPages || 0), 0),
      completedVideos: library.folders.reduce((sum, f) => sum + (f.completedVideos || 0), 0),
      completedPDFs: library.folders.reduce((sum, f) => sum + (f.completedPDFs || 0), 0)
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats'
    });
  }
});

module.exports = router;
