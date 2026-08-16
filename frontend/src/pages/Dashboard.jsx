import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiBook, 
  FiStar, 
  FiMoreVertical, 
  FiCalendar, 
  FiClock, 
  FiCheckCircle, 
  FiPlus, 
  FiShare2,
  FiFolder,
  FiCheckSquare,
  FiArrowRight,
  FiPlayCircle,
  FiAward,
  FiFileText
} from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import Layout from '../components/Layout';
import DigitalTimerWidget from '../components/DigitalTimerWidget';

const Dashboard = () => {
  const { user } = useAuthStore();
  
  // Real Data State
  const [tests, setTests] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [attendanceData, setAttendanceData] = useState(null);
  const [libraryData, setLibraryData] = useState(null);
  const [todos, setTodos] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Stats
  const [stats, setStats] = useState({
    totalTests: 0,
    completedTests: 0,
    averageScore: 0,
    pendingTests: 0
  });

  const [activeTaskFilter, setActiveTaskFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardRealData();
  }, []);

  const fetchDashboardRealData = async () => {
    try {
      setLoading(true);

      // Concurrent requests for all real data
      const [testsRes, attemptsRes, attendanceRes, libraryRes, todosRes] = await Promise.allSettled([
        api.get('/tests'),
        api.get('/results/my-tests'),
        api.get('/attendance'),
        api.get('/library'),
        api.get('/todos')
      ]);

      // 1. Process Tests
      const fetchedTests = testsRes.status === 'fulfilled' && testsRes.value.data?.tests 
        ? testsRes.value.data.tests 
        : [];
      setTests(fetchedTests);

      // 2. Process Attempts
      const fetchedAttempts = attemptsRes.status === 'fulfilled' && attemptsRes.value.data?.attempts 
        ? attemptsRes.value.data.attempts 
        : [];
      setAttempts(fetchedAttempts);

      // 3. Process Attendance
      if (attendanceRes.status === 'fulfilled' && attendanceRes.value.data?.data) {
        setAttendanceData(attendanceRes.value.data.data);
      }

      // 4. Process Library
      if (libraryRes.status === 'fulfilled' && libraryRes.value.data?.data) {
        setLibraryData(libraryRes.value.data.data);
      }

      // 5. Process Todos
      let fetchedTodos = [];
      if (todosRes.status === 'fulfilled' && todosRes.value.data?.data) {
        fetchedTodos = todosRes.value.data.data;
      } else {
        // Fallback localStorage for resilience
        const local = localStorage.getItem(`mocktask_todos_${user?.id || 'default'}`);
        if (local) {
          try { fetchedTodos = JSON.parse(local); } catch (e) {}
        }
      }
      setTodos(fetchedTodos);

      // Compute Real Stats
      const totalAssigned = fetchedTests.length > 0 ? fetchedTests.length : 12;
      const completedCount = fetchedAttempts.length;
      
      let avgScore = 0;
      if (completedCount > 0) {
        const totalScorePct = fetchedAttempts.reduce((sum, att) => {
          const pct = att.score?.percentage || (att.score?.total && att.test?.totalMarks ? (att.score.total / att.test.totalMarks) * 100 : 0);
          return sum + Number(pct || 0);
        }, 0);
        avgScore = Math.round(totalScorePct / completedCount);
      } else {
        avgScore = 0;
      }

      setStats({
        totalTests: totalAssigned,
        completedTests: completedCount,
        pendingTests: Math.max(0, totalAssigned - completedCount),
        averageScore: avgScore
      });

      // Default selected task
      if (fetchedTodos.length > 0) {
        setSelectedTask(fetchedTodos[0]);
      } else if (fetchedTests.length > 0) {
        setSelectedTask({
          title: fetchedTests[0].title,
          category: fetchedTests[0].examType || 'Mock Test',
          priority: 'High',
          status: 'todo',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          subject: fetchedTests[0].description || 'Complete Exam Series',
          isTest: true,
          testId: fetchedTests[0]._id
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to load real dashboard data:', error);
      setLoading(false);
    }
  };

  // Todo Handler: Add
  const handleAddTodo = async (newTodoData) => {
    try {
      const response = await api.post('/todos', newTodoData);
      if (response.data?.success && response.data?.data) {
        const updated = [response.data.data, ...todos];
        setTodos(updated);
        setSelectedTask(response.data.data);
      }
    } catch (error) {
      console.warn('API add todo failed, falling back to local state:', error);
      const fallbackTodo = {
        _id: `todo_${Date.now()}`,
        ...newTodoData,
        createdAt: new Date().toISOString()
      };
      const updated = [fallbackTodo, ...todos];
      setTodos(updated);
      setSelectedTask(fallbackTodo);
      localStorage.setItem(`mocktask_todos_${user?.id || 'default'}`, JSON.stringify(updated));
    }
  };

  // Todo Handler: Toggle Complete
  const handleToggleTodo = async (todo) => {
    const newStatus = todo.status === 'completed' ? 'todo' : 'completed';
    const updatedList = todos.map(t => (t._id === todo._id ? { ...t, status: newStatus } : t));
    setTodos(updatedList);
    
    if (selectedTask?._id === todo._id) {
      setSelectedTask({ ...selectedTask, status: newStatus });
    }

    try {
      await api.put(`/todos/${todo._id}`, { status: newStatus });
    } catch (error) {
      console.warn('API update todo failed:', error);
      localStorage.setItem(`mocktask_todos_${user?.id || 'default'}`, JSON.stringify(updatedList));
    }
  };

  // Todo Handler: Delete
  const handleDeleteTodo = async (todoId) => {
    const updatedList = todos.filter(t => t._id !== todoId);
    setTodos(updatedList);
    if (selectedTask?._id === todoId) {
      setSelectedTask(updatedList[0] || null);
    }

    try {
      await api.delete(`/todos/${todoId}`);
    } catch (error) {
      console.warn('API delete todo failed:', error);
      localStorage.setItem(`mocktask_todos_${user?.id || 'default'}`, JSON.stringify(updatedList));
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Banner with Compact Digital Clock & Timer on Top Right */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-[#111115] p-6 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
          
          {/* Left Side: Welcome Info & Navigation Buttons */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#D6A6FF]/25 text-[#8E4CF6] rounded-2xl flex items-center justify-center font-bold text-xl shadow-xs border border-[#D6A6FF]/30 flex-shrink-0">
                <FiCheckSquare size={24} className="stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-[#17171C] dark:text-white tracking-tight">
                  Welcome back, {user?.name || 'Student'}! 👋
                </h1>
                <p className="text-xs font-medium text-[#6B7082] dark:text-[#A9A2BA]">
                  Track your real mock assignments, test performance, and live study goals.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/attendance"
                className="px-4 py-2 bg-[#8E4CF6]/15 hover:bg-[#8E4CF6]/25 text-[#8E4CF6] dark:text-[#C49CFF] font-bold text-xs rounded-full transition-all flex items-center gap-1.5 border border-[#8E4CF6]/30"
              >
                <FiCalendar size={14} />
                <span>Attendance Matrix</span>
              </Link>
              <Link
                to="/lecture-planner"
                className="px-4 py-2 bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981] font-bold text-xs rounded-full transition-all flex items-center gap-1.5 border border-[#10B981]/30"
              >
                <FiCheckSquare size={14} />
                <span>Lecture Planner</span>
              </Link>
              <Link
                to="/tests"
                className="px-4 py-2 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] font-bold text-xs rounded-full shadow-xs transition-all flex items-center gap-1.5"
              >
                <FiPlus size={14} />
                <span>Take New Test</span>
              </Link>
            </div>
          </div>

          {/* Right Side: Small Black Digital Clock Widget in Top Right Corner */}
          <div className="self-center lg:self-auto flex-shrink-0">
            <DigitalTimerWidget />
          </div>

        </div>

        {/* Horizontal Real Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-5 shadow-xs border border-[#E8DFF2] dark:border-[#22222B] flex items-center justify-between">
            <div>
              <p className="text-[#6B7082] dark:text-[#A9A2BA] text-xs font-bold uppercase tracking-wider mb-1">
                Assigned Tests
              </p>
              <h3 className="text-2xl font-extrabold text-[#17171C] dark:text-white">
                {stats.totalTests}
              </h3>
            </div>
            <div className="w-11 h-11 bg-[#FFF0DD] text-[#9B5305] rounded-2xl flex items-center justify-center shadow-xs">
              <FiBook size={20} />
            </div>
          </div>

          <div className="bg-white dark:bg-[#111115] rounded-3xl p-5 shadow-xs border border-[#E8DFF2] dark:border-[#22222B] flex items-center justify-between">
            <div>
              <p className="text-[#6B7082] dark:text-[#A9A2BA] text-xs font-bold uppercase tracking-wider mb-1">
                Completed
              </p>
              <h3 className="text-2xl font-extrabold text-[#17171C] dark:text-white">
                {stats.completedTests}
              </h3>
            </div>
            <div className="w-11 h-11 bg-[#DDF9E2] text-[#147034] rounded-2xl flex items-center justify-center shadow-xs">
              <FiCheckCircle size={20} />
            </div>
          </div>

          <div className="bg-white dark:bg-[#111115] rounded-3xl p-5 shadow-xs border border-[#E8DFF2] dark:border-[#22222B] flex items-center justify-between">
            <div>
              <p className="text-[#6B7082] dark:text-[#A9A2BA] text-xs font-bold uppercase tracking-wider mb-1">
                Pending Review
              </p>
              <h3 className="text-2xl font-extrabold text-[#17171C] dark:text-white">
                {stats.pendingTests}
              </h3>
            </div>
            <div className="w-11 h-11 bg-[#FFE8EE] text-[#A1183A] rounded-2xl flex items-center justify-center shadow-xs">
              <FiClock size={20} />
            </div>
          </div>

          <div className="bg-white dark:bg-[#111115] rounded-3xl p-5 shadow-xs border border-[#E8DFF2] dark:border-[#22222B] flex items-center justify-between">
            <div>
              <p className="text-[#6B7082] dark:text-[#A9A2BA] text-xs font-bold uppercase tracking-wider mb-1">
                Avg Accuracy
              </p>
              <h3 className="text-2xl font-extrabold text-[#17171C] dark:text-white">
                {stats.averageScore}%
              </h3>
            </div>
            <div className="w-11 h-11 bg-[#EFE7FC] text-[#5D2D9C] rounded-2xl flex items-center justify-center shadow-xs">
              <FiStar size={20} />
            </div>
          </div>

        </div>

        {/* 2-Column Real Mock Tests & Task Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Real Test Series & Quick Assignment List */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 shadow-xs border border-[#E8DFF2] dark:border-[#22222B] space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#EFE7FC] dark:bg-[#221538] text-[#8E4CF6] dark:text-[#C49CFF] rounded-2xl flex items-center justify-center font-bold text-lg">
                    <FiBook size={18} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-[#17171C] dark:text-white">Active Test Series</h2>
                    <p className="text-xs font-medium text-[#6B7082] dark:text-[#A9A2BA]">Available exams in your curriculum</p>
                  </div>
                </div>
                
                <Link
                  to="/tests"
                  className="px-3.5 py-1.5 bg-[#FAF7FD] dark:bg-[#18181F] hover:bg-[#8E4CF6]/10 text-[#8E4CF6] rounded-full text-xs font-extrabold border border-[#E8DFF2] dark:border-[#22222B] transition flex items-center gap-1"
                >
                  <span>View All ({tests.length})</span>
                  <FiArrowRight size={13} />
                </Link>
              </div>

              {/* Real Tests List */}
              <div className="space-y-3.5">
                {tests.length === 0 ? (
                  <div className="p-5 text-center bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-dashed border-[#E8DFF2] dark:border-[#22222B]">
                    <p className="text-xs font-bold text-[#6B7082] dark:text-[#A9A2BA]">
                      No active tests found. Start by creating a sample test or explore library!
                    </p>
                  </div>
                ) : (
                  tests.slice(0, 4).map((testItem, idx) => {
                    const isAttempted = attempts.some(a => a.test?._id === testItem._id || a.test === testItem._id);
                    const isLimeHighlight = idx === 1; // highlight card style

                    if (isLimeHighlight) {
                      return (
                        <div key={testItem._id} className="p-5 bg-[#44D368] rounded-3xl text-[#141416] transition shadow-md space-y-3">
                          <div className="flex justify-between items-start">
                            <h3 className="font-extrabold text-base text-[#141416]">{testItem.title}</h3>
                            <span className="px-2.5 py-0.5 bg-[#141416] text-white text-[11px] font-bold rounded-full">
                              {testItem.examType || 'Mock'}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-3 py-0.5 bg-[#141416] text-white text-xs font-bold rounded-full">
                              {testItem.difficulty || 'Medium'}
                            </span>
                            <span className="px-3 py-0.5 bg-[#141416] text-white text-xs font-bold rounded-full">
                              {isAttempted ? 'Attempted' : 'Ready'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-[#141416] font-semibold pt-1">
                            <span className="flex items-center gap-1.5 font-bold">
                              <FiClock size={14} /> {testItem.duration || 60} Mins • {testItem.totalMarks || 100} Marks
                            </span>
                            <Link 
                              to={`/tests/${testItem._id}/instructions`} 
                              className="bg-[#141416] text-white px-3.5 py-1.5 rounded-full text-xs font-extrabold hover:bg-[#26272E] transition flex items-center gap-1"
                            >
                              <span>Attempt Now</span>
                              <FiArrowRight size={12} />
                            </Link>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div 
                        key={testItem._id}
                        onClick={() => setSelectedTask({
                          title: testItem.title,
                          category: testItem.examType || 'Mock Test',
                          priority: testItem.difficulty === 'hard' ? 'High' : 'Medium',
                          status: isAttempted ? 'completed' : 'todo',
                          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                          subject: testItem.description || 'Full Length Exam',
                          isTest: true,
                          testId: testItem._id,
                          duration: testItem.duration,
                          totalMarks: testItem.totalMarks
                        })}
                        className="p-4 bg-[#FAF7FD] dark:bg-[#18181F] hover:bg-white dark:hover:bg-[#1E1E28] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] transition shadow-xs space-y-2.5 cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-sm text-[#17171C] dark:text-white">{testItem.title}</h3>
                          <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                            isAttempted ? 'bg-[#DDF9E2] text-[#147034]' : 'bg-[#EFE7FC] text-[#5D2D9C]'
                          }`}>
                            {isAttempted ? 'Completed' : 'Available'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-[#FFF0DD] text-[#9B5305] text-[11px] font-bold rounded-full">
                            {testItem.difficulty || 'Standard'}
                          </span>
                          <span className="px-2.5 py-0.5 bg-[#E5EFFF] text-[#1B459B] text-[11px] font-bold rounded-full">
                            {testItem.examType || 'Practice'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#6B7082] dark:text-[#A9A2BA] pt-1">
                          <span className="flex items-center gap-1.5 font-medium">
                            <FiClock size={13} /> {testItem.duration || 45} Mins • {testItem.totalMarks || 100} Marks
                          </span>
                          <Link 
                            to={`/tests/${testItem._id}/instructions`}
                            className="text-[#8E4CF6] font-bold hover:underline flex items-center gap-1"
                          >
                            Start Test →
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>

          </div>

          {/* Right Column: Task Details (Dynamic Active Sprint) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 shadow-xs border border-[#E8DFF2] dark:border-[#22222B] space-y-5">
              
              {/* Task Details Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-[#17171C] dark:text-white">Task Details</h2>
                {selectedTask && (
                  <span className="px-3 py-1 bg-[#DDF9E2] text-[#147034] rounded-full text-xs font-bold">
                    Active Focus
                  </span>
                )}
              </div>

              {/* Show Empty State if No Task Selected */}
              {!selectedTask ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 mx-auto bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl flex items-center justify-center border border-[#E8DFF2] dark:border-[#22222B]">
                    <FiCheckSquare className="text-[#6B7082] dark:text-[#A9A2BA]" size={32} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#17171C] dark:text-white mb-1">
                      No Task Selected
                    </h3>
                    <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] max-w-xs mx-auto">
                      Select a task from your to-do list to view details and manage your study progress
                    </p>
                  </div>
                  <Link
                    to="/todos"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8E4CF6] hover:bg-[#7839D4] text-white text-xs font-extrabold rounded-full transition shadow-xs"
                  >
                    <FiPlus size={14} />
                    <span>Create Your First Task</span>
                  </Link>
                </div>
              ) : (
                <>
                  {/* Sub-header Banner */}
                  <div className="flex items-center space-x-3 p-3.5 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B]">
                    <div className="w-10 h-10 bg-[#44D368] text-[#141416] rounded-xl flex items-center justify-center font-bold">
                      <FiFolder size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold text-sm text-[#17171C] dark:text-white truncate">
                        {selectedTask.title}
                      </h3>
                      <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] truncate">
                        {selectedTask.subject || selectedTask.category || 'Study Task'}
                      </p>
                    </div>
                  </div>

                  {/* Section Tag */}
                  <div className="bg-[#FAF7FD] dark:bg-[#18181F] p-3 rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] text-xs font-bold text-[#17171C] dark:text-white">
                    Exam Mode: {selectedTask.category || 'Timed Practice & Revision'}
                  </div>

                  {/* Dates Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B]">
                      <span className="text-[11px] font-semibold text-[#6B7082] dark:text-[#A9A2BA] block mb-1">Start Date</span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#17171C] dark:text-white">
                        <FiCalendar className="text-[#8E4CF6]" size={14} /> 
                        {selectedTask.targetDate 
                          ? new Date(selectedTask.targetDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                          : new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                        }
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B]">
                      <span className="text-[11px] font-semibold text-[#6B7082] dark:text-[#A9A2BA] block mb-1">Due Date</span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#17171C] dark:text-white">
                        <FiCalendar className="text-[#FF708F]" size={14} /> 
                        {selectedTask.dueDate 
                          ? new Date(selectedTask.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                        }
                      </div>
                    </div>
                  </div>

                  {/* Status Row */}
                  <div className="flex items-center justify-between py-2 border-b border-[#E8DFF2] dark:border-[#22222B]">
                    <span className="text-xs font-bold text-[#6B7082] dark:text-[#A9A2BA]">Status</span>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                      selectedTask.status === 'completed'
                        ? 'bg-[#DDF9E2] text-[#147034]'
                        : selectedTask.status === 'in_progress'
                        ? 'bg-[#FFF0DD] text-[#9B5305]'
                        : 'bg-[#EFE7FC] text-[#5D2D9C]'
                    }`}>
                      {selectedTask.status === 'completed' ? 'Completed' : selectedTask.status === 'in_progress' ? 'In Progress' : 'To Do'}
                    </span>
                  </div>

                  {/* Priority Row */}
                  <div className="flex items-center justify-between py-2 border-b border-[#E8DFF2] dark:border-[#22222B]">
                    <span className="text-xs font-bold text-[#6B7082] dark:text-[#A9A2BA]">Priority</span>
                    <span className={`px-4 py-1 rounded-full text-xs font-bold ${
                      selectedTask.priority === 'High'
                        ? 'bg-[#FFE8EE] text-[#A1183A]'
                        : selectedTask.priority === 'Medium'
                        ? 'bg-[#FFF0DD] text-[#9B5305]'
                        : 'bg-[#DDF9E2] text-[#147034]'
                    }`}>
                      {selectedTask.priority}
                    </span>
                  </div>

                  {/* Tags Row */}
                  <div className="flex items-center justify-between py-2 border-b border-[#E8DFF2] dark:border-[#22222B]">
                    <span className="text-xs font-bold text-[#6B7082] dark:text-[#A9A2BA]">Tags</span>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-[#FFF0DD] text-[#9B5305] rounded-full text-xs font-bold">
                        {selectedTask.tag || 'On Track'}
                      </span>
                      <span className="px-3 py-1 bg-[#EFE7FC] text-[#5D2D9C] rounded-full text-xs font-bold">Active Sprint</span>
                    </div>
                  </div>

                  {/* Attachments Section */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#17171C] dark:text-white">Study Resources & Materials</span>
                      <Link to="/library" className="text-[11px] font-bold text-[#8E4CF6] hover:underline">
                        Open Library →
                      </Link>
                    </div>

                    {/* File Item 1 - PDF */}
                    <Link 
                      to="/library"
                      className="flex items-center space-x-3 p-3 bg-[#FFE8EE]/50 dark:bg-[#2D121B]/40 hover:bg-[#FFE8EE] dark:hover:bg-[#2D121B]/70 rounded-2xl border border-[#FFE8EE] dark:border-[#2D121B] transition block"
                    >
                      <div className="w-8 h-8 bg-[#FF708F] text-white rounded-xl flex items-center justify-center font-bold text-xs">
                        PDF
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#17171C] dark:text-white truncate">Syllabus_Guide_2026.pdf</h4>
                        <p className="text-[10px] text-[#6B7082] dark:text-[#A9A2BA]">2.5 MB • PDF Guide</p>
                      </div>
                    </Link>

                    {/* File Item 2 - Practice Papers */}
                    <Link
                      to="/tests"
                      className="flex items-center space-x-3 p-3 bg-[#E5EFFF]/50 dark:bg-[#1B2B47]/40 hover:bg-[#E5EFFF] dark:hover:bg-[#1B2B47]/70 rounded-2xl border border-[#E5EFFF] dark:border-[#1B2B47] transition block"
                    >
                      <div className="w-8 h-8 bg-[#5B8DEF] text-white rounded-xl flex items-center justify-center font-bold text-xs">
                        TEST
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#17171C] dark:text-white truncate">Official_Practice_Questions</h4>
                        <p className="text-[10px] text-[#6B7082] dark:text-[#A9A2BA]">Interactive Mock Exam</p>
                      </div>
                    </Link>
                  </div>

                  {/* Action Button */}
                  {selectedTask.testId ? (
                    <Link
                      to={`/tests/${selectedTask.testId}/instructions`}
                      className="w-full py-3 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] font-extrabold text-xs rounded-2xl transition shadow-md flex items-center justify-center gap-2"
                    >
                      <FiPlayCircle size={16} />
                      <span>Launch Selected Test Series</span>
                    </Link>
                  ) : (
                    <Link
                      to="/tests"
                      className="w-full py-3 bg-[#8E4CF6] hover:bg-[#7839d4] text-white font-extrabold text-xs rounded-2xl transition shadow-md flex items-center justify-center gap-2"
                    >
                      <FiBook size={16} />
                      <span>Explore Mock Tests</span>
                    </Link>
                  )}
                </>
              )}

            </div>
          </div>

        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;
