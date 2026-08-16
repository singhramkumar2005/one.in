# Vercel Quick Start - 5 Steps to Deploy

## ✅ Your MongoDB Atlas is already running!

Follow these 5 simple steps:

---

## Step 1: Push to GitHub (5 minutes)

```bash
cd "c:\Users\Admin\OneDrive\Desktop\project 2"

# Initialize git if not done
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Create main branch
git branch -M main
```

**Then:**
1. Go to [GitHub.com](https://github.com)
2. Click "+" → "New repository"
3. Name it: `exam-management-system`
4. Click "Create repository"
5. Copy the commands shown and run them:

```bash
git remote add origin https://github.com/YOUR_USERNAME/exam-management-system.git
git push -u origin main
```

---

## Step 2: Deploy Backend (5 minutes)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Select your repository: `exam-management-system`
4. Click **Import**

**Configure Backend:**
- **Root Directory**: Click "Edit" → Select `backend`
- **Framework**: Other
- Click **"Environment Variables"**

**Add these variables:**
```
MONGODB_URI = your-mongodb-atlas-connection-string
JWT_SECRET = any-random-string-like-abc123xyz789
NODE_ENV = production
PORT = 5000
```

**To get MongoDB URI:**
- Go to MongoDB Atlas
- Click "Connect" → "Connect your application"
- Copy the connection string
- Replace `<password>` with your actual password

5. Click **Deploy**
6. Wait 2-3 minutes
7. **Copy your backend URL** (looks like: `https://your-backend.vercel.app`)

---

## Step 3: Add Vercel IP to MongoDB Atlas (2 minutes)

Vercel uses dynamic IPs, so we need to allow all:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click "Network Access" (left sidebar)
3. Click "Add IP Address"
4. Click "Allow Access From Anywhere"
5. Confirm with `0.0.0.0/0`
6. Click "Confirm"

---

## Step 4: Deploy Frontend (5 minutes)

1. Go back to Vercel Dashboard
2. Click **"Add New..."** → **"Project"**
3. Select the **same** repository: `exam-management-system`
4. Click **Import**

**Configure Frontend:**
- **Root Directory**: Click "Edit" → Select `frontend`
- **Framework**: Create React App (auto-detected)
- Click **"Environment Variables"**

**Add this variable:**
```
REACT_APP_API_URL = https://your-backend.vercel.app
```
(Use the URL you copied from Step 2)

5. Click **Deploy**
6. Wait 2-3 minutes
7. **Copy your frontend URL** (looks like: `https://your-frontend.vercel.app`)

---

## Step 5: Update Backend CORS (2 minutes)

We need to allow your frontend to call the backend:

1. Open `backend/server.js` in your code editor
2. Find this line (around line 18):
```javascript
  // 'https://your-app-name.vercel.app'
```
3. Uncomment it and replace with your actual frontend URL:
```javascript
  'https://your-frontend.vercel.app',  // Your actual URL from Step 4
```

4. Save the file
5. Push the update:
```bash
git add backend/server.js
git commit -m "Update CORS for production"
git push
```

Vercel will automatically redeploy your backend in ~1 minute.

---

## 🎉 Done! Test Your App

1. Open your frontend URL: `https://your-frontend.vercel.app`
2. Register a new account
3. Login
4. Try creating a test

---

## Create Admin User

After successful deployment, create an admin:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to backend folder
cd backend

# Set environment variables locally
set MONGODB_URI=your-mongodb-atlas-connection-string

# Create admin
node scripts/createAdmin.js
```

Or run it directly on Vercel using the Functions tab in your backend project.

---

## ⚠️ Important Note: File Uploads

Vercel Serverless Functions have limitations:
- Max request size: 10 MB
- No persistent storage

**For file uploads (OCR, PDFs), you have 3 options:**

### Option 1: Use Cloudinary (Recommended - Free)
- 25 credits/month free
- Already in your dependencies
- I can help you set this up

### Option 2: Use MongoDB GridFS
- Store files in MongoDB Atlas
- Free tier: 512 MB total storage

### Option 3: Use AWS S3
- Pay as you go
- Best for large files

**Want me to set up Cloudinary for you?** It's the easiest option.

---

## Your Free Tier Limits

### Vercel Free Tier:
- ✅ 100 GB bandwidth/month
- ✅ 100 GB-hours serverless execution
- ✅ Unlimited projects
- ✅ Automatic HTTPS
- ✅ Custom domains

### MongoDB Atlas Free Tier:
- ✅ 512 MB storage
- ✅ Shared cluster
- ✅ Enough for 100-500 users

### Expected Usage (50 students):
- Bandwidth: ~5-10 GB/month ✅
- Storage: ~50-100 MB ✅
- **Result: Comfortably within free tier**

---

## Troubleshooting

### "Cannot connect to database"
→ Check MongoDB Atlas Network Access allows `0.0.0.0/0`

### "CORS error"
→ Make sure you updated `server.js` with your frontend URL (Step 5)

### "API not responding"
→ Check backend environment variables in Vercel dashboard

### "Build failed"
→ Check deployment logs in Vercel

---

## Next Steps

1. ✅ Test all features
2. ✅ Set up Cloudinary for file uploads (I can help!)
3. ✅ Add custom domain (optional)
4. ✅ Set up monitoring

**Need help with any step?** Just ask! 🚀
