# GitHub Setup Guide

## Current Status

✅ Git initialized locally  
✅ Files committed  
❌ Need to connect to GitHub repository

---

## Option 1: Create a NEW Repository (Recommended - Easiest)

### Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. **Repository name**: `exam-management-system` (or any name you like)
3. **Description**: Exam Management System with React & Node.js
4. **Visibility**: 
   - Choose **Public** (free, anyone can see)
   - Or **Private** (only you can see)
5. ❌ **DO NOT** check "Add a README file"
6. ❌ **DO NOT** check "Add .gitignore"
7. ❌ **DO NOT** choose a license
8. Click **"Create repository"**

### Step 2: Connect Your Local Project

After creating the repository, GitHub will show you commands. Run these in PowerShell:

```powershell
cd "c:\Users\Admin\OneDrive\Desktop\project 2"

# Remove old remote
git remote remove origin

# Add new remote (REPLACE with YOUR repository URL from GitHub)
git remote add origin https://github.com/YOUR_USERNAME/exam-management-system.git

# Push to GitHub
git push -u origin main
```

**If it asks for authentication:**
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your password)

### Step 3: Create Personal Access Token (if needed)

If GitHub asks for password:

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. **Note**: `Vercel Deployment`
4. **Expiration**: 90 days (or your choice)
5. **Select scopes**: Check ✅ **repo** (all repo permissions)
6. Click **"Generate token"**
7. **COPY THE TOKEN** (you won't see it again!)
8. Use this token as password when pushing

---

## Option 2: Use Existing Repository

If you want to use https://github.com/singhramkumar2005/one.in:

### Step 1: Check if Repository Exists

1. Go to https://github.com/singhramkumar2005/one.in
2. Does it show "404 Not Found"?
   - **YES** → Repository doesn't exist, use Option 1 above
   - **NO** → Continue to Step 2

### Step 2: Check Repository Permissions

If repository exists:
1. Are you logged in as `singhramkumar2005`?
2. Do you have write access?

### Step 3: Authenticate and Push

```powershell
cd "c:\Users\Admin\OneDrive\Desktop\project 2"

# Try to push (might ask for credentials)
git push -u origin main
```

If it asks for authentication, you'll need a Personal Access Token (see Option 1, Step 3).

---

## Option 3: Force Push to Existing Repository

If repository exists but is empty or you want to overwrite it:

```powershell
cd "c:\Users\Admin\OneDrive\Desktop\project 2"

# Force push (WARNING: This will overwrite everything in the remote repository!)
git push -u origin main --force
```

---

## After Successful Push

Once you successfully push to GitHub, you'll see:

```
Enumerating objects: 150, done.
Counting objects: 100% (150/150), done.
...
To https://github.com/YOUR_USERNAME/REPO_NAME.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

✅ **Success!** Your code is now on GitHub.

### Next Steps:

1. Go to your GitHub repository URL
2. Refresh the page
3. You should see all your files
4. Now proceed with Vercel deployment (see DEPLOY_NOW.md)

---

## Troubleshooting

### Error: "remote: Repository not found"

**Cause**: Repository doesn't exist or URL is wrong

**Fix**: 
1. Create a new repository on GitHub (Option 1)
2. Or check if you're logged in as the correct user

### Error: "remote: Permission denied"

**Cause**: No write access to repository

**Fix**:
1. Make sure you're logged in as the repository owner
2. Use a Personal Access Token instead of password

### Error: "Authentication failed"

**Cause**: Wrong credentials or password deprecated

**Fix**:
1. Create a Personal Access Token (see Option 1, Step 3)
2. Use token as password when prompted

### Error: "Updates were rejected"

**Cause**: Remote has changes that you don't have locally

**Fix**:
```powershell
git pull origin main --allow-unrelated-histories
git push origin main
```

Or force push (overwrites remote):
```powershell
git push origin main --force
```

---

## Quick Command Reference

```powershell
# Check current remote
git remote -v

# Remove remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/USERNAME/REPO.git

# Push to GitHub
git push -u origin main

# Force push (overwrites remote)
git push -u origin main --force

# Check git status
git status

# View commit history
git log --oneline
```

---

## What to Do NOW

1. **Choose Option 1** (create new repository - easiest)
2. Go to https://github.com/new
3. Create repository `exam-management-system`
4. Copy the commands GitHub shows you
5. Run them in PowerShell
6. Once successful, continue with `DEPLOY_NOW.md`

---

## Need My Help?

Let me know:
1. Which option you want to use (Option 1 is recommended)
2. What error message you see (if any)
3. Your GitHub username

I can help you push to GitHub! 🚀
