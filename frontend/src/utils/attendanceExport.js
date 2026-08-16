import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to safely invoke autoTable in all bundler/ESM environments
const applyAutoTable = (doc, options) => {
  if (typeof autoTable === 'function') {
    autoTable(doc, options);
  } else if (autoTable && typeof autoTable.default === 'function') {
    autoTable.default(doc, options);
  } else if (typeof doc.autoTable === 'function') {
    doc.autoTable(options);
  } else {
    console.error('jsPDF autotable plugin is unavailable');
  }
};

/**
 * Filter days according to selected date scope
 */
export const filterDaysByScope = (fullPlanDays, scope, customStartDate, customEndDate, currentVisibleDays) => {
  if (scope === 'current_view') {
    return currentVisibleDays || fullPlanDays;
  }
  
  if (scope === 'this_month') {
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth() + 1; // 1-12
    return fullPlanDays.filter(d => {
      const parts = d.dateStr.split('-');
      return parseInt(parts[0], 10) === curYear && parseInt(parts[1], 10) === curMonth;
    });
  }

  if (scope === 'custom' && customStartDate && customEndDate) {
    return fullPlanDays.filter(d => d.dateStr >= customStartDate && d.dateStr <= customEndDate);
  }

  // default 'full_plan'
  return fullPlanDays;
};

/**
 * Export Attendance Data to Excel (.xlsx) Workbook
 */
