# Testing Checklist for Reattempt Feature

## 📋 Pre-Testing Setup

### ✅ Step 1: Verify Installation
```bash
# Backend
cd backend
npm install
```

```bash
# Frontend
cd frontend
npm install
```

### ✅ Step 2: Check Environment Variables
- [ ] Backend `.env` file exists with MongoDB URI
- [ ] Frontend `.env` file exists with API URL
- [ ] MongoDB is running

### ✅ Step 3: Start Servers
```bash
# Terminal 1 - Backend
cd backend
npm start
# Should see: "✅ MongoDB Connected Successfully"
# Should see: "🚀 Server running on port 5000"
```

```bash
# Terminal 2 - Frontend  
cd frontend
npm start
# Should open browser at http://localhost:3000
```

---

## 🔧 Admin Testing

### ✅ Test 1: Create Test with Reattempt Settings
- [ ] Login as admin
- [ ] Navigate to Create Test page
- [ ] Create a test with:
  - Title: "Sample Test - Reattempt"
  - Exam Type: "SSC"
  - Duration: 30 minutes
  - **allowedAttempts: 3** ← Important!
  - Add at least 5 questions
- [ ] Save test
- [ ] Verify test appears in tests list
- [ ] Note down the test ID from URL or database

**Expected:** Test created successfully with unique MongoDB _id

---

## 👨‍🎓 Student Testing - First Attempt

### ✅ Test 2: View Test Before Taking
- [ ] Login as student (or create new student account)
- [ ] Go to Tests page (`/tests`)
- [ ] Find the test you created
- [ ] Verify **"View Attempts"** button is visible
- [ ] Click "View Attempts"

**Expected:** 
- Should navigate to `/test/[TEST_ID]/attempts`
- Should show "No Attempts Yet" message
- Should show "Start Test" button
- Should NOT show "Reattempt Test" button

### ✅ Test 3: Take First Attempt
- [ ] Click "Start Test" button
- [ ] Go through test instructions
- [ ] Click "Start Test"
- [ ] Answer some questions (mix of correct/incorrect)
- [ ] Submit test
- [ ] View results

**Expected:** 
- Test completes successfully
- Results show score and statistics
- **"View All Attempts"** button visible on results page

