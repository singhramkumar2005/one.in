import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TestList from './pages/TestList';
import TestInstructions from './pages/TestInstructions';
import TestExam from './pages/TestExam';
import Results from './pages/Results';
import DetailedResult from './pages/DetailedResult';
import TestAttempts from './pages/TestAttempts';
import TestAnalysis from './pages/TestAnalysis';
import Profile from './pages/Profile';
import SyllabusManager from './pages/SyllabusManager';
import CreateSyllabus from './pages/CreateSyllabus';
import SyllabusDetail from './pages/SyllabusDetail';
import StudentLibrary from './pages/StudentLibrary';
import LibraryDetail from './pages/LibraryDetail';
import AttendanceTracker from './pages/AttendanceTracker';
import LecturePlanner from './pages/LecturePlanner';
import StudyTodos from './pages/StudyTodos';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateTest from './pages/admin/CreateTest';
import CreateMockTest from './pages/admin/CreateMockTest';
import ImportTest from './pages/admin/ImportTest';
import BulkEnglishImport from './pages/admin/BulkEnglishImport';
import BulkMCQImport from './pages/admin/BulkMCQImport';
import DesignShowcase from './pages/DesignShowcase';
import UserGuide from './pages/UserGuide';
import PlatformRules from './pages/PlatformRules';
import BestPractices from './pages/BestPractices';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import License from './pages/License';

import { useAuthStore } from './store/authStore';
import { DirectoryHandleProvider } from './context/DirectoryHandleContext';
import PrivateRoute from './components/PrivateRoute';

// AppContent to use useLocation hook
function AppContent() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/design" element={<DesignShowcase />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="/todos" element={
          <PrivateRoute>
            <StudyTodos />
          </PrivateRoute>
        } />
        
        <Route path="/tests" element={
          <PrivateRoute>
            <TestList />
          </PrivateRoute>
        } />
        
        <Route path="/test/:testId/instructions" element={
          <PrivateRoute>
            <TestInstructions />
          </PrivateRoute>
        } />
        
        <Route path="/test/:testId/exam" element={
          <PrivateRoute>
            <TestExam />
          </PrivateRoute>
        } />
        
        <Route path="/results" element={
          <PrivateRoute>
            <Results />
          </PrivateRoute>
        } />
        
        <Route path="/results/:attemptId" element={
          <PrivateRoute>
            <DetailedResult />
          </PrivateRoute>
        } />
        
        <Route path="/test/:testId/attempts" element={
          <PrivateRoute>
            <TestAttempts />
          </PrivateRoute>
        } />
        
        <Route path="/test/:testId/analysis" element={
          <PrivateRoute>
            <TestAnalysis />
          </PrivateRoute>
        } />
        
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        
        <Route path="/syllabus" element={
          <PrivateRoute>
            <SyllabusManager />
          </PrivateRoute>
        } />
        
        <Route path="/syllabus/create" element={
          <PrivateRoute>
            <CreateSyllabus />
          </PrivateRoute>
        } />
        
        <Route path="/syllabus/:id" element={
          <PrivateRoute>
            <SyllabusDetail />
          </PrivateRoute>
        } />
        
        <Route path="/library" element={
          <PrivateRoute>
            <StudentLibrary />
          </PrivateRoute>
        } />
        
        <Route path="/library/:id" element={
          <PrivateRoute>
            <LibraryDetail />
          </PrivateRoute>
        } />
        
        <Route path="/attendance" element={
          <PrivateRoute>
            <AttendanceTracker />
          </PrivateRoute>
        } />

        <Route path="/lecture-planner" element={
          <PrivateRoute>
            <LecturePlanner />
          </PrivateRoute>
        } />
        
        <Route path="/admin" element={
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        } />
        
        <Route path="/admin/create-test" element={
          <PrivateRoute role="admin">
            <CreateTest />
          </PrivateRoute>
        } />
        
        <Route path="/admin/create-mock-test" element={
          <PrivateRoute role="admin">
            <CreateMockTest />
          </PrivateRoute>
        } />
        
        <Route path="/admin/import-test" element={
          <PrivateRoute role="admin">
            <ImportTest />
          </PrivateRoute>
        } />
        
        <Route path="/admin/bulk-english" element={
          <PrivateRoute role="admin">
            <BulkEnglishImport />
          </PrivateRoute>
        } />
        
        <Route path="/admin/bulk-mcq" element={
          <PrivateRoute role="admin">
            <BulkMCQImport />
          </PrivateRoute>
        } />
        
        {/* Public Resource Pages */}
        <Route path="/user-guide" element={<UserGuide />} />
        <Route path="/platform-rules" element={<PlatformRules />} />
        <Route path="/best-practices" element={<BestPractices />} />
        <Route path="/faq" element={<FAQ />} />
        
        {/* Legal Pages */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/license" element={<License />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <DirectoryHandleProvider>
      <Router>
        <div className="min-h-screen bg-[#F3EEFB] text-[#17171C] dark:bg-[#09090B] dark:text-[#F7F5FC]">
          <AppContent />
        </div>
      </Router>
    </DirectoryHandleProvider>
  );
}

export default App;
