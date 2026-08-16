# Test Reattempt & Analysis Feature

## Overview
This feature allows students to reattempt tests multiple times and analyze their performance across all attempts. Each test has a unique ID stored in the database, and all attempts are tracked individually.

## Features Implemented

### 1. **Unique Test IDs**
- Every test created by admin automatically gets a unique MongoDB `_id`
- This ID is used to track and group all attempts for that specific test
- Test ID is stored in the `TestAttempt` model's `test` field

### 2. **Multiple Attempts per Test**
- Students can reattempt tests based on `allowedAttempts` setting (configured by admin)
- Each attempt is stored separately with:
  - `attemptNumber`: Sequential number (1, 2, 3, etc.)
  - Complete attempt data (answers, score, time spent, etc.)
  - Submission timestamp
  - Individual statistics

### 3. **View All Attempts**
**Route:** `/test/:testId/attempts`

Students can:
- See all their previous attempts for a test
- View summary of each attempt (score, percentage, accuracy)
- Compare attempts side by side
- Check if they can reattempt
- See "Best Score", "Latest", and "First" badges on attempts
- Click on any attempt to view detailed results

### 4. **Comprehensive Analysis Dashboard**
**Route:** `/test/:testId/analysis`

Features include:

#### Overall Statistics
- Best Score achieved
- Average Score across all attempts
- Improvement (difference between first and last attempt)
- Total number of attempts

#### Score Progression Chart
- Line chart showing score trends across attempts
- Displays both raw score and percentage
- Helps visualize improvement over time

#### Accuracy Progression Chart
- Bar chart showing accuracy trends
- Identifies consistency in performance

#### Attempt Details Tab
- List of all attempts with complete statistics
- Each attempt shows:
  - Attempt number
  - Submission date and time
  - Score and percentage
  - Correct, incorrect, and skipped questions
  - Badges for best/latest/first attempts

#### Question-wise Analysis Tab
- Detailed breakdown of each question
- Shows performance on each question across all attempts
- Success rate per question
- Average time spent per question
- Visual indicators:
  - Green box: Answered correctly
  - Red box: Answered incorrectly
  - Gray box: Not attempted
- Helps identify weak areas

### 5. **Reattempt Functionality**
Students can reattempt a test if:
- Current attempts < `allowedAttempts` configured for that test
- "Reattempt Test" button appears on attempts page
- Clicking reattempt takes them to test instructions

## Backend API Endpoints

### 1. Get All Attempts for a Test
```
GET /api/results/test/:testId/attempts
```
**Response:**
```json
{
  "success": true,
  "attempts": [...],
  "totalAttempts": 3,
  "allowedAttempts": 5,
  "canReattempt": true,
  "test": {
    "id": "...",
    "title": "...",
    "examType": "...",
    "duration": 60,
    "totalMarks": 100
  }
}
```

### 2. Get Test Analysis
```
GET /api/results/test/:testId/analysis
```
**Response:**
```json
{
  "success": true,
  "analysis": {
    "testInfo": {...},
    "totalAttempts": 3,
    "attempts": [...],
    "overall": {
      "bestScore": 85,
      "worstScore": 60,
      "averageScore": 72.5,
      "bestPercentage": 85,
      "averagePercentage": 72.5,
      "improvement": 15,
      "improvementPercentage": 15
    },
    "trends": {
      "scoreProgression": [...],
      "accuracyProgression": [...],
      "timeProgression": [...]
    },
    "strengths": {...}
  }
}
```

### 3. Get Question-wise Analysis
```
GET /api/results/test/:testId/question-analysis
```
**Response:**
```json
{
  "success": true,
  "questionAnalysis": [
    {
      "questionId": "...",
      "questionNumber": 1,
      "questionText": "...",
      "section": "Mathematics",
      "difficulty": "medium",
      "attempts": [
        {
          "attemptNumber": 1,
          "wasAttempted": true,
          "isCorrect": false,
          "marksAwarded": -0.25,
          "timeSpent": 45,
          "status": "answered"
        }
      ],
      "summary": {
        "timesAttempted": 3,
        "timesCorrect": 2,
        "timesIncorrect": 1,
        "successRate": 66.67,
        "averageTimeSpent": 38.5
      }
    }
  ],
  "testInfo": {...}
}
```

## Frontend Components

### 1. **TestAttempts.jsx**
Location: `frontend/src/pages/TestAttempts.jsx`

