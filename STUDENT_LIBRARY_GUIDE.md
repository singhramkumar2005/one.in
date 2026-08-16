# Student Library Feature Guide

## Overview
The Student Library feature allows students to import folders from their local device, automatically analyze all videos and PDFs within them, and track their progress through the study materials.

## Features

### 📁 Folder Management
- **Import Folders**: Select any folder from your device
- **Automatic Analysis**: System automatically scans and counts all videos and PDFs
- **Real-time Statistics**: See total files, size, duration, and completion status
- **Multiple Folders**: Add unlimited folders from different locations

### 📊 Comprehensive Statistics

#### Library-Level Stats
- Total number of folders
- Total videos across all folders
- Total PDFs across all folders
- Combined storage size
- Total video duration
- Completion progress

#### Folder-Level Stats
- Number of videos in the folder
- Number of PDFs in the folder
- Total folder size
- Total video duration
- Completed vs pending items
- Overall completion percentage

### 🎯 Progress Tracking
- **Individual File Progress**: Track progress (0-100%) for each file
- **Completion Status**: Mark files as completed
- **Notes**: Add personal notes to each file
- **Last Accessed**: Track when you last accessed each file
- **Visual Progress Bars**: Clear visual indicators of progress

### 🔍 Advanced Search & Filter
- **Search**: Find files by name instantly
- **Filter by Type**: View only videos, only PDFs, or all files
- **Filter by Status**: View completed or pending files
- **View Modes**: Switch between grid and list views

### 📱 Responsive Design
- Beautiful card-based layouts
- Mobile-friendly interface
- Dark mode support
- Smooth transitions and animations

## How to Use

### Adding a Folder

1. **Navigate to Library**
   - Click on "My Library" in the sidebar
   - You'll see your library dashboard

2. **Select Folder**
   - Click the "Add Folder" button
   - Your browser will prompt you to select a folder
   - Choose the folder containing your study materials

3. **Automatic Analysis**
   - The system will scan all subfolders
   - It identifies all video files (.mp4, .avi, .mkv, .mov, .wmv, .flv, .webm, .m4v)
   - It identifies all PDF files (.pdf)
   - File information is automatically collected

4. **View Results**
   - The folder appears in your library with statistics
   - Click on the folder to see detailed file information

### Managing Files

1. **View Folder Contents**
   - Click on any folder card to open it
   - See all videos and PDFs in a detailed table view

2. **Mark as Complete**
   - Click the circle icon next to any file to mark it complete
   - Completed files show a green checkmark

3. **Track Progress**
   - Click the edit button (pencil icon) on any file
   - Adjust the progress slider (0-100%)
   - Add notes about your study session
   - Click "Save Changes"

4. **Search and Filter**
   - Use the search bar to find specific files
   - Use filters to show only videos, PDFs, completed, or pending items
   - Switch between grid and list views for better organization

### Folder Information Display

When you open a folder, you'll see:

#### Top Section Statistics
- **Overall Progress**: Percentage of completion
- **Videos**: Total count and completed count
- **PDFs**: Total count and completed count
- **Total Size**: Combined size of all files
- **Last Scanned**: When the folder was last analyzed

#### File Table Columns
- **Status**: Circle icon (click to toggle completion)
- **Name**: File name and path
- **Type**: Video or PDF badge
- **Size**: File size in human-readable format
- **Progress**: Visual progress bar with percentage
- **Actions**: Edit button to update progress and notes

## Technical Details

### Supported File Types

#### Videos
- `.mp4` - MPEG-4 Video
- `.avi` - Audio Video Interleave
- `.mkv` - Matroska Video
- `.mov` - QuickTime Movie
- `.wmv` - Windows Media Video
- `.flv` - Flash Video
- `.webm` - WebM Video
- `.m4v` - MPEG-4 Video

#### Documents
- `.pdf` - Portable Document Format

### Browser Compatibility

The folder selection feature uses the **File System Access API**, which requires:
- **Chrome/Edge**: Version 86+
- **Opera**: Version 72+
- **Safari**: Not currently supported
- **Firefox**: Not currently supported

