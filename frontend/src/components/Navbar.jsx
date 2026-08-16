import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FiLogOut, FiMenu, FiX, FiCheckSquare, FiBookOpen, FiAward, FiLayers, FiShield } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import BrandLogo from './BrandLogo';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#111115]/90 backdrop-blur-md border-b border-[#E8DFF2] dark:border-[#22222B] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <BrandLogo size="md" showTagline={false} />


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                    isActive('/dashboard') 
                      ? 'bg-[#141416] text-white shadow-xs dark:bg-white dark:text-[#141416]' 
                      : 'text-[#6B7082] dark:text-[#A9A2BA] hover:text-[#17171C] dark:hover:text-white hover:bg-[#F3EEFB] dark:hover:bg-[#18181F]'
                  }`}
                >
                  Dashboard
                </Link>
                
                <Link 
                  to="/tests" 
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                    isActive('/tests') 
                      ? 'bg-[#141416] text-white shadow-xs dark:bg-white dark:text-[#141416]' 
                      : 'text-[#6B7082] dark:text-[#A9A2BA] hover:text-[#17171C] dark:hover:text-white hover:bg-[#F3EEFB] dark:hover:bg-[#18181F]'
                  }`}
                >
                  Tests
                </Link>
                
                <Link 
                  to="/results" 
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                    isActive('/results') 
                      ? 'bg-[#141416] text-white shadow-xs dark:bg-white dark:text-[#141416]' 
                      : 'text-[#6B7082] dark:text-[#A9A2BA] hover:text-[#17171C] dark:hover:text-white hover:bg-[#F3EEFB] dark:hover:bg-[#18181F]'
                  }`}
                >
                  Results
                </Link>

                <Link 
                  to="/syllabus" 
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                    isActive('/syllabus') 
                      ? 'bg-[#141416] text-white shadow-xs dark:bg-white dark:text-[#141416]' 
                      : 'text-[#6B7082] dark:text-[#A9A2BA] hover:text-[#17171C] dark:hover:text-white hover:bg-[#F3EEFB] dark:hover:bg-[#18181F]'
                  }`}
                >
                  Syllabus
                </Link>

                <Link 
                  to="/library" 
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                    isActive('/library') 
                      ? 'bg-[#141416] text-white shadow-xs dark:bg-white dark:text-[#141416]' 
                      : 'text-[#6B7082] dark:text-[#A9A2BA] hover:text-[#17171C] dark:hover:text-white hover:bg-[#F3EEFB] dark:hover:bg-[#18181F]'
                  }`}
                >
                  Library
                </Link>

                <Link 
                  to="/attendance" 
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                    isActive('/attendance') 
                      ? 'bg-[#141416] text-white shadow-xs dark:bg-white dark:text-[#141416]' 
                      : 'text-[#6B7082] dark:text-[#A9A2BA] hover:text-[#17171C] dark:hover:text-white hover:bg-[#F3EEFB] dark:hover:bg-[#18181F]'
                  }`}
                >
                  Attendance
                </Link>

                <Link 
                  to="/lecture-planner" 
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                    isActive('/lecture-planner') 
                      ? 'bg-[#141416] text-white shadow-xs dark:bg-white dark:text-[#141416]' 
                      : 'text-[#6B7082] dark:text-[#A9A2BA] hover:text-[#17171C] dark:hover:text-white hover:bg-[#F3EEFB] dark:hover:bg-[#18181F]'
                  }`}
                >
                  Planner
                </Link>

                {user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="px-4 py-2 bg-[#EFE7FC] text-[#6B29D6] dark:bg-[#221538] dark:text-[#C49CFF] rounded-full font-semibold text-sm hover:bg-[#E2D4F9] transition ml-1 flex items-center gap-1.5"
                  >
                    <FiShield size={14} /> Admin
                  </Link>
                )}

                <div className="ml-4 pl-4 border-l border-[#E8DFF2] dark:border-[#22222B] flex items-center space-x-3">
                  <ThemeToggle />
                  
                  {/* User Profile */}
                  <Link to="/profile" className="flex items-center space-x-2.5 px-3 py-1.5 bg-[#FAF7FD] dark:bg-[#18181F] hover:bg-[#F3EEFB] rounded-full border border-[#E8DFF2] dark:border-[#22222B] transition">
                    <div className="w-8 h-8 rounded-full bg-[#DDF9E2] text-[#147034] font-bold text-xs flex items-center justify-center border border-[#44D368]/40 shadow-xs">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="font-semibold text-[#17171C] dark:text-white text-xs max-w-[100px] truncate">
                      {user?.name || 'User'}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-2 text-[#6B7082] hover:text-[#FF708F] hover:bg-[#FFE8EE] dark:hover:bg-[#2D121B] rounded-full transition"
                    title="Logout"
                  >
                    <FiLogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <Link 
                  to="/login" 
                  className="px-5 py-2.5 text-[#17171C] dark:text-white hover:bg-[#F3EEFB] dark:hover:bg-[#18181F] rounded-full font-semibold text-sm transition"
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 bg-[#141416] text-white dark:bg-white dark:text-[#141416] rounded-full font-semibold text-sm hover:opacity-90 transition shadow-xs"
                >
                  Get Started →
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#17171C] dark:text-white hover:bg-[#F3EEFB] dark:hover:bg-[#18181F] rounded-xl transition"
            >
              {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E8DFF2] dark:border-[#22222B] space-y-2">
            {isAuthenticated ? (
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/dashboard" 
                  className="px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#F3EEFB] dark:hover:bg-[#18181F]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/tests" 
                  className="px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#F3EEFB] dark:hover:bg-[#18181F]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tests
                </Link>
                <Link 
                  to="/results" 
                  className="px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#F3EEFB] dark:hover:bg-[#18181F]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Results
                </Link>
                <Link 
                  to="/syllabus" 
                  className="px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#F3EEFB] dark:hover:bg-[#18181F]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Syllabus
                </Link>
                <Link 
                  to="/library" 
                  className="px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#F3EEFB] dark:hover:bg-[#18181F]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Library
                </Link>
                <Link 
                  to="/attendance" 
                  className="px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#F3EEFB] dark:hover:bg-[#18181F]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Attendance & Habits
                </Link>
                <Link 
                  to="/lecture-planner" 
                  className="px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#F3EEFB] dark:hover:bg-[#18181F]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Lecture Planner
                </Link>
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="px-4 py-2.5 bg-[#EFE7FC] text-[#6B29D6] dark:bg-[#221538] dark:text-[#C49CFF] rounded-xl font-semibold text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 text-[#FF708F] hover:bg-[#FFE8EE] rounded-xl font-semibold text-sm text-left flex items-center gap-2"
                >
                  <FiLogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2.5 text-center font-semibold text-sm text-[#17171C] dark:text-white hover:bg-[#F3EEFB] dark:hover:bg-[#18181F] rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2.5 text-center font-semibold text-sm bg-[#141416] text-white rounded-xl shadow-xs"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
