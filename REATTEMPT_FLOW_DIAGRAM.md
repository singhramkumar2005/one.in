# Test Reattempt & Analysis Flow Diagram

## 🔄 Complete System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN SIDE                                │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │ Create Test  │
    └──────┬───────┘
           │
           ▼
    ┌──────────────────────────┐
    │ Set allowedAttempts: 3   │  ← Each test gets unique _id
    └──────────┬───────────────┘
               │
               ▼
    ┌─────────────────────┐
    │ Test Published      │
    │ Unique ID: 507f...  │
    └─────────┬───────────┘
              │
              │
┌─────────────┴─────────────────────────────────────────────────┐
│                      STUDENT SIDE                               │
└─────────────────────────────────────────────────────────────────┘

              │
              ▼
    ┌─────────────────┐
    │  Browse Tests   │ (/tests)
    │  ┌───────────┐  │
    │  │  Test A   │  │
    │  │ [View     │  │ ← New Button Added
    │  │  Attempts]│  │
    │  └───────────┘  │
    └────┬───────┬────┘
         │       │
         │       └──────────────┐
         │                      │
         ▼                      ▼
┌────────────────┐    ┌─────────────────────┐
│ Start Test     │    │ View Attempts Page  │ (/test/:id/attempts)
│ (First Time)   │    │                     │
└───────┬────────┘    │ ┌─────────────────┐ │
        │             │ │ Attempt 1: 75%  │ │
        │             │ │ Attempt 2: 82%  │ │
        ▼             │ │ Attempt 3: 88%  │ │
┌───────────────┐     │ └─────────────────┘ │
│ Take Test     │     │                     │
│ (60 minutes)  │     │ Buttons:            │
└───────┬───────┘     │ [Reattempt Test]   │ ← If attempts < allowedAttempts
        │             │ [View Analysis]     │
        ▼             └──────────┬──────────┘
┌───────────────┐                │
│ Submit Test   │                │
└───────┬───────┘                │
        │                        │
        ▼                        │
┌─────────────────────┐          │
│ TestAttempt Created │          │
│ attemptNumber: 1    │          │
│ test: 507f...       │ ← Links to test ID
│ user: user_id       │          │
│ score: 75%          │          │
│ status: submitted   │          │
└─────────┬───────────┘          │
          │                      │
          ▼                      │
