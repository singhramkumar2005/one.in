import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Layout from '../components/Layout';
import ManualTimetableCreator from '../components/ManualTimetableCreator';
import AttendanceExportModal from '../components/AttendanceExportModal';
import {
  FiCheckSquare, FiCalendar, FiClock, FiPlus, FiTrash2, FiEdit3,
  FiTrendingUp, FiAward, FiZap, FiBookOpen, FiActivity, FiCpu,
  FiPieChart, FiBarChart2, FiCheck, FiX, FiRefreshCw, FiChevronLeft,
  FiChevronRight, FiSliders, FiArrowRight, FiTarget, FiInfo, FiStar,
  FiFolder, FiSun, FiLayers, FiHelpCircle, FiCheckCircle, FiGrid,
  FiDownload
} from 'react-icons/fi';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell
} from 'recharts';

const AVAILABLE_ICONS = [
  { id: 'book', label: 'Book', icon: FiBookOpen },
  { id: 'zap', label: 'Energy', icon: FiZap },
  { id: 'activity', label: 'Science', icon: FiActivity },
  { id: 'cpu', label: 'Tech/CS', icon: FiCpu },
  { id: 'target', label: 'Target', icon: FiTarget },
  { id: 'check-circle', label: 'Task', icon: FiCheckSquare },
];

const PRESET_COLORS = [
  '#3B82F6', '#10B981', '#EC4899', '#8B5CF6', '#F59E0B',
  '#06B6D4', '#EF4444', '#14B8A6', '#6366F1', '#D946EF'
];

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const PRESET_CURRICULUMS = {
  jee: [
    { name: 'Mathematics', lectures: 160, dailyGoal: 2, durationMinutes: 60, color: '#3B82F6', icon: 'book', timingSlot: '08:00 AM & 04:00 PM (2 Lecs/day)' },
    { name: 'Physics & Lab', lectures: 140, dailyGoal: 2, durationMinutes: 60, color: '#10B981', icon: 'zap', timingSlot: '10:00 AM & 06:00 PM (2 Lecs/day)' },
    { name: 'Chemistry (Org/Inorg)', lectures: 100, dailyGoal: 1, durationMinutes: 50, color: '#EC4899', icon: 'activity', timingSlot: '12:00 PM (1 Lec/day)' }
  ],
  neet: [
    { name: 'Biology (Botany & Zoology)', lectures: 180, dailyGoal: 2, durationMinutes: 45, color: '#10B981', icon: 'book', timingSlot: '08:00 AM & 03:00 PM (2 Lecs/day)' },
    { name: 'Physics (NEET)', lectures: 120, dailyGoal: 1, durationMinutes: 60, color: '#3B82F6', icon: 'zap', timingSlot: '10:30 AM (1 Lec/day)' },
    { name: 'Chemistry', lectures: 100, dailyGoal: 1, durationMinutes: 50, color: '#EC4899', icon: 'activity', timingSlot: '12:30 PM (1 Lec/day)' }
  ],
  custom_400: [
    { name: 'Mathematics (Core)', lectures: 200, dailyGoal: 2, durationMinutes: 60, color: '#3B82F6', icon: 'book', timingSlot: 'Morning (08:00 AM) & Evening (05:00 PM)' },
    { name: 'Physics / Tech', lectures: 100, dailyGoal: 1, durationMinutes: 60, color: '#10B981', icon: 'zap', timingSlot: '10:30 AM - 12:00 PM' },
    { name: 'English / Electives', lectures: 100, dailyGoal: 1, durationMinutes: 45, color: '#8B5CF6', icon: 'activity', timingSlot: '02:00 PM - 03:30 PM' }
  ]
};

