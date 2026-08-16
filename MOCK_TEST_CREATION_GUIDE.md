# 🎯 Full Mock Test Creation System - Complete Guide

## Overview
A comprehensive system for creating full mock tests with multiple subjects/sections, bulk question upload, and flexible timing options.

---

## ✨ Key Features

### 1. **Multi-Subject/Section Support**
- Create tests with multiple sections (Physics, Chemistry, Math, etc.)
- Add unlimited sections to a single test
- Each section can have different number of questions
- Edit or delete sections before finalizing

### 2. **Bulk Question Upload**
- Paste all questions at once in a simple text format
- No need to add questions one by one
- Automatic parsing of questions, options, answers, and marks
- Supports hundreds of questions in seconds

### 3. **Flexible Timing Options**
Two timing modes:
- **Individual Section Time**: Set separate time for each section (e.g., Physics: 15 min, Chemistry: 15 min)
- **Total Test Time**: Set overall time limit (e.g., 2 hours for entire test)

### 4. **Three-Step Creation Process**
1. **Basic Info** - Test details and timing mode
2. **Add Sections** - Create subjects with bulk questions
3. **Review & Create** - Review everything before creating

---

## 📝 How to Create a Mock Test

### Step 1: Basic Information

Navigate to: **Admin Dashboard → Create Mock Test**

Fill in:
- **Test Title** * (e.g., "JEE Main Mock Test 2024")
- **Description** (Brief overview of the test)
- **Allowed Attempts** (How many times students can attempt)
- **Total Duration** (In minutes - disabled if using section-wise time)
- **Individual Section Time** (Checkbox)
  - ✅ Check this to set separate time for each section
  - ⬜ Uncheck to use total test duration
- **Test Instructions** (Instructions for students)
- **Publish Immediately** (Make visible to students right away)

**Example:**
```
Title: JEE Main Full Mock Test 2024 - Paper 1
Description: Complete mock test covering Physics, Chemistry, and Mathematics
Allowed Attempts: 3
Total Duration: 180 minutes (or use section-wise)
☑ Set individual section time
Instructions: 
- All questions are compulsory
- Each question carries 4 marks for correct answer
- 1 mark will be deducted for wrong answer
- No negative marking for unattempted questions
```

### Step 2: Add Sections/Subjects

#### Adding a Section:

1. Click **"Add Section"** button
2. Fill section details:
   - **Section Name** * (e.g., "Physics", "Chemistry", "Mathematics")
   - **Description** (Optional - e.g., "Mechanics and Thermodynamics")
   - **Section Duration** * (Only if individual time mode - e.g., 60 minutes)
   - **Paste Questions** * (Bulk format - see below)

3. Click **"Add Section"** or **"Update Section"**

#### Question Format:

Paste your questions in this exact format:

```
Q1. What is the value of acceleration due to gravity on Earth?
A) 8.8 m/s²
B) 9.8 m/s²
C) 10.8 m/s²
D) 11.8 m/s²
Answer: B
Marks: +4, -1

Q2. Which of the following is a scalar quantity?
A) Velocity
B) Acceleration
C) Force
D) Speed
Answer: D
Marks: +4, -1

Q3. The SI unit of force is?
A) Newton
B) Joule
C) Watt
D) Pascal
Answer: A
Marks: +4, -1
```

**Format Rules:**
- Each question starts with `Q1.`, `Q2.`, etc.
- Options labeled as `A)`, `B)`, `C)`, `D)` (or `A.`, `B.`, `C.`, `D.`)
- Answer line: `Answer: B` (capital letter)
- Marks line: `Marks: +4, -1` (positive, negative)
- Blank line between questions (optional)

#### Section Management:

- **Edit Section**: Click edit icon ✏️ to modify
- **Delete Section**: Click trash icon 🗑️ to remove
- **View Summary**: See question count and duration for each section

### Step 3: Review & Create

#### Review Summary Shows:
- Total Sections count
- Total Questions count
- Total Marks available
- Total Duration (calculated or set)
- All sections with their details

#### Final Check:
1. Verify all sections are correct
2. Check question counts
3. Confirm timing settings
4. Review test instructions

Click **"Create Mock Test"** to finalize!

---

## 📋 Example: Complete Mock Test Creation

### Example 1: JEE Main Style (Section-wise Time)

