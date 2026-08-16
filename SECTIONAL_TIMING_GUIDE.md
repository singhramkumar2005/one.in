# ⏱️ Sectional Timing Feature - Complete Guide

## Overview
A comprehensive section-wise timing system that gives each section its own independent timer, automatically moves to the next section when time expires, and prevents going back to previous sections.

---

## ✨ Key Features

### 1. **Two Timing Modes**

#### Mode 1: Total Test Time (Default)
- One timer for entire test
- Students can switch between sections freely
- Total duration applies to all sections combined
- Example: 180 minutes for entire test

#### Mode 2: Section-Wise Timing (New!)
- Each section has its own timer
- Timer resets when moving to next section
- Cannot go back to previous sections
- Example: Physics (60 min) + Chemistry (60 min) + Math (60 min)

---

## 🎯 How It Works

### For Admins (Creating Test):

1. **Enable Sectional Timing**
   - Check ☑ "Set individual time for each section"
   - This enables section-wise timing mode

2. **Set Section Times**
   - Physics Section: Set 60 minutes
   - Chemistry Section: Set 60 minutes
   - Mathematics Section: Set 60 minutes
   - Each section gets independent timer

3. **Result**
   - Test has 3 sections × 60 min each = 180 minutes total
   - But timer shows 60 min for each section separately
   - Students MUST complete each section within its time limit

---

### For Students (Taking Test):

#### When Test Has Sectional Timing:

1. **Test Start**
   - Timer shows current section time (e.g., "60:00")
   - Label shows "Section Time" below timer
   - Previous sections are grayed out (cannot access)
   - Next sections are locked (must complete current first)

2. **During Section**
   - Timer counts down: 60:00 → 59:59 → 59:58...
   - When time reaches 5:00, timer turns RED and pulses
   - Warning: "Section time running out!"

3. **Section Time Expires**
   - Toast notification: "Section time expired! Moving to next section..."
   - Automatically saves current progress
   - Automatically moves to next section
   - Current section becomes grayed out (cannot go back)
   - New section timer starts fresh

4. **Section Navigation**
   - ✅ Can navigate within current section (any question)
   - ❌ Cannot go back to previous sections (grayed out + warning)
   - ❌ Cannot skip to future sections (locked + warning)
   - Previous section tabs show "Completed" indicator

5. **Last Section**
   - When last section time expires
   - Automatically submits entire test
   - Shows: "All sections completed! Submitting test..."

---

## 📊 Visual Differences

### Without Sectional Timing:
```
Timer: [60:00] (Total Test Time)
Sections: [Physics] [Chemistry] [Math] ← All clickable
```

### With Sectional Timing:
```
Timer: [60:00] (Section Time) ← Shows current section time
Sections: [Physics ✓] [Chemistry (60min)] [Math (60min)] 
          ↑ Completed  ↑ Current         ↑ Locked
```

---

## 🎨 UI Elements

### Timer Display:

**Total Time Mode:**
```
┌─────────────────┐
│  ⏰  01:30:00   │  ← Blue timer
└─────────────────┘
```

**Section Time Mode:**
```
┌─────────────────┐
│  ⏰  00:60:00   │  ← Blue timer
│  Section Time   │  ← Label
└─────────────────┘

After 55 minutes:
┌─────────────────┐
│  ⏰  00:05:00   │  ← RED timer + pulse
│  Section Time   │  ← Label
└─────────────────┘
```

### Section Tabs:

**Total Time Mode:**
```
[Physics] [Chemistry] [Math]
  ↑         ↑          ↑
 All sections are clickable anytime
```

**Section Time Mode:**
```
[Physics ✓] [Chemistry (60min)] [Math (60min)]
  ↑ Gray       ↑ Active Blue       ↑ Gray Disabled
  Completed    Current Section     Not Yet Available
```

---

## 🔒 Restrictions in Sectional Timing

### What Students CANNOT Do:

