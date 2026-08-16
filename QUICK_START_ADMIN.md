# 🚀 Quick Start Guide for Admin

## Create Admin Account (2 minutes)

### Step 1: Start Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### Step 2: Create Admin User

**Option 1: MongoDB Compass (Easiest)**
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017/`
3. Create database: `mocktest`
4. Create collection: `users`
5. Click "Add Data" → "Insert Document"
6. Paste this:

```json
{
  "name": "Admin User",
  "email": "admin@mocktest.com",
  "password": "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILXw3F5m2",
  "role": "admin",
  "avatar": "https://via.placeholder.com/150",
  "phone": "1234567890",
  "subscription": {
    "plan": "elite",
    "isActive": true
  },
  "createdAt": { "$date": "2024-01-01T00:00:00.000Z" }
}
```

7. Click "Insert"

**Login:** admin@mocktest.com / admin123

---

## Create Your First Test (5 minutes)

### Step 1: Login as Admin
1. Go to: `http://localhost:3000/login`
2. Email: `admin@mocktest.com`
3. Password: `admin123`
4. Click "Sign in"

### Step 2: Go to Admin Panel
1. Click "Admin Panel" in navbar
2. Or go to: `http://localhost:3000/admin`

### Step 3: Create Test
1. Click "Create New Test"
2. Fill in:
   ```
   Test Title: My First Mock Test
   Exam Type: SSC
   Duration: 30 minutes
   Total Marks: 10
   Difficulty: Easy
   Description: Practice test
   ```

### Step 4: Add Section
1. Section Name: "General Knowledge"
2. Click "Add Question"

### Step 5: Add Question
```
Question: What is the capital of India?

Options:
A. Mumbai
B. Delhi ✓ (Check this)
C. Kolkata
D. Chennai

Positive Marks: 1
Negative Marks: 0.25
```

### Step 6: Add More Questions
- Add at least 10 questions
- Mix easy and medium difficulty
- Verify correct answers

### Step 7: Make Test Live
- ✓ Check "Make Test Live"
- This makes test visible to students

### Step 8: Save Test
- Click "Create Test"
- Success! Test is now live

---

## Verify Test is Live

### As Admin:
1. Go to Admin Dashboard
2. See your test with "● Live" badge
3. See total questions and duration

### As Student:
1. Logout from admin
2. Register new student account
3. Go to "Tests" page
4. Your test should appear!
5. Click "Start Test"

---

## Quick Test Using Sample Data

### Fastest Way (30 seconds)

1. Open MongoDB Compass
2. Go to `mocktest` → `tests` collection
3. Click "Add Data" → "Insert Document"
4. Copy from `SAMPLE_TEST_DATA.json` file
5. Make sure `"isActive": true`
6. Click "Insert"
7. Done! Test is live

---

## Test Visibility Control

### Make Test Live (Visible)
```javascript
"isActive": true
```
- Students can see in test list
- Students can start test
- Appears in browse tests page

### Make Test Draft (Hidden)
```javascript
"isActive": false
```
- Only admin can see
- Students cannot access
- Good for testing/editing

---

## Admin Dashboard Features

### View Tests
- ✅ See all created tests
- ✅ See Live/Draft status
- ✅ See total attempts
- ✅ See question count

### Manage Tests
- 👁️ **Eye Icon** - Activate/Deactivate test
- ✏️ **Edit Icon** - Edit test (coming soon)
- 🗑️ **Trash Icon** - Delete test

### Statistics
- 📊 Total tests created
- 📊 Active tests (live)
- 📊 Total users
- 📊 Total attempts

---

## Common Tasks

### Activate a Test
1. Go to Admin Dashboard
2. Find your test
3. Click eye icon (if grayed out)
4. Test is now live!

### Deactivate a Test
1. Go to Admin Dashboard
2. Find your test
3. Click eye icon (if colored)
4. Test is now hidden from students

### Delete a Test
1. Go to Admin Dashboard
2. Find your test
3. Click trash icon
4. Confirm deletion
5. Test and all attempts deleted

---

## Pro Tips

### Before Making Test Live
- ✓ Review all questions
- ✓ Verify correct answers
- ✓ Check marking scheme
- ✓ Add clear instructions
- ✓ Set appropriate duration

### Best Practices
- Keep tests as draft while editing
- Test yourself before publishing
- Monitor first few student attempts
- Update based on feedback

### Question Quality
- Write clear, unambiguous questions
- Verify all correct answers
- Add explanations for learning
- Mix difficulty levels
- Use proper grammar

---

## Troubleshooting

### Test Not Showing to Students?

**Check 1:** Is test active?
- Admin Dashboard → Find test
- Should show "● Live" badge
- If shows "○ Draft", click eye icon

**Check 2:** Does test have questions?
- At least 1 section required
- At least 1 question in section

**Check 3:** Refresh student page
- Logout and login again
- Or clear cache (Ctrl+Shift+Delete)

### Can't Login as Admin?

**Check:** User role in database
```javascript
// In MongoDB users collection:
"role": "admin"  // NOT "student"
```

### Test Creation Failed?

**Check:**
- All required fields filled
- At least 1 section added
- At least 1 question added
- Correct answer selected

---

## Next Steps

1. ✅ Create admin account
2. ✅ Create first test
3. ✅ Make test live
4. ✅ Test as student
5. 📊 Monitor results
6. 📝 Add more tests
7. 🎓 Launch to students!

---

## Resources

- **Full Guide:** ADMIN_GUIDE.md
- **Setup Help:** SETUP_INSTRUCTIONS.md
- **Features List:** FEATURES.md
- **Sample Data:** SAMPLE_TEST_DATA.json

---

## Support

Need help?
1. Check ADMIN_GUIDE.md for detailed instructions
2. Check TEST_BACKEND.md for troubleshooting
3. Review console logs for errors
4. Check MongoDB data format

**Admin Login:**
- URL: http://localhost:3000/admin
- Email: admin@mocktest.com
- Password: admin123

**Happy Testing!** 🎉