**Step 1 - Basic Info:**
```
Title: JEE Main 2024 - Mock Test 1
Description: Full-length mock test for JEE Main preparation
Allowed Attempts: 2
☑ Set individual section time (checked)
Instructions: Standard JEE instructions...
☑ Publish immediately
```

**Step 2 - Add Sections:**

**Section 1: Physics**
- Duration: 60 minutes
- Questions: 30 questions (paste bulk format)
- Marks: +4, -1 per question

**Section 2: Chemistry**
- Duration: 60 minutes  
- Questions: 30 questions (paste bulk format)
- Marks: +4, -1 per question

**Section 3: Mathematics**
- Duration: 60 minutes
- Questions: 30 questions (paste bulk format)
- Marks: +4, -1 per question

**Result:**
- Total: 90 questions
- Total Time: 180 minutes (3 hours)
- Total Marks: 360
- 3 Sections

---

### Example 2: General Test (Total Time)

**Step 1 - Basic Info:**
```
Title: Competitive Exam Mock Test
Description: General knowledge and aptitude test
Allowed Attempts: 1
Total Duration: 120 minutes
⬜ Set individual section time (unchecked)
```

**Step 2 - Add Sections:**

**Section 1: General Knowledge**
- Questions: 50 questions
- No individual time (uses total)

**Section 2: Reasoning**
- Questions: 40 questions
- No individual time (uses total)

**Section 3: Quantitative Aptitude**
- Questions: 30 questions
- No individual time (uses total)

**Result:**
- Total: 120 questions
- Total Time: 120 minutes (2 hours shared)
- Total Marks: 480
- 3 Sections

---

## 🎓 Subject/Section Examples

### Common Test Structures:

#### JEE Main:
- Physics (30Q, 60min)
- Chemistry (30Q, 60min)
- Mathematics (30Q, 60min)

#### NEET:
- Physics (45Q, 45min)
- Chemistry (45Q, 45min)
- Biology (90Q, 90min)

#### SSC CGL:
- General Intelligence (25Q, 60min)
- General Awareness (25Q, 60min)
- Quantitative Aptitude (25Q, 60min)
- English Comprehension (25Q, 60min)

#### UPSC Prelims:
- General Studies Paper I (100Q, 120min)
- General Studies Paper II - CSAT (80Q, 120min)

#### Bank PO:
- Reasoning Ability (35Q, 60min)
- Quantitative Aptitude (35Q, 60min)
- English Language (30Q, 40min)

---

## 💡 Tips for Creating Quality Mock Tests

### Question Formatting:
1. ✅ Use clear, concise question text
2. ✅ Keep options short and distinct
3. ✅ Ensure only one correct answer
4. ✅ Use consistent marking scheme
5. ✅ Double-check answer keys

### Section Design:
1. ✅ Group similar topics together
2. ✅ Balance difficulty levels
3. ✅ Set appropriate time limits
4. ✅ Consider student experience level
5. ✅ Include variety in question types

### Timing Strategy:
1. ✅ Allow ~1-2 minutes per question
2. ✅ Add buffer time for review
3. ✅ Consider question difficulty
4. ✅ Match real exam patterns
5. ✅ Test timing yourself first

### Quality Assurance:
1. ✅ Review all questions before publishing
2. ✅ Verify answer keys are correct
3. ✅ Check for typos and errors
4. ✅ Test the mock test yourself
5. ✅ Get feedback from others

---

## 🚀 Advanced Features

### Question Parsing:
The system automatically:
- Extracts question text
- Identifies all options (A-D)
- Marks correct answer
- Sets positive/negative marks
- Numbers questions sequentially

### Validation:
The system checks:
- Section name is not empty
- Questions are in correct format
- At least 2 options per question
- Answer is specified
- Marks are specified

### Edit Capability:
You can:
- Edit any section before creating
- Add more sections anytime
- Delete unwanted sections
- Modify question text
- Change timing

---

## 📊 What Students See

### Test List:
- Test title and description
- Total questions and marks
- Duration (total or sectioned)
- Attempt limits
- Start test button

### During Test:
- Section tabs (if multiple sections)
- Question navigation
- Timer (overall or per section)
- Mark for review option
- Submit test button

### After Test:
- Score and percentage
- Section-wise performance
- Question-wise analysis
- Time spent per question
- Correct answers review

---

## 🔧 Technical Details

### Question Format Parser:
- Splits text by `Q1.`, `Q2.`, etc.
- Extracts options using regex
- Identifies answer line
- Parses marks line
- Creates question objects

