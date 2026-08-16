# OCR Question Import Feature - Implementation Plan

## Overview
Allow admins to upload scanned question papers and answer sheets, then automatically extract and create test questions.

## Phase 1: Basic OCR Setup ✅

### Backend Dependencies
```bash
npm install tesseract.js multer sharp pdf-parse
```

### Components to Create:
1. **OCR Service** (`backend/services/ocrService.js`)
   - Extract text from images
   - Parse question format
   - Parse answer format

2. **Upload Route** (`backend/routes/ocr.js`)
   - POST `/api/ocr/upload-questions` - Upload question sheet
   - POST `/api/ocr/upload-answers` - Upload answer sheet
   - POST `/api/ocr/create-test` - Create test from OCR data

3. **Frontend Component** (`frontend/src/pages/admin/ImportTest.jsx`)
   - Upload question sheet
   - Upload answer sheet
   - Preview extracted data
   - Edit/correct extracted data
   - Create test

## Phase 2: Question Parsing Logic

### Question Sheet Format Detection:
```
Q.19. The professor postponed the discussion (1)/ until the
research would be published (2)/ to maintain confidentiality (3)/
of the findings. (4)/
SSC CGL 15/09/2025 (Shift 1)
(a) (1)    (b) (2)    (c) (3)    (d) (4)
```

**Extract:**
- Question Number: Q.19
- Question Text: "The professor postponed..."
- Exam Source: "SSC CGL 15/09/2025 (Shift 1)"
- Options: (a) (1), (b) (2), (c) (3), (d) (4)

### Answer Sheet Format Detection:
```
Sol.23.(b) (2) - were overly optimistic
[Explanation in Hindi/English]
```

**Extract:**
- Solution Number: Sol.23
- Correct Answer: (b) (2)
- Explanation: Hindi/English text

## Phase 3: Intelligent Matching

### Auto-Match Logic:
- Match Q.19 with Sol.19
- Match Q.20 with Sol.20
- Handle missing solutions
- Handle duplicate question numbers

### Validation:
- Ensure all questions have 4 options
- Ensure each question has exactly one correct answer
- Flag mismatches for admin review

## Phase 4: UI/UX

### Upload Flow:
1. Admin clicks "Import Test from OCR"
2. Upload question sheet (drag & drop or file select)
3. System processes → Shows extracted questions
4. Upload answer sheet
5. System matches → Shows matched pairs
6. Preview table with:
   - Q. No
   - Question Text
   - Options (a, b, c, d)
   - Correct Answer
   - Explanation
   - Edit button for each
7. Admin reviews and corrects
8. Click "Create Test" → Test created

### Preview Table:
| Q# | Question | Options | Answer | Explanation | Actions |
|----|----------|---------|--------|-------------|---------|
| 19 | The professor... | (a)(b)(c)(d) | (b) | [text] | ✏️ Edit |
| 20 | Were she to... | (a)(b)(c)(d) | (c) | [text] | ✏️ Edit |

## Phase 5: Advanced Features

### Multi-Column Detection:
- Detect 2-column layouts (like your images)
- Parse "Pinnacle" and "Spot the Error" sections separately

### Language Detection:
- Detect Hindi/English mixed content
- Preserve formatting

### Image Question Support:
- If question contains diagrams
- Extract and store image separately

## API Endpoints

### 1. Upload Question Sheet
```
POST /api/ocr/upload-questions
Content-Type: multipart/form-data
Body: { file: [image/pdf] }

Response:
{
  "success": true,
  "questions": [
    {
      "questionNumber": 19,
      "questionText": "...",
      "options": [
        { "label": "a", "text": "(1)" },
        { "label": "b", "text": "(2)" },
        { "label": "c", "text": "(3)" },
        { "label": "d", "text": "(4)" }
      ],
      "examSource": "SSC CGL 15/09/2025 (Shift 1)"
    }
  ]
}
```

### 2. Upload Answer Sheet
```
POST /api/ocr/upload-answers
Content-Type: multipart/form-data
Body: { file: [image/pdf] }

Response:
{
  "success": true,
  "solutions": [
    {
      "questionNumber": 19,
      "correctAnswer": "b",
      "explanation": "..."
    }
  ]
}
```

### 3. Create Test from OCR
```
POST /api/ocr/create-test
Body: {
  "title": "SSC CGL Mock Test 1",
  "questions": [...],
  "solutions": [...]
}

Response:
{
  "success": true,
  "test": { ... }
}
```

## Technical Challenges

### 1. OCR Accuracy
- **Solution**: Use high-quality OCR (Tesseract.js or Cloud Vision)
- **Fallback**: Allow manual editing

### 2. Complex Formatting
- Multi-column layouts
- Hindi/English mixed text
- Special characters (/, parentheses)
- **Solution**: Regex patterns + AI parsing

### 3. Question Numbering
- Q.19, Q.20, Q.21...
- Sol.19, Sol.20, Sol.21...
- **Solution**: Extract numbers and match

### 4. Option Detection
- (a) (1), (b) (2), (c) (3), (d) (4)
- Sometimes options are text
- **Solution**: Pattern matching for option format

## Regex Patterns

### Question Number:
```javascript
/Q\.(\d+)\./g
// Matches: Q.19., Q.20., etc.
```

### Solution Number:
```javascript
/Sol\.(\d+)\./g
// Matches: Sol.19., Sol.20., etc.
```

### Options:
```javascript
/\(([a-d])\)\s*\((\d+)\)/g
// Matches: (a) (1), (b) (2), etc.
```

### Correct Answer:
```javascript
/Sol\.\d+\.\(([a-d])\)\s*\((\d+)\)/
// Matches: Sol.23.(b) (2)
```

## Cost Considerations

### Free Options:
- **Tesseract.js**: Free, runs in Node.js, good accuracy
- **Pros**: No cost, offline
- **Cons**: Slower, lower accuracy for complex layouts

### Paid Options:
- **Google Cloud Vision API**: $1.50 per 1000 images
- **AWS Textract**: $1.50 per 1000 pages
- **Azure Computer Vision**: $1.00 per 1000 images
- **Pros**: High accuracy, fast, handles complex layouts
- **Cons**: Costs money

## Recommendation

**Start with Tesseract.js (Free)**:
- Good enough for most cases
- Admin can correct errors manually
- No API costs

**Upgrade to Cloud API later** if needed:
- If accuracy is insufficient
- If processing speed is important
- Can add as optional premium feature

## Timeline

- **Phase 1-2** (Basic OCR + Parsing): 2-3 hours
- **Phase 3** (Matching Logic): 1 hour  
- **Phase 4** (UI/UX): 2-3 hours
- **Phase 5** (Advanced Features): 3-4 hours

**Total**: ~10-12 hours of development

## Next Steps

1. Install dependencies
2. Create OCR service with Tesseract.js
3. Create upload routes
4. Create frontend import page
5. Test with your sample images
6. Refine parsing logic based on results
7. Add manual correction UI
8. Deploy and iterate

---

**Ready to start? I can begin implementing this feature now!**
