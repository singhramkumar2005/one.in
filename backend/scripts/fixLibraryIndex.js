const mongoose = require('mongoose');
require('dotenv').config();

const fixLibraryIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mocktask');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('studentlibraries');

    // List all indexes first
    console.log('\n📋 Current indexes:');
    const indexes = await collection.indexes();
    indexes.forEach(idx => {
      console.log(`  - ${idx.name}:`, JSON.stringify(idx.key));
    });

    // Drop the problematic unique index on folderId
    console.log('\n🔧 Attempting to drop problematic indexes...');
    
    const indexesToDrop = [
      'folders.folderId_1',
      'folderId_1'
    ];

    for (const indexName of indexesToDrop) {
      try {
        await collection.dropIndex(indexName);
        console.log(`✅ Successfully dropped index: ${indexName}`);
      } catch (error) {
        if (error.codeName === 'IndexNotFound') {
          console.log(`ℹ️  Index ${indexName} does not exist (already fixed or never created)`);
        } else {
          console.error(`⚠️  Error dropping index ${indexName}:`, error.message);
        }
      }
    }

    // List indexes after cleanup
    console.log('\n📋 Remaining indexes:');
    const remainingIndexes = await collection.indexes();
    remainingIndexes.forEach(idx => {
      console.log(`  - ${idx.name}:`, JSON.stringify(idx.key));
    });

    console.log('\n✅ Library index fix completed!');
    console.log('👉 Please restart your backend server now.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

fixLibraryIndex();