For best results, use **Google Chrome** or **Microsoft Edge**.

### Data Storage

- All folder and file information is stored in your MongoDB database
- Files remain on your local device (the system only stores metadata)
- Progress and notes are synced to the database
- Data is associated with your user account

## API Endpoints

### Get Library
```
GET /api/library
```
Returns the user's complete library with all folders and files.

### Add/Update Folder
```
POST /api/library/folder
Body: {
  name: string,
  path: string,
  files: array,
  color: string,
  icon: string,
  tags: array
}
```

### Get Specific Folder
```
GET /api/library/folder/:folderId
```

### Update File Progress
```
PUT /api/library/folder/:folderId/file/:fileId/progress
Body: {
  progress: number (0-100),
  isCompleted: boolean,
  notes: string
}
```

### Delete Folder
```
DELETE /api/library/folder/:folderId
```

### Get Statistics
```
GET /api/library/stats
```

## Database Schema

### StudentLibrary Model
```javascript
{
  userId: ObjectId (ref: User),
  folders: [FolderSchema],
  timestamps: true
}
```

### Folder Schema
```javascript
{
  name: string,
  path: string,
  totalVideos: number,
  totalPDFs: number,
  totalSize: number,
  totalDuration: number,
  totalPages: number,
  completedVideos: number,
  completedPDFs: number,
  files: [FileSchema],
  color: string,
  icon: string,
  tags: [string],
  lastScanned: date,
  timestamps: true
}
```

### File Schema
```javascript
{
  name: string,
  path: string,
  type: enum['video', 'pdf'],
  size: number,
  duration: number,
  pages: number,
  lastModified: date,
  isCompleted: boolean,
  progress: number,
  notes: string,
  lastAccessed: date
}
```

## Tips for Best Experience

1. **Organize Your Files**
   - Keep study materials in dedicated folders
   - Use descriptive folder names
   - Group related content together

2. **Regular Updates**
   - Re-scan folders after adding new files
   - Update progress regularly
   - Use notes to track important points

3. **Use Filters**
   - Filter by type when focusing on specific content
   - Use completion filters to see what's left

4. **Track Progress**
   - Set progress as you go through materials
   - Mark items complete when finished
   - Review statistics to stay motivated

## Color Coding

Folders are automatically assigned colors for easy identification:
- Indigo (#6366f1)
- Purple (#8b5cf6)
- Pink (#ec4899)
- Orange (#f59e0b)
- Green (#10b981)
- Blue (#3b82f6)
- Red (#ef4444)

## Future Enhancements

Potential future features:
- Video duration extraction
- PDF page count extraction
- Study time tracking
- Spaced repetition reminders
- Export progress reports
- Integration with calendar
- Collaborative study folders
- Bookmark specific timestamps/pages

## Troubleshooting

### Browser Not Supported
**Issue**: "Your browser does not support folder selection"
**Solution**: Use Google Chrome or Microsoft Edge (latest versions)

### Folder Not Appearing
**Issue**: Added folder doesn't show up
**Solution**: 
- Check browser console for errors
- Ensure the folder contains supported file types
- Try refreshing the page

### Progress Not Saving
**Issue**: Changes to progress don't persist
**Solution**:
- Check your internet connection
- Ensure you're logged in
- Try logging out and back in

## Security & Privacy

- **Local Files**: Your actual files never leave your device
- **Metadata Only**: Only file names, sizes, and paths are stored
- **User Isolation**: Each user can only see their own library
- **Secure API**: All endpoints require authentication
- **No File Upload**: Files are not uploaded to the server

## Performance

- **Fast Scanning**: Folders are analyzed client-side
- **Efficient Storage**: Only metadata is stored
- **Indexed Queries**: Database indexes for fast retrieval
- **Optimized UI**: Smooth animations and transitions

---

**Version**: 1.0.0  
**Last Updated**: August 2026  
**Feature Status**: ✅ Fully Implemented
