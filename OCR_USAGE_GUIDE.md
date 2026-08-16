# OCR Test Import - User Guide

## ✅ MVP Feature Complete!

The OCR test import feature is now ready to use. This allows admins to upload scanned question papers and automatically create tests.

## 🚀 How to Use

### Step 1: Access Import Feature
1. Login as **Admin**
2. Go to **Admin Dashboard**
3. Click **"Import from OCR"** button

### Step 2: Upload Question Sheet
1. Click "Choose File" under "Question Sheet"
2. Select your question paper:
   - **PDF** (recommended - faster and more accurate)
   - **PNG, JPG, JPEG** (scanned images)
3. Wait for processing:
   - PDF: 5-10 seconds
   - Image: 10-30 seconds
4. Review extracted questions
5. Click "Next: Upload Solutions"

### Step 3: Upload Solution Sheet
1. Click "Choose File" under "Solution Sheet"
2. Select your answer sheet:
   - **PDF** (recommended)
   - **PNG, JPG, JPEG**
3. Wait for processing
4. System automatically matches questions with solutions
5. Click "Next: Review"

### Step 4: Review & Create
1. Enter test details:
   - Test Title (required)
   - Exam Type (SSC, Banking, etc.)
   - Duration in minutes
   - Description (optional)

2. Review extracted questions:
   - Edit question text if needed
   - Select correct answer for each question
   - Check explanations

3. Click **"Create Test"**
4. Test is created and ready for students!

## 📋 Supported Question Format

The OCR works best with this format:

```
Q.19. The professor postponed the discussion (1)/ until the
research would be published (2)/ to maintain confidentiality (3)/
of the findings. (4)/
SSC CGL 15/09/2025 (Shift 1)
(a) (1)    (b) (2)    (c) (3)    (d) (4)
```

**Key elements:**
- Question number: `Q.19.`
- Question text with numbered parts: `(1)/ text (2)/ text...`
- Exam source: `SSC CGL 15/09/2025 (Shift 1)`
- Options: `(a) (1)`, `(b) (2)`, `(c) (3)`, `(d) (4)`

## 📋 Supported Solution Format

```
Sol.23.(b) (2) - were overly optimistic
[Explanation in Hindi/English]
```

**Key elements:**
- Solution number: `Sol.23.`
- Correct answer: `(b) (2)`
- Explanation: Full text after the dash

## 🎯 Tips for Best Results

### File Format:
- ✅ **PDF (Highly Recommended)**: Fastest and most accurate
  - Embedded text is extracted directly
  - No OCR needed for text-based PDFs
  - Processing time: 5-10 seconds
- ✅ **PNG/JPG Images**: Works well with good quality
  - Requires OCR processing
  - Processing time: 10-30 seconds

### Image Quality (for scanned images):
- ✅ Use high-resolution scans (300 DPI or higher)
- ✅ Ensure good lighting and contrast
- ✅ Keep text straight and aligned
- ❌ Avoid blurry or dark images
- ❌ Avoid images with shadows

### Format:
- ✅ Clear question numbering (Q.19, Q.20, etc.)
- ✅ Clear option labels (a, b, c, d)
- ✅ Solution numbering matches question numbering
- ❌ Don't mix different formats in one sheet

### Processing:
- 📸 Scan question sheet first
- 📝 Then scan solution sheet
- ⏱️ OCR takes 10-30 seconds per page
- ✏️ Always review and correct before creating test

## ⚠️ Known Limitations

### Current MVP supports:
- ✅ **PDF files** (highly recommended)
- ✅ **Image files** (PNG, JPG, JPEG, BMP, TIFF)
- ✅ Single-choice MCQ questions
- ✅ English text
- ✅ Simple number-based options (1, 2, 3, 4)
- ✅ One question sheet + one solution sheet at a time

### Not yet supported:
- ❌ Multiple-choice questions (multiple correct answers)
- ❌ Descriptive/numerical questions
- ❌ Questions with diagrams/images
- ❌ Multi-column complex layouts
- ❌ Hindi/mixed language (works but less accurate)

## 🔧 Troubleshooting

### Problem: No questions extracted
**Solution:**
- Check if image is clear and high-resolution
- Ensure question numbers are visible (Q.19, Q.20)
- Try uploading a different image format

### Problem: Wrong text extracted
**Solution:**
- Use higher resolution image
- Improve image contrast
- Manually edit extracted text in review step

### Problem: Questions not matching with solutions
**Solution:**
- Ensure question and solution numbers match (Q.19 → Sol.19)
- Check if solution sheet has clear numbering
- Manually assign correct answers in review step

### Problem: Options not detected
**Solution:**
- Ensure options are in format: `(a) (1), (b) (2), (c) (3), (d) (4)`
- Manually add options in review step

## 📊 What Happens Behind the Scenes

1. **Image Upload** → Saved to server
2. **OCR Processing** → Tesseract.js extracts text
3. **Text Parsing** → Regex patterns find questions/solutions
4. **Matching** → Q.19 matched with Sol.19
5. **Validation** → Checks for 4 options, correct answer, etc.
6. **Preview** → Admin can review and edit
7. **Create Test** → Saved to database

## 🎓 Example Workflow

1. **Get your question paper** → `questions.pdf` or `questions.jpg`
2. **Get answer key** → `solutions.pdf` or `solutions.jpg`
3. **Login as admin** → Go to Import OCR
4. **Upload questions.pdf** → Wait 10 seconds (PDF is faster!)
5. **See 25 questions extracted** → Click Next
6. **Upload solutions.pdf** → Wait 8 seconds
7. **See 25 matched** → Click Next
8. **Enter title**: "SSC CGL 2025 Mock Test 1"
9. **Review questions** → Edit if needed
10. **Click Create Test** → Done! ✅

**Pro Tip**: Use PDF files for best results - they're processed much faster and more accurately!

## 🚀 Future Enhancements (Not in MVP)

- Support for image-based questions
- Multi-language OCR (Hindi, Gujarati)
- Batch processing (multiple sheets at once)
- PDF support
- Cloud OCR (Google Vision) for better accuracy
- Auto-detect question type
- Subject/topic categorization
- Difficulty level detection

## 💡 Best Practices

1. **Use PDF when possible** - Faster and more accurate than images
2. **Start with clean scans** - Quality matters for images
3. **Review before creating** - Always check extracted data
4. **Edit as needed** - OCR isn't 100% accurate
5. **Test with small batches** - Upload 5-10 questions first
6. **Save originals** - Keep original PDFs/images as backup

## 📞 Need Help?

If OCR extraction fails or gives poor results:
1. Try manual test creation (Create New Test)
2. Check OCR_FEATURE_PLAN.md for technical details
3. Improve image quality and retry

---

**Status: ✅ MVP Ready**  
**Version: 1.0**  
**Last Updated: Now**

Enjoy creating tests faster with OCR! 🎉