1. ❌ **Go back to previous section**
   - Click on Physics after moving to Chemistry
   - Warning: "Cannot go back to previous section in timed mode!"
   - Previous section tab is grayed out and disabled

2. ❌ **Skip to next section**
   - Click on Math while in Chemistry
   - Warning: "Complete current section first!"
   - Future section tabs are disabled

3. ❌ **Extend section time**
   - No way to get more time for a section
   - When time expires, automatically moves forward

### What Students CAN Do:

1. ✅ **Navigate within current section**
   - Jump to any question in current section
   - Use question navigator freely
   - Mark for review
   - Change answers

2. ✅ **Submit early**
   - Can submit test before time expires
   - Click "Submit Test" button anytime

3. ✅ **See progress**
   - Question status (answered, marked, etc.)
   - Time spent per question
   - Current section progress

---

## 🎓 Real-World Examples

### Example 1: JEE Main Pattern

**Admin Setup:**
```
☑ Set individual section time

Section 1: Physics
- Duration: 60 minutes
- Questions: 30
- Marks: 120

Section 2: Chemistry
- Duration: 60 minutes
- Questions: 30
- Marks: 120

Section 3: Mathematics
- Duration: 60 minutes
- Questions: 30
- Marks: 120

Total: 180 minutes (but section-wise)
```

**Student Experience:**
- Start → Physics section timer: 60:00
- After 60 min → Auto-move to Chemistry → Timer: 60:00
- After 60 min → Auto-move to Math → Timer: 60:00
- After 60 min → Auto-submit test
- Cannot go back to Physics/Chemistry once time expires

---

### Example 2: Bank PO Exam

**Admin Setup:**
```
☑ Set individual section time

Section 1: Reasoning
- Duration: 60 minutes
- Questions: 35

Section 2: Quantitative Aptitude
- Duration: 60 minutes
- Questions: 35

Section 3: English
- Duration: 40 minutes
- Questions: 30
```

**Student Experience:**
- Reasoning: 60 minutes strict
- Quant: 60 minutes strict
- English: 40 minutes strict (shorter!)
- Each section independent

---

### Example 3: UPSC Prelims

**Admin Setup:**
```
⬜ Set individual section time (UNCHECKED)

Total Duration: 120 minutes

Section 1: General Studies
- Questions: 100

Section 2: CSAT
- Questions: 80

No individual time - use total 120 min
```

**Student Experience:**
- Timer shows: 120:00 (total time)
- Can switch between GS and CSAT freely
- Manage time yourself between sections
- Traditional mode

---

## ⚙️ Technical Implementation

### Backend (Test Model):
```javascript
{
  sections: [
    {
      name: "Physics",
      duration: 60, // minutes (if set, enables sectional timing)
      questions: [...]
    },
    {
      name: "Chemistry",
      duration: 60,
      questions: [...]
    }
  ]
}
```

### Frontend Logic:
```javascript
// Check if test has sectional timing
const hasSectionalTiming = test.sections.some(s => s.duration > 0);

if (hasSectionalTiming) {
  // Use section timer
  sectionTimeLeft = currentSection.duration * 60;
  
  // Start section timer
  setInterval(() => {
    sectionTimeLeft--;
    if (sectionTimeLeft === 0) {
      moveToNextSection();
    }
  }, 1000);
} else {
  // Use total timer
  timeLeft = test.duration * 60;
}
```

### Auto-Navigation:
```javascript
handleSectionTimeExpiry() {
  toast.warning('Section time expired!');
  
  if (hasNextSection) {
    moveToNextSection(); // Auto-navigate
    startNewSectionTimer(); // Fresh timer
  } else {
    autoSubmitTest(); // Last section done
  }
}
```

---

## 📋 Admin Checklist

When creating sectional timing test:

