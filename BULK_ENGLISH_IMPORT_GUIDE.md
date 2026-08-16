# Bulk English Questions Import - User Guide

## 📚 Overview

This feature allows admins to quickly create English vocabulary tests by pasting bulk questions in a simple text format. The system automatically:
- Parses questions and answers
- Creates 4 multiple-choice options for each question
- Uses the correct answer as one option
- Picks 3 wrong answers from other questions
- Shuffles all options randomly

---

## 🚀 How to Use

### Step 1: Access the Feature
1. Login as an **Admin**
2. Go to **Admin Dashboard**
3. Click on **"Bulk English Questions"** card

### Step 2: Prepare Your Questions

Use this simple format:
```
Q1. [Question text] Ans. [Correct Answer] — [Hindi Translation (optional)]
Q2. [Question text] Ans. [Correct Answer] — [Hindi Translation (optional)]
```

**Example:**
```
Q1. An inscription on a tombstone in memory of a person who has died. Ans. Epitaph — समाधि-लेख
Q2. A person who loves mankind and donates money to help others. Ans. Philanthropist — मानव प्रेमी
Q3. Something no longer in use. Ans. Obsolete — अप्रचलित
Q4. A person who endures pain without showing feelings. Ans. Stoic — सुख-दुःख में समान
Q5. One who does not believe in God. Ans. Atheist — नास्तिक
```

### Step 3: Parse Questions
1. **Paste** your questions in the text area
2. Click **"Parse Questions"** button
3. System will automatically:
   - Extract all questions and answers
   - Create 4 options per question (1 correct + 3 wrong)
   - Show preview of parsed questions

### Step 4: Configure Test
Fill in test details:
- **Test Title** (required): e.g., "English Vocabulary - One Word Substitution"
- **Description** (optional): Brief description of the test
- **Duration**: Time limit in minutes (default: 30)
- **Difficulty**: Easy, Medium, or Hard
- **Make Test Live**: Check to publish immediately, uncheck to save as draft

### Step 5: Create Test
1. Review the preview showing first 3 questions
2. Click **"Create Test"** button
3. Test will be created and visible on Admin Dashboard

---

## 📋 Format Rules

### Required Format
- Each question **MUST** start with `Q1.`, `Q2.`, `Q3.`, etc.
- Use `Ans.` to separate question and answer
- Question number must be sequential

### Optional Elements
- Hindi translation after `—` symbol
- You can skip Hindi translation: `Q1. Question text? Ans. Answer`

### What Gets Parsed
✅ **Question Text**: Everything between `Q1.` and `Ans.`  
✅ **Correct Answer**: Text immediately after `Ans.`  
✅ **Hindi Translation**: Text after `—` symbol (saved as explanation)

---

## 🎯 How Options Are Generated

### Automatic Option Creation
For each question:
1. ✅ **1 Correct Option**: The actual answer from "Ans."
2. ❌ **3 Wrong Options**: Randomly picked from answers of OTHER questions
3. 🔀 **Random Shuffle**: All 4 options are shuffled so correct answer isn't always in position A

### Example
If you have these questions:
```
Q1. A person who loves books. Ans. Bibliophile
Q2. Fear of heights. Ans. Acrophobia
Q3. A person who eats human flesh. Ans. Cannibal
Q4. Fear of confined spaces. Ans. Claustrophobia
```

**Question 1** might get these options (shuffled):
- A. Claustrophobia ❌ (from Q4)
- B. Bibliophile ✅ (correct answer)
- C. Acrophobia ❌ (from Q2)
- D. Cannibal ❌ (from Q3)

---

## ✨ Features

### Automatic Processing
- ✅ Intelligent question parsing
- ✅ Automatic option generation
- ✅ Random shuffling of options
- ✅ Question numbering
- ✅ Marks assignment (1 mark per question)

### Test Configuration
- ✅ Custom test title and description
- ✅ Adjustable time duration
- ✅ Difficulty levels
- ✅ Save as draft or publish immediately
- ✅ Preview before creating

### Quality Assurance
- ✅ Preview first 3 questions before creation
- ✅ See total question count
- ✅ Validation of format
- ✅ Error messages for invalid format

---

## 💡 Tips for Best Results

### 1. Question Quality
- Write clear, unambiguous questions
- Keep questions concise
- Use proper grammar and punctuation

### 2. Answer Consistency
- All answers should be similar in nature (e.g., all single words)
- This makes wrong options more believable
- Avoid very long or very short answers mixed together

### 3. Minimum Questions
- Add at least **4 questions** for best results
- More questions = better variety in wrong options
- Recommended: 10-50 questions per test

### 4. Format Checking
- Use the "Load Example" button to see correct format
- Double-check question numbers are sequential
- Ensure "Ans." separator is present in each line

---

## 🔧 Technical Details

### Backend API
- **Endpoint**: `POST /api/bulk/parse-bulk-english`
- **Request**: `{ bulkText: "Q1. Question? Ans. Answer..." }`
- **Response**: Array of parsed questions with options

### Question Schema
Each parsed question includes:
```javascript
{
  questionNumber: 1,
  questionText: "Question text",
  questionType: "single",
  options: [
    { optionText: "Answer 1", isCorrect: true },
    { optionText: "Answer 2", isCorrect: false },
    { optionText: "Answer 3", isCorrect: false },
    { optionText: "Answer 4", isCorrect: false }
  ],
  marks: { positive: 1, negative: 0.25 },
  difficulty: "medium",
  tags: ["English", "Vocabulary"],
  explanation: "Hindi translation (if provided)"
}
```

---

## ❓ Troubleshooting

### "No valid questions found" Error
**Solution**: Check your format. Each question needs:
- Question number: `Q1.`, `Q2.`, etc.
- Separator: `Ans.`
- Example: `Q1. What is this? Ans. Answer`

### Not Enough Wrong Options
**Solution**: Add more questions. System needs at least 4 questions to create proper multiple-choice options.

### Preview Not Showing
**Solution**: 
1. Click "Parse Questions" first
2. Wait for success message
3. Preview will appear on the right side

### Test Not Created
**Solution**: 
1. Ensure test title is filled
2. Make sure questions are parsed first
3. Check browser console for errors

---

## 📞 Support

For issues or questions about this feature:
1. Check the format rules above
2. Use "Load Example" to see correct format
3. Contact system administrator if problems persist

---

## 🎓 Example Use Cases

### 1. One Word Substitution
```
Q1. A person who studies ancient cultures. Ans. Archaeologist — पुरातत्वविद्
Q2. A place where birds are kept. Ans. Aviary — पक्षीशाला
Q3. A lover of books. Ans. Bibliophile — पुस्तक प्रेमी
```

### 2. Idioms and Phrases
```
Q1. To spill the beans means? Ans. Reveal a secret
Q2. Break the ice means? Ans. Start a conversation
Q3. Hit the nail on the head means? Ans. Do something exactly right
```

### 3. Synonyms
```
Q1. Synonym of Happy? Ans. Joyful
Q2. Synonym of Sad? Ans. Melancholy
Q3. Synonym of Angry? Ans. Furious
```

---

## 🔄 Version History

**Version 1.0** (Initial Release)
- Bulk question parsing
- Automatic option generation
- Random shuffling
- Preview functionality
- Test creation from parsed questions