Displays:
- Test information
- Attempt counter (X/Y attempts used)
- List of all previous attempts
- "Reattempt Test" button (if allowed)
- "View Analysis" button
- Empty state if no attempts

### 2. **TestAnalysis.jsx**
Location: `frontend/src/pages/TestAnalysis.jsx`

Features:
- Three tabs: Overview, Attempts, Questions
- Interactive charts (using Recharts library)
- Performance trends
- Detailed question-wise breakdown
- Color-coded success indicators

### 3. **Updated Components**

#### TestList.jsx
- Added "View Attempts" button next to each test
- Allows quick access to attempt history

#### Results.jsx
- Added "View All Attempts" button for each result
- Links to the test attempts page

#### App.js
- Added routes for `/test/:testId/attempts`
- Added routes for `/test/:testId/analysis`

## Admin Configuration

Admins can set the number of allowed attempts when creating/editing a test:

```javascript
{
  "allowedAttempts": 3, // Set to -1 for unlimited attempts
  // ... other test fields
}
```

## User Flow

### First Time Taking a Test
1. Student browses tests → clicks "Start Test"
2. Takes test and submits
3. Views result
4. Can click "View All Attempts" to see attempt history

### Reattempting a Test
1. Student goes to Tests page
2. Clicks "View Attempts" on any test
3. Sees previous attempts and "Reattempt" button (if allowed)
4. Clicks "Reattempt Test"
5. Goes through test instructions again
6. Takes new attempt
7. New attempt is stored with `attemptNumber` incremented

### Analyzing Performance
1. After multiple attempts, student clicks "View Analysis"
2. Sees comprehensive dashboard with:
   - Overall performance metrics
   - Score progression charts
   - Accuracy trends
   - Question-wise breakdown
3. Identifies weak areas for improvement
4. Can click on individual attempts for detailed review

## Benefits

### For Students
- Track progress over time
- Identify improvement areas
- Build confidence through practice
- Analyze mistakes across attempts
- Visual performance trends

### For Admins
- Control number of attempts per test
- Each test has unique tracking
- Better engagement through reattempts
- Data-driven insights on student performance

## Database Schema

### Test Model
```javascript
{
  _id: ObjectId, // Unique test ID
  title: String,
  allowedAttempts: Number, // Default: 1
  // ... other fields
}
```

### TestAttempt Model
```javascript
{
  _id: ObjectId, // Unique attempt ID
  user: ObjectId, // Reference to User
  test: ObjectId, // Reference to Test (groups attempts)
  attemptNumber: Number, // 1, 2, 3, etc.
  status: String, // 'submitted'
  score: {
    total: Number,
    percentage: Number,
    totalMarks: Number
  },
  statistics: {
    totalQuestions: Number,
    attempted: Number,
    correct: Number,
    incorrect: Number,
    skipped: Number,
    accuracy: Number
  },
  responses: [...], // All answers
  submittedAt: Date
}
```

## Future Enhancements

1. **Leaderboard per Attempt**
   - Compare with other students' attempts
   - Show ranking for each attempt

2. **Time-based Trends**
   - Performance over days/weeks/months
   - Best time of day for taking tests

3. **AI-powered Insights**
   - Personalized recommendations
   - Weak topic identification
   - Study plan suggestions

4. **Export Analysis**
   - Download PDF reports
   - Share analysis with teachers

5. **Comparative Analysis**
   - Compare with class average
   - Percentile rankings

## Testing the Feature

### As Admin:
1. Create a test with `allowedAttempts: 3`
2. Verify test has unique ID in database

### As Student:
1. Take the test first time
2. Go to "View Attempts" - should show 1 attempt
3. Click "Reattempt Test"
4. Take test again with different answers
5. Go to "View Attempts" - should show 2 attempts
6. Click "View Analysis" - should see charts and trends
7. Take test one more time
8. Verify all 3 attempts are tracked
9. Try to take 4th attempt - should be blocked if `allowedAttempts: 3`

## Installation Note

The feature uses Recharts library which is already included in package.json:
```json
"recharts": "^2.8.0"
```

If not installed, run:
```bash
cd frontend
npm install recharts
```

## Conclusion

This feature provides a complete reattempt and analysis system for your mock test platform. Students can practice tests multiple times, track their improvement, and identify areas needing attention. The visual analytics make it easy to understand performance trends and build confidence through repeated practice.
