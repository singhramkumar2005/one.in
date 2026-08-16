const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI + 'mocktest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  avatar: String,
  phone: String,
  targetExam: String,
  subscription: {
    plan: String,
    isActive: Boolean
  },
  preferences: {
    notifications: Boolean,
    emailUpdates: Boolean
  },
  createdAt: Date
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'ram1@gmail.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with email: ram1@gmail.com');
      console.log('Deleting existing admin...');
      await User.deleteOne({ email: 'ram1@gmail.com' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('123456', 12);
    console.log('🔐 Password hashed successfully');

    // Create admin user
    const admin = await User.create({
      name: 'Admin Ram',
      email: 'ram1@gmail.com',
      password: hashedPassword,
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin+Ram&background=2563eb&color=fff',
      phone: '1234567890',
      targetExam: 'All',
      subscription: {
        plan: 'elite',
        isActive: true
      },
      preferences: {
        notifications: true,
        emailUpdates: true
      },
      createdAt: new Date()
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('   Email: ram1@gmail.com');
    console.log('   Password: 123456');
    console.log('\n🔗 Login URL: http://localhost:3000/login');
    console.log('\n✨ Admin will be automatically redirected to Admin Panel after login\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
