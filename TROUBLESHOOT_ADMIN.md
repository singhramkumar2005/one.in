# Troubleshooting Admin Access

## Error: "Permissions check failed"

This error occurs when trying to access admin pages. Here's how to fix it:

---

## 🔍 Step 1: Check Browser Console

1. Open browser (F12)
2. Go to Console tab
3. Look for these logs when you try to access `/admin`:
   ```
   PrivateRoute - isAuthenticated: true
   PrivateRoute - user: {name: "Admin Ram", email: "ram1@gmail.com", role: "admin"}
   PrivateRoute - required role: admin
   ```

If you see something different, follow the steps below.

---

## 🔧 Step 2: Clear Browser Data

Sometimes old data causes issues:

1. **Clear localStorage:**
   - Open Console (F12)
   - Type: `localStorage.clear()`
   - Press Enter

2. **Clear cache:**
   - Press `Ctrl + Shift + Delete`
   - Select "Cached images and files"
   - Click "Clear data"

3. **Refresh page:**
   - Press `Ctrl + R`

4. **Login again:**
   - Go to `/login`
   - Email: `ram1@gmail.com`
   - Password: `123456`

---

## 🔧 Step 3: Verify Admin User in Database

1. **Open MongoDB Compass**
2. **Connect to:** `mongodb://localhost:27017/`
3. **Go to:** `mocktest` → `users` collection
4. **Find admin user** (email: ram1@gmail.com)
5. **Verify role field:**
   ```json
   "role": "admin"
   ```
   
   Should be `"admin"` not `"student"`

6. **If role is wrong:**
   - Click edit (pencil icon)
   - Change `"role": "student"` to `"role": "admin"`
   - Click Update

---

## 🔧 Step 4: Re-create Admin User

If admin user is missing or corrupted:

```bash
cd backend
npm run create-admin
```

This will:
- Delete existing admin (if any)
- Create fresh admin user
- Email: ram1@gmail.com
- Password: 123456

---

## 🔧 Step 5: Test Login Flow

### Test in Console:

1. **After login, check localStorage:**
   ```javascript
   JSON.parse(localStorage.getItem('auth-storage'))
   ```
   
   Should show:
   ```json
   {
     "state": {
       "user": {
         "id": "...",
         "name": "Admin Ram",
         "email": "ram1@gmail.com",
         "role": "admin"
       },
       "token": "...",
       "isAuthenticated": true
     }
   }
   ```

2. **If `role` is missing or wrong:**
   - Logout
   - Clear localStorage: `localStorage.clear()`
   - Login again

---

## 🔧 Step 6: Direct Access Test

Try accessing admin page directly:

1. **Make sure you're logged in**
2. **Type in address bar:**
   ```
   http://localhost:3000/admin
   ```
3. **Press Enter**

### Expected Results:

✅ **Success:** Admin Dashboard loads with stats and "Create New Test" button

❌ **Redirects to /dashboard:** Your role is not admin
❌ **Redirects to /login:** You're not logged in
❌ **Shows "Loading...":** User data not loaded (wait 2 seconds)

---

## 🔧 Step 7: Check Backend Response

Test if backend returns correct user data:

1. **Login and check Network tab:**
   - Open DevTools (F12)
   - Go to Network tab
   - Login with admin credentials
   - Click on the `login` request
   - Check Response:

   Should contain:
   ```json
   {
     "success": true,
     "token": "...",
     "user": {
       "id": "...",
       "name": "Admin Ram",
       "email": "ram1@gmail.com",
       "role": "admin"
     }
   }
   ```

2. **If `role` is missing in response:**
   - Backend issue
   - Recreate admin: `npm run create-admin`

---

## 🔧 Step 8: Restart Everything

Sometimes a clean restart helps:

1. **Stop frontend** (Ctrl + C in terminal)
2. **Stop backend** (Ctrl + C in terminal)
3. **Clear browser cache**
4. **Start backend:**
   ```bash
   cd backend
   npm run dev
   ```
5. **Start frontend:**
   ```bash
   cd frontend
   npm start
   ```
6. **Login again**

---

## 📝 Manual Fix (If Nothing Works)

### Option 1: Bypass Admin Check Temporarily

Edit `frontend/src/App.js`:

Find:
```javascript
<Route path="/admin" element={
  <PrivateRoute role="admin">
    <AdminDashboard />
  </PrivateRoute>
} />
```

Replace with:
```javascript
<Route path="/admin" element={
  <PrivateRoute>
    <AdminDashboard />
  </PrivateRoute>
} />
```

This removes role check temporarily so you can access admin panel.

⚠️ **Warning:** This allows any logged-in user to access admin panel!

### Option 2: Force User Role in Frontend

Edit `frontend/src/pages/Login.jsx`:

After line `login(user, token);` add:
```javascript
// Force admin role for testing
user.role = 'admin';
login(user, token);
```

⚠️ **Warning:** This is only for testing! Remove after fixing the issue.

---

## 🎯 Expected Working Flow

1. ✅ Create admin: `npm run create-admin`
2. ✅ Start servers: backend + frontend
3. ✅ Go to: `http://localhost:3000/login`
4. ✅ Login: ram1@gmail.com / 123456
5. ✅ Auto-redirect to: `/admin`
6. ✅ See: Admin Dashboard with "Create New Test" button
7. ✅ Navbar shows: Blue "Admin Panel" button

---

## 🐛 Common Issues

### Issue 1: "Cannot read property 'role' of undefined"
**Cause:** User object is null/undefined
**Fix:** Clear localStorage and login again

### Issue 2: Redirects to /dashboard instead of /admin
**Cause:** User role is not "admin"
**Fix:** Check database, ensure role is "admin"

### Issue 3: "Network Error"
**Cause:** Backend not running
**Fix:** Start backend: `cd backend && npm run dev`

### Issue 4: Token expired
**Cause:** Old token in localStorage
**Fix:** Logout and login again

---

## 🆘 Still Not Working?

1. **Check these files exist:**
   - `frontend/src/pages/admin/AdminDashboard.jsx`
   - `frontend/src/pages/admin/CreateTest.jsx`
   - `frontend/src/components/PrivateRoute.jsx`

2. **Share these details:**
   - Browser console logs (when accessing /admin)
   - Network tab response for /login
   - localStorage auth-storage content
   - MongoDB users collection (admin document)

3. **Quick diagnostic:**
   ```javascript
   // In browser console after login:
   const auth = JSON.parse(localStorage.getItem('auth-storage'));
   console.log('Is authenticated:', auth?.state?.isAuthenticated);
   console.log('User role:', auth?.state?.user?.role);
   console.log('User email:', auth?.state?.user?.email);
   ```

---

## ✅ Success Indicators

After login, you should see:

✅ Browser console shows:
```
Login successful!
User role: admin
Redirecting to admin panel
```

✅ URL changes to: `http://localhost:3000/admin`

✅ Page shows: "Admin Dashboard" with stats cards

✅ Navbar shows: Blue "Admin Panel" button

✅ Page has: "Create New Test" button with + icon

**If you see all these ✅ - Admin access is working correctly!**
