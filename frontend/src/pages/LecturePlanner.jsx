import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Layout from '../components/Layout';
import {
  FiSliders, FiCalendar, FiClock, FiPlus, FiTrash2, FiZap,
  FiTrendingUp, FiTarget, FiFolder, FiCheckCircle, FiArrowRight,
  FiLayers, FiPieChart, FiBarChart2, FiAward, FiInfo, FiStar,
  FiBookOpen, FiActivity, FiCpu, FiCheckSquare, FiAlertCircle,
  FiSave, FiRefreshCw, FiGrid
} from 'react-icons/fi';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  Legend, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const PRESET_COLORS = [
  '#3B82F6', '#10B981', '#EC4899', '#8B5CF6', '#F59E0B',
  '#06B6D4', '#EF4444', '#14B8A6', '#6366F1', '#D946EF'
];

const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const LecturePlanner = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [libraryLoading, setLibraryLoading] = useState(false);
  
  // Target setup
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [targetDays, setTargetDays] = useState(200);
  const [deadlineDate, setDeadlineDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 200);
    return d.toISOString().split('T')[0];
  });
  const [studyDaysPerWeek, setStudyDaysPerWeek] = useState(6);
  const [strategy, setStrategy] = useState('balanced'); // 'balanced', 'proportional', 'heavy_first'

  // Master Subjects with lecture counts & duration
  const [subjects, setSubjects] = useState([]);

  // Form input for adding new subject
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjLectures, setNewSubjLectures] = useState(50);
  const [newSubjDuration, setNewSubjDuration] = useState(60);
  const [newSubjTiming, setNewSubjTiming] = useState('09:00 AM - 10:30 AM');
  const [newSubjColor, setNewSubjColor] = useState(PRESET_COLORS[0]);

  // Active Tab: 'pacing', 'hours_analytics', 'master_syllabus'
  const [activeTab, setActiveTab] = useState('pacing');

  useEffect(() => {
    fetchInitialSyllabus();
  }, []);

  const fetchInitialSyllabus = async () => {
    try {
      const res = await api.get('/attendance/master-syllabus');
      if (res.data.success && res.data.data?.length) {
        const formatted = res.data.data.map(s => ({
          id: s.id,
          name: s.name,
          lectures: s.totalLectures || 50,
          durationMinutes: s.durationMinutes || 60,
          completed: s.completedLectures || 0,
          color: s.color || '#3B82F6',
          icon: s.icon || 'book',
          timing: s.timingSlot || '08:00 AM - 09:30 AM'
        }));
        setSubjects(formatted);
      }
    } catch (err) {
      console.warn('Could not fetch master syllabus:', err);
    }
  };

  // Update deadline date when targetDays or startDate changes
  const handleDaysChange = (days) => {
    const dNum = Math.max(1, parseInt(days) || 1);
    setTargetDays(dNum);
    const d = new Date(startDate);
    d.setDate(d.getDate() + dNum);
    setDeadlineDate(d.toISOString().split('T')[0]);
  };

  const handleStartDateChange = (dateStr) => {
    setStartDate(dateStr);
    const d = new Date(dateStr);
    d.setDate(d.getDate() + targetDays);
    setDeadlineDate(d.toISOString().split('T')[0]);
  };

  const handleDeadlineDateChange = (dateStr) => {
    setDeadlineDate(dateStr);
    const target = new Date(dateStr);
    const start = new Date(startDate);
    const diffTime = target - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setTargetDays(Math.max(1, diffDays));
  };

  // Import subjects and video counts from StudentLibrary
  const handleImportFromLibrary = async () => {
    setLibraryLoading(true);
    try {
      const res = await api.get('/library');
      if (res.data.success && res.data.data && res.data.data.folders?.length) {
        const folders = res.data.data.folders;
        const imported = folders.map((folder, idx) => {
          let vCount = folder.totalVideos || 0;
          let totalSecs = folder.totalDuration || 0;
          if (!vCount && folder.files) {
            vCount = folder.files.filter(f => f.type === 'video').length;
          }
          if (folder.subfolders) {
            folder.subfolders.forEach(sf => {
              vCount += sf.totalVideos || (sf.files?.filter(f => f.type === 'video').length || 0);
              totalSecs += sf.totalDuration || 0;
            });
          }

          const avgDurationMins = vCount > 0 && totalSecs > 0 ? Math.round(totalSecs / (vCount * 60)) : 50;

          return {
            id: folder.subjectId || `subj_lib_${folder.folderId || idx}`,
            name: folder.subjectName || folder.name,
            lectures: vCount || 40,
            durationMinutes: avgDurationMins || 50,
            completed: folder.completedVideos || 0,
            color: folder.color || PRESET_COLORS[idx % PRESET_COLORS.length],
            icon: 'folder',
            timing: `0${(idx % 4) * 2 + 8}:00 AM - 0${(idx % 4) * 2 + 9}:30 AM`
          };
        });

        setSubjects(imported);
        toast.success(`Imported ${imported.length} subjects directly from your Library!`);
      } else {
        toast.info('No folders found in your library yet.');
      }
    } catch (err) {
      console.error('Import library error:', err);
      toast.error('Failed to import library');
    } finally {
      setLibraryLoading(false);
    }
  };

  // Save syllabus to master syllabus registry
  const handleSaveMasterSyllabus = async () => {
    try {
      const formatted = subjects.map(s => ({
        id: s.id,
        name: s.name,
        totalLectures: s.lectures,
        durationMinutes: s.durationMinutes,
        completedLectures: s.completed || 0,
        color: s.color,
        icon: s.icon || 'book',
        timingSlot: s.timing
      }));

      await api.post('/attendance/master-syllabus', { subjects: formatted });
      toast.success('Master Syllabus saved successfully to database! 💾');
    } catch (err) {
      toast.error('Failed to save master syllabus');
    }
  };

  // Calculations: Total Lectures, Study Hours & Subject Velocities
  const calculations = useMemo(() => {
    const totalLectures = subjects.reduce((sum, s) => sum + (Number(s.lectures) || 0), 0);
    const totalMinutes = subjects.reduce((sum, s) => sum + ((Number(s.lectures) || 0) * (Number(s.durationMinutes) || 60)), 0);
    const totalHours = (totalMinutes / 60).toFixed(1);

    const totalWeeks = targetDays / 7;
    const effectiveStudyDays = Math.round(totalWeeks * studyDaysPerWeek);

    // Global daily watch rate
    const dailyTargetExact = effectiveStudyDays > 0 ? (totalLectures / effectiveStudyDays).toFixed(2) : 0;
    const dailyTargetRound = Math.ceil(Number(dailyTargetExact));
    const dailyStudyMinutes = effectiveStudyDays > 0 ? Math.round(totalMinutes / effectiveStudyDays) : 0;
    const dailyStudyHours = (dailyStudyMinutes / 60).toFixed(1);

    // Subject-by-subject velocity & study hours
    const subjectBreakdown = subjects.map(s => {
      const lecs = Number(s.lectures) || 0;
      const mins = lecs * (Number(s.durationMinutes) || 60);
      const hours = (mins / 60).toFixed(1);

      const subjDailyRate = effectiveStudyDays > 0 ? (lecs / effectiveStudyDays).toFixed(2) : '0.00';
      const subjWeeklyLecs = Math.ceil(Number(subjDailyRate) * studyDaysPerWeek);
      const recommendedDailyGoal = Math.max(1, Math.ceil(Number(subjDailyRate)));

      const subjDailyMinutes = effectiveStudyDays > 0 ? Math.round(mins / effectiveStudyDays) : 0;
      const subjDailyHours = (subjDailyMinutes / 60).toFixed(1);

      return {
        ...s,
        totalMins: mins,
        totalHours: Number(hours),
        subjDailyRate,
        subjWeeklyLecs,
        recommendedDailyGoal,
        subjDailyMinutes,
        subjDailyHours,
        sharePct: totalLectures > 0 ? Math.round((lecs / totalLectures) * 100) : 0
      };
    });

    return {
      totalLectures,
      totalMinutes,
      totalHours: Number(totalHours),
      effectiveStudyDays,
      dailyTargetExact,
      dailyTargetRound,
      dailyStudyMinutes,
      dailyStudyHours,
      subjectBreakdown
    };
  }, [subjects, targetDays, studyDaysPerWeek]);

  // Add subject to plan
  const handleAddSubject = () => {
    if (!newSubjName.trim()) {
      toast.error('Please enter a subject name');
      return;
    }

    const newEntry = {
      id: `subj_${Date.now()}`,
      name: newSubjName.trim(),
      lectures: Number(newSubjLectures) || 50,
      durationMinutes: Number(newSubjDuration) || 60,
      completed: 0,
      color: newSubjColor,
      icon: 'book',
      timing: newSubjTiming
    };
    setSubjects([...subjects, newEntry]);
    setNewSubjName('');
    toast.success('Subject added to plan!');
  };

  const handleDeleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const handleUpdateLectures = (id, newLecs) => {
    const val = Math.max(1, parseInt(newLecs) || 1);
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, lectures: val } : s));
  };

  const handleUpdateDuration = (id, newDuration) => {
    const val = Math.max(5, parseInt(newDuration) || 45);
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, durationMinutes: val } : s));
  };

  // 1-Click Export to Attendance Matrix & Save
  const handleExportToAttendance = async () => {
    setLoading(true);
    try {
      const attendanceSubjects = subjects.map(s => {
        const subjDailyRate = calculations.effectiveStudyDays > 0 ? (s.lectures / calculations.effectiveStudyDays) : 1;
        const computedGoal = Math.max(1, Math.ceil(subjDailyRate));

        return {
          id: s.id,
          name: s.name,
          color: s.color,
          icon: s.icon || 'book',
          dailyGoal: computedGoal,
          timingSlot: s.timing || (computedGoal > 1 ? 'Morning & Evening (2 Sessions)' : '08:00 AM - 09:30 AM'),
          recurringDays: studyDaysPerWeek === 7 ? [0,1,2,3,4,5,6] : [1,2,3,4,5,6],
          totalLectures: s.lectures,
          durationMinutes: s.durationMinutes || 60,
          completedLectures: s.completed || 0,
          notes: `Target: ${s.lectures} lectures in ${targetDays} days`
        };
      });

      const payload = {
        title: `Study Schedule: ${calculations.totalLectures} Lecs in ${targetDays} Days`,
        startDate: startDate,
        endDate: deadlineDate,
        subjects: attendanceSubjects,
        lecturePlan: {
          targetDays,
          deadlineDate,
          studyDaysPerWeek,
          strategy,
          avgLectureMinutes: 60,
          totalLectures: calculations.totalLectures,
          dailyTargetRate: Number(calculations.dailyTargetExact)
        }
      };

      const res = await api.post('/attendance/save', payload);
      if (res.data.success) {
        toast.success('🎉 Timetable & Multi-Lecture Checkmarks Synced!');
        navigate('/attendance');
      }
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to sync with attendance timetable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        
        {/* Top Header Banner (Solid, Clean, Non-Gradient) */}
        <div className="bg-white dark:bg-[#111115] text-[#17171C] dark:text-white p-6 sm:p-8 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs relative">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8E4CF6]/15 text-[#8E4CF6] dark:text-[#C49CFF] text-xs font-black uppercase tracking-wider border border-[#8E4CF6]/25">
                <FiStar size={14} className="text-[#8E4CF6]" />
                DEADLINE PACING & SMART TIMETABLE OPTIMIZER
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#17171C] dark:text-white tracking-tight">
                Smart Lecture Target & Study Planner
              </h1>
              <p className="text-[#6B7082] dark:text-[#A9A2BA] text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
                Set your Syllabus Subjects (Maths, Physics, English, etc.), attach library video folders, and calculate required lectures and study hours to finish in <span className="font-bold text-[#8E4CF6] dark:text-[#C49CFF]">{targetDays} Days</span>!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleImportFromLibrary}
                disabled={libraryLoading}
                className="px-4 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] hover:bg-[#F3EEFB] dark:hover:bg-[#20202A] text-[#17171C] dark:text-white rounded-2xl font-bold text-xs sm:text-sm transition border border-[#E8DFF2] dark:border-[#22222B] flex items-center gap-2"
              >
                <FiFolder size={16} />
                {libraryLoading ? 'Scanning...' : 'Import from Library'}
              </button>

              <button
                onClick={handleExportToAttendance}
                disabled={loading}
                className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-2xl font-extrabold text-xs sm:text-sm transition shadow-xs flex items-center gap-2 active:scale-95"
              >
                <FiCheckSquare size={16} />
                {loading ? 'Creating...' : 'Apply to Attendance Matrix →'}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Toolbar */}
        <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-[#111115] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] w-fit shadow-xs">
          <button
            onClick={() => setActiveTab('pacing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'pacing'
                ? 'bg-[#8E4CF6] text-white shadow-md'
                : 'text-[#6B7082] dark:text-[#A9A2BA] hover:bg-[#FAF7FD] dark:hover:bg-[#18181F]'
            }`}
          >
            <FiZap size={14} /> Pacing Calculator
          </button>

          <button
            onClick={() => setActiveTab('hours_analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'hours_analytics'
                ? 'bg-[#8E4CF6] text-white shadow-md'
                : 'text-[#6B7082] dark:text-[#A9A2BA] hover:bg-[#FAF7FD] dark:hover:bg-[#18181F]'
            }`}
          >
            <FiBarChart2 size={14} /> Subject Study Hours Analytics
          </button>

          <button
            onClick={() => setActiveTab('master_syllabus')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'master_syllabus'
                ? 'bg-[#8E4CF6] text-white shadow-md'
                : 'text-[#6B7082] dark:text-[#A9A2BA] hover:bg-[#FAF7FD] dark:hover:bg-[#18181F]'
            }`}
          >
            <FiBookOpen size={14} /> Master Syllabus ({subjects.length} Subjects)
          </button>
        </div>

        {/* Top Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Target Days Card */}
          <div className="bg-white dark:bg-[#111115] p-5 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-3">
            <div className="flex justify-between items-center text-[#6B7082] dark:text-[#A9A2BA]">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Start Date & Target</span>
              <FiCalendar size={18} className="text-[#8E4CF6]" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#17171C] dark:text-white">
                {targetDays} <span className="text-sm font-semibold text-[#6B7082]">Days</span>
              </div>
              <div className="text-xs text-[#10B981] font-bold mt-1">
                {calculations.effectiveStudyDays} Study Days ({studyDaysPerWeek}d/wk)
              </div>
              <div className="text-[10px] text-[#A9A2BA] mt-0.5">
                Finish by: <span className="font-semibold">{deadlineDate}</span>
              </div>
            </div>
          </div>

          {/* Daily Watch Rate Card */}
          <div className="bg-[#8E4CF6] p-5 rounded-3xl text-white shadow-md space-y-2">
            <div className="flex justify-between items-center text-white/80">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Required Watch Velocity</span>
              <FiZap size={18} className="text-[#FBBF24]" />
            </div>
            <div className="text-3xl font-black">
              {calculations.dailyTargetExact} <span className="text-sm font-bold text-white/80">Lecs/Day</span>
            </div>
            <div className="text-xs text-white/90">
              Daily Study: <span className="font-bold text-[#FBBF24]">~{calculations.dailyStudyHours} Hours/Day</span>
            </div>
          </div>

          {/* Total Curriculum Scope */}
          <div className="bg-white dark:bg-[#111115] p-5 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-3">
            <div className="flex justify-between items-center text-[#6B7082] dark:text-[#A9A2BA]">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Total Curriculum</span>
              <FiLayers size={18} className="text-[#10B981]" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#17171C] dark:text-white">
                {calculations.totalLectures} <span className="text-sm font-semibold text-[#6B7082]">Lectures</span>
              </div>
              <div className="text-xs text-[#8E4CF6] font-bold mt-1">
                Across {subjects.length} Subjects
              </div>
              <div className="text-[10px] text-[#A9A2BA] mt-0.5">
                Total Study Time: <span className="font-bold text-[#17171C] dark:text-white">~{calculations.totalHours} Hours</span>
              </div>
            </div>
          </div>

          {/* Target Routine Config */}
          <div className="bg-white dark:bg-[#111115] p-5 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] block">
              Quick Target Days Setup
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={targetDays}
                onChange={(e) => handleDaysChange(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#8E4CF6] rounded-xl font-black text-sm text-[#8E4CF6] text-center"
              />
              <span className="text-xs font-bold text-[#6B7082]">Days</span>
            </div>
            <div className="flex gap-1.5 pt-1">
              {[100, 150, 200, 300].map(d => (
                <button
                  key={d}
                  onClick={() => handleDaysChange(d)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition ${
                    targetDays === d ? 'bg-[#8E4CF6] text-white' : 'bg-[#FAF7FD] dark:bg-[#18181F] text-[#6B7082] border'
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* TAB 1: PACING CALCULATOR & SUBJECT VELOCITIES */}
        {activeTab === 'pacing' && (
          <div className="space-y-6">
            
            {/* Subject Predictions Grid */}
            <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8DFF2] dark:border-[#22222B]">
                <div>
                  <h2 className="text-base font-extrabold text-[#17171C] dark:text-white flex items-center gap-2">
                    <FiZap className="text-[#8E4CF6]" />
                    Subject-by-Subject Daily Velocity Predictions ({targetDays} Days Plan)
                  </h2>
                  <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA]">
                    Based on your target of {targetDays} days, here is how many lectures you must watch per day for each subject:
                  </p>
                </div>
                <button
                  onClick={handleSaveMasterSyllabus}
                  className="px-3.5 py-1.5 bg-[#8E4CF6]/15 hover:bg-[#8E4CF6]/25 text-[#8E4CF6] dark:text-[#C49CFF] rounded-xl font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto transition"
                >
                  <FiSave size={14} /> Save Syllabus
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {calculations.subjectBreakdown.map((s) => (
                  <div 
                    key={s.id}
                    className="p-4 rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] space-y-3"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      <div className="truncate">
                        <div className="font-extrabold text-sm text-[#17171C] dark:text-white truncate">{s.name}</div>
                        <div className="text-[10px] text-[#A9A2BA]">{s.lectures} Lectures Total • {s.totalHours}h</div>
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-[#111115] rounded-xl border border-[#E8DFF2]/60 dark:border-[#22222B] space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[#6B7082] dark:text-[#A9A2BA]">Required Velocity:</span>
                        <span className="font-extrabold text-[#8E4CF6] dark:text-[#C49CFF]">{s.subjDailyRate} lecs/day</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#6B7082] dark:text-[#A9A2BA]">Recommended Goal:</span>
                        <span className="font-black text-[#10B981]">{s.recommendedDailyGoal} Lecs / Day</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#6B7082] dark:text-[#A9A2BA]">Daily Study Time:</span>
                        <span className="font-bold text-[#F59E0B]">~{s.subjDailyMinutes} mins/day</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-[#A9A2BA] flex items-center justify-between">
                      <span>Weekly Goal: <span className="font-bold text-[#17171C] dark:text-white">{s.subjWeeklyLecs} lecs/wk</span></span>
                      <span>{s.sharePct}% of Syllabus</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editable Subjects Table */}
            <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-extrabold text-[#17171C] dark:text-white">
                  Adjust Subject Lectures & Durations
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E8DFF2] dark:border-[#22222B] text-[#6B7082] dark:text-[#A9A2BA] font-bold">
                      <th className="pb-3">SUBJECT</th>
                      <th className="pb-3 text-center">TOTAL LECTURES</th>
                      <th className="pb-3 text-center">DURATION (MINS/LEC)</th>
                      <th className="pb-3 text-center">TOTAL HOURS</th>
                      <th className="pb-3 text-center">DAILY WATCH RATE</th>
                      <th className="pb-3 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFF2] dark:divide-[#22222B]">
                    {calculations.subjectBreakdown.map(s => (
                      <tr key={s.id} className="hover:bg-[#FAF7FD] dark:hover:bg-[#18181F] transition">
                        <td className="py-3">
                          <div className="flex items-center space-x-2.5">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                            <span className="font-bold text-[#17171C] dark:text-white">{s.name}</span>
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <input
                            type="number"
                            min="1"
                            value={s.lectures}
                            onChange={(e) => handleUpdateLectures(s.id, e.target.value)}
                            className="w-20 px-2 py-1 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-lg font-bold text-center text-[#8E4CF6]"
                          />
                        </td>
                        <td className="py-3 text-center">
                          <input
                            type="number"
                            min="5"
                            step="5"
                            value={s.durationMinutes}
                            onChange={(e) => handleUpdateDuration(s.id, e.target.value)}
                            className="w-20 px-2 py-1 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-lg font-bold text-center text-[#17171C] dark:text-white"
                          />
                        </td>
                        <td className="py-3 text-center font-bold text-[#10B981]">
                          {s.totalHours} hrs
                        </td>
                        <td className="py-3 text-center font-black text-[#8E4CF6]">
                          {s.subjDailyRate} lecs/day (~{s.recommendedDailyGoal} lecs/day)
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDeleteSubject(s.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded-lg transition"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: SUBJECT STUDY HOURS ANALYTICS GRAPH */}
        {activeTab === 'hours_analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Hours by Subject Bar Chart */}
            <div className="lg:col-span-7 bg-white dark:bg-[#111115] p-6 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-extrabold text-[#17171C] dark:text-white flex items-center gap-2">
                    <FiBarChart2 className="text-[#8E4CF6]" />
                    Total Study Hours by Subject
                  </h3>
                  <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA]">
                    Total curriculum demands <span className="font-bold text-[#17171C] dark:text-white">{calculations.totalHours} Hours</span> of video lectures
                  </p>
                </div>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={calculations.subjectBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis dataKey="name" stroke="#A9A2BA" fontSize={10} tickLine={false} />
                    <YAxis stroke="#A9A2BA" fontSize={10} tickLine={false} unit="h" />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-[#17171C] text-white text-xs p-3 rounded-xl shadow-xl border border-white/10">
                              <div className="font-bold text-sm">{data.name}</div>
                              <div className="text-[#10B981] mt-1 font-semibold">{data.totalHours} Total Hours ({data.lectures} Lectures)</div>
                              <div className="text-[#FBBF24]">Daily Need: ~{data.subjDailyMinutes} mins/day ({data.subjDailyRate} lecs/day)</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="totalHours" radius={[8, 8, 0, 0]}>
                      {calculations.subjectBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || PRESET_COLORS[index % PRESET_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Hours Distribution Donut & Daily Required Hours */}
            <div className="lg:col-span-5 bg-white dark:bg-[#111115] p-6 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#17171C] dark:text-white flex items-center gap-2">
                  <FiPieChart className="text-[#10B981]" />
                  Study Hours Distribution
                </h3>
                <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA]">
                  Percentage share of study time per subject
                </p>
              </div>

              <div className="h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={calculations.subjectBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={68}
                      paddingAngle={3}
                      dataKey="totalHours"
                    >
                      {calculations.subjectBreakdown.map((entry, index) => (
                        <Cell key={`pie-cell-${index}`} fill={entry.color || PRESET_COLORS[index % PRESET_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#E8DFF2] dark:border-[#22222B] text-xs">
                {calculations.subjectBreakdown.map(s => (
                  <div key={s.id} className="flex justify-between items-center">
                    <span className="flex items-center gap-2 truncate max-w-[170px]">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="font-semibold text-[#17171C] dark:text-white truncate">{s.name}</span>
                    </span>
                    <span className="font-bold text-[#6B7082] dark:text-[#A9A2BA]">{s.totalHours} hrs ({s.sharePct}%)</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: MASTER SYLLABUS REGISTRY & ADD SUBJECTS */}
        {activeTab === 'master_syllabus' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Add Subject Form */}
            <div className="lg:col-span-5 bg-white dark:bg-[#111115] p-6 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-[#17171C] dark:text-white flex items-center gap-2">
                <FiPlus className="text-[#8E4CF6]" />
                Add New Syllabus Subject
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-[#17171C] dark:text-white block mb-1">Subject Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Mathematics, Physics, English..."
                    value={newSubjName}
                    onChange={(e) => setNewSubjName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] font-semibold text-[#17171C] dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#17171C] dark:text-white block mb-1">Total Lectures</label>
                    <input
                      type="number"
                      min="1"
                      value={newSubjLectures}
                      onChange={(e) => setNewSubjLectures(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] font-bold text-[#8E4CF6]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#17171C] dark:text-white block mb-1">Duration (Mins/Lec)</label>
                    <input
                      type="number"
                      min="5"
                      step="5"
                      value={newSubjDuration}
                      onChange={(e) => setNewSubjDuration(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] font-bold text-[#17171C] dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#17171C] dark:text-white block mb-1">Timing Slot</label>
                  <input
                    type="text"
                    placeholder="e.g. 08:00 AM & 04:00 PM"
                    value={newSubjTiming}
                    onChange={(e) => setNewSubjTiming(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] text-[#17171C] dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#17171C] dark:text-white block mb-1">Color Theme</label>
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {PRESET_COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewSubjColor(c)}
                        className={`w-7 h-7 rounded-full transition ${newSubjColor === c ? 'ring-4 ring-[#8E4CF6]/40 scale-110' : 'hover:scale-105'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAddSubject}
                  className="w-full py-2.5 bg-[#8E4CF6] hover:bg-[#7839EE] text-white rounded-xl font-extrabold text-xs shadow-md transition active:scale-95"
                >
                  + Add Subject to Syllabus
                </button>
              </div>
            </div>

            {/* Master Syllabus List */}
            <div className="lg:col-span-7 bg-white dark:bg-[#111115] p-6 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-extrabold text-[#17171C] dark:text-white flex items-center gap-2">
                  <FiBookOpen className="text-[#10B981]" />
                  Configured Master Subjects ({subjects.length})
                </h3>
                <button
                  onClick={handleSaveMasterSyllabus}
                  className="px-4 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                >
                  <FiSave size={14} /> Save to Database
                </button>
              </div>

              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {subjects.map((s) => (
                  <div key={s.id} className="p-3.5 rounded-2xl bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] flex items-center justify-between">
                    <div className="flex items-center space-x-3 truncate">
                      <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      <div className="truncate">
                        <div className="font-extrabold text-sm text-[#17171C] dark:text-white truncate">{s.name}</div>
                        <div className="text-[10px] text-[#A9A2BA] flex items-center gap-2 mt-0.5">
                          <span>{s.lectures} Lectures</span>
                          <span>•</span>
                          <span>{s.durationMinutes}m / lec</span>
                          <span>•</span>
                          <span>{s.timing}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteSubject(s.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/30 rounded-xl transition"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </Layout>
  );
};

export default LecturePlanner;
