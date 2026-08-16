# Video Player & PDF Reader - Feature Guide

## 🎥 Video Player Features

### Comprehensive Video Player
A fully-featured video player with all modern controls and functionality.

### Key Features

#### ✅ Playback Controls
- **Play/Pause** - Click video or spacebar
- **Skip Forward/Backward** - 10-second jumps
- **Progress Bar** - Click to seek, visual buffering indicator
- **Keyboard Shortcuts** - Full keyboard control support

#### ✅ Video Quality Controls
- **Playback Speed** - 0.25x to 2x speed options
  - 0.25x, 0.5x, 0.75x, 1x (Normal)
  - 1.25x, 1.5x, 1.75x, 2x
- **Volume Control** - Slider with mute toggle
- **Fullscreen Mode** - Expand to full screen

#### ✅ Progress Tracking
- **Auto-Save Progress** - Automatically tracks watch progress
- **Mark as Complete** - Button to mark video as finished
- **Resume Playback** - Remember where you left off
- **Progress Percentage** - Visual indicator of completion

#### ✅ User Interface
- **Auto-Hide Controls** - Controls fade after 3 seconds of inactivity
- **Show on Movement** - Controls reappear on mouse movement
- **Dark Theme** - Professional dark interface
- **Buffering Indicator** - Shows video buffering status
- **Keyboard Shortcuts Help** - On-screen guide

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Space** | Play/Pause |
| **←/→** | Skip 10 seconds backward/forward |
| **↑/↓** | Volume up/down |
| **F** | Toggle Fullscreen |
| **M** | Mute/Unmute |
| **Esc** | Close Player |

### Supported Video Formats
- MP4 (.mp4)
- AVI (.avi)
- MKV (.mkv)
- MOV (.mov)
- WMV (.wmv)
- FLV (.flv)
- WebM (.webm)
- M4V (.m4v)

---

## 📄 PDF Reader Features

### Simple and Effective PDF Viewer
A streamlined PDF reader with essential controls.

### Key Features

#### ✅ Viewing Controls
- **Embedded Viewer** - Native browser PDF viewer
- **Fullscreen Mode** - Expand to full screen
- **Open in New Tab** - Full browser PDF controls
- **Download Option** - Save PDF locally

#### ✅ Progress Tracking
- **Manual Progress** - Slider to set reading progress (0-100%)
- **Mark as Complete** - Button to mark PDF as finished
- **Auto-Save** - Progress saved automatically

#### ✅ User Interface
- **Dark Theme** - Matches application design
- **Clean Layout** - Minimal, distraction-free
- **Keyboard Support** - Esc to close

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Esc** | Close Reader |

---

## 📁 Folder Analysis Features

### Automatic Video Duration Calculation
When you add a folder, the system automatically:

1. **Scans All Videos** - Recursively finds all video files
2. **Extracts Duration** - Gets actual video duration
3. **Calculates Total Time** - Sums all video durations
4. **Displays Statistics** - Shows total hours/minutes

### How It Works

```javascript
// When adding a folder:
1. User selects folder → System scans recursively
2. For each video file → Create temporary video element
3. Load metadata → Extract duration in seconds
4. Store duration → Save to database
5. Calculate total → Sum all video durations
```

### Duration Display Formats

**Folder Level:**
- Total Duration: `3h 45m` (hours and minutes)
- Per Video: Shows in file table

**Statistics Cards:**
- Library Total: Combined duration across all folders
- Folder Total: Duration for specific folder

---

## 🎯 How to Use

### Playing Videos

1. **Navigate to Folder**
   - Go to My Library
   - Click on any folder

2. **Grant Access** (First Time)
   - Click "Grant Folder Access" button
   - Select the same folder you originally added
   - This allows the app to read files

3. **Play Video**
   - Click the eye icon (👁️) next to any video
   - Video player opens full screen
   - Progress is tracked automatically

4. **Use Player Controls**
   - Click play/pause or use spacebar
   - Adjust volume with slider
   - Change playback speed in settings
   - Seek by clicking progress bar

5. **Mark Complete**
   - Click "Mark Complete" button
   - Or watch until the end (auto-completes)

### Viewing PDFs

1. **Open PDF**
   - Click the eye icon next to any PDF
   - PDF viewer opens full screen

2. **Track Progress**
   - Use progress slider to mark reading progress
   - Click "Mark Complete" when finished
   - Or click "Open in New Tab" for full PDF controls

3. **Close Reader**
   - Press Esc or click X button

---

## 💾 Data Storage

### What's Stored in Database

**Video Files:**
```javascript
{
  name: "Lecture 1.mp4",
  path: "Physics/Chapter1/Lecture 1.mp4",
  type: "video",
  size: 52428800, // bytes
  duration: 1800, // seconds (30 minutes)
  isCompleted: false,
  progress: 45, // 45% watched
  notes: "Important concepts at 15:30"
}
```

**PDF Files:**
```javascript
{
  name: "Notes.pdf",
  path: "Physics/Chapter1/Notes.pdf",
  type: "pdf",
  size: 2097152, // bytes
  isCompleted: true,
  progress: 100,
  notes: "Read pages 1-25"
}
```

### What's NOT Stored
- ❌ Actual video/PDF content
- ❌ File data or binary
- ❌ Blob URLs (generated on-demand)

---

## 🔒 Security & Privacy

### File Access Approach

1. **Initial Scan** (Adding Folder)
   - Request folder access once
   - Extract metadata (duration, size)
   - Store only file information

2. **Playback** (Viewing Files)
   - Request folder access again
   - Create temporary blob URL
   - Play/view file locally
   - URL discarded after closing

### Why This Approach?

