const mongoose = require('mongoose');
const Test = require('../models/Test');
require('dotenv').config();

const updateAttemptLimits = async () => {
  try {
    // Read .env from backend directory
    const path = require('path');
    require('dotenv').config({ path: path.join(__dirname, '../.env') });

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
    await mongoose.connect(mongoUri + 'mocktest', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Update all tests with allowedAttempts: 1 to 999
    const result = await Test.updateMany(
      { allowedAttempts: 1 },
      { $set: { allowedAttempts: 999 } }
    );

    console.log(`✅ Updated ${result.modifiedCount} tests`);
    console.log('All tests now allow unlimited attempts (999)');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updateAttemptLimits();
