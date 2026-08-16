# Quick Setup Guide

## Prerequisites
- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Backend Setup

1. **Navigate to backend:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
copy .env.example .env
```

Then edit `.env` and add your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/
or
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

Note: The MongoDB connection will automatically create a database when you first insert data.

4. **Start backend server:**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

## Frontend Setup

1. **Open new terminal and navigate to frontend:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
copy .env.example .env
```

4. **Start frontend:**
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## Create Admin User

Use MongoDB Compass or mongo shell to create an admin user:

```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@mocktest.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILXw3F5m2", // password: admin123
  role: "admin",
  avatar: "https://via.placeholder.com/150",
  subscription: {
    plan: "elite",
    isActive: true
  },
  createdAt: new Date()
})
```

Login credentials:
- Email: admin@mocktest.com
- Password: admin123

## Access the Application

1. **Homepage:** http://localhost:3000
2. **Login:** http://localhost:3000/login
3. **Register:** http://localhost:3000/register
4. **Admin Panel:** http://localhost:3000/admin (login as admin first)

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check connection string in .env
- For local MongoDB: `mongodb://localhost:27017/mocktest`
- For MongoDB Atlas: Use your cluster connection string

### Port Already in Use
- Backend port 5000: Change PORT in backend/.env
- Frontend port 3000: React will prompt to use different port

### Dependencies Error
- Delete node_modules folder
- Delete package-lock.json
- Run `npm install` again

## Next Steps

1. **Create Test** (as admin):
   - Login as admin
   - Go to Admin Panel
   - Click "Create Test"
   - Add sections and questions
   - Publish test

2. **Take Test** (as student):
   - Register/Login as student
   - Browse available tests
   - Click "Start Test"
   - Read instructions
   - Begin exam

Enjoy your mock test platform! 🎉
