import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import BrandLogo from './BrandLogo';
import { 
  FiHome, 
  FiBookOpen, 
  FiClipboard,
  FiBook,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiPlusCircle,
  FiUploadCloud,
  FiCalendar,
  FiFolder,
  FiCheckSquare,
  FiGrid,
  FiSearch,
  FiChevronDown,
  FiLayers,
  FiZap
} from 'react-icons/fi';

const Sidebar = ({ onOpenSearch }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentWorkspaceItems = [
    { path: '/dashboard', label: 'Home / Dashboard', icon: FiGrid },
    { path: '/todos', label: 'Study To-Do & Tasks', icon: FiCheckSquare },
    { path: '/attendance', label: 'Attendance & Habits', icon: FiCalendar },
    { path: '/lecture-planner', label: 'Lecture Planner', icon: FiZap },
  ];

  const studentCurriculumItems = [
    { path: '/syllabus', label: 'Syllabus Plan', icon: FiBookOpen },
    { path: '/library', label: 'Study Library', icon: FiFolder },
    { path: '/tests', label: 'Mock Tests', icon: FiBook },
    { path: '/results', label: 'Test Results', icon: FiClipboard },
    { path: '/profile', label: 'My Profile', icon: FiUser },
  ];

  const adminNavItems = [
    { path: '/admin', label: 'Overview', icon: FiGrid },
    { path: '/admin/create-test', label: 'Create Test', icon: FiPlusCircle },
    { path: '/admin/create-mock-test', label: 'Mock Test Wizard', icon: FiCheckSquare },
    { path: '/admin/import-test', label: 'Import Test', icon: FiUploadCloud },
    { path: '/admin/bulk-english', label: 'Bulk English', icon: FiBookOpen },
    { path: '/admin/bulk-mcq', label: 'Bulk MCQ', icon: FiBook },
  ];

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-3 left-4 z-50 p-2.5 bg-[#141416] text-white rounded-full shadow-md hover:opacity-90 transition"
      >
        {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white dark:bg-[#121216]
          flex flex-col z-40 transform transition-transform duration-300 border-r border-[#E8DFF2] dark:border-[#22222A]
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Workspace Switcher & Search Header */}
        <div className="pt-4 px-4 pb-3 border-b border-[#E8DFF2] dark:border-[#22222A] space-y-3">
          {/* Brand Logo on Left Side Top */}
          <div className="px-1 pt-0.5 flex items-center justify-between">
            <BrandLogo size="md" to="/dashboard" />
          </div>

          {/* Workspace Switcher */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF7FD] dark:bg-[#1A1A22] border border-[#E8DFF2] dark:border-[#282834] transition hover:border-[#8E4CF6]/50">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#8E4CF6]/20 text-[#8E4CF6] dark:text-[#C49CFF] font-black text-xs flex items-center justify-center border border-[#8E4CF6]/30 shrink-0">
                {user?.name?.[0]?.toUpperCase() || 'O'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-extrabold text-[#17171C] dark:text-white truncate flex items-center gap-1">
                  <span>{user?.name ? `${user.name}'s Space` : "ONE.in Space"}</span>
                  <FiChevronDown size={12} className="text-[#8E8E9F]" />
                </div>
                <div className="text-[10px] text-[#4ADE80] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse"></span>
                  <span>Online Workspace</span>
                </div>
              </div>
            </div>
          </div>


          {/* Universal Workspace Search Trigger */}
          <div 
            onClick={onOpenSearch}
            className="mt-3 relative flex items-center cursor-pointer group"
          >
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E9F] group-hover:text-[#8E4CF6] transition-colors" size={13} />
            <div className="w-full pl-8 pr-8 py-1.5 bg-[#FAF7FD] dark:bg-[#16161D] border border-[#E8DFF2] dark:border-[#282834] rounded-xl text-xs text-[#8E8E9F] group-hover:border-[#8E4CF6]/60 transition-all select-none truncate">
              Search workspace...
            </div>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[#8E8E9F] font-mono group-hover:text-white transition-colors">
              ⌘K
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-4 text-xs scrollbar-none">
          {user?.role === 'admin' ? (
            <div>
              <div className="px-3 pb-1.5 text-[10px] font-extrabold text-[#8E8E9F] uppercase tracking-wider">
                Admin Panel
              </div>
              <ul className="space-y-1">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl transition-all font-semibold ${
                          active 
                            ? 'bg-[#141416] text-white dark:bg-[#23232C] dark:text-white border border-[#E8DFF2] dark:border-[#343442] shadow-xs' 
                            : 'text-[#6B7082] dark:text-[#9090A2] hover:text-[#17171C] dark:hover:text-white hover:bg-[#F3EEFB] dark:hover:bg-[#1A1A22]'
                        }`}
                      >
                        <Icon size={15} className={active ? 'text-[#8E4CF6] dark:text-[#C49CFF]' : 'text-[#8E8E9F]'} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <>
              {/* Workspace Navigation */}
              <div>
                <div className="px-3 pb-1.5 text-[10px] font-extrabold text-[#8E8E9F] uppercase tracking-wider">
                  Workspace
                </div>
                <ul className="space-y-1">
                  {studentWorkspaceItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl transition-all font-semibold ${
                            active 
                              ? 'bg-[#141416] text-white dark:bg-[#23232C] dark:text-white border border-[#E8DFF2] dark:border-[#343442] shadow-xs' 
                              : 'text-[#6B7082] dark:text-[#9090A2] hover:text-[#17171C] dark:hover:text-white hover:bg-[#F3EEFB] dark:hover:bg-[#1A1A22]'
                          }`}
                        >
                          <Icon size={15} className={active ? 'text-[#4ADE80]' : 'text-[#8E8E9F]'} />
                          <span className="truncate">{item.label}</span>
                          {active && (
                            <span className="ml-auto w-1.5 h-1.5 bg-[#4ADE80] rounded-full shadow-xs"></span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Curriculum & Library */}
              <div>
                <div className="px-3 pb-1.5 text-[10px] font-extrabold text-[#8E8E9F] uppercase tracking-wider">
                  Curriculum & Tests
                </div>
                <ul className="space-y-1">
                  {studentCurriculumItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl transition-all font-semibold ${
                            active 
                              ? 'bg-[#141416] text-white dark:bg-[#23232C] dark:text-white border border-[#E8DFF2] dark:border-[#343442] shadow-xs' 
                              : 'text-[#6B7082] dark:text-[#9090A2] hover:text-[#17171C] dark:hover:text-white hover:bg-[#F3EEFB] dark:hover:bg-[#1A1A22]'
                          }`}
                        >
                          <Icon size={15} className={active ? 'text-[#8E4CF6] dark:text-[#C49CFF]' : 'text-[#8E8E9F]'} />
                          <span className="truncate">{item.label}</span>
                          {active && (
                            <span className="ml-auto w-1.5 h-1.5 bg-[#8E4CF6] dark:bg-[#C49CFF] rounded-full shadow-xs"></span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-[#E8DFF2] dark:border-[#22222A]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-[#F87171] bg-[#FFE8EE] dark:bg-[#3E141B] hover:bg-[#FFD4DF] dark:hover:bg-[#521C26] transition-all border border-[#F87171]/20"
          >
            <FiLogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
