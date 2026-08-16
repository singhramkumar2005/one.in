# Backend Testing Guide

## Step 1: Check if Backend is Running

### Start Backend Server
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully to mocktest database
🚀 Server running on port 5000
```

## Step 2: Test Backend API

### Using Browser
Open: `http://localhost:5000/health`

Should return:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### Using PowerShell
```powershell
Invoke-WebRequest -Uri http://localhost:5000/health -Method GET
```

### Using Command Prompt
```cmd
curl http://localhost:5000/health
```

## Step 3: Test Registration Endpoint

### Using PowerShell
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:5000/api/auth/register -Method POST -Body $body -ContentType "application/json"
```

### Using curl (if installed)
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

## Common Issues & Solutions

### Issue 1: Port 5000 Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change port in .env file
PORT=5001
```

### Issue 2: MongoDB Connection Failed
**Error:** `MongoDB Connection Error`

**Solutions:**
1. Make sure MongoDB Compass is running
2. Check MongoDB service:
   ```powershell
   # Check if MongoDB is running
   Get-Service -Name MongoDB
   
   # Start MongoDB if not running
   Start-Service -Name MongoDB
   ```

3. Verify connection string in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/
   ```

### Issue 3: Module Not Found
**Error:** `Cannot find module 'express'`

**Solution:**
```bash
cd backend
npm install
```

### Issue 4: CORS Error in Browser
**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:** Already fixed in server.js with:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue 5: 400 Bad Request
Check the console logs in backend terminal for detailed error messages.

Common causes:
- Missing required fields (name, email, password)
- Invalid email format
- Password less than 6 characters
- User already exists with that email

## Debug Mode

### Backend Console Logs
The backend now logs:
- All incoming requests
- Registration data received
- Validation errors
- Database operations
- User creation success/failure

### Frontend Console Logs
The frontend now logs:
- Data being sent to backend
- Registration response
- Detailed error messages

## Manual Testing Flow

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   Wait for: `✅ MongoDB Connected Successfully`

2. **Check Health:**
   Open browser: `http://localhost:5000/health`

3. **Start Frontend:**
   ```bash
   cd frontend
   npm start
   ```

4. **Open Application:**
   Browser should auto-open: `http://localhost:3000`

5. **Register:**
   - Go to Register page
   - Fill in all fields:
     - Name: John Doe
     - Email: john@example.com
     - Phone: 1234567890 (optional)
     - Target Exam: SSC (optional)
     - Password: password123
     - Confirm Password: password123
   - Click "Create Account"

6. **Check Console:**
   - **Backend terminal:** Should show registration logs
   - **Browser console (F12):** Should show request/response

## Success Indicators

✅ Backend console shows:
```
POST /api/auth/register
Register request received: { name: '...', email: '...', ... }
Creating user...
User created successfully: [ObjectId]
```

✅ Frontend shows:
```
Registration successful!
```

✅ Browser redirects to `/dashboard`

## If Still Not Working

1. **Clear Browser Cache:**
   - Press Ctrl + Shift + Delete
   - Clear cached images and files

2. **Restart Both Servers:**
   - Stop backend (Ctrl + C)
   - Stop frontend (Ctrl + C)
   - Start backend first
   - Then start frontend

3. **Check Network Tab:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Try registration
   - Click on the failed request
   - Check "Preview" or "Response" tab for error details

4. **Check Backend Logs:**
   - Look at the backend terminal
   - Should show the exact error

5. **Verify Environment:**
   ```bash
   # Backend
   cd backend
   type .env
   
   # Should show:
   # MONGODB_URI=mongodb://localhost:27017/
   # JWT_SECRET=mocktest_secret_key_2024_change_this_in_production
   ```

## Contact

If the issue persists, share:
1. Backend console output (full logs)
2. Browser console errors (F12)
3. Network tab request/response details
