# 🚀 Quick Test Setup - See Everything Working!

## Create Sample Test (30 seconds)

### Step 1: Run the Script

Open terminal in backend folder:

```bash
cd backend
npm run create-sample-test
```

### You'll See:
```
✅ MongoDB Connected
🗑️  Cleared old sample tests
✅ Sample test created successfully!

📝 Test Details:
   Title: Sample Mock Test - Quick Start
   Questions: 5
   Duration: 10 minutes
   Total Marks: 5
   Status: ✅ LIVE (Visible to all students)

🔗 Access Test:
   1. Go to: http://localhost:3000/tests
   2. You will see "Sample Mock Test - Quick Start"
   3. Click "Start Test"
   4. Take the test!
```

### Step 2: Take the Test!

1. **Go to Tests Page:**
   ```
   http://localhost:3000/tests
   ```

2. **You'll see the test:**
   ```
   Sample Mock Test - Quick Start
   📝 5 questions | ⏱️ 10 min | 💯 5 marks
   ```

3. **Click "Start Test"**

4. **Read Instructions and Start**

5. **Experience the Real Exam Interface:**
   - Full-screen mode
   - Live timer (10 minutes)
   - 5 questions
   - Mark for review
   - Section navigation
   - Question navigator panel
   - Color-coded status

6. **Submit and See Results:**
   - Total score
   - Correct/Incorrect answers
   - Time taken
   - Detailed analysis

---

## What's in the Sample Test?

### Questions:
1. ✅ What is the capital of India? (Delhi)
2. ✅ How many states are there in India? (28)
3. ✅ Who is known as the Father of the Nation? (Mahatma Gandhi)
4. ✅ What is 5 + 3? (8)
5. ✅ Which planet is the Red Planet? (Mars)

### Features:
- Duration: 10 minutes
- Each question: +1 mark
- Wrong answer: -0.25 marks
- 5 attempts allowed
- Answers shown after submission
- Explanations included

---

## Test the Full Workflow

### As Student:

1. **Browse Tests:**
   - Go to `/tests`
   - See sample test card

2. **Read Instructions:**
   - Click "Start Test"
   - See test details
   - Read instructions
   - Check "I agree"

3. **Take Exam:**
   - Full-screen exam mode
   - Timer counts down
   - Answer questions
   - Mark for review
   - Navigate freely

4. **Submit Test:**
   - Click "Submit Test"
   - Confirm submission
   - See summary

5. **View Results:**
   - Total score and percentage
   - Question-wise analysis
   - Correct answers
   - Explanations
   - Time spent

### As Admin:

1. **View in Admin Panel:**
   ```
   http://localhost:3000/admin
   ```

2. **See the test listed:**
   - Status: ● Live
   - 5 Questions
   - 10 min duration

3. **Manage Test:**
   - Toggle active/inactive
   - Edit (coming soon)
   - Delete
   - View attempts

---

## Now Create Your Own Test!

After seeing the sample test work:

1. **Go to Admin Panel:**
   ```
   http://localhost:3000/admin
   ```

2. **Click "Create New Test"**

3. **Fill in details:**
   - Title: Your test name
   - Exam Type: SSC, Banking, etc.
   - Duration: Minutes
   - Marks: Total marks

4. **Add Section:**
   - Click "Add Section"
   - Name: Section name

5. **Add Questions:**
   - Click "Add Question"
   - Question text
   - 4 options
   - Mark correct answer
   - Set marks

6. **Make it Live:**
   - ✓ Check "Make Test Live"

7. **Save:**
   - Click "Create Test"

---

## Verify Everything Works

### ✅ Checklist:

After running `npm run create-sample-test`:

- [ ] Backend shows: "Sample test created successfully"
- [ ] Go to `/tests` page
- [ ] See "Sample Mock Test - Quick Start"
- [ ] Click "Start Test"
- [ ] See instructions page
- [ ] Click "Start Exam"
- [ ] See full-screen exam interface
- [ ] See timer counting down
- [ ] Answer questions
- [ ] See question navigator working
- [ ] Mark questions for review
- [ ] Submit test
- [ ] See results page
- [ ] See detailed analysis

**If all ✅ - Everything is working perfectly!**

---

## Delete Sample Test

When you want to remove the sample test:

### Method 1: MongoDB Compass
1. Open MongoDB Compass
2. Go to `mocktest` → `tests`
3. Find "Sample Mock Test - Quick Start"
4. Delete document

### Method 2: Admin Panel
1. Go to Admin Panel
2. Find sample test
3. Click trash icon
4. Confirm delete

### Method 3: Run Script Again
```bash
npm run create-sample-test
```
This will delete the old one and create a fresh one.

---

## Troubleshooting

### Script Error: "Module not found"
```bash
cd backend
npm install
npm run create-sample-test
```

### Test Not Showing in /tests Page
**Check:**
1. Test is active (`isActive: true`)
2. Backend is running
3. Refresh page (Ctrl + R)

### Can't Start Test
**Check:**
1. You're logged in
2. Backend is running
3. Check console for errors

### 400 Bad Request Error
This is what you were getting! It means:
- Test ID doesn't exist
- Test was deleted
- Wrong test ID

**Fix:** Run `npm run create-sample-test` to create a valid test

---

## Next Steps

1. ✅ Run: `npm run create-sample-test`
2. ✅ Take the sample test
3. ✅ See results
4. ✅ Create your own test
5. ✅ Share with students!

**Happy Testing!** 🎉
