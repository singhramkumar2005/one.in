# Persistent Folder Permissions - Feature Documentation

## Overview
This feature eliminates the need for students to repeatedly grant folder access permissions when viewing their library content. Once a folder is uploaded and permission is granted, the system remembers the access rights permanently using the browser's IndexedDB storage.

## How It Works

### 1. **Initial Folder Upload**
When a student uploads a folder for the first time:
- The system generates a unique `folderId` (e.g., `folder_1234567890_abc123`)
- Browser prompts for folder access (one-time permission request)
- The folder's `FileSystemDirectoryHandle` is saved to IndexedDB
- Folder metadata is saved to MongoDB with the unique `folderId`
- The `folderId` links the database record to the stored permission

### 2. **Playing Videos or Viewing PDFs**
When a student tries to access a file:
- System checks IndexedDB for saved folder permission using `folderId`
- If permission exists and is still valid → file opens immediately (no prompt!)
- If permission expired → system automatically requests re-authorization
- If no permission found → shows one-time permission dialog

### 3. **Permission Persistence**
- Permissions persist **across browser sessions** (even after closing/reopening)
- Permissions persist **until manually revoked** by the user or cleared from browser
- Each folder has its own independent permission stored separately

## Technical Implementation

### Frontend Components

#### 1. **IndexedDB Helper** (`utils/indexedDBHelper.js`)
```javascript
// Key functions:
- saveDirectoryHandle(folderId, directoryHandle, folderName)
- getDirectoryHandle(folderId)
- getDirectoryHandleWithPermission(folderId)
- checkPermission(directoryHandle)
- requestPermission(directoryHandle)
- deleteDirectoryHandle(folderId)
```

#### 2. **StudentLibrary.jsx**
- Generates unique `folderId` when folder is uploaded
- Saves directory handle to IndexedDB immediately after upload
- Passes `folderId` to backend for database storage

#### 3. **LibraryDetail.jsx**
- Loads directory handle from IndexedDB on page mount
- Automatically checks and requests permission if needed
- Shows permission status indicator to user
- Cleans up IndexedDB when folder is deleted

#### 4. **PermissionStatus Component**
Visual indicator showing:
- ✅ Green: Permission granted (ready to play files)
- ⚠️ Yellow: Permission needed (with grant button)

### Backend Components

#### 1. **StudentLibrary Model**
```javascript
{
  folderId: { type: String, required: true, unique: true },
  needsAccess: { type: Boolean, default: false }
  // ... other fields
}
```

#### 2. **Library Routes**
- `/library/folder` - Accepts and stores `folderId`
- `/library/folder/:folderId` - Retrieves folder by `folderId` or MongoDB `_id`

## User Experience Flow

### First Time Upload
1. Student clicks "Add Folder"
2. Browser shows folder picker → Student selects folder
3. System analyzes folder contents
4. **One-time permission granted automatically during upload**
5. ✅ Folder added with green "Access Granted" status
6. Files can be played immediately without additional prompts

### Playing Files Later
1. Student opens folder from library
2. System checks IndexedDB in background
3. **No permission dialog shown** - files play instantly!
4. Green status indicator confirms access is granted

### If Permission Lost (rare cases)
1. Student tries to play a file
2. Yellow status indicator appears
3. Student clicks "Grant Folder Access" button
4. Browser shows folder picker → Select same folder
5. Permission restored - won't be asked again

## Browser Compatibility

### Supported Browsers
- ✅ **Google Chrome** 86+ (recommended)
- ✅ **Microsoft Edge** 86+ (recommended)
- ✅ **Opera** 72+
- ❌ Firefox (File System Access API not supported yet)
- ❌ Safari (File System Access API not supported yet)

### Feature Detection
System automatically detects browser support:
```javascript
if ('showDirectoryPicker' in window) {
  // Feature available
} else {
  // Show error message
}
```

## Security & Privacy

### What Gets Stored
- **IndexedDB**: Directory handle reference (not the actual files!)
- **MongoDB**: Folder metadata (file names, paths, sizes, progress)
- **Not Stored**: Actual file contents remain on student's computer

### Permission Scope
- **Read-only access**: System can only read files, never modify or delete
- **Isolated by folder**: Each folder permission is independent
- **Browser-specific**: Permissions don't transfer between different browsers
- **User-controlled**: Students can revoke access anytime via browser settings

### Revoking Permissions
Students can manually revoke access:
1. Chrome Settings → Privacy and Security → Site Settings
2. Find BlinkExam website → Permissions
3. Remove file system permissions
4. Or use browser's "Clear site data" option

