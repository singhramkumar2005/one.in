const mongoose = require('mongoose');
require('dotenv').config();

const cleanLibraryData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mocktask');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('studentlibraries');

    // Find all documents
    const allDocs = await collection.find({}).toArray();
    console.log(`\n📊 Found ${allDocs.length} library documents`);

    // Delete ALL existing library documents to start fresh
    const deleteResult = await collection.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} library documents`);

    // Drop ALL indexes
    console.log('\n🔧 Dropping all indexes except _id...');
    const indexes = await collection.indexes();
    
    for (const idx of indexes) {
      if (idx.name !== '_id_') {
        try {
          await collection.dropIndex(idx.name);
          console.log(`✅ Dropped index: ${idx.name}`);
        } catch (error) {
          console.log(`⚠️  Could not drop ${idx.name}:`, error.message);
        }
      }
    }

    // List remaining indexes
    console.log('\n📋 Remaining indexes:');
    const remainingIndexes = await collection.indexes();
    remainingIndexes.forEach(idx => {
      console.log(`  - ${idx.name}:`, JSON.stringify(idx.key));
    });

    console.log('\n✅ Library data cleaned successfully!');
    console.log('👉 All library data has been removed and indexes cleaned.');
    console.log('👉 Users will need to re-add their folders.');
    console.log('👉 Please restart your backend server now.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

cleanLibraryData();
