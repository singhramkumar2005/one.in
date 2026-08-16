import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiSearch, 
  FiX, 
  FiBook, 
  FiFolder, 
  FiBookOpen, 
  FiCheckSquare, 
  FiCalendar, 
  FiGrid, 
  FiClipboard, 
  FiUser, 
  FiSliders, 
  FiArrowRight, 
  FiVideo, 
  FiFileText,
  FiZap
} from 'react-icons/fi';
import api from '../utils/api';

const GlobalSearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'tests', 'library', 'syllabus', 'todos', 'pages'
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Cached Search Index Data
  const [testsData, setTestsData] = useState([]);
  const [libraryData, setLibraryData] = useState([]);
  const [syllabusData, setSyllabusData] = useState([]);
  const [todosData, setTodosData] = useState([]);

  // Default Quick Pages
  const staticPages = [
    { id: 'page-dashboard', title: 'Dashboard', subtitle: 'Overview, analytics & streak', path: '/dashboard', type: 'page', icon: FiGrid, category: 'Pages' },
    { id: 'page-todos', title: 'Study To-Do & Daily Records', subtitle: 'Day-wise tasks & study logs', path: '/todos', type: 'page', icon: FiCheckSquare, category: 'Pages' },
    { id: 'page-attendance', title: 'Attendance & Habits Matrix', subtitle: 'Pacing schedule & daily attendance', path: '/attendance', type: 'page', icon: FiCalendar, category: 'Pages' },
    { id: 'page-planner', title: 'Lecture Pacing Planner', subtitle: 'Calculate daily lecture velocity', path: '/lecture-planner', type: 'page', icon: FiSliders, category: 'Pages' },
    { id: 'page-syllabus', title: 'Master Syllabus Plan', subtitle: 'Subject-wise curriculum breakdown', path: '/syllabus', type: 'page', icon: FiBookOpen, category: 'Pages' },
    { id: 'page-library', title: 'Study Library Vault', subtitle: 'Course folders, video lectures & notes', path: '/library', type: 'page', icon: FiFolder, category: 'Pages' },
    { id: 'page-tests', title: 'Mock Test Center', subtitle: 'Full length tests & sectional exams', path: '/tests', type: 'page', icon: FiBook, category: 'Pages' },
    { id: 'page-results', title: 'Test Results & Performance', subtitle: 'Past scores, analysis & ranking', path: '/results', type: 'page', icon: FiClipboard, category: 'Pages' },
    { id: 'page-profile', title: 'My Profile & Settings', subtitle: 'Account preferences & profile info', path: '/profile', type: 'page', icon: FiUser, category: 'Pages' }
  ];

  // Fetch all searchable data once when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      fetchAllIndexData();
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const fetchAllIndexData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Tests
      try {
        const testsRes = await api.get('/tests');
        if (testsRes.data?.success && Array.isArray(testsRes.data.data)) {
          setTestsData(testsRes.data.data);
        }
      } catch (err) {
        console.warn('Search tests index err:', err.message);
      }

      // 2. Fetch Library Folders & Content
      try {
        const libRes = await api.get('/library');
        if (libRes.data?.success && Array.isArray(libRes.data.data)) {
          setLibraryData(libRes.data.data);
        }
      } catch (err) {
        console.warn('Search library index err:', err.message);
      }

      // 3. Fetch Syllabus
      try {
        const sylRes = await api.get('/syllabus');
        if (sylRes.data?.success && Array.isArray(sylRes.data.data)) {
          setSyllabusData(sylRes.data.data);
        }
      } catch (err) {
        console.warn('Search syllabus index err:', err.message);
      }

      // 4. Fetch Todos / History
      try {
        const todoRes = await api.get('/todos/history');
        if (todoRes.data?.success && Array.isArray(todoRes.data.data)) {
          setTodosData(todoRes.data.data);
        }
      } catch (err) {
        console.warn('Search todos index err:', err.message);
      }

      setLoading(false);
    } catch (error) {
      console.error('Universal search data fetch error:', error);
      setLoading(false);
    }
  };

  // Compile search results
  const q = query.trim().toLowerCase();

  // Filter Tests
  const matchedTests = (testsData || [])
    .filter(t => 
      !q ||
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.subject && t.subject.toLowerCase().includes(q)) ||
      (t.category && t.category.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q))
    )
    .map(t => ({
      id: `test-${t._id || t.id}`,
      title: t.title || 'Mock Test',
      subtitle: `${t.subject || t.category || 'General'} • ${t.totalQuestions || 0} Questions • ${t.duration || 60} mins`,
      badge: 'Mock Test',
      badgeColor: 'bg-[#0A2F45] text-[#38BDF8] border-[#0E4968]/50',
      path: `/test/${t._id || t.id}/instructions`,
      type: 'tests',
      icon: FiBook
    }));

  // Filter Library (Folders & Videos)
  const matchedLibrary = [];
  (libraryData || []).forEach(f => {
    // Folder match
    if (!q || (f.name && f.name.toLowerCase().includes(q)) || (f.subject && f.subject.toLowerCase().includes(q))) {
      matchedLibrary.push({
        id: `folder-${f._id || f.id}`,
        title: f.name || 'Study Folder',
        subtitle: `Folder • ${f.subject || 'Subject'} • ${f.videos?.length || 0} Videos`,
        badge: 'Library Folder',
        badgeColor: 'bg-[#301754] text-[#C49CFF] border-[#48227E]/50',
        path: `/library`,
        type: 'library',
        icon: FiFolder
      });
    }
    // Video items within folders
    if (Array.isArray(f.videos)) {
      f.videos.forEach((v, vIdx) => {
        if (q && ((v.title && v.title.toLowerCase().includes(q)) || (v.notes && v.notes.toLowerCase().includes(q)))) {
          matchedLibrary.push({
            id: `video-${f._id}-${vIdx}`,
            title: v.title || 'Video Lecture',
            subtitle: `In ${f.name} • ${v.duration || 'Lecture'}`,
            badge: 'Video Lesson',
            badgeColor: 'bg-[#422006] text-[#FB923C] border-[#6B340B]/50',
            path: `/library`,
            type: 'library',
            icon: FiVideo
          });
        }
      });
    }
  });

  // Filter Syllabus
  const matchedSyllabus = [];
  (syllabusData || []).forEach(s => {
    if (!q || (s.subject && s.subject.toLowerCase().includes(q)) || (s.unitTitle && s.unitTitle.toLowerCase().includes(q))) {
      matchedSyllabus.push({
        id: `syl-${s._id || s.id}`,
        title: s.subject || s.unitTitle || 'Syllabus Chapter',
        subtitle: `${s.unitTitle || 'Unit'} • ${s.topics?.length || 0} Topics • ${s.weightage || ''}`,
        badge: 'Syllabus',
        badgeColor: 'bg-[#0D331A] text-[#4ADE80] border-[#195F31]/50',
        path: `/syllabus`,
        type: 'syllabus',
        icon: FiBookOpen
      });
    }
  });

  // Filter Todos
  const matchedTodos = (todosData || [])
    .filter(td => 
      !q ||
      (td.date && td.date.includes(q)) ||
      (td.dailyNotes && td.dailyNotes.toLowerCase().includes(q))
    )
    .map(td => ({
      id: `todo-${td.date}`,
      title: `Daily Record: ${td.date}`,
      subtitle: td.dailyNotes ? `"${td.dailyNotes.slice(0, 50)}..."` : `${td.completedTasks || 0} / ${td.totalTasks || 0} Tasks Done`,
      badge: 'Study Log',
      badgeColor: 'bg-[#38121E] text-[#FB7185] border-[#6E2230]/50',
      path: `/todos`,
      type: 'todos',
      icon: FiCheckSquare
    }));

  // Filter Static Pages
  const matchedPages = staticPages.filter(p => 
    !q || 
    p.title.toLowerCase().includes(q) || 
    p.subtitle.toLowerCase().includes(q)
  );

  // Group all results based on active tab
  const getFilteredList = () => {
    if (activeTab === 'tests') return matchedTests;
    if (activeTab === 'library') return matchedLibrary;
    if (activeTab === 'syllabus') return matchedSyllabus;
    if (activeTab === 'todos') return matchedTodos;
    if (activeTab === 'pages') return matchedPages;

    // 'all': Combine in priority order
    return [
      ...matchedPages.slice(0, 3),
      ...matchedTests.slice(0, 5),
      ...matchedLibrary.slice(0, 5),
      ...matchedSyllabus.slice(0, 4),
      ...matchedTodos.slice(0, 3)
    ];
  };

  const currentResults = getFilteredList();

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (currentResults.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + (currentResults.length || 1)) % (currentResults.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentResults[selectedIndex]) {
        handleSelectItem(currentResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelectItem = (item) => {
    navigate(item.path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 md:pt-20 px-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-[#121216] rounded-3xl border border-[#E8DFF2] dark:border-[#282834] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] z-10"
        onKeyDown={handleKeyDown}
      >
        {/* Top Search Input Header */}
        <div className="p-4 border-b border-[#E8DFF2] dark:border-[#22222A] flex items-center gap-3">
          <FiSearch className="text-[#8E4CF6] dark:text-[#C49CFF] shrink-0" size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search mock tests, library folders, syllabus, topics, daily tasks..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm md:text-base font-medium text-[#17171C] dark:text-white placeholder-[#8E8E9F] focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-[#8E8E9F] hover:text-[#17171C] dark:hover:text-white"
            >
              <FiX size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 bg-black/5 dark:bg-white/10 text-[#8E8E9F] hover:text-white rounded-lg text-xs font-mono"
          >
            ESC
          </button>
        </div>

        {/* Filter Category Tabs */}
        <div className="px-4 py-2 bg-[#FAF7FD] dark:bg-[#16161C] border-b border-[#E8DFF2] dark:border-[#22222A] flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          {[
            { id: 'all', label: 'All Results', count: matchedPages.length + matchedTests.length + matchedLibrary.length + matchedSyllabus.length + matchedTodos.length },
            { id: 'tests', label: 'Mock Tests', count: matchedTests.length },
            { id: 'library', label: 'Library & Videos', count: matchedLibrary.length },
            { id: 'syllabus', label: 'Syllabus', count: matchedSyllabus.length },
            { id: 'todos', label: 'To-Dos & Logs', count: matchedTodos.length },
            { id: 'pages', label: 'Pages', count: matchedPages.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#8E4CF6] text-white shadow-xs'
                  : 'text-[#6B7082] dark:text-[#8E8E9F] hover:bg-white dark:hover:bg-[#202028] hover:text-[#17171C] dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-black/10 dark:bg-white/10 text-[#8E8E9F]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 max-h-[420px]">
          {loading ? (
            <div className="py-12 text-center text-xs font-bold text-[#8E8E9F]">
              <FiZap className="animate-spin inline-block mr-2" size={16} />
              Searching across all tests, library folders & study records...
            </div>
          ) : currentResults.length === 0 ? (
            <div className="py-12 text-center text-xs font-bold text-[#8E8E9F]">
              <FiSearch className="mx-auto text-gray-400 mb-2 opacity-60" size={28} />
              No results found matching "{query}".
              <p className="text-[11px] font-normal text-[#8E8E9F] mt-1">
                Try searching for "Reasoning", "Mathematics", "Mock Test", "Folder", or "Syllabus".
              </p>
            </div>
          ) : (
            currentResults.map((item, index) => {
              const Icon = item.icon || FiFileText;
              const isSelected = index === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3 rounded-2xl cursor-pointer transition flex items-center justify-between gap-3 border ${
                    isSelected
                      ? 'bg-[#8E4CF6]/10 dark:bg-[#8E4CF6]/20 border-[#8E4CF6]/60 shadow-xs'
                      : 'bg-[#FAF7FD]/70 dark:bg-[#181820] border-transparent hover:border-[#E8DFF2] dark:hover:border-[#282834]'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected 
                        ? 'bg-[#8E4CF6] text-white' 
                        : 'bg-[#FAF7FD] dark:bg-[#20202A] text-[#8E4CF6] dark:text-[#C49CFF] border border-[#E8DFF2] dark:border-[#2E2E3C]'
                    }`}>
                      <Icon size={16} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs md:text-sm font-bold text-[#17171C] dark:text-white truncate">
                          {item.title}
                        </h4>
                        {item.badge && (
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border shrink-0 ${item.badgeColor || 'bg-black/10 text-gray-400'}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#6B7082] dark:text-[#8E8E9F] truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {isSelected && (
                      <span className="text-[10px] font-bold text-[#8E4CF6] dark:text-[#C49CFF] hidden sm:inline flex items-center gap-1">
                        Jump to <FiArrowRight size={12} />
                      </span>
                    )}
                    <FiArrowRight size={14} className={isSelected ? 'text-[#8E4CF6] dark:text-[#C49CFF]' : 'text-gray-400'} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Keyboard Hints */}
        <div className="px-4 py-2.5 bg-[#FAF7FD] dark:bg-[#16161C] border-t border-[#E8DFF2] dark:border-[#22222A] flex items-center justify-between text-[11px] text-[#8E8E9F]">
          <div className="flex items-center gap-3">
            <span><strong className="text-[#17171C] dark:text-white">↑ ↓</strong> to navigate</span>
            <span><strong className="text-[#17171C] dark:text-white">↵</strong> to open</span>
            <span><strong className="text-[#17171C] dark:text-white">ESC</strong> to close</span>
          </div>
          <div className="font-semibold text-[#8E4CF6] dark:text-[#C49CFF]">
            Universal Platform Search
          </div>
        </div>

      </div>
    </div>
  );
};

export default GlobalSearchModal;
