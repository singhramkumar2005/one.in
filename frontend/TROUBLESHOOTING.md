# Troubleshooting Steps

## Current Error
`Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object`

## Steps to Fix

### 1. Clear All Caches
```bash
# In the frontend directory
rm -rf node_modules/.cache
rm -rf .next
rm -rf build
```

### 2. Restart Dev Server
```bash
# Stop the current dev server (Ctrl+C)
npm start
```

### 3. Clear Browser Cache
- Open Chrome DevTools (F12)
- Right-click on the refresh button
- Select "Empty Cache and Hard Reload"

### 4. If Error Persists - Reinstall Dependencies
```bash
cd frontend
rm -rf node_modules
npm install
npm start
```

### 5. Check for Circular Dependencies
The error often occurs when there's a circular import. Check if any files are importing each other.

### 6. Verify recharts Installation
```bash
npm uninstall recharts
npm install recharts@2.15.4
```

## Common Causes
1. **Incorrect imports** - Using `import {Component}` when it should be `import Component`
2. **Missing default export** - A component file doesn't have `export default`
3. **Circular dependencies** - Two files importing each other  
4. **Library compatibility** - A package version mismatch
5. **Hot reload issues** - Dev server cache problems

## Quick Test
To identify which component is causing the issue, temporarily comment out imports in App.js one by one until the error disappears.
