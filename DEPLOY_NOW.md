# Deploy Your App to Vercel NOW - Step by Step

Your GitHub Repository: `https://github.com/singhramkumar2005/one.in`

---

## Step 1: Push Latest Changes to GitHub (2 minutes)

I've created new configuration files. Let's push them:

```bash
cd "c:\Users\Admin\OneDrive\Desktop\project 2"

# Add all new files
git add .

# Commit changes
git commit -m "Add Vercel deployment configuration"

# Push to GitHub
git push origin main
```

If you get an error about remote, run:
```bash
git remote set-url origin https://github.com/singhramkumar2005/one.in.git
git push origin main
```

---

## Step 2: Deploy Backend to Vercel (5 minutes)

### 2.1: Go to Vercel
1. Open https://vercel.com
2. Click **"Sign Up"** or **"Login"** with GitHub
3. Authorize Vercel to access your GitHub

### 2.2: Import Your Repository
1. Click **"Add New..."** → **"Project"**
2. You'll see your repository: **`singhramkumar2005/one.in`**
3. Click **"Import"**

### 2.3: Configure Backend Deployment
- **Project Name**: `exam-backend` (or any name you like)
- **Framework Preset**: **Other**
- **Root Directory**: Click **"Edit"** → Select **`backend`** → Click **"Continue"**
- **Build Command**: Leave empty
- **Output Directory**: Leave empty
- **Install Command**: `npm install`

### 2.4: Add Environment Variables
Click **"Environment Variables"** and add these:

#### Variable 1: MONGODB_URI
```
Name: MONGODB_URI
Value: [Your MongoDB Atlas connection string]
```

**To get this:**
- Go to https://cloud.mongodb.com
- Click "Database" → "Connect" → "Connect your application"
- Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)
- Replace `<password>` with your actual password
- Replace `<dbname>` with `mocktest` or your database name

#### Variable 2: JWT_SECRET
```
Name: JWT_SECRET
Value: your-super-secret-key-12345
```
(Use any random string, keep it secret!)

#### Variable 3: NODE_ENV
```
Name: NODE_ENV
Value: production
```

#### Variable 4: PORT
```
Name: PORT
Value: 5000
```

### 2.5: Deploy Backend
1. Click **"Deploy"** button
2. Wait 2-3 minutes for deployment
3. ✅ Once done, you'll see: **"Congratulations! Your project has been deployed"**
4. **COPY YOUR BACKEND URL** (looks like: `https://exam-backend.vercel.app` or `https://exam-backend-xxx.vercel.app`)

**Important:** Click on your deployment URL and add `/health` to test:
- Example: `https://exam-backend.vercel.app/health`
- You should see: `{"status":"OK","message":"Server is running"}`

---

## Step 3: Allow Vercel IPs in MongoDB Atlas (2 minutes)

Since Vercel uses dynamic IPs, we need to allow all IPs:

1. Go to https://cloud.mongodb.com
2. Click **"Network Access"** in the left sidebar
3. Click **"Add IP Address"**
4. Click **"Allow Access From Anywhere"**
5. It will show `0.0.0.0/0`
6. Click **"Confirm"**
7. Wait 1-2 minutes for changes to apply

---

## Step 4: Deploy Frontend to Vercel (5 minutes)

### 4.1: Import Repository Again
1. Go back to Vercel Dashboard (https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select **`singhramkumar2005/one.in`** again
4. Click **"Import"**

### 4.2: Configure Frontend Deployment
- **Project Name**: `exam-portal` (or any name you like)
- **Framework Preset**: **Create React App** (should auto-detect)
- **Root Directory**: Click **"Edit"** → Select **`frontend`** → Click **"Continue"**
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 4.3: Add Environment Variable
Click **"Environment Variables"** and add:

```
Name: REACT_APP_API_URL
Value: https://exam-backend.vercel.app
```
(Replace with YOUR actual backend URL from Step 2.5)

### 4.4: Deploy Frontend
1. Click **"Deploy"** button
2. Wait 3-5 minutes for deployment (frontend takes longer)
3. ✅ Once done, you'll see: **"Congratulations! Your project has been deployed"**
4. **COPY YOUR FRONTEND URL** (looks like: `https://exam-portal.vercel.app`)

---

## Step 5: Update Backend CORS (3 minutes)

Now we need to allow your frontend to access your backend:

### 5.1: Update server.js locally
Open `backend/server.js` in your editor and find this section (around line 18-25):

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
  // Add your Vercel frontend URL here after deployment:
  // 'https://your-app-name.vercel.app'
];
```

Replace the commented line with your actual frontend URL:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
  'https://exam-portal.vercel.app',  // Your actual frontend URL
];
```

### 5.2: Push the update
```bash
cd "c:\Users\Admin\OneDrive\Desktop\project 2"

git add backend/server.js
git commit -m "Update CORS for production frontend"
git push origin main
```

Vercel will automatically redeploy your backend in ~1 minute.

---

