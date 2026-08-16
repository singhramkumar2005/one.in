const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  type: { type: String, enum: ['video', 'pdf'], required: true },
  size: { type: Number }, // in bytes
  duration: { type: Number }, // video duration in seconds
  pages: { type: Number }, // PDF pages
  lastModified: { type: Date },
  isCompleted: { type: Boolean, default: false },
  progress: { type: Number, default: 0 }, // 0-100
  notes: { type: String },
  lastAccessed: { type: Date }
});

// Subfolder schema (for nested folders)
const subfolderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  totalVideos: { type: Number, default: 0 },
  totalPDFs: { type: Number, default: 0 },
  totalSize: { type: Number, default: 0 },
  totalDuration: { type: Number, default: 0 },
  completedVideos: { type: Number, default: 0 },
  completedPDFs: { type: Number, default: 0 },
  files: [fileSchema]
});

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  folderId: { type: String, required: true, unique: true }, // Unique folder identifier
  totalVideos: { type: Number, default: 0 },
  totalPDFs: { type: Number, default: 0 },
  totalSize: { type: Number, default: 0 },
  totalDuration: { type: Number, default: 0 }, // total video duration in seconds
  totalPages: { type: Number, default: 0 }, // total PDF pages
  completedVideos: { type: Number, default: 0 },
  completedPDFs: { type: Number, default: 0 },
  files: [fileSchema], // Files directly in the main folder
  subfolders: [subfolderSchema], // Nested subfolders
  color: { type: String, default: '#6366f1' },
  icon: { type: String, default: 'folder' },
  subjectId: { type: String }, // Linked Syllabus Subject ID
  subjectName: { type: String }, // Linked Syllabus Subject Name
  tags: [{ type: String }],
  lastScanned: { type: Date, default: Date.now },
  needsAccess: { type: Boolean, default: true } // Flag to indicate if folder access is needed
}, {
  timestamps: true
});

const studentLibrarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  folders: [folderSchema]
}, {
  timestamps: true
});

// Indexes
studentLibrarySchema.index({ userId: 1 });
folderSchema.index({ name: 1 });

module.exports = mongoose.model('StudentLibrary', studentLibrarySchema);
