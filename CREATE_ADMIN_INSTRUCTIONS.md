# Create Admin User - Quick Guide

## 🎯 Admin Credentials

```
Email: ram1@gmail.com
Password: 123456
```

---

## 🚀 Method 1: Automated Script (Recommended - 10 seconds)

### Step 1: Run the Script

Open terminal in backend folder and run:

```bash
cd backend
npm run create-admin
```

### You'll See:
```
✅ MongoDB Connected
🔐 Password hashed successfully
✅ Admin user created successfully!

📧 Login Credentials:
   Email: ram1@gmail.com
   Password: 123456

🔗 Login URL: http://localhost:3000/login

✨ Admin will be automatically redirected to Admin Panel after login
```

### Step 2: Login

1. Go to: `http://localhost:3000/login`
2. Enter:
   - Email: `ram1@gmail.com`
   - Password: `123456`
3. Click "Sign in"
4. **You will be automatically redirected to Admin Panel!**

---

## 🔄 Method 2: MongoDB Compass (Manual - 2 minutes)

### Step 1: Open MongoDB Compass

1. Connect to: `mongodb://localhost:27017/`
2. Select database: `mocktest`
3. Select collection: `users`
4. Click "Add Data" → "Insert Document"

### Step 2: Insert Admin Document

Paste this JSON:

```json
{
  "name": "Admin Ram",
  "email": "ram1@gmail.com",
  "password": "$2a$12$VRzKpvWzf8F3OsC9q3FJ.eX4Y.KvN8xL7JQGzM5qhE2pY3W8.7JTW",
  "role": "admin",
  "avatar": "https://ui-avatars.com/api/?name=Admin+Ram&background=2563eb&color=fff",
  "phone": "1234567890",
  "targetExam": "All",
  "subscription": {
    "plan": "elite",
    "isActive": true
  },
  "preferences": {
    "notifications": true,
    "emailUpdates": true
  },
  "createdAt": { "$date": "2024-01-01T00:00:00.000Z" }
}
```

### Step 3: Click "Insert"

Admin user is now created!

---

## ✨ How Login Works

### Same Login Page for Everyone

**Students and Admins use the SAME login page:**
- URL: `http://localhost:3000/login`
- Same form, same fields
- No separate admin login page needed

### Automatic Role Detection

When you login, the system:
1. ✅ Checks your email and password
2. ✅ Reads your `role` from database
3. ✅ Redirects based on role:
   - **Admin** (`role: "admin"`) → `/admin` (Admin Dashboard)
   - **Student** (`role: "student"`) → `/dashboard` (Student Dashboard)

### Navbar Changes Automatically

After login:
- **Admin sees:** Admin Panel button
- **Student sees:** Dashboard, Tests, Results buttons

---

## 🔐 How Password Works

### Your Password: `123456`

**In Database:** Stored as hashed string
```
$2a$12$VRzKpvWzf8F3OsC9q3FJ.eX4Y.KvN8xL7JQGzM5qhE2pY3W8.7JTW
```

**When You Login:**
1. You enter: `123456`
2. System hashes it
3. Compares with database hash
4. If match → Login successful ✅

**Security:** Even if someone sees database, they can't know the actual password!

---

## 🧪 Test Login

### Test Admin Login

1. Go to: `http://localhost:3000/login`
2. Enter:
   ```
   Email: ram1@gmail.com
   Password: 123456
   ```
3. Click "Sign in"
4. Should redirect to: `http://localhost:3000/admin`
5. Should see "Admin Dashboard" page

### Test Student Login

1. Go to: `http://localhost:3000/register`
2. Create student account
3. Login with student credentials
4. Should redirect to: `http://localhost:3000/dashboard`
5. Should see "Student Dashboard" page

---

## 🔍 Verify Admin Creation

### Check in MongoDB Compass

1. Open MongoDB Compass
2. Go to: `mocktest` → `users` collection
3. Find document with email: `ram1@gmail.com`
4. Check `role` field: Should be `"admin"`

### Check via Browser Console

After login, open browser console (F12) and type:
```javascript
localStorage.getItem('auth-storage')
```

Should see your user data with `"role":"admin"`

---

## 🐛 Troubleshooting

### Script Error: "MongoDB Connection Error"

**Fix:**
1. Make sure MongoDB is running
2. Check `.env` file has: `MONGODB_URI=mongodb://localhost:27017/`
3. Try connecting with MongoDB Compass first

### Script Error: "Module not found"

**Fix:**
```bash
cd backend
npm install
npm run create-admin
```

### Login Error: "Invalid credentials"

**Check:**
1. Email is exactly: `ram1@gmail.com` (no spaces)
2. Password is exactly: `123456` (no spaces)
3. Admin user exists in database

### Admin Created but Login Redirects to Student Dashboard

**Check:**
1. In MongoDB, verify `"role": "admin"` (not "student")
2. Logout and login again
3. Clear browser cache (Ctrl+Shift+Delete)

### Can't See Admin Panel Button

**Check:**
1. You're logged in as admin (check console)
2. Refresh page (Ctrl+R)
3. Logout and login again

---

## 📝 Quick Reference

### Admin Credentials
```
Email: ram1@gmail.com
Password: 123456
Role: admin
```

### URLs
```
Login Page:        http://localhost:3000/login
Admin Dashboard:   http://localhost:3000/admin
Create Test:       http://localhost:3000/admin/create-test
```

### Create Admin
```bash
cd backend
npm run create-admin
```

### Login Flow
```
Login Page → Enter Credentials → 
  If Admin → /admin
  If Student → /dashboard
```

---

## 🎯 Next Steps After Login

1. ✅ Login as admin
2. ✅ See Admin Panel button in navbar
3. ✅ Click "Admin Panel"
4. ✅ Click "Create New Test"
5. ✅ Add questions
6. ✅ Check "Make Test Live"
7. ✅ Save test
8. ✅ Test is now visible to students!

---

## 💡 Pro Tips

### Multiple Admin Accounts

To create more admin accounts:

**Method 1:** Run script multiple times with different emails
- Edit `createAdmin.js` file
- Change email and password
- Run `npm run create-admin`

**Method 2:** Register as student, then change role
1. Register normal account
2. Go to MongoDB Compass
3. Find your user
4. Change `"role": "student"` to `"role": "admin"`
5. Logout and login again

### Change Admin Password

**In MongoDB:**
1. Find admin user
2. Generate new hash:
   ```javascript
   // In Node.js or browser console
   const bcrypt = require('bcryptjs');
   const hash = await bcrypt.hash('newpassword', 12);
   console.log(hash);
   ```
3. Update `password` field with new hash

### Security Best Practices

- ✅ Use strong password in production
- ✅ Don't share admin credentials
- ✅ Change default password after first login
- ✅ Regularly update passwords
- ✅ Monitor admin activity

---

## 🆘 Need Help?

1. Check `ADMIN_GUIDE.md` for detailed admin guide
2. Check `SETUP_INSTRUCTIONS.md` for setup help
3. Check `TEST_BACKEND.md` for backend testing
4. Check browser console (F12) for errors
5. Check backend terminal for logs

---

**Ready to Go!** 🚀

Run: `npm run create-admin` and start managing tests!