### Supported Formats:
```
Options: A), B), C), D)
Or: A., B., C., D.
Or: a), b), c), d)

Answer: A or a
Marks: +4, -1 or Marks: 4, 1
```

### Data Structure:
```javascript
{
  title: "Test Title",
  sections: [
    {
      name: "Physics",
      duration: 60,
      questions: [
        {
          questionNumber: 1,
          questionText: "What is...",
          questionType: "single",
          options: [
            { optionText: "Option A", isCorrect: false },
            { optionText: "Option B", isCorrect: true }
          ],
          marks: { positive: 4, negative: 1 }
        }
      ]
    }
  ]
}
```

---

## ❓ Frequently Asked Questions

### Q: Can I create a test with just one section?
**A:** Yes! You can create single-section or multi-section tests.

### Q: What's the maximum number of questions per section?
**A:** No hard limit. The system can handle hundreds of questions.

### Q: Can I mix section-wise and total time?
**A:** No, choose one mode. Either all sections have individual time, or use total time.

### Q: Can students move between sections?
**A:** Yes, students can navigate between sections anytime during the test.

### Q: What happens if I make a mistake?
**A:** You can edit sections before creating. After creation, contact support to modify.

### Q: Can I duplicate an existing test?
**A:** Currently no, but you can copy questions and create a new test.

### Q: How do I see who attempted my test?
**A:** Go to Admin Dashboard → Click on test → View attempts

### Q: Can I unpublish a test?
**A:** Yes, toggle the "Active" status in Admin Dashboard.

### Q: Is negative marking mandatory?
**A:** No, you can set negative marks to 0 (e.g., `Marks: +4, -0`)

### Q: Can I add images to questions?
**A:** Currently, text-only. Image support coming soon!

---

## 🎯 Best Practices

### Before Creating:
1. ✅ Prepare all questions in text format
2. ✅ Organize by subjects/sections
3. ✅ Decide on timing strategy
4. ✅ Set appropriate marks scheme
5. ✅ Write clear instructions

### During Creation:
1. ✅ Fill complete test details
2. ✅ Add sections one by one
3. ✅ Verify question format
4. ✅ Review before clicking create
5. ✅ Test immediately after creation

### After Creation:
1. ✅ Take the test yourself first
2. ✅ Check all questions display correctly
3. ✅ Verify timer works as expected
4. ✅ Confirm marks calculation is correct
5. ✅ Publish when satisfied

---

## 🆘 Troubleshooting

### Problem: Questions not parsing correctly
**Solution:** Check format - ensure proper line breaks, Answer: line, Marks: line

### Problem: Section not adding
**Solution:** Verify section name and questions text are not empty

### Problem: Wrong question count
**Solution:** Check for missing Q numbers or incorrect format

### Problem: Timer issues
**Solution:** Ensure duration is set and mode (section/total) is selected

### Problem: Can't edit after creation
**Solution:** Tests are final. Delete and recreate if needed (or contact support)

---

## 📱 Access Points

### Admin Access:
1. **Admin Dashboard** → Top right → **"Create Mock Test"** (Green button)
2. **Direct URL**: `/admin/create-mock-test`

### Required Role:
- Must be logged in as **Admin**
- Regular users cannot access

---

## ✅ Summary

The Mock Test Creation system allows admins to:
- ✅ Create comprehensive multi-section tests
- ✅ Bulk upload hundreds of questions instantly
- ✅ Set flexible timing (section-wise or total)
- ✅ Edit sections before finalizing
- ✅ Review complete summary before creating
- ✅ Publish immediately or later
- ✅ Track student attempts and performance

Perfect for creating:
- 🎓 Entrance exam mocks (JEE, NEET, UPSC)
- 📚 Competitive exam practice tests
- 🏫 School/college assessments
- 💼 Recruitment tests
- 📖 Subject-wise practice tests

---

## 🚀 Quick Start Guide

1. **Navigate**: Admin Dashboard → Create Mock Test
2. **Step 1**: Enter test title, set timing mode
3. **Step 2**: Click "Add Section" → Paste questions → Add Section
4. **Step 3**: Repeat for each subject
5. **Review**: Check all details
6. **Create**: Click "Create Mock Test"
7. **Test**: Take the test yourself first
8. **Publish**: Make available to students

That's it! Your comprehensive mock test is ready! 🎉
