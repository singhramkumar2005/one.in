import React, { useState } from 'react';
import {
  FiX, FiDownload, FiFileText, FiGrid, FiCalendar, FiCheck,
  FiSliders, FiLayers, FiPieChart, FiCheckCircle
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { exportAttendanceToExcel, exportAttendanceToPDF, filterDaysByScope } from '../utils/attendanceExport';

const AttendanceExportModal = ({
  isOpen,
  onClose,
  timetable,
  subjectsList,
  logs,
  fullPlanDays,
  allWeeklyBlocks,
  stats,
  pacingStats,
  currentVisibleDays
}) => {
  const [exportFormat, setExportFormat] = useState('excel'); // 'excel' | 'pdf'
  const [selectedScope, setSelectedScope] = useState('full_plan'); // 'full_plan' | 'current_view' | 'this_month' | 'custom'
  const [customStartDate, setCustomStartDate] = useState(
    fullPlanDays?.[0]?.dateStr || new Date().toISOString().split('T')[0]
  );
  const [customEndDate, setCustomEndDate] = useState(
    fullPlanDays?.[fullPlanDays.length - 1]?.dateStr || new Date().toISOString().split('T')[0]
  );
  
  const [options, setOptions] = useState({
    includeSummary: true,
    includeSubjects: true,
    includeDailyLogs: true,
    includeWeeklyStats: true
  });

  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const targetDaysCount = filterDaysByScope(
    fullPlanDays,
    selectedScope,
    customStartDate,
    customEndDate,
    currentVisibleDays
  ).length;

  const handleExport = async (formatOverride) => {
    const format = formatOverride || exportFormat;
    setIsExporting(true);

    try {
      const exportParams = {
        timetable,
        subjectsList,
        logs,
        fullPlanDays,
        allWeeklyBlocks,
        stats,
        pacingStats,
        selectedScope,
        customStartDate,
        customEndDate,
        currentVisibleDays,
        options
      };

      if (format === 'excel') {
        exportAttendanceToExcel(exportParams);
        toast.success('📊 Excel spreadsheet generated and downloaded successfully!');
      } else {
        exportAttendanceToPDF(exportParams);
        toast.success('📄 PDF attendance report generated and downloaded successfully!');
      }

      onClose();
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to generate export file. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#121216] border border-[#E8DFF2] dark:border-[#262630] rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#F0EAF8] dark:border-[#1E1E26] flex items-center justify-between bg-[#FAF7FD] dark:bg-[#16161C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8E4CF6]/15 text-[#8E4CF6] dark:text-[#C49CFF] flex items-center justify-center font-black">
              <FiDownload size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#17171C] dark:text-white">
                Export Attendance & Records
              </h2>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                Download detailed study logs and attendance data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center text-[#71717A] dark:text-[#A1A1AA] transition"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* Format Picker */}
          <div>
            <label className="block text-xs font-bold text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider mb-2">
              Choose Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExportFormat('excel')}
                className={`p-4 rounded-2xl border flex items-center gap-3 transition text-left ${
                  exportFormat === 'excel'
                    ? 'border-[#10B981] bg-[#10B981]/10 text-[#059669] dark:text-[#34D399] font-bold shadow-xs'
                    : 'border-[#E8DFF2] dark:border-[#22222B] bg-white dark:bg-[#18181F] text-[#17171C] dark:text-white hover:border-[#10B981]/40'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${exportFormat === 'excel' ? 'bg-[#10B981] text-white' : 'bg-black/5 dark:bg-white/5 text-[#71717A]'}`}>
                  <FiGrid size={20} />
                </div>
                <div>
                  <div className="font-extrabold text-sm">Excel (.xlsx)</div>
                  <div className="text-[11px] font-normal text-[#71717A] dark:text-[#A1A1AA]">
                    Multi-sheet workbook
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setExportFormat('pdf')}
                className={`p-4 rounded-2xl border flex items-center gap-3 transition text-left ${
                  exportFormat === 'pdf'
                    ? 'border-[#8E4CF6] bg-[#8E4CF6]/10 text-[#8E4CF6] dark:text-[#C49CFF] font-bold shadow-xs'
                    : 'border-[#E8DFF2] dark:border-[#22222B] bg-white dark:bg-[#18181F] text-[#17171C] dark:text-white hover:border-[#8E4CF6]/40'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${exportFormat === 'pdf' ? 'bg-[#8E4CF6] text-white' : 'bg-black/5 dark:bg-white/5 text-[#71717A]'}`}>
                  <FiFileText size={20} />
                </div>
                <div>
                  <div className="font-extrabold text-sm">PDF Document</div>
                  <div className="text-[11px] font-normal text-[#71717A] dark:text-[#A1A1AA]">
                    Formatted report tables
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Date Scope Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider">
                Date Range & Scope
              </label>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#8E4CF6]/10 text-[#8E4CF6] dark:text-[#C49CFF]">
                {targetDaysCount} Days Selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'full_plan', label: 'Full Plan', desc: `${fullPlanDays.length} Days` },
                { id: 'current_view', label: 'Current View', desc: `${currentVisibleDays.length} Days` },
                { id: 'this_month', label: 'This Month', desc: 'Current Month' },
                { id: 'custom', label: 'Custom Range', desc: 'Pick Dates' }
              ].map(scope => (
                <button
                  key={scope.id}
                  type="button"
                  onClick={() => setSelectedScope(scope.id)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    selectedScope === scope.id
                      ? 'border-[#8E4CF6] bg-[#8E4CF6]/10 text-[#8E4CF6] dark:text-[#C49CFF] font-bold'
                      : 'border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] text-[#6B7082] dark:text-[#A9A2BA] hover:bg-[#F3EEFB]'
                  }`}
                >
                  <div className="text-xs font-bold">{scope.label}</div>
                  <div className="text-[10px] opacity-75">{scope.desc}</div>
                </button>
              ))}
            </div>

            {/* Custom Date Pickers */}
            {selectedScope === 'custom' && (
              <div className="mt-3 p-3.5 rounded-2xl bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B7082] dark:text-[#A9A2BA] mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#121216] border border-[#E8DFF2] dark:border-[#2C2C38] text-[#17171C] dark:text-white font-semibold focus:outline-none focus:border-[#8E4CF6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6B7082] dark:text-[#A9A2BA] mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#121216] border border-[#E8DFF2] dark:border-[#2C2C38] text-[#17171C] dark:text-white font-semibold focus:outline-none focus:border-[#8E4CF6]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Included Data Sections */}
          <div>
            <label className="block text-xs font-bold text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider mb-2">
              Sections to Include
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { key: 'includeSummary', label: 'Executive Summary & KPIs', icon: FiPieChart },
                { key: 'includeSubjects', label: 'Subject Performance Matrix', icon: FiLayers },
                { key: 'includeDailyLogs', label: 'Detailed Daily Attendance Logs', icon: FiCalendar },
                { key: 'includeWeeklyStats', label: 'Weekly Summary Progress', icon: FiCheckCircle }
              ].map(sec => (
                <button
                  key={sec.key}
                  type="button"
                  onClick={() => setOptions(prev => ({ ...prev, [sec.key]: !prev[sec.key] }))}
                  className={`p-3 rounded-xl border flex items-center justify-between transition text-left ${
                    options[sec.key]
                      ? 'border-[#8E4CF6]/40 bg-[#8E4CF6]/5 text-[#17171C] dark:text-white'
                      : 'border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] text-[#71717A] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <sec.icon size={15} className={options[sec.key] ? 'text-[#8E4CF6]' : 'text-[#71717A]'} />
                    <span className="text-xs font-bold">{sec.label}</span>
                  </div>
                  <div className={`w-4 h-4 rounded flex items-center justify-center ${options[sec.key] ? 'bg-[#8E4CF6] text-white' : 'border border-[#CBD5E1]'}`}>
                    {options[sec.key] && <FiCheck size={12} />}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-[#F0EAF8] dark:border-[#1E1E26] bg-[#FAF7FD] dark:bg-[#16161C] flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* 1-Click Fast Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              disabled={isExporting}
              onClick={() => handleExport('excel')}
              className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-white dark:bg-[#1E1E26] hover:bg-[#10B981]/10 text-[#059669] dark:text-[#34D399] border border-[#10B981]/30 font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <FiGrid size={14} /> Quick .XLSX
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={() => handleExport('pdf')}
              className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-white dark:bg-[#1E1E26] hover:bg-[#8E4CF6]/10 text-[#8E4CF6] dark:text-[#C49CFF] border border-[#8E4CF6]/30 font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <FiFileText size={14} /> Quick .PDF
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-[#71717A] dark:text-[#A1A1AA] font-bold text-xs transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={() => handleExport()}
              className={`px-5 py-2.5 rounded-xl text-white font-extrabold text-xs transition shadow-md flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
                exportFormat === 'excel'
                  ? 'bg-[#10B981] hover:bg-[#059669]'
                  : 'bg-[#8E4CF6] hover:bg-[#7839D4]'
              }`}
            >
              <FiDownload size={15} />
              {isExporting ? 'Generating...' : `Download ${exportFormat === 'excel' ? 'Excel (.xlsx)' : 'PDF Report'}`}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AttendanceExportModal;
