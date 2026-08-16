# Complete Vercel Deployment Guide

## Overview
This guide will help you deploy your exam management system to Vercel with MongoDB Atlas.

### What We'll Deploy:
- **Frontend**: React app → Vercel
- **Backend**: Express API → Vercel Serverless Functions
- **Database**: MongoDB Atlas (already running ✅)

---

## Prerequisites

✅ MongoDB Atlas is already running  
✅ Git installed on your computer  
✅ GitHub account  
✅ Vercel account (free - sign up at vercel.com)

---

## Part 1: Prepare Backend for Vercel

### Step 1.1: Create Vercel Configuration

Create a file `backend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 1.2: Update Backend server.js for Vercel

The CORS configuration needs to be updated to allow your Vercel frontend domain.

**Current CORS (local only):**
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

**Updated CORS (for production):**
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-app-name.vercel.app', // Will update after frontend deployment
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### Step 1.3: Update package.json

Ensure your `backend/package.json` has:

```json
{
  "scripts": {
    "start": "node server.js",
    "vercel-build": "echo 'Building for Vercel'"
  },
  "engines": {
    "node": "18.x"
  }
}
```

---

## Part 2: Prepare Frontend for Vercel

### Step 2.1: Create Frontend vercel.json

Create `frontend/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "devCommand": "npm start",
  "installCommand": "npm install",
  "framework": "create-react-app",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 2.2: Update Frontend API URLs

Update your API base URL to use environment variables.

**Find all axios API calls** in your frontend and ensure they use:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

---

## Part 3: Push to GitHub

### Step 3.1: Initialize Git (if not already done)

```bash
cd "c:\Users\Admin\OneDrive\Desktop\project 2"
git init
```

### Step 3.2: Create .gitignore files

**Root .gitignore:**
```
node_modules/
.env
.DS_Store
*.log
build/
dist/
```

**Backend .gitignore (already exists):**
```
node_modules/
.env
uploads/*.pdf
uploads/*.png
uploads/*.jpg
```

**Frontend .gitignore (already exists):**
```
node_modules/
build/
.env
.DS_Store
```

### Step 3.3: Commit and Push

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git branch -M main
```

Create a new repository on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

---

## Part 4: Deploy Backend to Vercel

### Step 4.1: Import Backend Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Click **"Select"** on your repository

### Step 4.2: Configure Backend Project

- **Project Name**: `exam-system-backend` (or your choice)
- **Framework Preset**: Other
- **Root Directory**: `backend`
- **Build Command**: Leave empty
- **Output Directory**: Leave empty
- **Install Command**: `npm install`

### Step 4.3: Add Environment Variables

Click **"Environment Variables"** and add:

```
MONGODB_URI=mongodb+srv://your-atlas-connection-string
JWT_SECRET=your-secret-key-here
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
PORT=5000
```

**Get your MongoDB URI from Atlas:**
- Go to MongoDB Atlas Dashboard
- Click "Connect" → "Connect your application"
- Copy the connection string
- Replace `<password>` with your actual password

### Step 4.4: Deploy

Click **"Deploy"** button and wait for deployment.

✅ Your backend URL will be: `https://exam-system-backend.vercel.app`

---

## Part 5: Deploy Frontend to Vercel

### Step 5.1: Import Frontend Project

1. Go to Vercel Dashboard
2. Click **"Add New..."** → **"Project"**
3. Select the same repository
4. Click **"Select"**

### Step 5.2: Configure Frontend Project

- **Project Name**: `exam-system` (or your choice)
- **Framework Preset**: Create React App
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### Step 5.3: Add Environment Variables

Click **"Environment Variables"** and add:

```
REACT_APP_API_URL=https://exam-system-backend.vercel.app
```

(Use your actual backend URL from Step 4.4)

### Step 5.4: Deploy

Click **"Deploy"** button and wait for deployment.

✅ Your frontend URL will be: `https://exam-system.vercel.app`

---

## Part 6: Update CORS Configuration

### Step 6.1: Update Backend CORS

Now that you have your frontend URL, update your backend's `server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://exam-system.vercel.app', // Your actual frontend URL
  process.env.FRONTEND_URL
];
```

### Step 6.2: Commit and Redeploy

```bash
git add backend/server.js
git commit -m "Update CORS for production"
git push
```

Vercel will automatically redeploy your backend.

---

## Part 7: Test Your Deployment

### Test Checklist:

1. ✅ Open `https://exam-system.vercel.app`
2. ✅ Try to register a new user
3. ✅ Try to login
4. ✅ Create a test
5. ✅ Upload syllabus
6. ✅ Check MongoDB Atlas to verify data is being saved

---

## Part 8: Important Vercel Limitations

⚠️ **File Uploads**: Vercel Serverless Functions have:
- **10 MB** request body limit
- **No persistent storage** (files uploaded will be deleted after function execution)

### Solutions for File Uploads:

**Option A: Use Cloudinary (Recommended)**
- Already in your dependencies
- Free tier: 25 credits/month
- Stores images/PDFs in cloud

**Option B: Use MongoDB GridFS**
- Store files directly in MongoDB
- Free with Atlas free tier (512 MB total)

**Option C: Use AWS S3**
- More storage, pay as you go
- Better for large files

Would you like me to implement Cloudinary for your file uploads?

---

## Part 9: Custom Domain (Optional)

### Add Your Own Domain:

1. Go to Vercel Dashboard
2. Select your frontend project
3. Click "Settings" → "Domains"
4. Add your domain (e.g., `examportal.com`)
5. Follow DNS configuration steps

---

## Troubleshooting

### Issue 1: "Cannot connect to database"
- Check MongoDB Atlas IP whitelist
- Add `0.0.0.0/0` to allow all IPs (Vercel uses dynamic IPs)

### Issue 2: "CORS error"
- Verify CORS configuration in `server.js`
- Check environment variables in Vercel dashboard

### Issue 3: "API calls failing"
- Verify `REACT_APP_API_URL` in frontend environment variables
- Check backend deployment logs in Vercel

### Issue 4: "Build failed"
- Check Vercel deployment logs
- Verify all dependencies are in `package.json`
- Ensure Node version compatibility

---

## Useful Commands

### View Logs:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# View logs
vercel logs <your-project-url>
```

### Redeploy:
```bash
git add .
git commit -m "Update"
git push
```
(Vercel auto-deploys on push)

---

## Cost Analysis

### Free Tier Includes:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Serverless function executions: 100 GB-hours
- ✅ Custom domains (unlimited)
- ✅ Automatic HTTPS
- ✅ Preview deployments

### Likely Usage (50 students):
- Bandwidth: ~5-10 GB/month ✅
- Function executions: ~20 GB-hours ✅
- **Result**: Should stay in free tier

---

## Next Steps

1. ✅ Create the configuration files I outlined above
2. ✅ Push to GitHub
3. ✅ Deploy backend first (to get API URL)
4. ✅ Deploy frontend (using backend API URL)
5. ✅ Update CORS and redeploy
6. ✅ Configure file upload solution (Cloudinary recommended)
7. ✅ Create admin user using your script
8. ✅ Test thoroughly

---

## Need Help?

If you want me to:
1. Create all the configuration files for you
2. Update your CORS configuration
3. Set up Cloudinary for file uploads
4. Create deployment automation scripts

Just let me know! 🚀