- [ ] Check ☑ "Set individual section time"
- [ ] For each section, set duration (e.g., 60 minutes)
- [ ] Ensure all sections have duration set
- [ ] Total time = Sum of all section times
- [ ] Add clear instructions about sectional timing
- [ ] Test yourself before publishing

---

## 📱 Student Instructions

### Before Starting:
1. Read section time limits carefully
2. Plan time management for each section
3. Understand you cannot go back
4. Ensure stable internet connection

### During Test:
1. Watch section timer (not total time)
2. Complete current section within time
3. Don't waste time - timer is strict
4. Answer all questions before time expires
5. Review quickly before section ends

### Important Notes:
- ⚠️ Section time is STRICT - cannot be extended
- ⚠️ Cannot go back to previous sections
- ⚠️ Auto-submits if you don't click next
- ✅ Progress is always auto-saved
- ✅ Can submit entire test early anytime

---

## 🔄 Comparison: Two Modes

| Feature | Total Time Mode | Sectional Time Mode |
|---------|----------------|-------------------|
| Timer Display | One timer for all | Timer per section |
| Section Navigation | Free movement | Locked after time expires |
| Time Management | Student's choice | Enforced by system |
| Going Back | ✅ Allowed | ❌ Not allowed |
| Skipping Ahead | ✅ Allowed | ❌ Not allowed |
| Auto-Navigation | Never | When time expires |
| Best For | Self-paced tests | Structured exams |
| Examples | Practice tests | JEE, NEET, Bank PO |

---

## 🎯 Best Practices

### For Admins:

1. **Clear Instructions**
   - Mention sectional timing in description
   - Add to test instructions
   - Show section times on instructions page

2. **Appropriate Time Allocation**
   - Allow ~1.5-2 min per question
   - Add 5-10 min buffer per section
   - Test yourself first

3. **Section Order**
   - Put easier sections first
   - Balance difficulty across sections
   - Consider student psychology

### For Students:

1. **Time Management**
   - Divide section time by questions
   - Keep 5 min buffer for review
   - Don't get stuck on one question

2. **Strategy**
   - Quick first pass (easy questions)
   - Second pass (medium questions)
   - Final pass (hard questions + review)
   - Mark difficult ones for later

3. **Stay Calm**
   - Section timer can be stressful
   - Focus on current section only
   - Don't worry about next sections

---

## ✅ Feature Status

### Implemented:
- ✅ Section-wise timer display
- ✅ Auto-navigation on time expiry
- ✅ Prevent going back to previous sections
- ✅ Prevent skipping to future sections
- ✅ Visual indicators (grayed out tabs)
- ✅ Section time in tab labels
- ✅ Warning when time is low
- ✅ Auto-submit after last section
- ✅ Instructions page shows section times
- ✅ Progress auto-save

### Working:
- ✅ Timer counts down correctly
- ✅ Section navigation restricted properly
- ✅ Auto-moves to next section at 0:00
- ✅ Shows "Section Time" label
- ✅ Previous sections grayed out
- ✅ Future sections locked

---

## 🚀 Quick Start

### Admin:
1. Go to Create Mock Test
2. Check ☑ "Set individual section time"
3. Add section: Physics (60 min)
4. Add section: Chemistry (60 min)
5. Add section: Math (60 min)
6. Create test → Done!

### Student:
1. Start test
2. See section timer: 60:00
3. Answer Physics questions
4. Time expires → Auto-move to Chemistry
5. Answer Chemistry questions
6. Time expires → Auto-move to Math
7. Answer Math questions
8. Time expires → Auto-submit
9. View results!

---

## 📊 Summary

**Sectional Timing** provides:
- ⏱️ Independent timer per section
- 🔒 Prevents going back after time expires
- 🚀 Auto-navigation to next section
- ⚡ Simulates real exam conditions
- 📱 Clear visual indicators
- ✅ Foolproof time management

Perfect for competitive exams like JEE, NEET, Bank PO, SSC, etc.!

---

**The sectional timing feature is now fully implemented and production-ready!** 🎉
