const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS Configuration for Production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://one-in.vercel.app', // Frontend production URL
  'https://one-in-3z4i-five.vercel.app', // Temporary frontend URL
  process.env.FRONTEND_URL,
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Database connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mocktest';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Atlas Connected Successfully!'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err.message));


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/attempts', require('./routes/attempts'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/results', require('./routes/results'));
app.use('/api/ocr', require('./routes/ocr'));
app.use('/api/bulk', require('./routes/bulkEnglish'));
app.use('/api/bulk-mcq', require('./routes/bulkMCQ'));
app.use('/api/syllabus', require('./routes/syllabus'));
app.use('/api/library', require('./routes/library'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/todos', require('./routes/todos'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    nodeVersion: process.version 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
