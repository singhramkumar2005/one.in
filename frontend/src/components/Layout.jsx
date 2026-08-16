import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import GlobalSearchModal from './GlobalSearchModal';
import { useAuthStore } from '../store/authStore';
import { 
  FiBell, 
  FiSearch, 
  FiCheckSquare, 
  FiArrowLeft, 
  FiArrowRight, 
  FiRotateCw, 
  FiLayers,
  FiBookOpen,
  FiSliders,
  FiCalendar,
  FiFolder
} from 'react-icons/fi';

const Layout = ({ children }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Keyboard Shortcut for Search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Get active section name
  const getPageInfo = () => {
    switch (location.pathname) {
      case '/dashboard':
        return { label: 'Home / Dashboard', icon: FiLayers };
      case '/todos':
        return { label: 'Study To-Do & Daily Records', icon: FiCheckSquare };
      case '/attendance':
        return { label: 'Attendance & Habits Matrix', icon: FiCalendar };
      case '/lecture-planner':
        return { label: 'Lecture Pacing Planner', icon: FiSliders };
      case '/syllabus':
        return { label: 'Master Syllabus Plan', icon: FiBookOpen };
      case '/library':
        return { label: 'Study Library Vault', icon: FiFolder };
      case '/tests':
        return { label: 'Mock Test Center', icon: FiBookOpen };
      default:
        return { label: 'Workspace Hub', icon: FiCheckSquare };
    }
  };

  const pageInfo = getPageInfo();
  const PageIcon = pageInfo.icon;

  return (
    <div className="flex min-h-screen bg-[#F3EEFB] dark:bg-[#0A0A0D] transition-colors text-[#17171C] dark:text-[#EDEDF2]">
      <Sidebar onOpenSearch={() => setIsSearchOpen(true)} />
      
      {/* Universal Search Modal */}
      <GlobalSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Top Header Bar (MacOS style with Navigation Controls) */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#121216]/95 backdrop-blur-md border-b border-[#E8DFF2] dark:border-[#22222A] transition-colors">
          <div className="h-14 px-4 md:px-7 flex items-center justify-between gap-4">
            
            {/* Left: Window Navigation & Current View Tab */}
            <div className="flex items-center space-x-3">
              {/* Back / Forward / Refresh controls */}
              <div className="hidden sm:flex items-center space-x-1 text-[#8E8E9F]">
                <button 
                  onClick={() => navigate(-1)} 
                  className="p-1.5 rounded-lg hover:bg-[#F3EEFB] dark:hover:bg-[#1A1A22] hover:text-[#17171C] dark:hover:text-white transition"
                  title="Go Back"
                >
                  <FiArrowLeft size={14} />
                </button>
                <button 
                  onClick={() => navigate(1)} 
                  className="p-1.5 rounded-lg hover:bg-[#F3EEFB] dark:hover:bg-[#1A1A22] hover:text-[#17171C] dark:hover:text-white transition"
                  title="Go Forward"
                >
                  <FiArrowRight size={14} />
                </button>
                <button 
                  onClick={() => window.location.reload()} 
                  className="p-1.5 rounded-lg hover:bg-[#F3EEFB] dark:hover:bg-[#1A1A22] hover:text-[#17171C] dark:hover:text-white transition"
                  title="Reload"
                >
                  <FiRotateCw size={13} />
                </button>
              </div>

              {/* Active Tab Pill */}
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#FAF7FD] dark:bg-[#1A1A22] border border-[#E8DFF2] dark:border-[#282834] text-xs font-bold text-[#17171C] dark:text-white shadow-xs">
                <PageIcon size={14} className="text-[#8E4CF6] dark:text-[#C49CFF]" />
                <span className="truncate">{pageInfo.label}</span>
              </div>
            </div>

            {/* Middle: Universal Search Bar Trigger */}
            <div 
              onClick={() => setIsSearchOpen(true)}
              className="flex-1 max-w-sm relative hidden md:flex items-center cursor-pointer group"
            >
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E9F] group-hover:text-[#8E4CF6] transition-colors" size={14} />
              <div className="w-full pl-9 pr-12 py-1.5 bg-[#FAF7FD] dark:bg-[#16161D] border border-[#E8DFF2] dark:border-[#282834] rounded-xl text-xs text-[#8E8E9F] group-hover:border-[#8E4CF6]/60 transition-all select-none truncate">
                Search tests, library folders, syllabus, to-dos...
              </div>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[#8E8E9F] font-mono group-hover:text-white transition-colors">
                Ctrl+K
              </span>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2.5">
              {/* Mobile Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2 hover:bg-[#FAF7FD] dark:hover:bg-[#1A1A22] border border-[#E8DFF2] dark:border-[#282834] rounded-xl transition text-[#6B7082] dark:text-[#9090A2]"
                title="Search everything"
              >
                <FiSearch size={15} />
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notification Bell */}
              <button 
                className="relative p-2 hover:bg-[#FAF7FD] dark:hover:bg-[#1A1A22] border border-[#E8DFF2] dark:border-[#282834] rounded-xl transition text-[#6B7082] dark:text-[#9090A2]"
                title="Notifications"
              >
                <FiBell size={15} />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#FF708F] rounded-full ring-2 ring-white dark:ring-[#121216]"></span>
              </button>

              {/* Mini User Indicator */}
              <div className="flex items-center gap-2 pl-2 border-l border-[#E8DFF2] dark:border-[#282834]">
                <div className="w-7 h-7 rounded-lg bg-[#0D331A] text-[#4ADE80] font-black text-xs flex items-center justify-center border border-[#195F31]/50 shadow-xs">
                  {user?.name?.[0]?.toUpperCase() || 'S'}
                </div>
                <div className="text-left leading-tight hidden sm:block">
                  <div className="text-xs font-bold text-[#17171C] dark:text-white truncate max-w-[100px]">{user?.name || 'Student'}</div>
                  <div className="text-[10px] text-[#4ADE80] font-semibold flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[#4ADE80]"></span>
                    <span>Online</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Content Area with Obsidian Background */}
        <div className="p-4 md:p-6 lg:p-7 flex-1 bg-[#F3EEFB] dark:bg-[#0A0A0D]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