┌───────────────────┐            │
│ View Result       │            │
│ ┌───────────────┐ │            │
│ │ Score: 75%    │ │            │
│ │ [View Details]│ │            │
│ │ [View All     │ │            │
│ │  Attempts]    │ │ ← New Button
│ └───────────────┘ │            │
└─────┬─────────────┘            │
      │                          │
      └──────────┐               │
                 │               │
                 ▼               ▼
        ┌──────────────────────────────────┐
        │    REATTEMPT FLOW                │
        └──────────────────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │ Click          │
        │ "Reattempt     │
        │  Test"         │
        └───────┬────────┘
                │
                ▼
        ┌────────────────┐
        │ Test           │
        │ Instructions   │
        └───────┬────────┘
                │
                ▼
        ┌────────────────┐
        │ Take Test      │
        │ Again          │
        └───────┬────────┘
                │
                ▼
        ┌─────────────────────┐
        │ New TestAttempt     │
        │ attemptNumber: 2    │
        │ test: 507f...       │ ← Same test ID
        │ score: 82%          │
        └─────────┬───────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │ Both attempts       │
        │ stored separately   │
        └─────────┬───────────┘
                  │
                  │
        ┌─────────┴────────────────────────┐
        │    ANALYSIS FLOW                  │
        └─────────┬────────────────────────┘
                  │
                  ▼
        ┌──────────────────────────┐
        │ Click "View Analysis"    │
        └────────┬─────────────────┘
                 │
                 ▼
        ┌────────────────────────────────┐
        │  Analysis Dashboard            │ (/test/:id/analysis)
        │  ════════════════════════════  │
        │                                │
        │  ┌──────────────────────────┐ │
        │  │  OVERVIEW TAB            │ │
        │  │  ═══════════             │ │
        │  │  ┌────────────────────┐  │ │
        │  │  │ Overall Stats:     │  │ │
        │  │  │ Best: 88%          │  │ │
        │  │  │ Average: 81.67%    │  │ │
        │  │  │ Improvement: +13%  │  │ │
        │  │  └────────────────────┘  │ │
        │  │                          │ │
        │  │  📈 Score Progression    │ │
        │  │     Chart                │ │
        │  │     (Line Chart)         │ │
        │  │                          │ │
        │  │  📊 Accuracy Trend       │ │
        │  │     Chart                │ │
        │  │     (Bar Chart)          │ │
        │  └──────────────────────────┘ │
        │                                │
        │  ┌──────────────────────────┐ │
        │  │  ATTEMPTS TAB            │ │
        │  │  ════════                │ │
        │  │  ┌────────────────────┐  │ │
        │  │  │ Attempt 1: 75%     │  │ │
        │  │  │ [First][Click]     │  │ │
        │  │  ├────────────────────┤  │ │
        │  │  │ Attempt 2: 82%     │  │ │
        │  │  │ [Click]            │  │ │
        │  │  ├────────────────────┤  │ │
        │  │  │ Attempt 3: 88%     │  │ │
        │  │  │ [Latest][Best]     │  │ │
        │  │  └────────────────────┘  │ │
        │  └──────────────────────────┘ │
        │                                │
        │  ┌──────────────────────────┐ │
        │  │  QUESTIONS TAB           │ │
        │  │  ═════════                │ │
        │  │  ┌────────────────────┐  │ │
        │  │  │ Q1: Math Problem   │  │ │
        │  │  │ Success: 66.67%    │  │ │
        │  │  │ [1:❌][2:✅][3:✅] │  │ │
        │  │  ├────────────────────┤  │ │
        │  │  │ Q2: Logic Problem  │  │ │
        │  │  │ Success: 100%      │  │ │
        │  │  │ [1:✅][2:✅][3:✅] │  │ │
        │  │  ├────────────────────┤  │ │
        │  │  │ Q3: Reasoning      │  │ │
        │  │  │ Success: 33.33%    │  │ │
        │  │  │ [1:❌][2:⊘][3:❌]  │  │ │ ← Weak area!
        │  │  └────────────────────┘  │ │
        │  └──────────────────────────┘ │
        └────────────────────────────────┘

```

## 🔀 Data Flow

```
                    ┌──────────────┐
                    │  Test Model  │
                    │  _id: 507f.. │
                    │  title: "..." │
                    │  allowedAttempts: 3
                    └──────┬───────┘
                           │
                           │ Referenced by
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ TestAttempt 1  │ │ TestAttempt 2  │ │ TestAttempt 3  │
│ ─────────────  │ │ ─────────────  │ │ ─────────────  │
│ test: 507f..   │ │ test: 507f..   │ │ test: 507f..   │ ← Same test ID
│ user: user1    │ │ user: user1    │ │ user: user1    │ ← Same user
│ attemptNumber:1│ │ attemptNumber:2│ │ attemptNumber:3│ ← Different attempts
│ score: 75      │ │ score: 82      │ │ score: 88      │
│ submittedAt: T1│ │ submittedAt: T2│ │ submittedAt: T3│
└────────────────┘ └────────────────┘ └────────────────┘
         │                 │                 │
         └─────────────────┴─────────────────┘
                           │
                           │ Queried by
                           │
                           ▼
                  ┌─────────────────┐
                  │ Analysis API    │
                  │ /test/:id/      │
                  │   analysis      │
                  └────────┬────────┘
                           │
                           │ Returns
                           ▼
                  ┌─────────────────┐
                  │ Aggregated Data │
                  │ • Best score    │
                  │ • Trends        │
                  │ • Improvement   │
                  │ • Question stats│
                  └─────────────────┘