✅ **Secure** - Files never uploaded to server  
✅ **Private** - Data stays on your device  
✅ **Efficient** - Only metadata in database  
✅ **Compliant** - Follows browser security model  

---

## 🎨 User Interface

### Video Player Layout

```
┌─────────────────────────────────────────────────┐
│ [X Close]                    [Keyboard Shortcuts]│
│                                                   │
│                                                   │
│                 VIDEO DISPLAY                     │
│                                                   │
│                                                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 45% │
│ 0:15                                       30:00 │
│                                                   │
│ [▶] [<<10s] [10s>>] [🔊───] Physics_Lec1.mp4   │
│                      [⚙ 1x] [✓ Complete] [⛶]   │
└─────────────────────────────────────────────────┘
```

### PDF Reader Layout

```
┌─────────────────────────────────────────────────┐
│ [X] Notes.pdf            Progress: [====] 75%  │
│                    [✓ Complete] [↗] [↓] [⛶]   │
├─────────────────────────────────────────────────┤
│                                                   │
│                  PDF VIEWER                       │
│              (Browser Native)                     │
│                                                   │
│                                                   │
│                    Controls Help                  │
│                 • Adjust progress slider          │
│                 • Open in new tab                 │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Performance

### Video Player
- **Lazy Loading** - Videos load on demand
- **Buffering** - Smart buffering indicator
- **Memory Efficient** - Cleans up on close

### PDF Reader
- **Native Rendering** - Uses browser's PDF engine
- **Fast Load** - Embedded iframe approach
- **Low Memory** - No heavy libraries

### Duration Extraction
- **One-Time** - Only when adding folder
- **Asynchronous** - Doesn't block UI
- **Accurate** - Real duration from metadata

---

## 🐛 Troubleshooting

### Video Won't Play

**Issue**: Video player opens but video doesn't play  
**Cause**: Folder access not granted or lost  
**Fix**:
1. Click "Grant Folder Access" button
2. Select the original folder
3. Try playing video again

### "Please select the folder" Message

**Issue**: See prompt to select folder when playing video  
**Cause**: Browser security - blob URLs don't persist  
**Fix**:
1. Select the same folder you added initially
2. Access granted for current session
3. Will need to grant again after page refresh

### Duration Shows 0:00

**Issue**: Videos show 0 duration  
**Cause**: Duration extraction failed during import  
**Fix**:
1. Remove and re-add the folder
2. Ensure videos are valid format
3. Wait for complete scan

### PDF Not Loading

**Issue**: PDF viewer shows blank screen  
**Cause**: File access or browser PDF support  
**Fix**:
1. Grant folder access
2. Click "Open in New Tab" instead
3. Ensure PDF is valid format

---

## 📊 Statistics Display

### Total Video Duration

**Library Level:**
```
Total Duration: 24h 35m
Across 5 folders, 142 videos
```

**Folder Level:**
```
Folder: Physics
Total Videos: 45
Total Duration: 8h 20m
Completed: 12 videos (3h 10m)
Remaining: 33 videos (5h 10m)
```

**Per Video:**
```
Lecture 1.mp4
Duration: 30:25
Progress: 45% (13:41 watched)
```

---

## 🎓 Best Practices

### For Students

1. **Grant Access Once Per Session**
   - Grant folder access when opening folder
   - Valid until page refresh

2. **Track Progress Regularly**
   - Progress saves automatically for videos
   - Manually set for PDFs

3. **Use Playback Speed**
   - 1.25x or 1.5x for review
   - 0.75x for complex topics

4. **Add Notes**
   - Use notes field for timestamps
   - Mark important sections

### For Administrators

1. **Folder Organization**
   - Encourage clear folder structure
   - One subject per folder

2. **File Formats**
   - Recommend MP4 for videos
   - Use standard PDF format

3. **User Guidance**
   - Explain folder access requirement
   - Provide folder structure examples

---

## 🔄 Future Enhancements

### Potential Features

1. **Video Bookmarks**
   - Save specific timestamps
   - Jump to important sections

2. **Playback Resume**
   - Remember position per video
   - Auto-resume from last watched

3. **Subtitles/Captions**
   - Load .srt files
   - Toggle on/off

4. **PDF Annotations**
   - Highlight text
   - Add comments
   - Save annotations

5. **Watch History**
   - Track view count
   - Last watched date
   - Time spent per video

6. **Quality Selection**
   - Multiple resolutions
   - Auto quality

7. **Offline Mode**
   - Cache for offline viewing
   - Service worker integration

---

## 📱 Browser Compatibility

### Video Player
- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

### PDF Reader
- ✅ Chrome (native PDF viewer)
- ✅ Edge (native PDF viewer)
- ✅ Firefox (native PDF viewer)
- ✅ Safari (native PDF viewer)

### File System Access API
- ✅ Chrome 86+
- ✅ Edge 86+
- ❌ Firefox (not supported)
- ❌ Safari (not supported)

**Recommended**: Chrome or Edge for full functionality

---

## 📞 Support

### Common Questions

**Q: Why do I need to select folder multiple times?**  
A: Browser security prevents storing direct file access. You grant access per session.

**Q: Are my files uploaded to server?**  
A: No. Only metadata (name, size, duration) is stored. Files stay on your device.

**Q: Can I use on mobile?**  
A: Video/PDF players work, but folder selection requires desktop browser.

**Q: Duration not showing?**  
A: Re-add folder. Extraction happens during import.

---

**Version**: 1.0.0  
**Last Updated**: August 2026  
**Feature Status**: ✅ Fully Implemented

---

### 🌟 Enjoy Your Enhanced Study Experience! 🌟