export const exportAttendanceToExcel = ({
  timetable,
  subjectsList = [],
  logs = {},
  fullPlanDays = [],
  allWeeklyBlocks = [],
  stats = {},
  pacingStats = {},
  selectedScope = 'full_plan',
  customStartDate = '',
  customEndDate = '',
  currentVisibleDays = [],
  options = {
    includeSummary: true,
    includeSubjects: true,
    includeDailyLogs: true,
    includeWeeklyStats: true
  }
}) => {
  const filteredDays = filterDaysByScope(fullPlanDays, selectedScope, customStartDate, customEndDate, currentVisibleDays);
  const wb = XLSX.utils.book_new();

  // 1. Executive Summary Sheet
  if (options.includeSummary) {
    const summaryData = [
      ['ATTENDANCE & STUDY TRACKER REPORT'],
      ['Generated On', new Date().toLocaleString()],
      [''],
      ['Plan Details', ''],
      ['Title', timetable?.title || 'My Study & Attendance Timetable'],
      ['Start Date', timetable?.startDate || fullPlanDays[0]?.dateStr || 'N/A'],
      ['Deadline / Target Date', timetable?.endDate || fullPlanDays[fullPlanDays.length - 1]?.dateStr || 'N/A'],
      ['Total Plan Duration (Days)', fullPlanDays.length],
      ['Exported Days Count', filteredDays.length],
      [''],
      ['Progress & Key Metrics', ''],
      ['Total Target Lectures', stats.totalTargetLectures || 0],
      ['Total Completed Lectures (All-time)', stats.totalCheckedAllTime || 0],
      ['Lectures Remaining', stats.leftLectures || 0],
      ['Overall Completion Rate', `${stats.overallCompletionRate || 0}%`],
      ['Current Active Streak', `${stats.currentStreak || 0} Days`],
      ['Daily Required Velocity', `${pacingStats.dailyRate || 0} lectures/day`],
      ['Study Days Per Week', `${timetable?.lecturePlan?.studyDaysPerWeek || 6} days/week`]
    ];

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    // Set column widths
    wsSummary['!cols'] = [{ wch: 30 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
  }

  // 2. Subject Breakdown Sheet
  if (options.includeSubjects && subjectsList.length > 0) {
    const subjHeaders = [
      'Subject Name',
      'Timing Slot',
      'Daily Slot Target',
      'Completed Lectures',
      'Total Target Lectures',
      'Completion %',
      'Lectures Remaining',
      'Status'
    ];

    const subjRows = subjectsList.map(s => {
      const sp = stats.subjectProgress?.[s.id] || { completed: 0, goal: s.totalLectures || 0, percent: 0, left: s.totalLectures || 0 };
      const status = sp.percent >= 100 ? 'Completed' : (sp.percent > 0 ? 'In Progress' : 'Not Started');
      return [
        s.name,
        s.timingSlot || 'Flexible',
        s.dailyGoal || 1,
        sp.completed,
        sp.goal,
        `${sp.percent}%`,
        sp.left,
        status
      ];
    });

    const wsSubjects = XLSX.utils.aoa_to_sheet([subjHeaders, ...subjRows]);
    wsSubjects['!cols'] = [
      { wch: 30 },
      { wch: 25 },
      { wch: 18 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 18 },
      { wch: 15 }
    ];
    XLSX.utils.book_append_sheet(wb, wsSubjects, 'Subject Performance');
  }

  // 3. Daily Attendance Log Matrix Sheet
  if (options.includeDailyLogs && filteredDays.length > 0) {
    const dynamicSubjectHeaders = subjectsList.map(s => `${s.name} (${s.dailyGoal || 1}/day)`);
    const dailyHeaders = [
      'Date',
      'Day',
      'Week #',
      ...dynamicSubjectHeaders,
      'Total Lectures Watched',
      'Total Daily Goal',
      'Daily Completion %',
      'Day Status'
    ];

    const dailyRows = filteredDays.map(day => {
      let dayCompleted = 0;
      let dayGoal = 0;

      const subjectStatuses = subjectsList.map(s => {
        const isScheduled = (s.recurringDays || [1, 2, 3, 4, 5, 6]).includes(day.dayOfWeek);
        const goal = s.dailyGoal || 1;
        
        if (!isScheduled) {
          return 'Off Day';
        }

        dayGoal += goal;
        const entry = logs[day.dateStr]?.[s.id];
        const count = entry?.count !== undefined ? entry.count : (entry?.checked ? goal : 0);
        dayCompleted += count;

        return `${count}/${goal} done`;
      });

      const dayPct = dayGoal > 0 ? Math.round((dayCompleted / dayGoal) * 100) : 0;
      let dayStatus = 'Off Day';
      if (dayGoal > 0) {
        if (dayCompleted >= dayGoal) dayStatus = 'Fully Completed';
        else if (dayCompleted > 0) dayStatus = 'Partially Completed';
        else dayStatus = 'Missed / Pending';
      }

      return [
        day.dateStr,
        day.weekday,
        `Week ${day.weekNumber}`,
        ...subjectStatuses,
        dayCompleted,
        dayGoal,
        `${dayPct}%`,
        dayStatus
      ];
    });

    const wsDaily = XLSX.utils.aoa_to_sheet([dailyHeaders, ...dailyRows]);
    const colWidths = [
      { wch: 14 },
      { wch: 10 },
      { wch: 10 },
      ...subjectsList.map(() => ({ wch: 25 })),
      { wch: 22 },
      { wch: 18 },
      { wch: 18 },
      { wch: 20 }
    ];
    wsDaily['!cols'] = colWidths;
    XLSX.utils.book_append_sheet(wb, wsDaily, 'Daily Attendance Matrix');
  }

  // 4. Weekly Statistics Sheet
  if (options.includeWeeklyStats && stats.allWeeklyStats?.length > 0) {
    const weeklyHeaders = [
      'Week Number',
      'Target Lectures',
      'Completed Lectures',
      'Remaining Lectures',
      'Completion %',
      'Status'
    ];

    const weeklyRows = stats.allWeeklyStats.map(w => {
      const status = w.progressPct >= 100 ? 'Completed' : (w.progressPct > 0 ? 'In Progress' : 'Pending');
      return [
        `Week ${w.weekNumber}`,
        w.goal,
        w.completed,
        w.left,
        `${w.progressPct}%`,
        status
      ];
    });

    const wsWeekly = XLSX.utils.aoa_to_sheet([weeklyHeaders, ...weeklyRows]);
    wsWeekly['!cols'] = [
      { wch: 15 },
      { wch: 18 },
      { wch: 20 },
      { wch: 20 },
      { wch: 16 },
      { wch: 15 }
    ];
    XLSX.utils.book_append_sheet(wb, wsWeekly, 'Weekly Performance');
  }

  // Generate filename and trigger download
  const cleanTitle = (timetable?.title || 'Attendance_Report').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanTitle}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
};

/**
 * Export Attendance Data to PDF Document
 */
export const exportAttendanceToPDF = ({
  timetable,
  subjectsList = [],
  logs = {},
  fullPlanDays = [],
  allWeeklyBlocks = [],
  stats = {},
  pacingStats = {},
  selectedScope = 'full_plan',
  customStartDate = '',
  customEndDate = '',
  currentVisibleDays = [],
  options = {
    includeSummary: true,
    includeSubjects: true,
    includeDailyLogs: true,
    includeWeeklyStats: true
  }
}) => {
  const filteredDays = filterDaysByScope(fullPlanDays, selectedScope, customStartDate, customEndDate, currentVisibleDays);
  
  // Initialize PDF in Portrait or Landscape depending on column count
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentY = 16;

  // Header Banner
  doc.setFillColor(142, 76, 246); // Primary Purple (#8E4CF6)
  doc.rect(14, currentY, pageWidth - 28, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(timetable?.title || 'Attendance & Study Habit Matrix', 20, currentY + 9);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString()}  |  Scope: ${selectedScope.replace('_', ' ').toUpperCase()} (${filteredDays.length} Days)`, 20, currentY + 16);

  currentY += 28;

  // 1. Executive Summary KPI Grid
  if (options.includeSummary) {
    doc.setTextColor(23, 23, 28);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Progress Metrics', 14, currentY);
    currentY += 4;

    const kpiData = [
      [
        `Total Target: ${stats.totalTargetLectures || 0} Lectures`,
        `Completed: ${stats.totalCheckedAllTime || 0} Lectures`,
        `Attendance Rate: ${stats.overallCompletionRate || 0}%`
      ],
      [
        `Remaining: ${stats.leftLectures || 0} Lectures`,
        `Current Streak: ${stats.currentStreak || 0} Days`,
        `Daily Velocity: ${pacingStats.dailyRate || 0} lecs/day`
      ],
      [
        `Plan Duration: ${fullPlanDays.length} Days`,
        `Start Date: ${timetable?.startDate || 'N/A'}`,
        `Target Deadline: ${timetable?.endDate || 'N/A'}`
      ]
    ];

    applyAutoTable(doc, {
      startY: currentY,
      head: [],
      body: kpiData,
      theme: 'grid',
      styles: {
        fontSize: 8.5,
        cellPadding: 3,
        textColor: [23, 23, 28],
        lineColor: [232, 223, 242],
        lineWidth: 0.2
      },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [248, 245, 253] },
        1: { fontStyle: 'bold', fillColor: [248, 245, 253] },
        2: { fontStyle: 'bold', fillColor: [248, 245, 253] }
      },
      margin: { left: 14, right: 14 }
    });

    currentY = (doc.lastAutoTable?.finalY || currentY + 30) + 8;
  }

  // 2. Subject Breakdown Table
  if (options.includeSubjects && subjectsList.length > 0) {
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = 16;
    }

    doc.setTextColor(23, 23, 28);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Subject-wise Performance Breakdown', 14, currentY);
    currentY += 4;

    const subjTableHead = [['Subject', 'Time Slot', 'Daily Goal', 'Completed', 'Target', 'Progress %', 'Status']];
    const subjTableBody = subjectsList.map(s => {
      const sp = stats.subjectProgress?.[s.id] || { completed: 0, goal: s.totalLectures || 0, percent: 0 };
      const status = sp.percent >= 100 ? 'Completed' : (sp.percent > 0 ? 'In Progress' : 'Not Started');
      return [
        s.name,
        s.timingSlot || 'Flexible',
        `${s.dailyGoal || 1} lecs`,
        `${sp.completed} lecs`,
        `${sp.goal} lecs`,
        `${sp.percent}%`,
        status
      ];
    });

    applyAutoTable(doc, {
      startY: currentY,
      head: subjTableHead,
      body: subjTableBody,
      theme: 'striped',
      headStyles: {
        fillColor: [142, 76, 246],
        textColor: [255, 255, 255],
        fontSize: 8.5,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 8,
        cellPadding: 2.5,
        textColor: [50, 50, 60]
      },
      margin: { left: 14, right: 14 }
    });

    currentY = (doc.lastAutoTable?.finalY || currentY + 30) + 8;
  }

  // 3. Weekly Statistics Table (if enabled)
  if (options.includeWeeklyStats && stats.allWeeklyStats?.length > 0) {
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = 16;
    }

    doc.setTextColor(23, 23, 28);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Weekly Performance Summary', 14, currentY);
    currentY += 4;

    const weeklyTableHead = [['Week #', 'Target Lectures', 'Completed Lectures', 'Remaining', 'Completion %', 'Status']];
    const weeklyTableBody = stats.allWeeklyStats.map(w => {
      const status = w.progressPct >= 100 ? 'Completed' : (w.progressPct > 0 ? 'In Progress' : 'Pending');
      return [
        `Week ${w.weekNumber}`,
        `${w.goal} lecs`,
        `${w.completed} lecs`,
        `${w.left} lecs`,
        `${w.progressPct}%`,
        status
      ];
    });

    applyAutoTable(doc, {
      startY: currentY,
      head: weeklyTableHead,
      body: weeklyTableBody,
      theme: 'striped',
      headStyles: {
        fillColor: [79, 70, 229], // Indigo
        textColor: [255, 255, 255],
        fontSize: 8.5,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        textColor: [50, 50, 60]
      },
      margin: { left: 14, right: 14 }
    });

    currentY = (doc.lastAutoTable?.finalY || currentY + 30) + 8;
  }

  // 4. Daily Attendance Matrix Log Table
  if (options.includeDailyLogs && filteredDays.length > 0) {
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = 16;
    }

    doc.setTextColor(23, 23, 28);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Daily Attendance Log (${filteredDays.length} Days)`, 14, currentY);
    currentY += 4;

    const dynamicSubjectShortHeaders = subjectsList.map(s => {
      // Keep short name
      return s.name.length > 14 ? s.name.substring(0, 12) + '..' : s.name;
    });

    const dailyTableHead = [
      ['Date', 'Day', 'Week', ...dynamicSubjectShortHeaders, 'Total Watched', 'Day %', 'Status']
    ];

    const dailyTableBody = filteredDays.map(day => {
      let dayCompleted = 0;
      let dayGoal = 0;

      const subjectStatuses = subjectsList.map(s => {
        const isScheduled = (s.recurringDays || [1, 2, 3, 4, 5, 6]).includes(day.dayOfWeek);
        const goal = s.dailyGoal || 1;
        
        if (!isScheduled) {
          return '-';
        }

        dayGoal += goal;
        const entry = logs[day.dateStr]?.[s.id];
        const count = entry?.count !== undefined ? entry.count : (entry?.checked ? goal : 0);
        dayCompleted += count;

        return `${count}/${goal}`;
      });

      const dayPct = dayGoal > 0 ? Math.round((dayCompleted / dayGoal) * 100) : 0;
      let dayStatus = 'Off';
      if (dayGoal > 0) {
        if (dayCompleted >= dayGoal) dayStatus = 'Done';
        else if (dayCompleted > 0) dayStatus = 'Partial';
        else dayStatus = 'Missed';
      }

      return [
        day.dateStr,
        day.weekday,
        `W${day.weekNumber}`,
        ...subjectStatuses,
        `${dayCompleted}/${dayGoal}`,
        `${dayPct}%`,
        dayStatus
      ];
    });

    applyAutoTable(doc, {
      startY: currentY,
      head: dailyTableHead,
      body: dailyTableBody,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59], // Dark Slate
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 7,
        cellPadding: 1.5,
        textColor: [40, 40, 50]
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: 14, right: 14 }
    });
  }

  // Add Page Numbers in Footer for all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 150);
    doc.text(
      `Page ${i} of ${totalPages}  |  ${timetable?.title || 'Attendance Tracker'}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // Generate filename and trigger download
  const cleanTitle = (timetable?.title || 'Attendance_Report').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanTitle}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};

const attendanceExportUtils = {
  exportAttendanceToExcel,
  exportAttendanceToPDF,
  filterDaysByScope
};

export default attendanceExportUtils;


