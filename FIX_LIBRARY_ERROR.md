# Fix Library 500 Error

## Problem
The library folder save was failing with a 500 error due to a unique index constraint on `folderId` that prevented multiple users from adding folders.

## Solution Applied

### 1. Updated StudentLibrary Model
- Removed the global unique index on `folderId` 
- File: `backend/models/StudentLibrary.js`

### 2. Created Index Fix Script
- Created a script to drop the old problematic index from MongoDB
- File: `backend/scripts/fixLibraryIndex.js`

## How to Fix

### Step 1: Run the Fix Script
Open a terminal in the `backend` folder and run:

```bash
cd backend
node scripts/fixLibraryIndex.js
```

You should see:
```
Connected to MongoDB
✅ Successfully dropped unique index on folders.folderId
✅ Library index fix completed!
```

### Step 2: Restart the Backend Server
After running the fix script, restart your backend server:

```bash
# Stop the current backend server (Ctrl+C)
# Then start it again
npm start
```

### Step 3: Test
Try adding a folder to the library again. The error should now be resolved!

## What Was Fixed
- ✅ Removed global unique constraint on `folderId`
- ✅ Users can now add folders without conflicts
- ✅ Each user's folders are properly isolated by `userId`

## Note
The `folderId` is still unique within each user's library (enforced in application logic), but not globally across all users in the database.
