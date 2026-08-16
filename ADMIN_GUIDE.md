# Admin Guide - Test Management

## 📋 Complete Admin Workflow

### Step 1: Create Admin Account

#### Option A: Using MongoDB Compass (Recommended)
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017/`
3. Click on `mocktest` database (will be created automatically)
4. Click on `users` collection
5. Click "Add Data" → "Insert Document"
6. Paste this JSON:

```json
{
  "name": "Admin User",
  "email": "admin@mocktest.com",
  "password": "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILXw3F5m2",
  "role": "admin",
  "avatar": "https://via.placeholder.com/150",
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

7. Click "Insert"

**Login Credentials:**
- Email: `admin@mocktest.com`
- Password: `admin123`

#### Option B: Register and Manually Change Role
1. Register a normal account
2. Go to MongoDB Compass
3. Find your user in `users` collection
4. Click edit (pencil icon)
5. Change `"role": "student"` to `"role": "admin"`
6. Save

---

## Step 2: Login as Admin

1. Go to `http://localhost:3000/login`
2. Enter admin credentials
3. You'll see "Admin Panel" button in navbar
4. Click "Admin Panel" to access admin dashboard

---

## Step 3: Create a Test

### Method 1: Using Admin Panel UI

1. **Navigate to Admin Panel**
   - Click "Admin Panel" in navbar
   - Or go to `http://localhost:3000/admin`

2. **Start Creating Test**
   - Click "Create New Test" button
   - Or click the "+" icon

3. **Fill Basic Information**
   ```
   Test Title: SSC CGL Mock Test 2024
   Exam Type: SSC (dropdown)
   Duration: 60 minutes
   Total Marks: 100
   Difficulty: Medium (dropdown)
   Language: English (dropdown)
   Description: Complete mock test for SSC CGL exam
   ```

4. **Add Sections**
   - Click "Add Section"
   - Section 1: General Intelligence
   - Section 2: General Awareness
   - Section 3: Quantitative Aptitude
   - Section 4: English Comprehension

5. **Add Questions to Each Section**
   - Click "Add Question" under a section
   - Fill in:
     - Question Text
     - Options A, B, C, D
     - Check the correct answer(s)
     - Positive marks (default: 1)
     - Negative marks (default: 0.25)

6. **Add Instructions (Optional)**
   - "Read all questions carefully"
   - "Negative marking applicable"
   - "Use calculator if needed"

7. **Test Visibility**
   - Check "Active" to make test visible to students
   - Uncheck to keep it as draft

8. **Save Test**
   - Click "Create Test"
   - Test will be saved and visible based on "Active" status

### Method 2: Using Sample Data (Quick Start)

1. **Import Sample Test**
   - Open `SAMPLE_TEST_DATA.json` in project root
   - Copy the JSON content
   - Go to MongoDB Compass
   - Navigate to `mocktest` → `tests` collection
   - Click "Add Data" → "Insert Document"
   - Paste the JSON
   - Change `"isActive": true` to make it visible
   - Click "Insert"

2. **Test is Now Available**
   - Students can see it in Tests page
   - Admin can edit it from Admin Panel

---

## Step 4: Manage Test Visibility

### Making Test Live (Visible to Students)

#### Option A: During Creation
- When creating test, ensure `isActive` checkbox is **checked**
- Test will be immediately visible to all students

#### Option B: After Creation (MongoDB)
1. Go to MongoDB Compass
2. Navigate to `tests` collection
3. Find your test
4. Edit the document
5. Change `"isActive": false` to `"isActive": true`
6. Save

#### Option C: Through API (Coming Soon)
- Admin dashboard will have "Activate/Deactivate" toggle

### Test States

**Draft (Not Live):**
```json
{
  "isActive": false
}
```
- Test is saved but not visible to students
- Admin can still preview and edit
- Good for testing before release

**Live (Visible to All):**
```json
{
  "isActive": true
}
```
- Test appears in student's test list
- Students can start taking the test
- Admin can still monitor attempts

---

## Step 5: Monitor Test Performance

### View Attempts
1. Go to Admin Panel
2. Click on test name
3. See all student attempts
4. View statistics:
   - Total attempts
   - Average score
   - Highest/Lowest scores
   - Time taken

### Analytics (Coming in Admin Panel)
- Number of students attempted
- Section-wise performance
- Question-wise accuracy
- Time management stats

---

## Complete Example: Creating SSC Test

### Test Structure
```
📘 SSC CGL Mock Test 2024
├── 📁 General Intelligence (25 questions)
│   ├── ❓ Coding-Decoding (5)
│   ├── ❓ Number Series (5)
│   ├── ❓ Blood Relations (5)
│   ├── ❓ Analogies (5)
│   └── ❓ Logical Reasoning (5)
│
├── 📁 General Awareness (25 questions)
│   ├── ❓ History (5)
│   ├── ❓ Geography (5)
│   ├── ❓ Polity (5)
│   ├── ❓ Science (5)
│   └── ❓ Current Affairs (5)
│
├── 📁 Quantitative Aptitude (25 questions)
│   ├── ❓ Arithmetic (10)
│   ├── ❓ Algebra (8)
│   └── ❓ Geometry (7)
│
└── 📁 English (25 questions)
    ├── ❓ Grammar (10)
    ├── ❓ Vocabulary (10)
    └── ❓ Comprehension (5)
```

### Step-by-Step Creation

1. **Login as Admin**
   ```
   Email: admin@mocktest.com
   Password: admin123
   ```

2. **Go to Create Test**
   ```
   Admin Panel → Create New Test
   ```

3. **Basic Info**
   ```
   Title: SSC CGL Mock Test 2024
   Exam Type: SSC
   Duration: 60
   Total Marks: 100
   Difficulty: Medium
   ```

4. **Add First Section**
   ```
   Name: General Intelligence and Reasoning
   Description: Logical and analytical reasoning questions
   ```

5. **Add First Question**
   ```
   Question: If BROTHER is coded as CSPUIFS, how will SISTER be coded?
   
   Options:
   ○ A. TJTUPS ✓ (Correct)
   ○ B. TJTUFS
   ○ C. TJSTUFS
   ○ D. TKTUPS
   
   Marks: +1 / -0.25
   Explanation: Each letter is replaced by next letter in alphabet
   ```

6. **Repeat for All Questions**
   - Add 24 more questions to Section 1
   - Add 3 more sections
   - Add 25 questions to each section

7. **Set as Active**
   ```
   ✓ Active (checked)
   ```

8. **Save Test**
   - Click "Create Test"
   - Success message appears
   - Redirected to Admin Dashboard

9. **Verify Test is Live**
   - Logout from admin
   - Login as student (or register new student)
   - Go to Tests page
   - Your test should appear in the list

---

## Student View

### When Test is Active (Live)
✅ Test appears in "Browse Tests" page
✅ Students can see test details
✅ Students can click "Start Test"
✅ Students can read instructions
✅ Students can take the test
✅ Students can view results after submission

### When Test is Inactive (Draft)
❌ Test does NOT appear in student's test list
❌ Even with direct link, students can't access
✅ Only admin can see in Admin Panel
✅ Admin can edit and activate later

---

## Quick Test Creation (JSON Method)

### 1. Create Test Document

```json
{
  "title": "Quick Banking Mock Test",
  "description": "50 questions banking exam",
  "examType": "Banking",
  "difficulty": "medium",
  "duration": 45,
  "totalMarks": 50,
  "language": "English",
  "isActive": true,
  "sections": [
    {
      "name": "Reasoning",
      "description": "Logical reasoning",
      "order": 1,
      "questions": [
        {
          "questionNumber": 1,
          "questionText": "Find the odd one: 3, 5, 7, 9, 11",
          "questionType": "single",
          "options": [
            { "optionText": "3", "isCorrect": false },
            { "optionText": "5", "isCorrect": false },
            { "optionText": "7", "isCorrect": false },
            { "optionText": "9", "isCorrect": true }
          ],
          "explanation": "9 is not a prime number",
          "marks": { "positive": 1, "negative": 0.25 },
          "difficulty": "easy"
        }
      ]
    }
  ],
  "instructions": [
    "Duration: 45 minutes",
    "Total Questions: 50",
    "Negative Marking: -0.25"
  ],
  "isPaid": false,
  "price": 0,
  "showAnswers": true,
  "shuffleQuestions": false,
  "allowedAttempts": 3,
  "createdAt": { "$date": "2024-01-01T00:00:00.000Z" }
}
```

### 2. Insert in MongoDB
- Open Compass
- Go to `mocktest` → `tests`
- Insert this document
- Done! Test is live

---

## Best Practices

### Before Making Test Live
✅ Review all questions
✅ Verify correct answers
✅ Check marking scheme
✅ Test instructions are clear
✅ Set appropriate duration
✅ Preview test yourself

### After Making Test Live
✅ Monitor first few attempts
✅ Check for any issues
✅ Review student feedback
✅ Update if needed (deactivate first)

### Test Management
✅ Keep drafts inactive until reviewed
✅ Use descriptive test titles
✅ Tag tests properly (exam type, difficulty)
✅ Regularly update question bank
✅ Archive old tests

---

## Troubleshooting

### Test Not Showing to Students

**Check 1: Is test active?**
```javascript
// In MongoDB, test document should have:
"isActive": true
```

**Check 2: Is backend running?**
```bash
# Backend should be running on port 5000
cd backend
npm run dev
```

**Check 3: Clear browser cache**
```
Ctrl + Shift + Delete
Clear cached images and files
```

**Check 4: Check test list API**
```
Open browser: http://localhost:5000/api/tests
Should return list of active tests
```

### Students Can't Start Test

**Check 1: Test has questions?**
- Verify test has at least one section
- Section has at least one question

**Check 2: Check allowedAttempts**
```javascript
"allowedAttempts": 3  // Must be > 0
```

### Admin Can't See Test

**Check 1: Verify admin role**
```javascript
// In users collection:
"role": "admin"  // NOT "student"
```

---

## Advanced Features

### Scheduled Tests (Coming Soon)
```javascript
{
  "isActive": true,
  "availableFrom": "2024-06-01T00:00:00Z",
  "availableUntil": "2024-06-30T23:59:59Z"
}
```

### Paid Tests (Coming Soon)
```javascript
{
  "isPaid": true,
  "price": 299
}
```

### Question Bank (Coming Soon)
- Reuse questions across tests
- Category-wise question library
- Import/Export questions

---

## Support

Need help? Check:
1. README.md - General documentation
2. SETUP_INSTRUCTIONS.md - Setup guide
3. FEATURES.md - Feature list
4. TEST_BACKEND.md - Backend testing

---

## Quick Reference

**Admin Login:**
- URL: `http://localhost:3000/login`
- Email: `admin@mocktest.com`
- Password: `admin123`

**Admin Panel:**
- URL: `http://localhost:3000/admin`

**Create Test:**
- URL: `http://localhost:3000/admin/create-test`

**MongoDB:**
- Connection: `mongodb://localhost:27017/`
- Database: `mocktest`
- Collections: `users`, `tests`, `testattempts`

**Make Test Live:**
- Set `"isActive": true` in test document
- Or check "Active" checkbox when creating

**Hide Test:**
- Set `"isActive": false` in test document
- Students won't see it in test list
