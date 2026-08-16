# Advanced Mock Test Platform

A comprehensive exam platform similar to Oliveboard and Testbook for students to practice with realistic mock tests.

## 🚀 Features

### Student Features
- **Real Exam Experience**
  - Full-screen exam mode
  - Section-wise test navigation
  - Question status indicators (Answered, Not Answered, Marked for Review, Not Visited)
  - Real-time timer with countdown
  - Question-wise time tracking
  - Mark for review functionality
  - Clear response option

- **Test Management**
  - Browse available tests by exam type (SSC, Banking, Railway, etc.)
  - View test instructions before starting
  - Resume interrupted tests
  - Multiple attempt tracking
  - Attempt history

- **Results & Analytics**
  - Detailed performance analysis
  - Section-wise score breakdown
  - Question-wise review with explanations
  - Accuracy percentage
  - Time management analysis
  - Rank and percentile (coming soon)

- **User Profile**
  - Personal information management
  - Test history
  - Performance tracking
  - Subscription management

### Admin Features
- **Test Creation**
  - Create multi-section tests
  - Add questions with images
  - Set marking scheme (positive/negative marks)
  - Configure test duration
  - Add instructions

- **Test Management**
  - Edit existing tests
  - Activate/deactivate tests
  - View test statistics
  - Monitor attempts

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- BCrypt for password hashing
- Express Validator
- Cloudinary for image uploads

### Frontend
- React 18
- React Router v6
- Zustand for state management
- Tailwind CSS
- Axios for API calls
- React Icons
- React Toastify for notifications
- Recharts for analytics

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Install Tailwind CSS:
```bash
npx tailwindcss init -p
```

5. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📱 Usage

### For Students

1. **Register/Login**
   - Create an account or login with existing credentials

2. **Browse Tests**
   - Navigate to Tests page
   - Filter by exam type
   - View test details

3. **Take Test**
   - Click on "Start Test"
   - Read instructions carefully
   - Click "Start Exam"
   - Answer questions
   - Use navigation panel to jump between questions
   - Mark questions for review
   - Submit test when complete

4. **View Results**
   - Check detailed results
   - Review answers with explanations
   - Analyze performance metrics

### For Admins

1. **Login as Admin**
   - Use admin credentials

2. **Create Test**
   - Go to Admin Panel
   - Click "Create Test"
   - Add test details
   - Add sections
   - Add questions with options
   - Set correct answers
   - Publish test

## 🎯 Key Features Breakdown

### Exam Interface (Like Testbook)
- **Timer**: Countdown timer with auto-submit
- **Sections**: Tab-based section navigation
- **Question Navigator**: Visual question palette with color-coded status
- **User Info**: Display student name and photo
- **Full Screen**: Immersive exam experience
- **Answer Options**: Radio/Checkbox selection
- **Mark System**: +/- marks display
- **Navigation**: Previous/Next buttons

### Question Status Colors
- 🟢 **Green**: Answered
- 🔴 **Red**: Not Answered (visited but not answered)
- ⚪ **Gray**: Not Visited
- 🟠 **Orange**: Marked for Review
- 🟣 **Purple**: Marked and Answered

### Scoring System
- Positive marking for correct answers
- Negative marking for incorrect answers
- No marks deduction for unattempted questions
- Section-wise scoring
- Overall percentage calculation

## 🔒 Security Features
- JWT-based authentication
- Password hashing with BCrypt
- Protected routes
- Token expiration
- Role-based access control

## 📊 Database Schema

### User Model
- Personal information
- Authentication credentials
- Test attempts history
- Subscription details

### Test Model
- Test metadata
- Sections
- Questions with options
- Marking scheme
- Instructions

### TestAttempt Model
- User responses
- Time tracking
- Status management
- Score calculation
- Statistics

## 🚧 Upcoming Features
- [ ] Video proctoring
- [ ] AI-based doubt resolution
- [ ] Performance comparison with peers
- [ ] Personalized study recommendations
- [ ] Mobile app
- [ ] Offline mode
- [ ] Payment integration
- [ ] Certificate generation
- [ ] Discussion forum
- [ ] Live classes integration

## 📝 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user
- PUT `/api/auth/profile` - Update profile

### Tests
- GET `/api/tests` - Get all tests
- GET `/api/tests/:id` - Get single test
- GET `/api/tests/:id/instructions` - Get test instructions

### Attempts
- POST `/api/attempts/start/:testId` - Start new attempt
- PUT `/api/attempts/:attemptId/answer` - Save answer
- POST `/api/attempts/:attemptId/submit` - Submit test
- GET `/api/attempts/:attemptId` - Get attempt details

### Results
- GET `/api/results/my-tests` - Get user's test history
- GET `/api/results/:attemptId/detailed` - Get detailed result

### Admin
- POST `/api/admin/tests` - Create test
- PUT `/api/admin/tests/:id` - Update test
- DELETE `/api/admin/tests/:id` - Delete test

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.

## 👨‍💻 Developer
Built with ❤️ for students preparing for competitive exams

## 📞 Support
For any queries or support, please open an issue on GitHub.