## Step 6: Add Frontend URL to Backend Environment (Optional but Recommended)

1. Go to Vercel Dashboard
2. Click on your **backend project** (`exam-backend`)
3. Click **"Settings"** → **"Environment Variables"**
4. Click **"Add New"**
5. Add:
   ```
   Name: FRONTEND_URL
   Value: https://exam-portal.vercel.app
   ```
   (Your actual frontend URL)
6. Click **"Save"**
7. Go to **"Deployments"** tab
8. Click **"Redeploy"** on the latest deployment

---

## 🎉 Step 7: Test Your Deployed App!

### 7.1: Open Your App
Go to your frontend URL: `https://exam-portal.vercel.app` (or your actual URL)

### 7.2: Test Features
1. ✅ Click **"Register"** and create a new account
2. ✅ Login with your credentials
3. ✅ Try creating a test
4. ✅ Check if data appears in MongoDB Atlas

### 7.3: Verify Database Connection
1. Go to MongoDB Atlas
2. Click "Database" → "Browse Collections"
3. You should see your database with new data

---

## Step 8: Create Admin User

After successful deployment, you need to create an admin account:

### Option A: Using Local Script (Easier)

```bash
cd "c:\Users\Admin\OneDrive\Desktop\project 2\backend"

# Set your MongoDB URI temporarily
set MONGODB_URI=mongodb+srv://your-connection-string

# Run the admin creation script
node scripts/createAdmin.js
```

Follow the prompts to create your admin account.

### Option B: Register and Manually Update in MongoDB

1. Register a normal account on your deployed app
2. Go to MongoDB Atlas
3. Navigate to your `users` collection
4. Find your user document
5. Change `role: "student"` to `role: "admin"`
6. Save the document

---

## 📊 Your Deployed URLs

After completing all steps, you'll have:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | `https://exam-portal.vercel.app` | Main application |
| **Backend API** | `https://exam-backend.vercel.app` | REST API |
| **Database** | MongoDB Atlas | Data storage |

---

## ⚠️ Known Limitations & Solutions

### Issue 1: File Uploads (OCR, PDFs)
**Problem**: Vercel has 10 MB limit and no persistent storage

**Solution**: Use Cloudinary (free tier available)
- I can help you set this up
- Takes ~10 minutes
- 25 credits/month free

### Issue 2: Cold Starts
**Problem**: First request after inactivity takes 5-10 seconds

**Solution**: This is normal for serverless. Subsequent requests are fast.

### Issue 3: Build Errors
**Problem**: Deployment fails during build

**Solution**: Check deployment logs in Vercel dashboard for specific errors

---

## 🆘 Troubleshooting

### Error: "Cannot connect to database"
**Fix:**
1. Check MongoDB Atlas Network Access allows `0.0.0.0/0`
2. Verify `MONGODB_URI` in Vercel environment variables
3. Check MongoDB Atlas user has correct permissions

### Error: "CORS policy error"
**Fix:**
1. Make sure you completed Step 5
2. Verify your frontend URL is in `backend/server.js` allowedOrigins
3. Redeploy backend after changes

### Error: "API request failed"
**Fix:**
1. Check `REACT_APP_API_URL` in frontend environment variables
2. Test backend directly: `https://your-backend.vercel.app/health`
3. Check browser console for actual error message

### Error: "Module not found"
**Fix:**
1. Check `package.json` has all dependencies
2. Try redeploying

---

## 🚀 Next Steps

After successful deployment:

1. ✅ **Test all features thoroughly**
2. ✅ **Create admin account**
3. ✅ **Set up Cloudinary for file uploads** (I can help!)
4. ✅ **Add custom domain** (optional)
5. ✅ **Share app with users**
6. ✅ **Monitor usage in Vercel dashboard**

---

## 💡 Pro Tips

1. **Auto-deploy**: Any push to GitHub will auto-deploy to Vercel
2. **Preview deployments**: Each pull request gets its own preview URL
3. **Logs**: View real-time logs in Vercel dashboard → Functions tab
4. **Rollback**: Can rollback to previous deployment anytime
5. **Custom domain**: Free HTTPS with custom domain

---

## Need Help?

**If you get stuck on any step:**
1. Check the error message in Vercel deployment logs
2. Test backend health endpoint
3. Verify all environment variables
4. Ask me for help with the specific error!

---

## Summary Checklist

- [ ] Step 1: Push changes to GitHub ✅
- [ ] Step 2: Deploy backend to Vercel ✅
- [ ] Step 3: Allow IPs in MongoDB Atlas ✅
- [ ] Step 4: Deploy frontend to Vercel ✅
- [ ] Step 5: Update CORS in backend ✅
- [ ] Step 6: Add frontend URL to backend env ✅
- [ ] Step 7: Test the deployed app ✅
- [ ] Step 8: Create admin user ✅

---

🎉 **That's it! Your exam management system should now be live on Vercel!**

Your repository: https://github.com/singhramkumar2005/one.in
