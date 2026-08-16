const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI + 'mocktest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Test Schema
const testSchema = new mongoose.Schema({
  title: String,
  description: String,
  examType: String,
  difficulty: String,
  duration: Number,
  totalMarks: Number,
  language: String,
  sections: Array,
  instructions: Array,
  isPaid: Boolean,
  price: Number,
  showAnswers: Boolean,
  shuffleQuestions: Boolean,
  allowedAttempts: Number,
  isActive: Boolean,
  createdAt: Date
});

const Test = mongoose.model('Test', testSchema);

async function createSampleTest() {
  try {
    // Delete existing sample test
    await Test.deleteMany({ title: 'Sample Mock Test - Quick Start' });
    console.log('🗑️  Cleared old sample tests');

    // Create sample test
    const sampleTest = await Test.create({
      title: 'Sample Mock Test - Quick Start',
      description: 'A quick sample test to get you started. Contains 5 easy questions.',
      examType: 'SSC',
      difficulty: 'easy',
      duration: 10,
      totalMarks: 5,
      language: 'English',
      isActive: true,
      sections: [
        {
          name: 'General Knowledge',
          description: 'Basic general knowledge questions',
          order: 1,
          questions: [
            {
              questionNumber: 1,
              questionText: 'What is the capital of India?',
              questionType: 'single',
              options: [
                { optionText: 'Mumbai', isCorrect: false },
                { optionText: 'Delhi', isCorrect: true },
                { optionText: 'Kolkata', isCorrect: false },
                { optionText: 'Chennai', isCorrect: false }
              ],
              explanation: 'Delhi is the capital city of India.',
              marks: { positive: 1, negative: 0.25 },
              difficulty: 'easy',
              tags: ['geography', 'india']
            },
            {
              questionNumber: 2,
              questionText: 'How many states are there in India?',
              questionType: 'single',
              options: [
                { optionText: '27', isCorrect: false },
                { optionText: '28', isCorrect: true },
                { optionText: '29', isCorrect: false },
                { optionText: '30', isCorrect: false }
              ],
              explanation: 'India has 28 states and 8 union territories.',
              marks: { positive: 1, negative: 0.25 },
              difficulty: 'easy',
              tags: ['geography', 'india']
            },
            {
              questionNumber: 3,
              questionText: 'Who is known as the Father of the Nation in India?',
              questionType: 'single',
              options: [
                { optionText: 'Jawaharlal Nehru', isCorrect: false },
                { optionText: 'Mahatma Gandhi', isCorrect: true },
                { optionText: 'Sardar Patel', isCorrect: false },
                { optionText: 'Dr. B.R. Ambedkar', isCorrect: false }
              ],
              explanation: 'Mahatma Gandhi is known as the Father of the Nation.',
              marks: { positive: 1, negative: 0.25 },
              difficulty: 'easy',
              tags: ['history', 'india']
            },
            {
              questionNumber: 4,
              questionText: 'What is 5 + 3?',
              questionType: 'single',
              options: [
                { optionText: '6', isCorrect: false },
                { optionText: '7', isCorrect: false },
                { optionText: '8', isCorrect: true },
                { optionText: '9', isCorrect: false }
              ],
              explanation: '5 + 3 = 8',
              marks: { positive: 1, negative: 0.25 },
              difficulty: 'easy',
              tags: ['mathematics']
            },
            {
              questionNumber: 5,
              questionText: 'Which planet is known as the Red Planet?',
              questionType: 'single',
              options: [
                { optionText: 'Venus', isCorrect: false },
                { optionText: 'Mars', isCorrect: true },
                { optionText: 'Jupiter', isCorrect: false },
                { optionText: 'Saturn', isCorrect: false }
              ],
              explanation: 'Mars is called the Red Planet due to its reddish appearance.',
              marks: { positive: 1, negative: 0.25 },
              difficulty: 'easy',
              tags: ['science', 'astronomy']
            }
          ]
        }
      ],
      instructions: [
        'This is a sample test with 5 questions',
        'Duration: 10 minutes',
        'Each question carries 1 mark',
        'There is negative marking of 0.25 marks',
        'You can mark questions for review',
        'Click Submit when done'
      ],
      isPaid: false,
      price: 0,
      showAnswers: true,
      shuffleQuestions: false,
      allowedAttempts: 5,
      totalAttempts: 0,
      averageScore: 0,
      createdAt: new Date()
    });

    console.log('\n✅ Sample test created successfully!');
    console.log('\n📝 Test Details:');
    console.log('   Title: Sample Mock Test - Quick Start');
    console.log('   Questions: 5');
    console.log('   Duration: 10 minutes');
    console.log('   Total Marks: 5');
    console.log('   Status: ✅ LIVE (Visible to all students)');
    console.log('\n🔗 Access Test:');
    console.log('   1. Go to: http://localhost:3000/tests');
    console.log('   2. You will see "Sample Mock Test - Quick Start"');
    console.log('   3. Click "Start Test"');
    console.log('   4. Take the test!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating sample test:', error);
    process.exit(1);
  }
}

createSampleTest();