```

## 🎯 State Management

```
┌────────────────────────────────────────┐
│  Frontend State (TestAttempts.jsx)     │
├────────────────────────────────────────┤
│                                        │
│  data: {                               │
│    attempts: [                         │
│      { attemptNumber: 1, score: 75 },  │
│      { attemptNumber: 2, score: 82 },  │
│      { attemptNumber: 3, score: 88 }   │
│    ],                                  │
│    totalAttempts: 3,                   │
│    allowedAttempts: 3,                 │
│    canReattempt: false  ← Calculated   │
│  }                                     │
└────────────────────────────────────────┘
```

## 🔐 Authorization Flow

```
Student Request
      │
      ▼
  ┌────────┐
  │ Token  │
  └────┬───┘
       │
       ▼
  ┌──────────┐
  │ Protect  │ ← Auth Middleware
  │ Verify   │
  └────┬─────┘
       │
       ▼
  ┌──────────────┐
  │ Route Handler│
  └────┬─────────┘
       │
       ▼
  ┌──────────────────┐
  │ Filter by user.id │ ← Only user's attempts
  └────┬─────────────┘
       │
       ▼
  ┌───────────┐
  │ Response  │
  └───────────┘
```

## 📊 Analytics Calculation

```
All Attempts → ┌────────────────┐
               │ Calculate:     │
               │                │
               │ • Min score    │
               │ • Max score    │
               │ • Avg score    │
               │ • Improvement  │
               │ • Trends       │
               └────┬───────────┘
                    │
                    ▼
               ┌────────────┐
               │ Per-Question│
               │ Analysis:   │
               │             │
               │ For each Q: │
               │ • Success%  │
               │ • Avg time  │
               │ • Pattern   │
               └────┬────────┘
                    │
                    ▼
               ┌────────────┐
               │   Charts   │
               │ Generated  │
               └────────────┘
```

## 🎨 UI Component Tree

```
App.js
 │
 ├─ /tests (TestList.jsx)
 │   │
 │   └─ TestCard
 │       ├─ [Start Test] Button
 │       └─ [View Attempts] Button ← NEW
 │
 ├─ /test/:id/attempts (TestAttempts.jsx) ← NEW PAGE
 │   │
 │   ├─ Header (Test info)
 │   ├─ Attempt Counter
 │   ├─ Action Buttons
 │   │   ├─ [Reattempt Test]
 │   │   └─ [View Analysis]
 │   │
 │   └─ Attempts List
 │       ├─ Attempt 1 Card
 │       ├─ Attempt 2 Card
 │       └─ Attempt 3 Card
 │
 ├─ /test/:id/analysis (TestAnalysis.jsx) ← NEW PAGE
 │   │
 │   ├─ Header (Test info)
 │   ├─ Overall Stats Cards
 │   ├─ Tabs
 │   │   ├─ Overview Tab
 │   │   │   ├─ Score Chart (Recharts)
 │   │   │   └─ Accuracy Chart (Recharts)
 │   │   │
 │   │   ├─ Attempts Tab
 │   │   │   └─ Attempt Cards List
 │   │   │
 │   │   └─ Questions Tab
 │   │       └─ Question Analysis Cards
 │   │
 │   └─ Footer
 │
 └─ /results (Results.jsx)
     │
     └─ ResultCard
         ├─ [View Details] Button
         └─ [View All Attempts] Button ← NEW
```

## 🔄 Reattempt Logic

```
┌─────────────────────────────────┐
│ Can student reattempt?          │
│                                 │
│ if (totalAttempts < allowed) {  │
│   Show "Reattempt" button       │
│   return true                   │
│ } else {                        │
│   Show "Max attempts" message   │
│   return false                  │
│ }                               │
└─────────────────────────────────┘
```

---

This diagram shows the complete flow from admin creating a test to students reattempting and analyzing their performance!