const AttendanceTracker = () => {
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState(null);
  
  // View mode: 'paginated_weeks' (default), 'full_timeline' (all days), 'calendar_month'
  const [viewMode, setViewMode] = useState('paginated_weeks');
  const [currentWeekPage, setCurrentWeekPage] = useState(0);
  const WEEKS_PER_PAGE = 4;

  // Calendar month state
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  
  // Wizard state: 1: Syllabus, 2: Target & Prediction, 3: Real Timetable Customizer
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [showManualTimetable, setShowManualTimetable] = useState(false);
  const [savedCustomTimetable, setSavedCustomTimetable] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  // Timetable setup state
  const [title, setTitle] = useState('My Study & Attendance Timetable');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [targetDays, setTargetDays] = useState(200);
  const [deadlineDate, setDeadlineDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 200);
    return d.toISOString().split('T')[0];
  });
  const [studyDaysPerWeek, setStudyDaysPerWeek] = useState(6);
  const [strategy, setStrategy] = useState('balanced');
  
  // Subjects list
  const [subjectsList, setSubjectsList] = useState([]);
  
  // New subject form fields
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjTiming, setNewSubjTiming] = useState('08:00 AM - 09:30 AM');
  const [newSubjGoal, setNewSubjGoal] = useState(2); // default 2 lecs/day
  const [newSubjColor, setNewSubjColor] = useState(PRESET_COLORS[0]);
  const [newSubjIcon, setNewSubjIcon] = useState('book');
  const [newSubjLectures, setNewSubjLectures] = useState(100);
  const [newSubjDuration, setNewSubjDuration] = useState(60);
  const [newSubjDays, setNewSubjDays] = useState([1, 2, 3, 4, 5, 6]);

  // Matrix logs state: map of "YYYY-MM-DD" -> { subjectId: { checked, count, sessions: [true, false] } }
  const [logs, setLogs] = useState({});

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await api.get('/attendance');
      if (res.data.success) {
        const data = res.data.data;
        if (data && data.subjects && data.subjects.length > 0) {
          setTimetable(data);
          setLogs(data.logs || {});
          setSubjectsList(data.subjects || []);
          setTitle(data.title || 'My Study & Attendance Timetable');
          if (data.startDate) setStartDate(data.startDate);
          if (data.endDate) setDeadlineDate(data.endDate);
          if (data.lecturePlan?.targetDays) setTargetDays(data.lecturePlan.targetDays);
          if (data.lecturePlan?.studyDaysPerWeek) setStudyDaysPerWeek(data.lecturePlan.studyDaysPerWeek);
          if (data.customTimetable) setSavedCustomTimetable(data.customTimetable);
        } else {
          setTimetable(null);
          setSubjectsList([]);
          setLogs({});
        }
      }
    } catch (err) {
      console.error('Failed to load attendance:', err);
      toast.error('Failed to load attendance timetable');
    } finally {
      setLoading(false);
    }
  };

  const handleResetTimetable = async () => {
    if (!window.confirm('Are you sure you want to reset your attendance timetable and start fresh?')) return;
    try {
      await api.delete('/attendance/reset');
      setTimetable(null);
      setSubjectsList([]);
      setLogs({});
      toast.info('Attendance timetable cleared. Create your new routine!');
    } catch (err) {
      toast.error('Failed to reset attendance timetable');
    }
  };

  // Generate ALL days of the full study plan (e.g. Day 1 to Day 200)
  const fullPlanDays = useMemo(() => {
    const start = new Date(startDate || new Date());
    const todayStr = new Date().toISOString().split('T')[0];
    const days = [];
    const totalDaysCount = Math.max(1, targetDays || 200);

    for (let i = 0; i < totalDaysCount; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay();
      const weekIndex = Math.floor(i / 7) + 1;

      days.push({
        dayIndex: i + 1,
        dayNum: d.getDate(),
        monthNum: d.getMonth() + 1,
        monthName: MONTH_NAMES[d.getMonth()].substring(0, 3),
        dateStr,
        weekday: WEEKDAY_NAMES[dayOfWeek],
        dayOfWeek,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        isToday: dateStr === todayStr,
        weekNumber: weekIndex
      });
    }
    return days;
  }, [startDate, targetDays]);

  // Group all days into weekly blocks (e.g. 29 weeks)
  const allWeeklyBlocks = useMemo(() => {
    const blocks = [];
    let cur = [];
    fullPlanDays.forEach((day, idx) => {
      cur.push(day);
      if (cur.length === 7 || idx === fullPlanDays.length - 1) {
        blocks.push({
          weekNumber: blocks.length + 1,
          days: cur
        });
        cur = [];
      }
    });
    return blocks;
  }, [fullPlanDays]);

  // Determine active visible weekly blocks & days
  const { visibleWeeklyBlocks, visibleDays } = useMemo(() => {
    if (viewMode === 'full_timeline') {
      return {
        visibleWeeklyBlocks: allWeeklyBlocks,
        visibleDays: fullPlanDays
      };
    } else if (viewMode === 'calendar_month') {
      const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const todayStr = new Date().toISOString().split('T')[0];
      const mDays = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(selectedYear, selectedMonth, d);
        const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayOfWeek = dateObj.getDay();
        mDays.push({
          dayIndex: d,
          dayNum: d,
          monthNum: selectedMonth + 1,
          monthName: MONTH_NAMES[selectedMonth].substring(0, 3),
          dateStr,
          weekday: WEEKDAY_NAMES[dayOfWeek],
          dayOfWeek,
          isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
          isToday: dateStr === todayStr,
          weekNumber: Math.ceil(d / 7)
        });
      }

      const mBlocks = [];
      let cur = [];
      mDays.forEach((day, idx) => {
        cur.push(day);
        if (cur.length === 7 || idx === mDays.length - 1) {
          mBlocks.push({ weekNumber: mBlocks.length + 1, days: cur });
          cur = [];
        }
      });

      return { visibleWeeklyBlocks: mBlocks, visibleDays: mDays };
    } else {
      const startIdx = currentWeekPage * WEEKS_PER_PAGE;
      const endIdx = startIdx + WEEKS_PER_PAGE;
      const pagedBlocks = allWeeklyBlocks.slice(startIdx, endIdx);
      const pagedDays = pagedBlocks.flatMap(b => b.days);

      return {
        visibleWeeklyBlocks: pagedBlocks,
        visibleDays: pagedDays
      };
    }
  }, [viewMode, currentWeekPage, allWeeklyBlocks, fullPlanDays, selectedYear, selectedMonth]);

  const totalPages = Math.ceil(allWeeklyBlocks.length / WEEKS_PER_PAGE);

  const jumpToTodayPage = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayIndex = fullPlanDays.findIndex(d => d.dateStr === todayStr);
    if (todayIndex !== -1) {
      const todayWeek = Math.floor(todayIndex / 7);
      const targetPage = Math.floor(todayWeek / WEEKS_PER_PAGE);
      setCurrentWeekPage(targetPage);
      setViewMode('paginated_weeks');
    }
  };

  const formatTimeSlotForIdx = (idx) => {
    const startHour = (idx % 5) * 2 + 8; // 8, 10, 12, 14, 16
    const endHour = startHour + 1; // 9, 11, 13, 15, 17
    const formatH = (h) => {
      const period = h >= 12 ? 'PM' : 'AM';
      const h12 = h > 12 ? h - 12 : (h === 0 ? 12 : h);
      return `${String(h12).padStart(2, '0')}:00 ${period}`;
    };
    const formatEndH = (h) => {
      const period = h >= 12 ? 'PM' : 'AM';
      const h12 = h > 12 ? h - 12 : (h === 0 ? 12 : h);
      return `${String(h12).padStart(2, '0')}:30 ${period}`;
    };
    return `${formatH(startHour)} - ${formatEndH(endHour)}`;
  };

  const handleTargetDaysChange = (days) => {
    const dNum = Math.max(1, parseInt(days) || 1);
    setTargetDays(dNum);
    const d = new Date(startDate || new Date());
    d.setDate(d.getDate() + dNum);
    setDeadlineDate(d.toISOString().split('T')[0]);

    // Auto-update daily goal recommendations for all subjects to guarantee finishing on time
    const effectiveStudyDays = Math.max(1, Math.round((dNum / 7) * studyDaysPerWeek));
    setSubjectsList(prev => prev.map(item => ({
      ...item,
      dailyGoal: Math.max(1, Math.ceil((Number(item.totalLectures) || 0) / effectiveStudyDays))
    })));
  };

  const handleStudyDaysChange = (daysPerWk) => {
    const num = Number(daysPerWk) || 6;
    setStudyDaysPerWeek(num);
    const effectiveStudyDays = Math.max(1, Math.round((targetDays / 7) * num));
    setSubjectsList(prev => prev.map(item => ({
      ...item,
      dailyGoal: Math.max(1, Math.ceil((Number(item.totalLectures) || 0) / effectiveStudyDays))
    })));
  };

  // Auto-balance daily slots across all subjects to guarantee 100% completion by target days
  const handleAutoBalanceGoals = (customTargetDays = targetDays, customStudyDays = studyDaysPerWeek) => {
    const effectiveWeeks = customTargetDays / 7;
    const effectiveDays = Math.max(1, Math.round(effectiveWeeks * customStudyDays));
    
    setSubjectsList(prev => prev.map(s => {
      const lecs = Number(s.totalLectures) || 0;
      const reqGoal = Math.max(1, Math.ceil(lecs / effectiveDays));
      return {
        ...s,
        dailyGoal: reqGoal
      };
    }));
    toast.success(`⚡ Automatically balanced daily lecture slots for ${customTargetDays} days!`);
  };

  // 1-Click Fix Shortfalls & Save to Database
  const handleFixShortfallNow = async () => {
    const effectiveWeeks = targetDays / 7;
    const effectiveDays = Math.max(1, Math.round(effectiveWeeks * studyDaysPerWeek));
    
    const updatedSubjects = subjectsList.map(s => {
      const lecs = Number(s.totalLectures) || 0;
      const reqGoal = Math.max(1, Math.ceil(lecs / effectiveDays));
      return {
        ...s,
        dailyGoal: Math.max(s.dailyGoal || 1, reqGoal)
      };
    });
    
    setSubjectsList(updatedSubjects);

    try {
      const payload = {
        title,
        startDate,
        endDate: deadlineDate,
        subjects: updatedSubjects,
        logs,
        lecturePlan: {
          targetDays,
          deadlineDate,
          studyDaysPerWeek,
          strategy,
          avgLectureMinutes: 60,
          totalLectures: updatedSubjects.reduce((sum, s) => sum + (Number(s.totalLectures) || 0), 0),
          dailyTargetRate: Number(pacingStats.dailyRate)
        }
      };
      await api.post('/attendance/save', payload);
      toast.success('🎉 Fixed! Daily slots upgraded so you finish all lectures in 200 days!');
      fetchAttendance();
    } catch (err) {
      toast.error('Failed to update subjects');
    }
  };

  // AI Pacing & Subject Rate Predictions (Guaranteed Completion Mathematics)
  const pacingStats = useMemo(() => {
    const totalLecs = subjectsList.reduce((sum, s) => sum + (Number(s.totalLectures) || 0), 0);
    const totalMinutes = subjectsList.reduce((sum, s) => sum + ((Number(s.totalLectures) || 0) * (Number(s.durationMinutes) || 60)), 0);
    const totalHours = (totalMinutes / 60).toFixed(0);

    const effectiveWeeks = targetDays / 7;
    const effectiveStudyDays = Math.max(1, Math.round(effectiveWeeks * studyDaysPerWeek));
    const dailyRate = effectiveStudyDays > 0 ? (totalLecs / effectiveStudyDays).toFixed(2) : '0.00';
    const dailyRecommended = Math.ceil(Number(dailyRate));
    const dailyStudyMinutes = effectiveStudyDays > 0 ? Math.round(totalMinutes / effectiveStudyDays) : 0;
    const dailyStudyHours = (dailyStudyMinutes / 60).toFixed(1);

    // Subject breakdown predictions with Guaranteed Completion Calculation
    const subjectPredictions = subjectsList.map(s => {
      const subjLecs = Number(s.totalLectures) || 0;
      const subjDaily = effectiveStudyDays > 0 ? (subjLecs / effectiveStudyDays).toFixed(2) : '0.00';
      // To complete subjLecs in effectiveStudyDays, minimum daily slots must be Math.ceil(subjLecs / effectiveStudyDays)
      const minRequiredDailyGoal = Math.max(1, Math.ceil(Number(subjDaily)));
      const weeklyLecs = Math.ceil(Number(subjDaily) * studyDaysPerWeek);
      
      const configuredDailyGoal = Number(s.dailyGoal) || 1;
      const maxReachableLectures = configuredDailyGoal * effectiveStudyDays;
      const isShortfall = maxReachableLectures < subjLecs;
      const shortfallCount = Math.max(0, subjLecs - maxReachableLectures);
      const daysNeededAtConfigured = configuredDailyGoal > 0 ? Math.ceil(subjLecs / (configuredDailyGoal * (studyDaysPerWeek / 7))) : targetDays;

      return {
        ...s,
        subjDaily,
        recommendedDailyGoal: minRequiredDailyGoal,
        minRequiredDailyGoal,
        weeklyLecs,
        configuredDailyGoal,
        maxReachableLectures,
        isShortfall,
        shortfallCount,
        daysNeededAtConfigured
      };
    });

    const hasAnyShortfall = subjectPredictions.some(sp => sp.isShortfall);
    const shortfallSubjects = subjectPredictions.filter(sp => sp.isShortfall);

    return {
      totalLecs,
      totalMinutes,
      totalHours,
      effectiveStudyDays,
      dailyRate,
      dailyRecommended,
      dailyStudyMinutes,
      dailyStudyHours,
      subjectPredictions,
      hasAnyShortfall,
      shortfallSubjects
    };
  }, [subjectsList, targetDays, studyDaysPerWeek]);

  // Toggle individual lecture session slot (e.g. Lecture 1 vs Lecture 2 on the same day)
  const handleToggleSlot = async (dateStr, subjectId, slotIdx, targetDailyGoal) => {
    const currentEntry = logs[dateStr]?.[subjectId] || { count: 0, checked: false, sessions: [] };
    let sessions = Array.isArray(currentEntry.sessions) ? [...currentEntry.sessions] : [];
    while (sessions.length < targetDailyGoal) {
      sessions.push(false);
    }

    sessions[slotIdx] = !sessions[slotIdx];
    const completedCount = sessions.filter(Boolean).length;
    const isFullyChecked = completedCount >= targetDailyGoal;

    setLogs(prev => {
      const updated = { ...prev };
      if (!updated[dateStr]) updated[dateStr] = {};
      updated[dateStr][subjectId] = {
        checked: isFullyChecked,
        count: completedCount,
        sessions,
        notes: currentEntry.notes || ''
      };
      return updated;
    });

    try {
      await api.post('/attendance/toggle-cell', {
        date: dateStr,
        subjectId,
        slotIndex: slotIdx,
        checked: sessions[slotIdx]
      });
    } catch (err) {
      console.error('Toggle cell error:', err);
      toast.error('Sync failed, refreshing...');
      fetchAttendance();
    }
  };

  // Mark all subjects for today
  const handleMarkTodayAll = async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const subjectIds = subjectsList.map(s => s.id);
    const allMarked = subjectIds.every(id => logs[todayStr]?.[id]?.checked);
    const targetState = !allMarked;

    setLogs(prev => {
      const updated = { ...prev };
      if (!updated[todayStr]) updated[todayStr] = {};
      subjectsList.forEach(s => {
        const goal = s.dailyGoal || 1;
        const sessions = new Array(goal).fill(targetState);
        updated[todayStr][s.id] = {
          checked: targetState,
          count: targetState ? goal : 0,
          sessions,
          notes: ''
        };
      });
      return updated;
    });

    try {
      await api.post('/attendance/batch-fill', {
        dates: [todayStr],
        subjectIds,
        checked: targetState
      });
      toast.success(targetState ? 'All subjects checked for today! 🔥' : 'Cleared today marks');
    } catch (err) {
      toast.error('Failed to batch mark');
      fetchAttendance();
    }
  };

  // Presets loader
  const loadPresetCurriculum = (presetKey) => {
    const preset = PRESET_CURRICULUMS[presetKey] || [];
    const formatted = preset.map((p, idx) => ({
      id: `subj_${Date.now()}_${idx}`,
      name: p.name,
      totalLectures: p.lectures,
      dailyGoal: p.dailyGoal || 1,
      durationMinutes: p.durationMinutes || 60,
      completedLectures: 0,
      color: p.color,
      icon: p.icon,
      timingSlot: p.timingSlot,
      recurringDays: [1, 2, 3, 4, 5, 6]
    }));
    setSubjectsList(formatted);
    toast.success(`Loaded ${presetKey.toUpperCase()} syllabus template!`);
  };

  // Import from Library
  const handleImportLibrary = async () => {
    try {
      toast.info('Scanning your Study Library...');
      const res = await api.get('/library');
      if (res.data.success && res.data.data?.folders?.length) {
        const folders = res.data.data.folders;
        const effectiveDays = Math.max(1, Math.round((targetDays / 7) * studyDaysPerWeek));
        const imported = folders.map((f, idx) => {
          let count = f.totalVideos || 0;
          if (!count && f.files) count = f.files.filter(x => x.type === 'video').length;
          if (f.subfolders) {
            f.subfolders.forEach(sf => {
              count += sf.totalVideos || (sf.files?.filter(x => x.type === 'video').length || 0);
            });
          }
          const totalVideoCount = count || 50;
          const reqDailyGoal = Math.max(1, Math.ceil(totalVideoCount / effectiveDays));
          return {
            id: `subj_lib_${f._id || f.folderId || idx}`,
            name: f.name,
            totalLectures: totalVideoCount,
            dailyGoal: reqDailyGoal,
            durationMinutes: 45,
            completedLectures: f.completedVideos || 0,
            color: f.color || PRESET_COLORS[idx % PRESET_COLORS.length],
            icon: 'folder',
            timingSlot: formatTimeSlotForIdx(idx),
            recurringDays: [1, 2, 3, 4, 5, 6]
          };
        });
        setSubjectsList(imported);
        toast.success(`Imported ${imported.length} subjects from your Study Library!`);
      } else {
        toast.info('No folders found in your library.');
      }
    } catch (err) {
      toast.error('Could not import from library');
    }
  };

  // Add individual subject
  const handleAddSubject = () => {
    if (!newSubjName.trim()) {
      toast.error('Please enter subject title');
      return;
    }
    const effectiveDays = Math.max(1, Math.round((targetDays / 7) * studyDaysPerWeek));
    const totalLecs = Number(newSubjLectures) || 50;
    const computedGoal = Number(newSubjGoal) || Math.max(1, Math.ceil(totalLecs / effectiveDays));

    const newSubj = {
      id: `subj_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: newSubjName.trim(),
      totalLectures: totalLecs,
      dailyGoal: computedGoal,
      durationMinutes: Number(newSubjDuration) || 45,
      completedLectures: 0,
      timingSlot: newSubjTiming || '08:00 AM - 09:30 AM',
      color: newSubjColor,
      icon: newSubjIcon,
      recurringDays: newSubjDays
    };

    setSubjectsList(prev => [...prev, newSubj]);
    setNewSubjName('');
    setIsAddSubjectModalOpen(false);
    toast.success('Subject added!');
  };

  // Delete subject
  const handleDeleteSubject = (id) => {
    setSubjectsList(prev => prev.filter(s => s.id !== id));
  };

  // Save Wizard
  const handleCompleteWizardAndSave = async () => {
    if (!subjectsList.length) {
      toast.error('Please add at least one subject first!');
      return;
    }

    try {
      const payload = {
        title: title || `Study Schedule: ${pacingStats.totalLecs} Lectures in ${targetDays} Days`,
        startDate,
        endDate: deadlineDate,
        subjects: subjectsList,
        logs,
        lecturePlan: {
          targetDays,
          deadlineDate,
          studyDaysPerWeek,
          strategy,
          avgLectureMinutes: 60,
          totalLectures: pacingStats.totalLecs,
          dailyTargetRate: Number(pacingStats.dailyRate)
        }
      };

      const res = await api.post('/attendance/save', payload);
      if (res.data.success) {
        setTimetable(res.data.data);
        setIsWizardOpen(false);
        toast.success('🎉 Study Timetable Created Successfully!');
      }
    } catch (err) {
      console.error('Error saving timetable:', err);
      toast.error('Failed to create timetable');
    }
  };

  // GLOBAL STATS across ALL 400 Lectures / 200 Days
  const stats = useMemo(() => {
    const totalTargetLectures = pacingStats.totalLecs || 400;
    
    let totalCheckedAllTime = 0;
    const subjCompletedMap = {};
    subjectsList.forEach(s => { subjCompletedMap[s.id] = 0; });

    Object.keys(logs).forEach(dateKey => {
      const dayLog = logs[dateKey];
      if (dayLog) {
        Object.keys(dayLog).forEach(subId => {
          const entry = dayLog[subId];
          if (entry) {
            const count = entry.count !== undefined ? entry.count : (entry.checked ? 1 : 0);
            totalCheckedAllTime += count;
            if (subjCompletedMap[subId] !== undefined) {
              subjCompletedMap[subId] += count;
            }
          }
        });
      }
    });

    const leftLectures = Math.max(0, totalTargetLectures - totalCheckedAllTime);
    const overallCompletionRate = totalTargetLectures > 0 
      ? Math.min(100, Math.round((totalCheckedAllTime / totalTargetLectures) * 100)) 
      : 0;

    // Per subject progress
    const subjProgress = {};
    subjectsList.forEach(s => {
      const comp = subjCompletedMap[s.id] || 0;
      const goal = s.totalLectures || 50;
      subjProgress[s.id] = {
        completed: comp,
        goal: goal,
        percent: goal > 0 ? Math.min(100, Math.round((comp / goal) * 100)) : 0,
        left: Math.max(0, goal - comp)
      };
    });

    // Daily trend data across visible days
    const dailyTrends = visibleDays.map(day => {
      let dayChecked = 0;
      let dayGoal = 0;

      subjectsList.forEach(s => {
        const isScheduled = (s.recurringDays || [1,2,3,4,5,6]).includes(day.dayOfWeek);
        if (isScheduled) {
          dayGoal += s.dailyGoal || 1;
          const entry = logs[day.dateStr]?.[s.id];
          if (entry) {
            dayChecked += (entry.count !== undefined ? entry.count : (entry.checked ? 1 : 0));
          }
        }
      });

      return {
        day: `${day.weekday} ${day.dayNum}`,
        dateStr: day.dateStr,
        checked: dayChecked,
        goal: dayGoal,
        pct: dayGoal > 0 ? Math.round((dayChecked / dayGoal) * 100) : 0
      };
    });

    // Weekly stats for ALL weekly blocks
    const allWeeklyStats = allWeeklyBlocks.map((w, idx) => {
      let wCompleted = 0;
      let wGoal = 0;

      w.days.forEach(d => {
        subjectsList.forEach(s => {
          const isScheduled = (s.recurringDays || [1,2,3,4,5,6]).includes(d.dayOfWeek);
          if (isScheduled) {
            wGoal += s.dailyGoal || 1;
            const entry = logs[d.dateStr]?.[s.id];
            if (entry) {
              wCompleted += (entry.count !== undefined ? entry.count : (entry.checked ? 1 : 0));
            }
          }
        });
      });

      const wPct = wGoal > 0 ? Math.round((wCompleted / wGoal) * 100) : 0;
      return {
        weekNumber: idx + 1,
        completed: wCompleted,
        goal: wGoal,
        left: Math.max(0, wGoal - wCompleted),
        progressPct: wPct
      };
    });

    // Streak
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < fullPlanDays.length; i++) {
      const d = fullPlanDays[i];
      const dObj = new Date(d.dateStr);
      if (dObj > today) break;
      const checkedToday = subjectsList.some(s => (logs[d.dateStr]?.[s.id]?.count || 0) > 0 || logs[d.dateStr]?.[s.id]?.checked);
      if (checkedToday) {
        streak++;
      }
    }

    return {
      totalTargetLectures,
      totalCheckedAllTime,
      overallCompletionRate,
      leftLectures,
      subjectProgress: subjProgress,
      dailyTrends,
      allWeeklyStats,
      currentStreak: streak
    };
  }, [subjectsList, logs, visibleDays, allWeeklyBlocks, fullPlanDays, pacingStats]);

  const donutData = [
    { name: 'Completed', value: stats.totalCheckedAllTime, color: '#10B981' },
    { name: 'Left', value: stats.leftLectures, color: '#F43F5E' }
  ];

  const getSubjectIcon = (iconId) => {
    const found = AVAILABLE_ICONS.find(i => i.id === iconId);
    const IconComponent = found ? found.icon : FiBookOpen;
    return <IconComponent className="stroke-[2.5]" size={15} />;
  };

  return (
    <Layout>
      <div className="max-w-[1540px] mx-auto px-2 sm:px-4 lg:px-6 py-6 space-y-6">
        
        {/* Top Banner (Solid, Clean, Non-Gradient) */}
        <div className="bg-white dark:bg-[#111115] text-[#17171C] dark:text-white p-6 sm:p-8 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs relative">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8E4CF6]/15 text-[#8E4CF6] dark:text-[#C49CFF] text-xs font-black uppercase tracking-wider border border-[#8E4CF6]/25">
                <FiStar size={14} className="text-[#8E4CF6]" />
                TRACK • ANALYZE • IMPROVE • ACHIEVE
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#17171C] dark:text-white tracking-tight">
                {timetable?.title || 'Attendance & Study Habit Matrix'}
              </h1>
              <p className="text-[#6B7082] dark:text-[#A9A2BA] text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
                Managing <span className="font-bold text-[#8E4CF6] dark:text-[#C49CFF]">{stats.totalTargetLectures} Lectures</span> across <span className="font-bold text-[#17171C] dark:text-white">{targetDays} Days</span> ({allWeeklyBlocks.length} Weeks). Daily watch velocity: <span className="text-[#10B981] font-black">{pacingStats.dailyRate} lecs/day</span>.
              </p>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setWizardStep(1);
                  setIsWizardOpen(true);
                }}
                className="px-5 py-2.5 bg-[#8E4CF6] hover:bg-[#7839D4] text-white rounded-2xl font-extrabold text-xs sm:text-sm transition shadow-xs flex items-center gap-2 active:scale-95"
              >
                <FiZap size={16} />
                ⚡ Setup Syllabus & Timetable
              </button>

              {subjectsList.length > 0 && (
                <>
                  <button
                    onClick={handleMarkTodayAll}
                    className="px-4 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-2xl font-bold text-xs sm:text-sm transition shadow-xs flex items-center gap-2 active:scale-95"
                  >
                    <FiCheckSquare size={16} /> Mark All Today
                  </button>

                  <button
                    onClick={() => setIsExportModalOpen(true)}
                    className="px-4 py-2.5 bg-[#8E4CF6]/10 hover:bg-[#8E4CF6]/20 text-[#8E4CF6] dark:text-[#C49CFF] rounded-2xl font-bold text-xs sm:text-sm transition border border-[#8E4CF6]/30 flex items-center gap-2 active:scale-95 shadow-xs"
                  >
                    <FiDownload size={16} />
                    Export (PDF / Excel)
                  </button>

                  <button
                    onClick={handleResetTimetable}
                    className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-2xl font-bold text-xs sm:text-sm transition border border-red-500/20 flex items-center gap-1.5 active:scale-95"
                    title="Reset and create a new timetable"
                  >
                    <FiTrash2 size={15} /> Reset Routine
                  </button>
                </>
              )}

              <Link
                to="/lecture-planner"
                className="px-4 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] hover:bg-[#F3EEFB] dark:hover:bg-[#20202A] text-[#17171C] dark:text-white rounded-2xl font-semibold text-xs sm:text-sm transition border border-[#E8DFF2] dark:border-[#22222B] flex items-center gap-1.5"
              >
                <FiSliders size={15} /> Pacing Planner
              </Link>
            </div>
          </div>
        </div>

        {/* Manual Timetable Creator Section */}
        {showManualTimetable && (
          <ManualTimetableCreator
            existingTimetable={savedCustomTimetable}
            onClose={() => setShowManualTimetable(false)}
            onSaveTimetable={async (ttData) => {
              try {
                // Convert timetable subjects into attendance subjects with daily goals
                const DAYS_MAP = { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
                const subjectSlotCounts = {};
                const subjectRecurringDays = {};

                ttData.timeSlots.forEach(slot => {
                  Object.entries(slot.days).forEach(([day, cell]) => {
                    if (cell && cell.subjectName) {
                      if (!subjectSlotCounts[cell.subjectName]) {
                        subjectSlotCounts[cell.subjectName] = 0;
                        subjectRecurringDays[cell.subjectName] = new Set();
                      }
                      subjectSlotCounts[cell.subjectName]++;
                      subjectRecurringDays[cell.subjectName].add(DAYS_MAP[day]);
                    }
                  });
                });

                const totalDurationDays = Math.max(1, Math.ceil((new Date(ttData.endDate) - new Date(ttData.startDate)) / (1000 * 60 * 60 * 24)));

                const newSubjects = ttData.subjects.map((s, idx) => {
                  const weeklySlots = subjectSlotCounts[s.name] || 0;
                  const activeDays = subjectRecurringDays[s.name] ? [...subjectRecurringDays[s.name]] : [1,2,3,4,5,6];
                  const maxDailyGoal = Math.max(1, Math.ceil(weeklySlots / Math.max(1, activeDays.length)));
                  const totalWeeks = Math.ceil(totalDurationDays / 7);
                  const estimatedTotalLectures = weeklySlots * totalWeeks;

                  // Find matching slot timing for display
                  let timingSlot = '';
                  ttData.timeSlots.forEach(slot => {
                    Object.values(slot.days).forEach(cell => {
                      if (cell?.subjectName === s.name && !timingSlot) {
                        const formatT = (t) => {
                          if (!t) return '';
                          const [h, m] = t.split(':').map(Number);
                          const ampm = h >= 12 ? 'PM' : 'AM';
                          return `${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
                        };
                        timingSlot = `${formatT(slot.startTime)} - ${formatT(slot.endTime)}`;
                      }
                    });
                  });

                  return {
                    id: `subj_tt_${Date.now()}_${idx}`,
                    name: s.name,
                    color: s.color,
                    icon: 'book',
                    dailyGoal: maxDailyGoal,
                    timingSlot: timingSlot || '09:00 AM - 10:30 AM',
                    recurringDays: activeDays,
                    totalLectures: estimatedTotalLectures || 50,
                    completedLectures: 0,
                    durationMinutes: ttData.timeSlots[0]?.durationMinutes || 60
                  };
                });

                setSubjectsList(newSubjects);
                setTitle(ttData.title || 'Custom Timetable');
                setStartDate(ttData.startDate);
                setDeadlineDate(ttData.endDate);
                setTargetDays(totalDurationDays);
                setSavedCustomTimetable(ttData);

                // Save to backend
                const payload = {
                  title: ttData.title,
                  startDate: ttData.startDate,
                  endDate: ttData.endDate,
                  subjects: newSubjects,
                  logs,
                  lecturePlan: {
                    targetDays: totalDurationDays,
                    deadlineDate: ttData.endDate,
                    studyDaysPerWeek: 6,
                    strategy: 'balanced',
                    avgLectureMinutes: ttData.timeSlots[0]?.durationMinutes || 60,
                    totalLectures: newSubjects.reduce((sum, s) => sum + s.totalLectures, 0),
                    dailyTargetRate: 0
                  },
                  customTimetable: ttData
                };

                const res = await api.post('/attendance/save', payload);
                if (res.data.success) {
                  setTimetable(res.data.data);
                  setShowManualTimetable(false);
                  toast.success('🎉 Custom Timetable Created & Applied to Attendance!');
                }
              } catch (err) {
                console.error('Save timetable error:', err);
                toast.error('Failed to save timetable');
              }
            }}
          />
        )}

        {/* Content Section: Empty First-Time State vs Full Active Matrix */}
        {subjectsList.length === 0 ? (
          <div className="bg-white dark:bg-[#111115] rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-sm space-y-8 my-6">
            <div className="w-20 h-20 bg-[#8E4CF6]/15 text-[#8E4CF6] dark:text-[#C49CFF] rounded-3xl flex items-center justify-center mx-auto border border-[#8E4CF6]/30 shadow-xs">
              <FiCalendar size={38} className="stroke-[2.5]" />
            </div>

            <div className="space-y-3 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-[#17171C] dark:text-white tracking-tight">
                No Attendance Routine Yet
              </h2>
              <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] font-medium leading-relaxed">
                You haven't set up your study timetable. Choose one of the options below to configure your subjects, target days, and daily lecture slot goals.
              </p>
            </div>

            {/* 3 Creation Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div 
                onClick={() => { setWizardStep(1); setIsWizardOpen(true); }}
                className="p-5 rounded-2xl bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#282834] hover:border-[#8E4CF6] transition-all cursor-pointer group flex flex-col justify-between space-y-4 hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#8E4CF6] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    <FiZap size={20} />
                  </div>
                  <div className="font-extrabold text-sm text-[#17171C] dark:text-white">
                    Setup Syllabus Wizard
                  </div>
                  <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Pick exam subjects (JEE, NEET, Custom), set target days, and auto-balance daily slots.
                  </p>
                </div>
                <button className="px-3.5 py-2 bg-[#8E4CF6] hover:bg-[#7839EE] text-white rounded-xl text-xs font-bold w-full text-center transition">
                  Start Wizard →
                </button>
              </div>

              <div 
                onClick={() => setShowManualTimetable(true)}
                className="p-5 rounded-2xl bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#282834] hover:border-[#F59E0B] transition-all cursor-pointer group flex flex-col justify-between space-y-4 hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    <FiCalendar size={20} />
                  </div>
                  <div className="font-extrabold text-sm text-[#17171C] dark:text-white">
                    Manual Timetable Grid
                  </div>
                  <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Build daily slot-by-slot routines (e.g. 08:00 AM - 09:30 AM) across Mon–Sat.
                  </p>
                </div>
                <button className="px-3.5 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold w-full text-center transition">
                  Open Creator →
                </button>
              </div>

              <div 
                onClick={handleImportLibrary}
                className="p-5 rounded-2xl bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#282834] hover:border-[#10B981] transition-all cursor-pointer group flex flex-col justify-between space-y-4 hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#10B981] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    <FiFolder size={20} />
                  </div>
                  <div className="font-extrabold text-sm text-[#17171C] dark:text-white">
                    Import From Library
                  </div>
                  <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Convert your existing video lecture folders directly into attendance subjects.
                  </p>
                </div>
                <button className="px-3.5 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold w-full text-center transition">
                  Scan Library →
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Global Analytics Top Row (Full 400/200 Lectures Scope) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Target & Scope Card */}
          <div className="lg:col-span-3 bg-white dark:bg-[#111115] p-5 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8E4CF6] dark:text-[#C49CFF] block mb-3">
                Full Study Target Scope
              </span>

              <div className="bg-[#8E4CF6] p-4 rounded-2xl text-white shadow-md mb-3">
                <div className="text-[11px] text-white/80 uppercase font-semibold">Total Target Curriculum</div>
                <div className="text-2xl font-black mt-0.5">
                  {stats.totalTargetLectures} Lectures
                </div>
                <div className="text-xs text-white/80 mt-1">
                  Over <span className="font-bold text-white">{targetDays} Days</span> ({allWeeklyBlocks.length} Weeks • {pacingStats.dailyRate} lecs/day)
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1.5 px-3 bg-[#FAF7FD] dark:bg-[#18181F] rounded-xl border border-[#E8DFF2]/60 dark:border-[#22222B]">
                  <span className="text-[#6B7082] dark:text-[#A9A2BA]">Active Subjects</span>
                  <span className="font-bold text-[#17171C] dark:text-white">{subjectsList.length}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 px-3 bg-[#FAF7FD] dark:bg-[#18181F] rounded-xl border border-[#E8DFF2]/60 dark:border-[#22222B]">
                  <span className="text-[#6B7082] dark:text-[#A9A2BA]">Current Streak</span>
                  <span className="font-bold text-[#F59E0B]">🔥 {stats.currentStreak} Days</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsAddSubjectModalOpen(true)}
              className="mt-3 w-full py-2 bg-[#FAF7FD] dark:bg-[#18181F] hover:bg-[#F3EEFB] text-[#8E4CF6] dark:text-[#C49CFF] rounded-xl font-bold text-xs border border-dashed border-[#8E4CF6]/40 flex items-center justify-center gap-1 transition"
            >
              <FiPlus size={14} /> Add Single Subject
            </button>
          </div>

          {/* Daily Trend Chart for Visible Window */}
          <div className="lg:col-span-5 bg-white dark:bg-[#111115] p-5 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA]">
                Daily Trend in Visible Window
              </span>
              <span className="text-xs font-extrabold text-[#10B981] px-2 py-0.5 bg-[#10B981]/10 rounded-full">
                {visibleDays.length} Days View
              </span>
            </div>

            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.dailyTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8E4CF6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8E4CF6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#A9A2BA" fontSize={9} tickLine={false} />
                  <YAxis stroke="#A9A2BA" fontSize={9} domain={[0, 100]} tickLine={false} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#17171C] text-white text-xs p-2.5 rounded-xl shadow-xl border border-white/10">
                            <div className="font-bold">{data.day} ({data.dateStr})</div>
                            <div className="text-[#10B981]">Watched: {data.checked} / {data.goal} lecs</div>
                            <div className="text-[#C49CFF] font-semibold">{data.pct}% Completed</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="pct" stroke="#8E4CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTrend)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between text-[11px] text-[#A9A2BA] font-medium pt-2 border-t border-[#E8DFF2] dark:border-[#22222B]">
              <span>{visibleDays[0]?.weekday} {visibleDays[0]?.dayNum} (Start)</span>
              <span>{visibleDays[visibleDays.length - 1]?.weekday} {visibleDays[visibleDays.length - 1]?.dayNum}</span>
            </div>
          </div>

          {/* Full 400/200 Lectures Goal Progress (Donut) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#111115] p-5 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex items-center justify-between gap-4">
            <div className="space-y-3 min-w-0">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] block truncate">
                Total Goal Progress ({stats.totalTargetLectures} Lecs)
              </span>
              <div>
                <div className="text-3xl font-black text-[#17171C] dark:text-white">
                  {stats.overallCompletionRate}%
                </div>
                <div className="text-xs text-[#10B981] font-bold mt-0.5">
                  {stats.totalCheckedAllTime} Completed
                </div>
                <div className="text-xs text-[#F43F5E] font-semibold">
                  {stats.leftLectures} Remaining
                </div>
              </div>
            </div>

            {/* Perfect SVG Circular Donut Ring (Never clipped) */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
                {/* Background Ring Track (Remaining) */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  className="stroke-[#F43F5E]/30 dark:stroke-[#F43F5E]/20"
                  strokeWidth="12"
                  fill="transparent"
                />
                {/* Completed Progress Arc */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  stroke="#10B981"
                  strokeWidth="12"
                  strokeDasharray={282.74}
                  strokeDashoffset={282.74 - (282.74 * (Math.min(100, Math.max(0, stats.overallCompletionRate)) / 100))}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              {/* Centered Percentage Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-black text-[#17171C] dark:text-white leading-none">
                  {stats.overallCompletionRate}%
                </span>
                <span className="text-[9px] font-bold text-[#10B981] mt-0.5">Done</span>
              </div>
            </div>
          </div>

        </div>

        {/* Timeline Navigation Toolbar: Full 29 Weeks Paginator & View Modes */}
        <div className="bg-white dark:bg-[#111115] p-4 sm:p-5 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* View Mode Switch */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#6B7082] dark:text-[#A9A2BA] mr-1 flex items-center gap-1">
              <FiCalendar size={14} className="text-[#8E4CF6]" /> Timeline View:
            </span>
            
            <button
              onClick={() => setViewMode('paginated_weeks')}
              className={`px-3.5 py-1.5 rounded-full font-bold text-xs transition flex items-center gap-1.5 ${
                viewMode === 'paginated_weeks'
                  ? 'bg-[#141416] text-white dark:bg-white dark:text-[#141416] shadow-xs'
                  : 'bg-[#FAF7FD] dark:bg-[#18181F] text-[#6B7082] dark:text-[#A9A2BA] border border-[#E8DFF2] dark:border-[#22222B]'
              }`}
            >
              <FiSun size={13} className="text-[#F59E0B]" />
              <span>4-Week Paged View (All {allWeeklyBlocks.length} Weeks)</span>
            </button>

            <button
              onClick={() => setViewMode('full_timeline')}
              className={`px-3.5 py-1.5 rounded-full font-bold text-xs transition flex items-center gap-1.5 ${
                viewMode === 'full_timeline'
                  ? 'bg-[#141416] text-white dark:bg-white dark:text-[#141416] shadow-xs'
                  : 'bg-[#FAF7FD] dark:bg-[#18181F] text-[#6B7082] dark:text-[#A9A2BA] border border-[#E8DFF2] dark:border-[#22222B]'
              }`}
            >
              <FiGrid size={13} className="text-[#10B981]" />
              <span>Full {targetDays}-Day Continuous Matrix (All {allWeeklyBlocks.length} Weeks)</span>
            </button>
          </div>

          {/* Week Paginator */}
          {viewMode === 'paginated_weeks' && (
            <div className="flex items-center gap-2">
              <button
                onClick={jumpToTodayPage}
                className="px-2.5 py-1.5 bg-[#8E4CF6]/15 hover:bg-[#8E4CF6]/25 text-[#8E4CF6] dark:text-[#C49CFF] rounded-xl font-bold text-xs transition border border-[#8E4CF6]/30 flex items-center gap-1"
                title="Jump to Today's Week"
              >
                🎯 Jump to Today
              </button>

              <button
                disabled={currentWeekPage === 0}
                onClick={() => setCurrentWeekPage(prev => Math.max(0, prev - 1))}
                className="p-2 rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] disabled:opacity-40 hover:bg-[#F3EEFB] text-[#17171C] dark:text-white transition"
                title="Previous 4 Weeks"
              >
                <FiChevronLeft size={16} />
              </button>

              <div className="px-3 py-1.5 rounded-xl bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] text-xs font-bold text-[#17171C] dark:text-white text-center min-w-[170px]">
                Weeks {currentWeekPage * WEEKS_PER_PAGE + 1}–{Math.min(allWeeklyBlocks.length, (currentWeekPage + 1) * WEEKS_PER_PAGE)} of {allWeeklyBlocks.length}
              </div>

              <button
                disabled={currentWeekPage >= totalPages - 1}
                onClick={() => setCurrentWeekPage(prev => Math.min(totalPages - 1, prev + 1))}
                className="p-2 rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] disabled:opacity-40 hover:bg-[#F3EEFB] text-[#17171C] dark:text-white transition"
                title="Next 4 Weeks"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Weekly Breakdown Row */}
        <div className="bg-white dark:bg-[#111115] p-5 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#17171C] dark:text-white flex items-center gap-2">
              <FiBarChart2 className="text-[#8E4CF6]" />
              Weekly Progress Breakdown ({allWeeklyBlocks.length} Weeks in Total Plan)
            </h3>
            <span className="text-xs text-[#A9A2BA]">
              {viewMode === 'paginated_weeks' 
                ? `Showing Weeks ${currentWeekPage * WEEKS_PER_PAGE + 1}–${Math.min(allWeeklyBlocks.length, (currentWeekPage + 1) * WEEKS_PER_PAGE)} of ${allWeeklyBlocks.length}`
                : `Showing All ${allWeeklyBlocks.length} Weeks`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {visibleWeeklyBlocks.map((w) => {
              const weekHeaderColors = [
                'bg-[#10B981]',
                'bg-[#F59E0B]',
                'bg-[#FF708F]',
                'bg-[#8E4CF6]'
              ];
              const headerColor = weekHeaderColors[(w.weekNumber - 1) % weekHeaderColors.length];
              const wStat = stats.allWeeklyStats.find(ws => ws.weekNumber === w.weekNumber) || { completed: 0, goal: 0, progressPct: 0 };

              return (
                <div 
                  key={`week-card-${w.weekNumber}`}
                  className="rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] overflow-hidden"
                >
                  <div className={`py-1.5 px-3 ${headerColor} text-white font-bold text-xs uppercase tracking-wider flex justify-between items-center`}>
                    <span>WEEK {w.weekNumber}</span>
                    <span>{wStat.progressPct}%</span>
                  </div>

                  <div className="p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[#6B7082] dark:text-[#A9A2BA]">Done / Goal</span>
                      <span className="font-bold text-[#17171C] dark:text-white">{wStat.completed} / {wStat.goal} Lecs</span>
                    </div>

                    <div className="w-full bg-[#E8DFF2] dark:bg-[#322B42] h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${
                          wStat.progressPct >= 75 ? 'bg-[#10B981]' :
                          wStat.progressPct >= 50 ? 'bg-[#F59E0B]' :
                          'bg-[#F43F5E]'
                        }`}
                        style={{ width: `${Math.min(100, wStat.progressPct)}%` }}
                      />
                    </div>

                    <div className="text-[10px] text-[#A9A2BA] text-right">
                      {w.days[0]?.weekday} {w.days[0]?.dayNum} – {w.days[w.days.length - 1]?.weekday} {w.days[w.days.length - 1]?.dayNum}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pacing Shortfall Alert (e.g. 420 lecs in 200 days needs 3 slots/day, not 2) */}
        {pacingStats.hasAnyShortfall && (
          <div className="bg-amber-500/10 border-2 border-amber-500/40 text-[#17171C] dark:text-white p-5 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm animate-pulse-once">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500 text-white shrink-0 shadow-sm mt-0.5">
                <FiZap size={20} />
              </div>
              <div>
                <div className="font-extrabold text-sm sm:text-base text-amber-700 dark:text-amber-300">
                  ⚡ Pacing Shortfall Warning: Daily Slots are Too Low to Complete in {targetDays} Days!
                </div>
                <div className="text-xs text-[#6B7082] dark:text-[#A9A2BA] mt-1 space-y-0.5">
                  {pacingStats.shortfallSubjects.map(s => (
                    <div key={`alert-${s.id}`} className="font-semibold">
                      • <span className="font-bold text-[#17171C] dark:text-white">{s.name}</span>: Has {s.totalLectures} lectures. At {s.configuredDailyGoal} lecs/day, you can only finish {s.maxReachableLectures} lecs in {targetDays} days ({s.shortfallCount} lecs short!). You need at least <span className="text-[#8E4CF6] dark:text-[#C49CFF] font-black underline">{s.minRequiredDailyGoal} slots/day</span> to finish all {s.totalLectures} lectures in {targetDays} days.
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleFixShortfallNow}
              className="px-5 py-3 bg-[#8E4CF6] hover:bg-[#7839D4] text-white rounded-2xl font-black text-xs sm:text-sm transition shadow-md flex items-center gap-2 shrink-0 active:scale-95"
            >
              <FiCheckSquare size={16} /> Auto-Upgrade Daily Slots Now
            </button>
          </div>
        )}

        {/* THE MAIN INTERACTIVE ATTENDANCE SPREADSHEET MATRIX (WITH MULTI-CHECKMARKS PER DAY!) */}
        <div className="bg-white dark:bg-[#111115] rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs overflow-hidden">
          
          {/* Header Bar */}
          <div className="p-4 sm:p-5 border-b border-[#E8DFF2] dark:border-[#22222B] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#17171C] dark:text-white tracking-tight flex items-center gap-2">
                <FiCheckSquare className="text-[#8E4CF6]" />
                Daily Real-Time Attendance Matrix (Multi-Lecture Checkmarks)
              </h2>
              <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] mt-0.5">
                Each day shows separate checkbox slots for every scheduled lecture (e.g. Lec 1, Lec 2 & Lec 3). Click to mark individual lectures!
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-[#10B981] inline-flex items-center justify-center text-[10px] text-white font-bold">✔</span> Checked
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 inline-flex items-center justify-center text-[9px] font-extrabold">1/2</span> Partial
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-zinc-700 inline-block" /> Pending
              </span>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                {/* Super-Header for Weeks */}
                <tr className="bg-[#FAF7FD] dark:bg-[#201C2B] text-xs font-extrabold border-b border-[#E8DFF2] dark:border-[#22222B]">
                  <th className="p-3 pl-4 sticky left-0 z-20 bg-[#FAF7FD] dark:bg-[#201C2B] border-r border-[#E8DFF2] dark:border-[#22222B] w-64">
                    SUBJECT / TIMING & DURATION
                  </th>
                  <th className="p-3 text-center border-r border-[#E8DFF2] dark:border-[#22222B] w-16 text-[#8E4CF6]">
                    DAILY
                  </th>
                  {visibleWeeklyBlocks.map((week) => {
                    const weekBgColors = [
                      'bg-teal-500/10 text-teal-700 dark:text-teal-300',
                      'bg-amber-500/10 text-amber-700 dark:text-amber-300',
                      'bg-rose-500/10 text-rose-700 dark:text-rose-300',
                      'bg-purple-500/10 text-purple-700 dark:text-purple-300'
                    ];
                    return (
                      <th
                        key={`th-week-${week.weekNumber}`}
                        colSpan={week.days.length}
                        className={`text-center py-1.5 px-2 border-r border-[#E8DFF2] dark:border-[#22222B] font-black uppercase tracking-wider text-[11px] ${weekBgColors[(week.weekNumber - 1) % weekBgColors.length]}`}
                      >
                        WEEK {week.weekNumber}
                      </th>
                    );
                  })}
                  <th colSpan={3} className="p-3 text-center bg-[#8E4CF6]/10 text-[#8E4CF6] dark:text-[#C49CFF] font-black uppercase text-[11px]">
                    TOTAL PROGRESS ({stats.totalTargetLectures} LECS)
                  </th>
                </tr>

                {/* Day Columns */}
                <tr className="bg-white dark:bg-[#111115] text-[11px] font-semibold text-[#6B7082] dark:text-[#A9A2BA] border-b border-[#E8DFF2] dark:border-[#22222B]">
                  <th className="p-2 pl-4 sticky left-0 z-20 bg-white dark:bg-[#111115] border-r border-[#E8DFF2] dark:border-[#22222B]">
                    <span className="text-[10px] text-[#A9A2BA] uppercase">Routine Name</span>
                  </th>
                  <th className="p-2 text-center border-r border-[#E8DFF2] dark:border-[#22222B]">
                    Lecs/Day
                  </th>
                  {visibleDays.map(day => (
                    <th
                      key={`th-day-${day.dateStr}`}
                      className={`p-1.5 text-center min-w-[44px] border-r border-[#E8DFF2]/60 dark:border-[#22222B]/60 ${
                        day.isToday ? 'bg-[#8E4CF6]/15 font-black text-[#8E4CF6] dark:text-[#C49CFF]' :
                        day.isWeekend ? 'bg-slate-50 dark:bg-[#201C2B]' : ''
                      }`}
                    >
                      <div className="text-[9px] uppercase tracking-tighter opacity-75">{day.weekday}</div>
                      <div className={`text-xs font-bold ${day.isToday ? 'text-[#8E4CF6] dark:text-[#C49CFF]' : 'text-[#17171C] dark:text-white'}`}>
                        {day.dayNum}
                      </div>
                      {day.isToday && (
                        <span className="block text-[8px] uppercase tracking-tighter bg-[#8E4CF6] text-white rounded-xs px-0.5 mt-0.5 font-extrabold">
                          TODAY
                        </span>
                      )}
                    </th>
                  ))}
                  <th className="p-2 text-center text-[#17171C] dark:text-white font-bold w-12">DONE</th>
                  <th className="p-2 text-center text-[#6B7082] dark:text-[#A9A2BA] font-semibold w-12">LEFT</th>
                  <th className="p-2 text-center text-[#17171C] dark:text-white font-bold w-20">%</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E8DFF2] dark:divide-[#22222B] text-xs">
                {subjectsList.map((subject, index) => {
                  const prog = stats.subjectProgress[subject.id] || { completed: 0, goal: 0, percent: 0, left: 0 };
                  const color = subject.color || PRESET_COLORS[index % PRESET_COLORS.length];
                  const dailyGoal = Number(subject.dailyGoal) || 1;

                  return (
                    <tr 
                      key={subject.id} 
                      className="hover:bg-[#FAF7FD] dark:hover:bg-[#231E2E] transition group"
                    >
                      {/* Subject Name & Duration Badge */}
                      <td className="p-2.5 pl-4 sticky left-0 z-10 bg-white dark:bg-[#111115] group-hover:bg-[#FAF7FD] dark:group-hover:bg-[#231E2E] border-r border-[#E8DFF2] dark:border-[#22222B]">
                        <div className="flex items-center space-x-2.5">
                          <div 
                            className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                            style={{ backgroundColor: color }}
                          >
                            {getSubjectIcon(subject.icon)}
                          </div>
                          <div className="truncate">
                            <div className="font-bold text-[#17171C] dark:text-white truncate max-w-[160px]">
                              {subject.name}
                            </div>
                            <div className="text-[10px] text-[#6B7082] dark:text-[#A9A2BA] flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-1"><FiClock size={10} /> {subject.timingSlot || '08:00 AM'}</span>
                              <span className="px-1.5 py-0.2 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-md font-semibold text-[#8E4CF6] dark:text-[#C49CFF]">
                                {subject.durationMinutes || 60}m / lec
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Daily Goal Badge */}
                      <td className="p-2 text-center border-r border-[#E8DFF2] dark:border-[#22222B]">
                        <span className="px-2 py-0.5 rounded-full bg-[#8E4CF6]/10 text-[#8E4CF6] dark:text-[#C49CFF] font-extrabold text-xs">
                          {dailyGoal} lecs
                        </span>
                      </td>

                      {/* Interactive Cells with Multi-Checkmarks */}
                      {visibleDays.map(day => {
                        const isScheduled = (subject.recurringDays || [1,2,3,4,5,6]).includes(day.dayOfWeek);
                        const entry = logs[day.dateStr]?.[subject.id] || { count: 0, checked: false, sessions: [] };
                        
                        const completedCount = entry.count !== undefined ? entry.count : (entry.checked ? dailyGoal : 0);
                        const isFullyDone = completedCount >= dailyGoal;
                        const isPartial = completedCount > 0 && completedCount < dailyGoal;

                        if (!isScheduled) {
                          return (
                            <td 
                              key={`cell-${subject.id}-${day.dateStr}`}
                              className="p-1 text-center border-r border-[#E8DFF2]/40 dark:border-[#22222B]/40 bg-slate-50/60 dark:bg-[#181520]/50"
                              title="Rest / Off Day"
                            >
                              <span className="inline-block w-2 h-2 rounded-full bg-slate-200 dark:bg-zinc-800" />
                            </td>
                          );
                        }

                        // MULTI-CHECKMARKS RENDERING FOR DAILY GOAL >= 2
                        if (dailyGoal > 1) {
                          const sessions = Array.isArray(entry.sessions) ? entry.sessions : [];
                          return (
                            <td
                              key={`cell-${subject.id}-${day.dateStr}`}
                              className={`p-1 text-center border-r border-[#E8DFF2]/40 dark:border-[#22222B]/40 transition ${
                                day.isToday ? 'bg-[#8E4CF6]/5' : ''
                              }`}
                            >
                              <div className="flex flex-col items-center justify-center gap-1">
                                <div className="flex items-center justify-center gap-1">
                                  {Array.from({ length: dailyGoal }).map((_, slotIdx) => {
                                    const isSlotChecked = sessions[slotIdx] !== undefined 
                                      ? sessions[slotIdx] 
                                      : (completedCount > slotIdx);

                                    return (
                                      <button
                                        key={slotIdx}
                                        onClick={() => handleToggleSlot(day.dateStr, subject.id, slotIdx, dailyGoal)}
                                        className={`w-5 h-5 rounded-md transition flex items-center justify-center active:scale-90 text-[10px] font-bold ${
                                          isSlotChecked
                                            ? 'bg-[#10B981] text-white shadow-xs'
                                            : 'border border-slate-300 dark:border-zinc-700 hover:border-[#8E4CF6] bg-white dark:bg-[#201C2B] text-[#A9A2BA]'
                                        }`}
                                        title={`${subject.name} - Lec ${slotIdx + 1} on ${day.dateStr}: ${isSlotChecked ? 'Completed' : 'Pending'}`}
                                      >
                                        {isSlotChecked ? <FiCheck size={11} className="stroke-[3]" /> : (slotIdx + 1)}
                                      </button>
                                    );
                                  })}
                                </div>
                                <span className={`text-[9px] font-extrabold ${
                                  isFullyDone ? 'text-[#10B981]' : isPartial ? 'text-amber-500' : 'text-[#A9A2BA]'
                                }`}>
                                  {completedCount}/{dailyGoal}
                                </span>
                              </div>
                            </td>
                          );
                        }

                        // SINGLE CHECKMARK FOR DAILY GOAL == 1
                        return (
                          <td
                            key={`cell-${subject.id}-${day.dateStr}`}
                            className={`p-1 text-center border-r border-[#E8DFF2]/40 dark:border-[#22222B]/40 transition ${
                              day.isToday ? 'bg-[#8E4CF6]/5' : ''
                            }`}
                          >
                            <button
                              onClick={() => handleToggleSlot(day.dateStr, subject.id, 0, 1)}
                              className={`w-6 h-6 rounded-lg transition flex items-center justify-center mx-auto active:scale-90 ${
                                isFullyDone
                                  ? 'bg-[#10B981] text-white shadow-xs font-bold'
                                  : 'border-2 border-slate-300 dark:border-zinc-700 hover:border-[#8E4CF6] dark:hover:border-[#8E4CF6] bg-white dark:bg-[#201C2B]'
                              }`}
                              title={`${subject.name} on ${day.dateStr}: ${isFullyDone ? 'Completed' : 'Pending'}`}
                            >
                              {isFullyDone && <FiCheck size={13} className="stroke-[3]" />}
                            </button>
                          </td>
                        );
                      })}

                      {/* Summary Columns for Full Scope */}
                      <td className="p-2 text-center font-bold text-[#10B981]">
                        {prog.completed}
                      </td>
                      <td className="p-2 text-center font-semibold text-[#F43F5E]">
                        {prog.left}
                      </td>
                      <td className="p-2 pr-3 text-center">
                        <div className="flex items-center space-x-1.5">
                          <div className="w-12 bg-[#E8DFF2] dark:bg-[#322B42] h-2 rounded-full overflow-hidden shrink-0">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                prog.percent >= 75 ? 'bg-[#10B981]' :
                                prog.percent >= 50 ? 'bg-[#F59E0B]' :
                                'bg-[#F43F5E]'
                              }`}
                              style={{ width: `${Math.min(100, prog.percent)}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-[#17171C] dark:text-white">
                            {prog.percent}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>
    )}


      {/* 3-STEP REAL TIMETABLE & SYLLABUS SETUP WIZARD */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#111115] rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-2xl my-8">
            
            {/* Wizard Header */}
            <div className="flex justify-between items-center pb-4 border-b border-[#E8DFF2] dark:border-[#22222B]">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8E4CF6] dark:text-[#C49CFF]">
                  Step {wizardStep} of 3
                </span>
                <h3 className="text-xl font-extrabold text-[#17171C] dark:text-white">
                  {wizardStep === 1 && 'Step 1: Setup Your Subjects & Total Lecture Numbers'}
                  {wizardStep === 2 && 'Step 2: Target Deadline & AI Pacing Prediction'}
                  {wizardStep === 3 && 'Step 3: Customize Daily Real Timetable (Multi-Lecture Slots)'}
                </h3>
              </div>
              <button 
                onClick={() => setIsWizardOpen(false)}
                className="p-2 rounded-full hover:bg-[#F3EEFB] dark:hover:bg-[#18181F] text-[#6B7082]"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Step 1: Setup Subjects & Lecture Numbers */}
            {wizardStep === 1 && (
              <div className="space-y-5 text-xs">
                <div>
                  <label className="font-bold text-[#17171C] dark:text-white block mb-2">
                    ⚡ Quick Presets or Import from Library:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => loadPresetCurriculum('custom_400')}
                      className="p-2.5 rounded-xl border border-[#8E4CF6] bg-[#8E4CF6]/10 text-[#8E4CF6] dark:text-[#C49CFF] font-bold text-center transition"
                    >
                      🌟 400 Lecs (Maths 200, Phys 100, Eng 100)
                    </button>
                    <button
                      type="button"
                      onClick={() => loadPresetCurriculum('jee')}
                      className="p-2.5 rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] hover:border-[#8E4CF6] font-bold text-center transition"
                    >
                      🎯 JEE (400 Lecs)
                    </button>
                    <button
                      type="button"
                      onClick={() => loadPresetCurriculum('neet')}
                      className="p-2.5 rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] hover:border-[#8E4CF6] font-bold text-center transition"
                    >
                      🧬 NEET (400 Lecs)
                    </button>
                    <button
                      type="button"
                      onClick={handleImportLibrary}
                      className="p-2.5 rounded-xl border border-[#8E4CF6]/40 bg-[#8E4CF6]/10 text-[#8E4CF6] dark:text-[#C49CFF] font-bold text-center transition flex items-center justify-center gap-1"
                    >
                      <FiFolder size={14} /> My Library
                    </button>
                  </div>
                </div>

                {/* Current Subjects List */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-bold text-[#17171C] dark:text-white">
                      Configured Subjects ({subjectsList.length} subjects • {pacingStats.totalLecs} total lectures)
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddSubjectModalOpen(true)}
                      className="text-[#8E4CF6] font-bold flex items-center gap-1 hover:underline"
                    >
                      <FiPlus size={14} /> Add Custom Subject
                    </button>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {subjectsList.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B]">
                        <div className="flex items-center space-x-3 truncate">
                          <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                          <div className="truncate">
                            <div className="font-bold text-[#17171C] dark:text-white truncate">{s.name}</div>
                            <div className="text-[10px] text-[#A9A2BA] flex items-center gap-2">
                              <span>⏳ {s.durationMinutes || 60}m/lec</span>
                              <span>•</span>
                              <span>{s.timingSlot}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-[#6B7082] font-semibold">Total Lecs:</span>
                          <input
                            type="number"
                            min="1"
                            value={s.totalLectures}
                            onChange={(e) => {
                              const val = Math.max(1, Number(e.target.value) || 1);
                              const effectiveDays = Math.max(1, Math.round((targetDays / 7) * studyDaysPerWeek));
                              const autoReqGoal = Math.max(1, Math.ceil(val / effectiveDays));
                              setSubjectsList(prev => prev.map(item => item.id === s.id ? { 
                                ...item, 
                                totalLectures: val,
                                dailyGoal: autoReqGoal
                              } : item));
                            }}
                            className="w-18 px-2 py-1 bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-lg font-extrabold text-center text-[#8E4CF6]"
                          />

                          <button
                            type="button"
                            onClick={() => handleDeleteSubject(s.id)}
                            className="p-1 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition ml-1"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Set Deadline & AI Predictions */}
            {wizardStep === 2 && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[#17171C] dark:text-white block mb-1">Start Date (Defaults to Today)</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] font-bold text-[#17171C] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#17171C] dark:text-white block mb-1">Target Days (e.g. 200 Days)</label>
                    <input
                      type="number"
                      min="1"
                      value={targetDays}
                      onChange={(e) => handleTargetDaysChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] font-bold text-[#17171C] dark:text-white"
                    />
                  </div>
                </div>

                {/* AI Prediction Box */}
                <div className="p-4 rounded-2xl bg-[#8E4CF6] text-white space-y-3 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] uppercase font-bold text-white/80">⚡ AI Pacing & Subject Velocity Prediction</span>
                    <span className="px-2 py-0.5 bg-white/20 rounded-full font-bold text-[10px]">
                      {targetDays} Days Target / {pacingStats.effectiveStudyDays} Active Study Days
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="text-2xl sm:text-3xl font-black">
                      {pacingStats.dailyRate} <span className="text-sm font-bold text-white/80">Lecs / Day Overall</span>
                    </div>
                    <span className="text-xs font-bold text-amber-200 bg-black/20 px-2.5 py-1 rounded-lg">
                      Min {pacingStats.dailyRecommended} slots/day overall to finish in {targetDays} days
                    </span>
                  </div>

                  <div className="p-3 bg-white/10 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white block">🤖 Subject-by-Subject Exact Pacing & Required Slots:</span>
                      <button
                        type="button"
                        onClick={() => handleAutoBalanceGoals(targetDays, studyDaysPerWeek)}
                        className="px-2 py-0.5 bg-white/20 hover:bg-white/30 text-white rounded-md text-[10px] font-extrabold transition flex items-center gap-1"
                      >
                        <FiZap size={10} /> Auto-Balance All Slots
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5 text-[11px] pt-1">
                      {pacingStats.subjectPredictions.map((sp) => (
                        <div key={sp.id} className="flex justify-between items-center bg-black/20 p-2.5 rounded-lg">
                          <div>
                            <span className="font-bold text-white">{sp.name}</span>
                            <span className="text-white/70 ml-1.5">({sp.totalLectures} lecs ÷ {pacingStats.effectiveStudyDays} days)</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-[#FBBF24]">
                              {sp.subjDaily} lecs/day → <span className="underline font-black">{sp.minRequiredDailyGoal} slots/day</span>
                            </span>
                            <span className="text-[10px] text-white/70 block">
                              (Finishes in ~{Math.ceil(sp.totalLectures / sp.minRequiredDailyGoal)} study days)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#17171C] dark:text-white block mb-1">Study Days per Week</label>
                  <select
                    value={studyDaysPerWeek}
                    onChange={(e) => handleStudyDaysChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] font-bold text-[#17171C] dark:text-white"
                  >
                    <option value={7}>7 Days a Week (Every day)</option>
                    <option value={6}>6 Days a Week (1 day rest / revision)</option>
                    <option value={5}>5 Days a Week (Weekdays only)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Customize Real Daily Timetable Slots */}
            {wizardStep === 3 && (
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#17171C] dark:text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-amber-600 dark:text-amber-400 block mb-0.5">🗓️ Set Your Real Daily Timetable:</span>
                    <p className="text-[11px] text-[#6B7082] dark:text-[#A9A2BA]">
                      Configure how many lectures you want to watch per day for each subject. Every daily slot adds an interactive checkmark in your Attendance Matrix!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAutoBalanceGoals(targetDays, studyDaysPerWeek)}
                    className="px-3 py-1.5 bg-[#8E4CF6] hover:bg-[#7839EE] text-white rounded-xl font-bold text-xs shrink-0 flex items-center gap-1 shadow-xs"
                  >
                    <FiZap size={13} /> Auto-Balance Slots for {targetDays} Days
                  </button>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {pacingStats.subjectPredictions.map((subj) => (
                    <div key={subj.id} className="p-3.5 rounded-2xl bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2.5">
                          <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: subj.color }} />
                          <div>
                            <div className="font-bold text-sm text-[#17171C] dark:text-white">{subj.name}</div>
                            <div className="text-[10px] text-[#A9A2BA]">
                              {subj.totalLectures} Lectures Total • Exact velocity: <span className="font-semibold text-[#8E4CF6] dark:text-[#C49CFF]">{subj.subjDaily} lecs/day</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-[#6B7082] dark:text-[#A9A2BA] block mb-0.5">Daily Slots (Checkmarks):</label>
                            <select
                              value={subj.dailyGoal || 1}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setSubjectsList(prev => prev.map(item => item.id === subj.id ? { ...item, dailyGoal: val } : item));
                              }}
                              className={`px-2.5 py-1.5 bg-white dark:bg-[#111115] border rounded-xl font-bold text-xs ${
                                subj.isShortfall 
                                  ? 'border-amber-500 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/20' 
                                  : 'border-[#8E4CF6] text-[#8E4CF6] dark:text-[#C49CFF]'
                              }`}
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => {
                                const willFinishIn = Math.ceil(subj.totalLectures / (n * (studyDaysPerWeek / 7)));
                                const isMinReq = n === subj.minRequiredDailyGoal;
                                return (
                                  <option key={n} value={n}>
                                    {n} {n === 1 ? 'Lec' : 'Lecs'} / Day ({n} {n === 1 ? 'Checkmark' : 'Checkmarks'}) {isMinReq ? '— ⭐ Minimum to finish on time' : `(Takes ~${willFinishIn} days)`}
                                  </option>
                                );
                              })}
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-[#6B7082] dark:text-[#A9A2BA] block mb-0.5">Timing Slot:</label>
                            <input
                              type="text"
                              value={subj.timingSlot || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setSubjectsList(prev => prev.map(item => item.id === subj.id ? { ...item, timingSlot: val } : item));
                              }}
                              placeholder="e.g. 08:00 AM & 04:00 PM"
                              className="px-2.5 py-1.5 bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-xl font-semibold text-xs min-w-[150px]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Validation & Shortfall Indicator */}
                      {subj.isShortfall ? (
                        <div className="flex items-center justify-between py-1.5 px-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                          <span>
                            ⚠️ At <strong>{subj.dailyGoal} lecs/day</strong>, you will only finish <strong>{subj.maxReachableLectures}</strong> of {subj.totalLectures} lectures in {targetDays} days ({subj.shortfallCount} short!).
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSubjectsList(prev => prev.map(item => item.id === subj.id ? { ...item, dailyGoal: subj.minRequiredDailyGoal } : item));
                            }}
                            className="px-2 py-0.5 bg-amber-500 text-white rounded-md font-bold text-[10px] hover:bg-amber-600 shrink-0 ml-2"
                          >
                            Set to {subj.minRequiredDailyGoal} Slots/Day
                          </button>
                        </div>
                      ) : (
                        <div className="py-1 px-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                          <span>✅ {subj.dailyGoal} slots/day completes all {subj.totalLectures} lectures in ~{Math.ceil(subj.totalLectures / subj.dailyGoal)} study days (On schedule for {targetDays} days target!)</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wizard Navigation Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-[#E8DFF2] dark:border-[#22222B]">
              {wizardStep > 1 ? (
                <button
                  onClick={() => setWizardStep(prev => prev - 1)}
                  className="px-4 py-2 bg-[#FAF7FD] dark:bg-[#18181F] text-[#6B7082] rounded-xl font-bold text-xs"
                >
                  ← Back
                </button>
              ) : <div />}

              {wizardStep < 3 ? (
                <button
                  onClick={() => {
                    if (wizardStep === 1 && !subjectsList.length) {
                      toast.error('Please add at least one subject!');
                      return;
                    }
                    setWizardStep(prev => prev + 1);
                  }}
                  className="px-5 py-2.5 bg-[#8E4CF6] hover:bg-[#7839EE] text-white rounded-xl font-bold text-xs shadow-md"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  onClick={handleCompleteWizardAndSave}
                  className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-extrabold text-xs shadow-lg flex items-center gap-1.5 active:scale-95"
                >
                  <FiCheckSquare size={16} /> Create My Timetable & Start Tracking!
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Add Single Subject Modal */}
      {isAddSubjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111115] rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#E8DFF2] dark:border-[#22222B] shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#17171C] dark:text-white">Add Subject to Syllabus</h3>
              <button onClick={() => setIsAddSubjectModalOpen(false)} className="p-1 text-[#6B7082]">
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#17171C] dark:text-white block mb-1">Subject Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics, Physics..."
                  value={newSubjName}
                  onChange={(e) => setNewSubjName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] font-semibold text-[#17171C] dark:text-white"
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
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] font-bold text-[#17171C] dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#17171C] dark:text-white block mb-1">Daily Target (Checkmarks)</label>
                  <select
                    value={newSubjGoal}
                    onChange={(e) => setNewSubjGoal(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] font-bold text-[#8E4CF6]"
                  >
                    <option value={1}>1 Lec / Day</option>
                    <option value={2}>2 Lecs / Day</option>
                    <option value={3}>3 Lecs / Day</option>
                    <option value={4}>4 Lecs / Day</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#17171C] dark:text-white block mb-1">Duration (Mins/Lec)</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={newSubjDuration}
                    onChange={(e) => setNewSubjDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] font-bold text-[#17171C] dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#17171C] dark:text-white block mb-1">Timing Slot</label>
                  <input
                    type="text"
                    placeholder="e.g. 08:00 AM & 04:00 PM"
                    value={newSubjTiming}
                    onChange={(e) => setNewSubjTiming(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] text-[#17171C] dark:text-white"
                  />
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <label className="font-bold text-[#17171C] dark:text-white block mb-1">Color Theme</label>
                <div className="flex items-center gap-2 flex-wrap">
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
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E8DFF2] dark:border-[#22222B]">
              <button
                onClick={() => setIsAddSubjectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-[#6B7082] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubject}
                className="px-5 py-2 bg-[#8E4CF6] hover:bg-[#7839EE] text-white rounded-xl font-bold text-xs shadow-md"
              >
                Add Subject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Export Modal (PDF / Excel) */}
      <AttendanceExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        timetable={timetable}
        subjectsList={subjectsList}
        logs={logs}
        fullPlanDays={fullPlanDays}
        allWeeklyBlocks={allWeeklyBlocks}
        stats={stats}
        pacingStats={pacingStats}
        currentVisibleDays={visibleDays}
      />

      </div>
    </Layout>
  );
};

export default AttendanceTracker;
