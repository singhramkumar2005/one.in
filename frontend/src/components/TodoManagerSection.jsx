import React, { useState, useEffect } from 'react';
import { 
  FiCheckSquare, 
  FiSquare, 
  FiPlus, 
  FiTrash2, 
  FiCalendar, 
  FiClock, 
  FiCheckCircle, 
  FiSearch,
  FiChevronRight,
  FiChevronLeft,
  FiStar,
  FiEdit3,
  FiBookOpen,
  FiTrendingUp,
  FiAward,
  FiSave,
  FiList,
  FiArchive
} from 'react-icons/fi';
import api from '../utils/api';

const getTodayFormatted = () => new Date().toISOString().split('T')[0];

const TodoManagerSection = ({ 
  onSelectTodo, 
  selectedTodoId 
}) => {
  // Current Selected Date for Day-wise Manager
  const [selectedDate, setSelectedDate] = useState(getTodayFormatted());
  const [viewMode, setViewMode] = useState('day_planner'); // 'day_planner' or 'history_archive'

  // Day Data
  const [dayTasks, setDayTasks] = useState([]);
  const [dailyLog, setDailyLog] = useState({
    studyMinutes: 0,
    focusRating: 4,
    dailyNotes: '',
    topicsCovered: [],
    status: 'productive'
  });
  const [dayStats, setDayStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0
  });

  // History Data
  const [historyList, setHistoryList] = useState([]);
  const [historySearch, setHistorySearch] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDailyJournal, setShowDailyJournal] = useState(false);
  const [savingJournal, setSavingJournal] = useState(false);

  // New Task form state
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newSubject, setNewSubject] = useState('Quantitative Aptitude');
  const [newCategory, setNewCategory] = useState('Mock Prep');

  // Load day records when selectedDate changes
  useEffect(() => {
    fetchDayData(selectedDate);
  }, [selectedDate]);

  // Load history when history tab opens
  useEffect(() => {
    if (viewMode === 'history_archive') {
      fetchHistory();
    }
  }, [viewMode]);

  // 1. Fetch Specific Day Data
  const fetchDayData = async (dateStr) => {
    try {
      setLoading(true);
      const res = await api.get(`/todos/day/${dateStr}`);
      if (res.data?.success && res.data?.data) {
        setDayTasks(res.data.data.tasks || []);
        setDailyLog(res.data.data.dailyLog || {
          studyMinutes: 0,
          focusRating: 4,
          dailyNotes: '',
          topicsCovered: [],
          status: 'productive'
        });
        setDayStats(res.data.data.stats || {
          totalTasks: 0,
          completedTasks: 0,
          completionRate: 0
        });

        if (res.data.data.tasks?.length > 0 && onSelectTodo) {
          onSelectTodo(res.data.data.tasks[0]);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Fetch day data error:', error);
      setLoading(false);
    }
  };

  // 2. Fetch All Previous History Records
  const fetchHistory = async () => {
    try {
      const res = await api.get('/todos/history');
      if (res.data?.success && res.data?.data) {
        setHistoryList(res.data.data);
      }
    } catch (error) {
      console.error('Fetch history error:', error);
    }
  };

  // 3. Add Task for Selected Date
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const taskPayload = {
        title: newTitle.trim(),
        priority: newPriority,
        subject: newSubject,
        category: newCategory,
        targetDate: selectedDate,
        status: 'todo',
        tag: newPriority === 'High' ? 'High Priority' : 'On Track'
      };

      const res = await api.post('/todos', taskPayload);
      if (res.data?.success && res.data?.data) {
        const updated = [res.data.data, ...dayTasks];
        setDayTasks(updated);
        setDayStats(prev => ({
          ...prev,
          totalTasks: prev.totalTasks + 1,
          completionRate: Math.round((prev.completedTasks / (prev.totalTasks + 1)) * 100)
        }));
        if (onSelectTodo) onSelectTodo(res.data.data);
      }
      setNewTitle('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Add task error:', error);
    }
  };

  // 4. Toggle Task Complete
  const handleToggleTask = async (task) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    const updated = dayTasks.map(t => t._id === task._id ? { ...t, status: newStatus } : t);
    setDayTasks(updated);

    const completedCount = updated.filter(t => t.status === 'completed').length;
    setDayStats({
      totalTasks: updated.length,
      completedTasks: completedCount,
      completionRate: updated.length > 0 ? Math.round((completedCount / updated.length) * 100) : 0
    });

    try {
      await api.put(`/todos/${task._id}`, { status: newStatus });
    } catch (error) {
      console.error('Update task status error:', error);
    }
  };

  // 5. Delete Task
  const handleDeleteTask = async (taskId) => {
    const updated = dayTasks.filter(t => t._id !== taskId);
    setDayTasks(updated);
    const completedCount = updated.filter(t => t.status === 'completed').length;
    setDayStats({
      totalTasks: updated.length,
      completedTasks: completedCount,
      completionRate: updated.length > 0 ? Math.round((completedCount / updated.length) * 100) : 0
    });

    try {
      await api.delete(`/todos/${taskId}`);
    } catch (error) {
      console.error('Delete task error:', error);
    }
  };

  // 6. Save Daily Journal / Study Hours & Notes
  const handleSaveDailyJournal = async () => {
    try {
      setSavingJournal(true);
      await api.post(`/todos/day/${selectedDate}/log`, dailyLog);
      setSavingJournal(false);
      setShowDailyJournal(false);
    } catch (error) {
      console.error('Save journal error:', error);
      setSavingJournal(false);
    }
  };

  // Date Navigation Helpers
  const changeDateByDays = (offset) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === getTodayFormatted();
  const dateObj = new Date(selectedDate);
  const formattedDayTitle = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  // Filter Tasks
  const filteredTasks = dayTasks.filter(task => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'todo' ? task.status === 'todo' :
      filter === 'in_progress' ? task.status === 'in_progress' :
      filter === 'completed' ? task.status === 'completed' : true;

    const matchesSearch = 
      (task.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.subject || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Filter History
  const filteredHistory = historyList.filter(h => 
    (h.date || '').includes(historySearch) ||
    (h.dailyNotes || '').toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-[#121216] rounded-3xl p-6 shadow-xs border border-[#E8DFF2] dark:border-[#22222A] space-y-6">
      
      {/* Header Bar with View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFF2] dark:border-[#22222A]">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-[#8E4CF6]/15 text-[#8E4CF6] dark:text-[#C49CFF] rounded-2xl flex items-center justify-center font-bold text-xl border border-[#8E4CF6]/25 shadow-xs flex-shrink-0">
            <FiCheckSquare size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#17171C] dark:text-white tracking-tight">
              Study To-Do & Daily Records Manager
            </h2>
            <p className="text-xs font-medium text-[#6B7082] dark:text-[#8E8E9F]">
              Day-wise task tracker, study hours journal, and historical progress records
            </p>
          </div>
        </div>

        {/* View Switcher: Day Planner vs Previous Records Archive */}
        <div className="flex items-center gap-1.5 bg-[#FAF7FD] dark:bg-[#1A1A22] p-1 rounded-2xl border border-[#E8DFF2] dark:border-[#282834] self-start sm:self-auto">
          <button
            onClick={() => setViewMode('day_planner')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'day_planner'
                ? 'bg-[#141416] text-white dark:bg-[#282834] dark:text-white shadow-xs border border-transparent dark:border-[#383848]'
                : 'text-[#6B7082] dark:text-[#8E8E9F] hover:text-[#17171C] dark:hover:text-white'
            }`}
          >
            <FiCalendar size={14} className="text-[#4ADE80]" />
            <span>Day-Wise Planner</span>
          </button>

          <button
            onClick={() => setViewMode('history_archive')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'history_archive'
                ? 'bg-[#141416] text-white dark:bg-[#282834] dark:text-white shadow-xs border border-transparent dark:border-[#383848]'
                : 'text-[#6B7082] dark:text-[#8E8E9F] hover:text-[#17171C] dark:hover:text-white'
            }`}
          >
            <FiArchive size={14} className="text-[#FB923C]" />
            <span>Previous Records ({historyList.length})</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODE 1: DAY-WISE STUDY PLANNER & DAILY RECORD VIEW */}
      {/* ======================================================== */}
      {viewMode === 'day_planner' && (
        <div className="space-y-5">
          
          {/* Day Navigation & Daily Metrics Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FAF7FD] dark:bg-[#16161C] p-4 rounded-2xl border border-[#E8DFF2] dark:border-[#242430]">
            
            {/* Date Navigator Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeDateByDays(-1)}
                className="p-2 bg-white dark:bg-[#1C1C24] hover:bg-[#F3EEFB] dark:hover:bg-[#282834] text-[#17171C] dark:text-white rounded-xl border border-[#E8DFF2] dark:border-[#282834] transition"
                title="Previous Day"
              >
                <FiChevronLeft size={16} />
              </button>

              {/* Date Display Pill & Picker */}
              <div className="flex items-center gap-2 bg-white dark:bg-[#111115] px-3.5 py-2 rounded-xl border border-[#E8DFF2] dark:border-[#22222B] text-xs font-extrabold text-[#17171C] dark:text-white">
                <FiCalendar className="text-[#8E4CF6]" size={14} />
                <span>{formattedDayTitle}</span>
                {isToday && (
                  <span className="px-2 py-0.5 bg-[#44D368]/20 text-[#147034] dark:text-[#44D368] text-[10px] rounded-full uppercase">
                    Today
                  </span>
                )}
              </div>

              <button
                onClick={() => changeDateByDays(1)}
                className="p-2 bg-white dark:bg-[#111115] hover:bg-[#F3EEFB] dark:hover:bg-[#20202A] text-[#17171C] dark:text-white rounded-xl border border-[#E8DFF2] dark:border-[#22222B] transition"
                title="Next Day"
              >
                <FiChevronRight size={16} />
              </button>

              {/* Direct Jump to Today / Date Picker */}
              {!isToday && (
                <button
                  onClick={() => setSelectedDate(getTodayFormatted())}
                  className="px-3 py-2 bg-[#8E4CF6]/15 hover:bg-[#8E4CF6]/25 text-[#8E4CF6] dark:text-[#C49CFF] rounded-xl text-xs font-extrabold transition border border-[#8E4CF6]/30"
                >
                  Jump to Today
                </button>
              )}

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-white dark:bg-[#111115] text-[#17171C] dark:text-white rounded-xl border border-[#E8DFF2] dark:border-[#22222B] focus:outline-hidden focus:ring-2 focus:ring-[#8E4CF6]"
                title="Pick exact date"
              />
            </div>

            {/* Daily Overview Stats & Reflection Toggle */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-extrabold text-[#17171C] dark:text-white">
                  {dayStats.completedTasks} / {dayStats.totalTasks} Done ({dayStats.completionRate}%)
                </div>
                <div className="text-[10px] text-[#6B7082] dark:text-[#A9A2BA]">
                  Study: {Math.floor((dailyLog.studyMinutes || 0) / 60)}h {(dailyLog.studyMinutes || 0) % 60}m • Rating: {dailyLog.focusRating || 4}⭐
                </div>
              </div>

              <button
                onClick={() => setShowDailyJournal(!showDailyJournal)}
                className="px-3.5 py-2 bg-white dark:bg-[#111115] hover:bg-[#F3EEFB] dark:hover:bg-[#20202A] text-[#8E4CF6] dark:text-[#C49CFF] rounded-xl text-xs font-extrabold transition border border-[#E8DFF2] dark:border-[#22222B] flex items-center gap-1.5"
              >
                <FiEdit3 size={13} />
                <span>{showDailyJournal ? 'Close Journal' : 'Daily Journal'}</span>
              </button>
            </div>

          </div>

          {/* Daily Journal / Study Log Drawer */}
          {showDailyJournal && (
            <div className="p-4 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-[#17171C] dark:text-white flex items-center gap-2">
                  <FiBookOpen className="text-[#8E4CF6]" size={14} />
                  <span>Daily Study Record & Reflection for {formattedDayTitle}</span>
                </h4>
                <button
                  onClick={handleSaveDailyJournal}
                  disabled={savingJournal}
                  className="px-4 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-extrabold rounded-full transition flex items-center gap-1.5 shadow-xs"
                >
                  <FiSave size={13} />
                  <span>{savingJournal ? 'Saving...' : 'Save Record'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#6B7082] dark:text-[#A9A2BA] block mb-1">
                    Study Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="15"
                    value={dailyLog.studyMinutes || 0}
                    onChange={(e) => setDailyLog({ ...dailyLog, studyMinutes: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-[#111115] text-[#17171C] dark:text-white rounded-xl border border-[#E8DFF2] dark:border-[#22222B] focus:outline-hidden focus:ring-2 focus:ring-[#8E4CF6]"
                    placeholder="e.g. 120 (2 hours)"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#6B7082] dark:text-[#A9A2BA] block mb-1">
                    Daily Focus & Productivity Rating
                  </label>
                  <select
                    value={dailyLog.focusRating || 4}
                    onChange={(e) => setDailyLog({ ...dailyLog, focusRating: parseInt(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-[#111115] text-[#17171C] dark:text-white rounded-xl border border-[#E8DFF2] dark:border-[#22222B] focus:outline-hidden focus:ring-2 focus:ring-[#8E4CF6]"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5/5 - Highly Productive</option>
                    <option value={4}>⭐⭐⭐⭐ 4/5 - Solid Progress</option>
                    <option value={3}>⭐⭐⭐ 3/5 - Average Day</option>
                    <option value={2}>⭐⭐ 2/5 - Low Focus / Distracted</option>
                    <option value={1}>⭐ 1/5 - Off-track / Rest Day</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6B7082] dark:text-[#A9A2BA] block mb-1">
                  Daily Study Notes & Key Achievements
                </label>
                <textarea
                  rows="2"
                  value={dailyLog.dailyNotes || ''}
                  onChange={(e) => setDailyLog({ ...dailyLog, dailyNotes: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#111115] text-[#17171C] dark:text-white rounded-xl border border-[#E8DFF2] dark:border-[#22222B] focus:outline-hidden focus:ring-2 focus:ring-[#8E4CF6]"
                  placeholder="Summarize lectures watched, mock scores, formulas revised, or topics to follow up on tomorrow..."
                />
              </div>
            </div>
          )}

          {/* Add Task Quick Bar / Modal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  filter === 'all'
                    ? 'bg-[#141416] text-white dark:bg-white dark:text-[#141416] shadow-xs'
                    : 'bg-[#FAF7FD] dark:bg-[#18181F] text-[#6B7082] dark:text-[#A9A2BA] border border-[#E8DFF2] dark:border-[#22222B]'
                }`}
              >
                <span>All Tasks</span>
                <span className="bg-white/20 dark:bg-black/20 px-1.5 py-0.2 rounded-full text-[10px]">
                  {dayTasks.length}
                </span>
              </button>

              <button
                onClick={() => setFilter('todo')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  filter === 'todo'
                    ? 'bg-[#141416] text-white dark:bg-white dark:text-[#141416] shadow-xs'
                    : 'bg-[#FAF7FD] dark:bg-[#18181F] text-[#6B7082] dark:text-[#A9A2BA] border border-[#E8DFF2] dark:border-[#22222B]'
                }`}
              >
                <span>To Do</span>
                <span className="bg-[#EFE7FC] text-[#5D2D9C] px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                  {dayTasks.filter(t => t.status === 'todo').length}
                </span>
              </button>

              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  filter === 'completed'
                    ? 'bg-[#141416] text-white dark:bg-white dark:text-[#141416] shadow-xs'
                    : 'bg-[#FAF7FD] dark:bg-[#18181F] text-[#6B7082] dark:text-[#A9A2BA] border border-[#E8DFF2] dark:border-[#22222B]'
                }`}
              >
                <span>Completed</span>
                <span className="bg-[#DDF9E2] text-[#147034] px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                  {dayTasks.filter(t => t.status === 'completed').length}
                </span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <div className="relative min-w-[160px]">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA0B0]" size={13} />
                <input
                  type="text"
                  placeholder="Search day tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full border border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] text-[#17171C] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#8E4CF6]"
                />
              </div>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-1.5 bg-[#8E4CF6] hover:bg-[#7839D4] text-white text-xs font-extrabold rounded-full flex items-center gap-1.5 shadow-xs transition whitespace-nowrap"
              >
                <FiPlus size={14} />
                <span>{showAddForm ? 'Cancel' : 'Add Task for Date'}</span>
              </button>
            </div>

          </div>

          {/* Add Task Inline Form */}
          {showAddForm && (
            <form onSubmit={handleCreateTask} className="p-4 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] space-y-3 animate-fadeIn">
              <div>
                <label className="text-xs font-bold text-[#17171C] dark:text-white block mb-1">
                  Task Title for {formattedDayTitle} *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Complete Chemistry Redox Reactions 20 Practice Qs..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-white dark:bg-[#111115] text-[#17171C] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#8E4CF6]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#17171C] dark:text-white block mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-white dark:bg-[#111115] text-[#17171C] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#8E4CF6]"
                  >
                    <option value="High">🔴 High Priority</option>
                    <option value="Medium">🟡 Medium Priority</option>
                    <option value="Low">🟢 Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#17171C] dark:text-white block mb-1">
                    Subject
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-white dark:bg-[#111115] text-[#17171C] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#8E4CF6]"
                  >
                    <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                    <option value="Reasoning Ability">Reasoning Ability</option>
                    <option value="English Language">English Language</option>
                    <option value="General Studies">General Studies</option>
                    <option value="General Awareness">General Awareness</option>
                    <option value="Revision & Mock">Revision & Mock</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#17171C] dark:text-white block mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g. Chapter Practice"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-white dark:bg-[#111115] text-[#17171C] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#8E4CF6]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] text-xs font-extrabold rounded-full transition shadow-xs flex items-center gap-1.5"
                >
                  <FiCheckCircle size={14} />
                  <span>Save to Database</span>
                </button>
              </div>
            </form>
          )}

          {/* Tasks List for the Selected Day */}
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {loading ? (
              <div className="text-center py-10 text-xs font-bold text-[#6B7082] dark:text-[#A9A2BA]">
                Loading records for {selectedDate}...
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-12 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-dashed border-[#E8DFF2] dark:border-[#22222B]">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#8E4CF6]/10 rounded-2xl flex items-center justify-center">
                  <FiCheckSquare className="text-[#8E4CF6]" size={32} />
                </div>
                <h3 className="text-sm font-extrabold text-[#17171C] dark:text-white mb-2">
                  No Tasks Yet for {formattedDayTitle}
                </h3>
                <p className="text-xs font-medium text-[#6B7082] dark:text-[#A9A2BA] mb-4 max-w-md mx-auto">
                  Start planning your study day! Add your first task to track your progress and stay organized.
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-5 py-2.5 bg-[#8E4CF6] text-white text-xs font-extrabold rounded-full hover:bg-[#7839D4] transition shadow-xs flex items-center gap-2 mx-auto"
                >
                  <FiPlus size={16} />
                  <span>Create Your First Task</span>
                </button>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isCompleted = task.status === 'completed';
                const isSelected = selectedTodoId === task._id;

                return (
                  <div
                    key={task._id || task.id}
                    onClick={() => onSelectTodo && onSelectTodo(task)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[#8E4CF6] bg-[#8E4CF6]/5 dark:bg-[#8E4CF6]/15 ring-2 ring-[#8E4CF6]/30'
                        : isCompleted
                        ? 'bg-[#FAF7FD]/60 dark:bg-[#18181F]/40 border-[#E8DFF2] dark:border-[#22222B] opacity-75'
                        : task.priority === 'High'
                        ? 'bg-white dark:bg-[#18181F] border-l-4 border-l-[#FF708F] border-[#E8DFF2] dark:border-[#22222B] hover:bg-[#FAF7FD] dark:hover:bg-[#20202A]'
                        : 'bg-[#FAF7FD] dark:bg-[#18181F] hover:bg-white dark:hover:bg-[#20202A] border-[#E8DFF2] dark:border-[#22222B]'
                    }`}
                  >
                    {/* Left: Checkbox + Meta */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleTask(task);
                        }}
                        className={`mt-0.5 transition flex-shrink-0 ${
                          isCompleted ? 'text-[#44D368]' : 'text-gray-400 hover:text-[#8E4CF6]'
                        }`}
                      >
                        {isCompleted ? <FiCheckSquare size={20} className="fill-[#44D368]/20" /> : <FiSquare size={20} />}
                      </button>

                      <div className="min-w-0 flex-1">
                        <h4 className={`text-xs sm:text-sm font-bold text-[#17171C] dark:text-white truncate ${
                          isCompleted ? 'line-through text-[#9CA0B0] dark:text-gray-500' : ''
                        }`}>
                          {task.title}
                        </h4>

                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                            task.priority === 'High'
                              ? 'bg-[#FFE8EE] text-[#A1183A]'
                              : task.priority === 'Medium'
                              ? 'bg-[#FFF0DD] text-[#9B5305]'
                              : 'bg-[#DDF9E2] text-[#147034]'
                          }`}>
                            {task.priority}
                          </span>

                          <span className="px-2 py-0.5 bg-[#EFE7FC] text-[#5D2D9C] text-[10px] font-bold rounded-full">
                            {task.subject || task.category || 'General'}
                          </span>

                          <span className="flex items-center gap-1 text-[10px] font-semibold text-[#6B7082] dark:text-[#A9A2BA] ml-1">
                            <FiCalendar size={11} className="text-[#8E4CF6]" />
                            {task.targetDate || selectedDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                        task.status === 'completed'
                          ? 'bg-[#DDF9E2] text-[#147034]'
                          : task.status === 'in_progress'
                          ? 'bg-[#FFF0DD] text-[#9B5305]'
                          : 'bg-[#FAF7FD] dark:bg-[#111115] text-[#6B7082] dark:text-[#A9A2BA] border border-[#E8DFF2] dark:border-[#22222B]'
                      }`}>
                        {task.status === 'completed' ? 'Completed' : task.status === 'in_progress' ? 'In Progress' : 'To Do'}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task._id || task.id);
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                        title="Delete task"
                      >
                        <FiTrash2 size={14} />
                      </button>

                      <FiChevronRight className="text-gray-400" size={16} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: PREVIOUS RECORDS & HISTORY ARCHIVE */}
      {/* ======================================================== */}
      {viewMode === 'history_archive' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* History Search & Stats Header */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#6B7082] dark:text-[#A9A2BA]">
                Total Days Recorded: <strong className="text-[#17171C] dark:text-white">{historyList.length} Days</strong>
              </span>
            </div>

            <div className="relative min-w-[200px]">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA0B0]" size={13} />
              <input
                type="text"
                placeholder="Search past date or notes..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full border border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] text-[#17171C] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#8E4CF6]"
              />
            </div>
          </div>

          {/* History Records Table / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredHistory.length === 0 ? (
              <div className="col-span-2 text-center py-10 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-dashed border-[#E8DFF2] dark:border-[#22222B]">
                <FiArchive className="mx-auto text-gray-400 mb-2" size={28} />
                <p className="text-xs font-bold text-[#6B7082] dark:text-[#A9A2BA]">
                  No previous records found matching your filter.
                </p>
              </div>
            ) : (
              filteredHistory.map((hItem) => {
                const itemDateObj = new Date(hItem.date);
                const prettyDate = itemDateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                const isSelected = selectedDate === hItem.date;

                return (
                  <div
                    key={hItem.date}
                    onClick={() => {
                      setSelectedDate(hItem.date);
                      setViewMode('day_planner');
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs space-y-3 ${
                      isSelected
                        ? 'border-[#8E4CF6] bg-[#8E4CF6]/10 dark:bg-[#8E4CF6]/20'
                        : 'bg-[#FAF7FD] dark:bg-[#18181F] hover:bg-white dark:hover:bg-[#20202A] border-[#E8DFF2] dark:border-[#22222B]'
                    }`}
                  >
                    {/* Top Row: Date & Progress Ring */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#8E4CF6]/15 text-[#8E4CF6] dark:text-[#C49CFF] rounded-xl flex items-center justify-center font-extrabold text-xs">
                          <FiCalendar size={15} />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-[#17171C] dark:text-white">
                            {prettyDate}
                          </h4>
                          <span className="text-[10px] text-[#6B7082] dark:text-[#A9A2BA]">
                            {hItem.date === getTodayFormatted() ? '⭐ Today' : 'Recorded in DB'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`px-2.5 py-1 text-[10px] font-black rounded-full ${
                          hItem.completionRate === 100
                            ? 'bg-[#DDF9E2] text-[#147034]'
                            : hItem.completionRate > 50
                            ? 'bg-[#FFF0DD] text-[#9B5305]'
                            : 'bg-[#EFE7FC] text-[#5D2D9C]'
                        }`}>
                          {hItem.completedTasks} / {hItem.totalTasks} Done ({hItem.completionRate}%)
                        </span>
                      </div>
                    </div>

                    {/* Meta Row: Study Time & Rating */}
                    <div className="flex items-center justify-between text-[11px] text-[#6B7082] dark:text-[#A9A2BA] pt-1 border-t border-[#E8DFF2] dark:border-[#22222B]">
                      <span className="flex items-center gap-1">
                        <FiClock size={12} className="text-[#8E4CF6]" />
                        Study Time: <strong className="text-[#17171C] dark:text-white">{Math.floor((hItem.studyMinutes || 0) / 60)}h {(hItem.studyMinutes || 0) % 60}m</strong>
                      </span>
                      <span>Rating: {'⭐'.repeat(hItem.focusRating || 4)}</span>
                    </div>

                    {/* Notes Snippet */}
                    {hItem.dailyNotes && (
                      <p className="text-[11px] text-[#17171C] dark:text-gray-300 italic line-clamp-2 bg-white/60 dark:bg-[#111115]/60 p-2 rounded-xl border border-[#E8DFF2] dark:border-[#22222B]">
                        "{hItem.dailyNotes}"
                      </p>
                    )}

                    <div className="flex justify-end pt-1">
                      <span className="text-[10px] font-bold text-[#8E4CF6] dark:text-[#C49CFF] flex items-center gap-1 hover:underline">
                        Open Date Record →
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default TodoManagerSection;