### ✅ Test 4: View First Attempt
- [ ] Click "View All Attempts" button
- [ ] Verify attempt is listed
- [ ] Check details:
  - [ ] Shows "Attempt 1"
  - [ ] Shows correct score
  - [ ] Shows "First" badge
  - [ ] Shows "Latest" badge
  - [ ] Shows "Best Score" badge (since it's the only one)
- [ ] Verify "Reattempt Test" button appears
- [ ] Verify attempt counter shows "1 / 3"
- [ ] Verify message: "You can reattempt this test 2 more time(s)"

**Expected:** Single attempt displayed with all badges

---

## 🔄 Student Testing - Second Attempt

### ✅ Test 5: Reattempt Test
- [ ] Click "Reattempt Test" button
- [ ] Confirm in popup (if shown)
- [ ] Go through instructions again
- [ ] Take test with DIFFERENT answers
- [ ] Try to get a higher score
- [ ] Submit test

**Expected:** 
- Test starts fresh
- Previous answers NOT pre-filled
- New attempt created

### ✅ Test 6: View Two Attempts
- [ ] Return to attempts page
- [ ] Verify TWO attempts are listed
- [ ] Check Attempt 1:
  - [ ] Shows "First" badge only
  - [ ] Shows original score
- [ ] Check Attempt 2:
  - [ ] Shows "Latest" badge
  - [ ] Shows "Best Score" badge (if score improved)
  - [ ] Shows new score
- [ ] Verify counter shows "2 / 3"
- [ ] Verify "Reattempt Test" button still appears
- [ ] Click on each attempt to view detailed results

**Expected:** Both attempts listed with proper badges

---

## 📊 Student Testing - Analysis Feature

### ✅ Test 7: View Analysis (2 Attempts)
- [ ] Click "View Analysis" button
- [ ] Verify navigation to `/test/[TEST_ID]/analysis`

#### Overview Tab:
- [ ] Overall stats cards show:
  - [ ] Best Score (highest between attempts)
  - [ ] Average Score (average of both)
  - [ ] Improvement (difference between 1st and 2nd)
  - [ ] Total Attempts (2)
- [ ] Score Progression Chart visible
  - [ ] Shows 2 data points
  - [ ] X-axis: Attempt 1, Attempt 2
  - [ ] Y-axis: Scores
- [ ] Accuracy Progression Chart visible
  - [ ] Shows 2 bars
  - [ ] Different heights based on accuracy

#### Attempts Tab:
- [ ] Lists both attempts
- [ ] Click on attempt → navigates to detailed result
- [ ] Proper sorting (latest first)

#### Questions Tab:
- [ ] All questions listed
- [ ] Each question shows:
  - [ ] Question number and text
  - [ ] Section name
  - [ ] Difficulty level
  - [ ] Success rate percentage
  - [ ] Two boxes (Attempt 1 and 2)
  - [ ] Color coding:
    - Green box = Correct
    - Red box = Incorrect  
    - Gray box = Not attempted

**Expected:** Full analysis dashboard with charts and data

---

## 🔄 Student Testing - Third Attempt

### ✅ Test 8: Take Third Attempt
- [ ] Return to attempts page
- [ ] Click "Reattempt Test"
- [ ] Take test again
- [ ] Try different strategy
- [ ] Submit

### ✅ Test 9: View Three Attempts
- [ ] Return to attempts page
- [ ] Verify THREE attempts listed
- [ ] Verify counter shows "3 / 3"
- [ ] Check badges:
  - [ ] Attempt 1: "First" only
  - [ ] Attempt 2: No special badge (unless best)
  - [ ] Attempt 3: "Latest" badge
  - [ ] One attempt has "Best Score" badge

**Expected:** Three attempts visible

### ✅ Test 10: View Analysis (3 Attempts)
- [ ] Click "View Analysis"
- [ ] Verify all charts show 3 data points
- [ ] Check improvement calculation (Attempt 3 - Attempt 1)
- [ ] Check question analysis shows 3 boxes per question
- [ ] Verify trends are visible

**Expected:** Analysis updated with 3 attempts

---

## 🚫 Student Testing - Maximum Attempts Reached

### ✅ Test 11: Try Fourth Attempt
- [ ] Return to attempts page
- [ ] Verify "Reattempt Test" button is NOT visible
- [ ] Verify message: "Maximum attempts reached"
- [ ] Verify counter shows "3 / 3"
- [ ] Try navigating directly to `/test/[TEST_ID]/instructions`

**Expected:** 
- Cannot start 4th attempt
- Clear message about max attempts reached
- If trying to start via URL, should be blocked by backend

---

## 🔗 Navigation Testing

### ✅ Test 12: All Navigation Links Work
- [ ] From Tests page → "View Attempts" → Correct page
- [ ] From Attempts page → "Reattempt Test" → Instructions
- [ ] From Attempts page → "View Analysis" → Analysis page
- [ ] From Attempts page → Click attempt → Detailed result
- [ ] From Analysis page → Click attempt → Detailed result
- [ ] From Results page → "View All Attempts" → Attempts page
- [ ] From any page → "Back" button → Previous page

**Expected:** All navigation works smoothly

---

## 🎨 UI/UX Testing

### ✅ Test 13: Visual Elements
- [ ] All badges display correctly (colors, text)
- [ ] Charts render properly (no console errors)
- [ ] Responsive design works on mobile
- [ ] Loading states show while fetching data
- [ ] Empty states show when no data
- [ ] Error messages display if API fails
- [ ] Colors are consistent (green/red/blue/purple)
- [ ] Progress bars animate smoothly

### ✅ Test 14: Data Accuracy
- [ ] Scores match between pages
- [ ] Percentages calculated correctly
- [ ] Improvement shown correctly (positive/negative)
- [ ] Question success rates accurate
- [ ] Attempt numbers sequential (1, 2, 3)
- [ ] Dates/times formatted properly
- [ ] Charts display correct values

---

## 🔄 Edge Cases Testing

### ✅ Test 15: Edge Cases
- [ ] Take test with 0 score
- [ ] Take test with 100% score
- [ ] Skip all questions in one attempt
- [ ] Answer all questions in another attempt
- [ ] View analysis with vastly different scores
- [ ] Test with only 1 allowed attempt
- [ ] Test with unlimited attempts (-1)

### ✅ Test 16: Multiple Students
- [ ] Student A takes test → 3 attempts
- [ ] Student B takes same test → 2 attempts
- [ ] Student A can only see their attempts
- [ ] Student B can only see their attempts
- [ ] No data leakage between students

---

## 🔙 Backend API Testing

### ✅ Test 17: API Endpoints (Optional - Use Postman)

**Get Attempts:**
```http
GET http://localhost:5000/api/results/test/[TEST_ID]/attempts
Authorization: Bearer [TOKEN]
```
- [ ] Returns user's attempts only
- [ ] Includes canReattempt flag
- [ ] Includes test info

**Get Analysis:**
```http
GET http://localhost:5000/api/results/test/[TEST_ID]/analysis
Authorization: Bearer [TOKEN]
```
- [ ] Returns all statistics
- [ ] Includes trends arrays
- [ ] Calculates improvement correctly

**Get Question Analysis:**
```http
GET http://localhost:5000/api/results/test/[TEST_ID]/question-analysis
Authorization: Bearer [TOKEN]
```
- [ ] Returns all questions
- [ ] Includes per-attempt data
- [ ] Calculates success rates

---

## 🗃️ Database Testing

### ✅ Test 18: Database Verification
- [ ] Open MongoDB Compass or mongo shell
- [ ] Check `tests` collection
  - [ ] Test document has `allowedAttempts` field
  - [ ] Test has unique `_id`
- [ ] Check `testattempts` collection
  - [ ] Multiple documents with same `test` field (same test ID)
  - [ ] Different `attemptNumber` values (1, 2, 3)
  - [ ] Same `user` field for same student
  - [ ] Each has complete `responses` array
  - [ ] Each has `submittedAt` timestamp

**Expected:** Data structure matches schema

---

## 🎯 Acceptance Criteria

### ✅ Final Verification
- [ ] **Unique Test IDs:** Each test has MongoDB _id ✅
- [ ] **Multiple Attempts:** Students can take test multiple times ✅
- [ ] **Stored Separately:** Each attempt has own document ✅
- [ ] **View All Attempts:** Attempts page shows all attempts ✅
- [ ] **Reattempt Button:** Appears when attempts < allowed ✅
- [ ] **Analysis Dashboard:** Shows comprehensive analytics ✅
- [ ] **Charts:** Visual trends displayed correctly ✅
- [ ] **Question Analysis:** Per-question breakdown works ✅
- [ ] **Improvement Tracking:** Shows progress over time ✅
- [ ] **Max Attempts Enforced:** Cannot exceed allowed attempts ✅

---

## 🐛 Bug Reporting Template

If you find issues, note:

```
**Bug:** [Brief description]
**Steps to Reproduce:**
1. 
2. 
3. 

**Expected:** [What should happen]
**Actual:** [What actually happened]
**Console Errors:** [Any errors in browser console]
**Screenshot:** [If applicable]
```

---

## ✅ Sign-Off

**Tested By:** _______________
**Date:** _______________
**All Tests Passed:** [ ] Yes [ ] No
**Issues Found:** [ ] None [ ] Minor [ ] Major

**Notes:**
_____________________________________
_____________________________________
_____________________________________

---

## 🎉 Success Criteria

All checkboxes marked = Feature is production-ready! 🚀

For any failed tests, check:
1. `REATTEMPT_FEATURE.md` - Technical docs
2. `TROUBLESHOOT_ADMIN.md` - Common issues
3. Browser console for errors
4. Backend logs for API errors