## Database Schema

### MongoDB - StudentLibrary Collection
```javascript
{
  userId: ObjectId,
  folders: [
    {
      _id: ObjectId,                    // MongoDB auto-generated
      folderId: "folder_123_abc",       // Unique identifier (links to IndexedDB)
      name: "Semester 1 Videos",
      path: "Semester 1 Videos",
      totalVideos: 10,
      totalPDFs: 5,
      needsAccess: false,               // Permission status flag
      files: [...],
      // ... other metadata
    }
  ]
}
```

### IndexedDB - BlinkExamLibrary Database
```javascript
// Object Store: folderHandles
{
  folderId: "folder_123_abc",           // Primary key
  directoryHandle: FileSystemDirectoryHandle,  // Native browser handle
  folderName: "Semester 1 Videos",
  savedAt: "2024-01-15T10:30:00.000Z"
}
```

## API Endpoints

### POST `/library/folder`
```javascript
Request:
{
  name: "Semester 1 Videos",
  path: "Semester 1 Videos",
  folderId: "folder_123_abc",  // Generated by frontend
  files: [...],
  color: "#6366f1"
}

Response:
{
  success: true,
  message: "Folder added",
  data: { /* updated library */ },
  folderId: "folder_123_abc"
}
```

### GET `/library/folder/:folderId`
```javascript
// Accepts MongoDB _id OR folderId
Response:
{
  success: true,
  data: {
    _id: "...",
    folderId: "folder_123_abc",
    name: "Semester 1 Videos",
    // ... folder details
  }
}
```

## Advantages

### For Students
- ✅ **One-time permission** - never asked again after upload
- ✅ **Instant playback** - no delays or prompts when watching videos
- ✅ **Seamless experience** - works like a native app
- ✅ **Privacy maintained** - files stay on their computer

### For System
- ✅ **No file storage costs** - files remain on student devices
- ✅ **Better performance** - direct file access without uploads
- ✅ **Scalable** - no server storage limitations
- ✅ **Secure** - read-only access enforced by browser

## Troubleshooting

### Permission Not Working?
**Symptoms**: Prompted for folder access every time
**Solutions**:
1. Check browser support (Chrome/Edge 86+)
2. Ensure IndexedDB is enabled in browser settings
3. Clear browser cache and re-upload folder
4. Try a different browser (Chrome recommended)

### Can't Find Folder?
**Symptoms**: "File not found" error when playing
**Solutions**:
1. Ensure folder hasn't been moved or renamed on computer
2. Re-grant permission and select the current folder location
3. If folder was moved, delete and re-add to library

### Permission Denied Error?
**Symptoms**: "Permission denied" when accessing files
**Solutions**:
1. Click "Grant Folder Access" button in the yellow banner
2. Select the same folder you originally uploaded
3. Check browser permissions: Settings → Site Settings → Permissions

## Future Enhancements

### Planned Features
- [ ] Auto-detect moved folders and update paths
- [ ] Batch permission management (grant for multiple folders)
- [ ] Permission health check on library page
- [ ] Folder sync to detect new files automatically
- [ ] Export/import folder permissions between devices

### Known Limitations
- Permissions don't sync across different computers
- Requires modern browser (Chrome/Edge)
- Folder must not be moved after upload
- No support for network drives (UNC paths)

## Testing Checklist

- [ ] Upload folder and verify permission saved to IndexedDB
- [ ] Close browser, reopen, verify files play without prompt
- [ ] Delete folder and verify IndexedDB cleaned up
- [ ] Try to play video without permission → shows grant button
- [ ] Grant permission manually → works without re-upload
- [ ] Check permission status indicator (green when granted)
- [ ] Verify works across browser tabs
- [ ] Test with folders containing subdirectories
- [ ] Test with mixed content (videos + PDFs)
- [ ] Verify proper error messages for unsupported browsers

## Developer Notes

### Debugging
Enable console logs to track permission flow:
```javascript
// Look for these console messages:
✅ Folder permission saved to IndexedDB
✅ Loaded folder permission from IndexedDB - no prompt needed!
⚠️ No saved permission found. User will need to grant access when playing files.
```

### IndexedDB Inspection
Chrome DevTools → Application Tab → Storage → IndexedDB → BlinkExamLibrary

### Testing Permission Revocation
```javascript
// In browser console:
indexedDB.deleteDatabase('BlinkExamLibrary');
```

## Conclusion

This feature significantly improves the user experience by eliminating repetitive permission prompts while maintaining security and privacy. Students grant access once during upload, and the system remembers it permanently, making file playback as smooth as using any native application.
