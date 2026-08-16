# 🚀 START HERE - Mock Test Platform

## ⚡ Quick Setup (5 minutes)

### Step 1: Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### Step 2: Create Admin Account
```bash
cd backend
npm run create-admin
```

**Output:**
```
✅ Admin user created successfully!
Email: ram1@gmail.com
Password: 123456
```

### Step 3: Start Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### Step 4: Login

**Browser automatically opens:** `http://localhost:3000`

**Admin Login:**
- Go to Login page
- Email: `ram1@gmail.com`
- Password: `123456`
- **Automatically redirects to Admin Panel!**

**Student Login:**
- Click "Register here"
- Create student account
- Login with student credentials
- Redirects to Student Dashboard

---

## 📋 What You Can Do

### As Admin (ram1@gmail.com)
✅ Create tests with multiple sections
✅ Add questions with options
✅ Set marking scheme (+/- marks)
✅ Make tests Live or Draft
✅ View all tests and their status
✅ Activate/Deactivate tests
✅ Delete tests
✅ Monitor student attempts

### As Student
✅ Browse available tests
✅ Filter by exam type
✅ Read test instructions
✅ Take tests with full-screen exam interface
✅ Timer with auto-submit
✅ Mark questions for review
✅ Section-wise navigation
✅ View detailed results
✅ See question-wise analysis
✅ Track performance history

---

## 🔑 Login Credentials

### Admin
```
Email: ram1@gmail.com
Password: 123456
URL: http://localhost:3000/login
```

### Create Student
```
URL: http://localhost:3000/register
Fill form and create account
```

---

## 📖 Quick Links

### Application URLs
- **Home:** http://localhost:3000
- **Login:** http://localhost:3000/login
- **Register:** http://localhost:3000/register
- **Admin Panel:** http://localhost:3000/admin
- **Create Test:** http://localhost:3000/admin/create-test
- **Tests List:** http://localhost:3000/tests

### Backend URLs
- **Health Check:** http://localhost:5000/health
- **API Base:** http://localhost:5000/api

---

## 📚 Documentation Files

### Quick Start
- **START_HERE.md** ← You are here
- **CREATE_ADMIN_INSTRUCTIONS.md** - Admin setup guide
- **QUICK_START_ADMIN.md** - Quick admin guide

### Detailed Guides
- **README.md** - Complete project documentation
- **ADMIN_GUIDE.md** - Full admin manual
- **SETUP_INSTRUCTIONS.md** - Detailed setup
- **FEATURES.md** - All features list

### Technical
- **PROJECT_SUMMARY.md** - Technical overview
- **DEPLOYMENT_GUIDE.md** - Production deployment
- **TEST_BACKEND.md** - Backend testing

### Sample Data
- **SAMPLE_TEST_DATA.json** - Example test structure

---

## 🎯 First Test in 2 Minutes

### Quick Way: Use Sample Data

1. **Start MongoDB Compass**
2. **Connect:** `mongodb://localhost:27017/`
3. **Database:** `mocktest`
4. **Collection:** `tests`
5. **Insert Document:** Copy from `SAMPLE_TEST_DATA.json`
6. **Set:** `"isActive": true`
7. **Done!** Test is live

### Manual Way: Use Admin Panel

1. **Login as admin:** ram1@gmail.com / 123456
2. **Click:** "Admin Panel"
3. **Click:** "Create New Test"
4. **Fill:** Title, Type, Duration, Marks
5. **Add Section:** "General Knowledge"
6. **Add Question:** Question text + 4 options
7. **Check:** Correct answer
8. **Check:** "Make Test Live"
9. **Click:** "Create Test"
10. **Done!** Test is live

---

## ✅ Verify Setup

### Check Backend Running
```bash
curl http://localhost:5000/health
```
Should return: `{"status":"OK","message":"Server is running"}`

### Check Frontend Running
Open browser: http://localhost:3000
Should see homepage with navbar

### Check Admin Created
Login with: ram1@gmail.com / 123456
Should redirect to Admin Panel

### Check MongoDB
Open MongoDB Compass
Connect to: mongodb://localhost:27017/
Should see `mocktest` database

---

## 🐛 Common Issues

### Port 5000 Already in Use
```bash
# Change port in backend/.env
PORT=5001
```

### MongoDB Not Connected
```bash
# Check MongoDB is running
# In MongoDB Compass, try connecting
# Make sure .env has: MONGODB_URI=mongodb://localhost:27017/
```

### Admin Login Redirects to Dashboard
```bash
# Check in MongoDB users collection
# Ensure: "role": "admin" (not "student")
```

### Can't Create Admin
```bash
cd backend
npm install bcryptjs
npm run create-admin
```

---

## 🎓 Usage Flow

### Admin Flow
```
Login → Admin Panel → Create Test → Add Sections → 
Add Questions → Make Live → Save → Test Visible to Students
```

### Student Flow
```
Register → Login → Browse Tests → Select Test → 
Read Instructions → Start Exam → Answer Questions → 
Submit → View Results → Detailed Analysis
```

---

## 📞 Need Help?

**Can't create admin?**
→ Read: CREATE_ADMIN_INSTRUCTIONS.md

**Want to create test?**
→ Read: ADMIN_GUIDE.md

**Backend not working?**
→ Read: TEST_BACKEND.md

**Need full setup?**
→ Read: SETUP_INSTRUCTIONS.md

**Want all features?**
→ Read: FEATURES.md

---

## 🎉 You're Ready!

**Admin is created ✅**
**Same login page for everyone ✅**
**Auto-redirect based on role ✅**
**Ready to create tests ✅**

### Next Steps:
1. ✅ Login as admin
2. ✅ Create your first test
3. ✅ Make it live
4. ✅ Test as student
5. 🚀 Launch to users!

**Happy Testing!** 🎊
