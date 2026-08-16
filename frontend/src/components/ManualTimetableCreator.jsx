import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiCalendar, FiClock, FiSave, FiX, FiCheckCircle, FiEdit3, FiEye } from 'react-icons/fi';

const PRESET_COLORS = [
  '#3B82F6', '#10B981', '#EC4899', '#8B5CF6', '#F59E0B',
  '#06B6D4', '#EF4444', '#14B8A6', '#6366F1', '#D946EF'
];

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAY_LABELS = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday' };
const DAY_SHORT = { mon: 'MON', tue: 'TUE', wed: 'WED', thu: 'THU', fri: 'FRI', sat: 'SAT' };

const calcDuration = (start, end) => {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
};

const formatTime12 = (t24) => {
  if (!t24) return '';
  const [h, m] = t24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
};

const getTodayStr = () => new Date().toISOString().split('T')[0];
const getSixMonthsLater = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 6);
  return d.toISOString().split('T')[0];
};

const ManualTimetableCreator = ({ onSaveTimetable, existingTimetable, onClose }) => {
  const [title, setTitle] = useState('My Weekly Timetable');
  const [ttStartDate, setTtStartDate] = useState(getTodayStr());
  const [ttEndDate, setTtEndDate] = useState(getSixMonthsLater());
  const [showPreview, setShowPreview] = useState(false);

  // Subjects the user has configured
  const [subjects, setSubjects] = useState([
    { name: 'Mathematics', color: '#3B82F6' },
    { name: 'Physics', color: '#10B981' },
    { name: 'Chemistry', color: '#EC4899' }
  ]);
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjColor, setNewSubjColor] = useState(PRESET_COLORS[3]);

  // Time slots: each row has startTime, endTime, and a day map
  const [timeSlots, setTimeSlots] = useState([
    {
      id: 'slot_1',
      startTime: '09:00',
      endTime: '10:30',
      days: { mon: null, tue: null, wed: null, thu: null, fri: null, sat: null }
    },
    {
      id: 'slot_2',
      startTime: '11:00',
      endTime: '12:30',
      days: { mon: null, tue: null, wed: null, thu: null, fri: null, sat: null }
    },
    {
      id: 'slot_3',
      startTime: '14:00',
      endTime: '15:30',
      days: { mon: null, tue: null, wed: null, thu: null, fri: null, sat: null }
    }
  ]);

  // Pre-fill if editing existing timetable
  useEffect(() => {
    if (existingTimetable) {
      setTitle(existingTimetable.title || 'My Weekly Timetable');
      setTtStartDate(existingTimetable.startDate || getTodayStr());
      setTtEndDate(existingTimetable.endDate || getSixMonthsLater());
      if (existingTimetable.subjects?.length) setSubjects(existingTimetable.subjects);
      if (existingTimetable.timeSlots?.length) {
        setTimeSlots(existingTimetable.timeSlots.map((s, i) => ({
          id: s.id || `slot_${i}`,
          startTime: s.startTime,
          endTime: s.endTime,
          days: s.days || { mon: null, tue: null, wed: null, thu: null, fri: null, sat: null }
        })));
      }
    }
  }, [existingTimetable]);

  // Add a new subject
  const handleAddSubject = () => {
    if (!newSubjName.trim()) return;
    if (subjects.find(s => s.name.toLowerCase() === newSubjName.trim().toLowerCase())) return;
    setSubjects(prev => [...prev, { name: newSubjName.trim(), color: newSubjColor }]);
    setNewSubjName('');
    setNewSubjColor(PRESET_COLORS[(subjects.length + 1) % PRESET_COLORS.length]);
  };

  // Remove a subject
  const handleRemoveSubject = (idx) => {
    const removed = subjects[idx];
    setSubjects(prev => prev.filter((_, i) => i !== idx));
    // Clear from slots
    setTimeSlots(prev => prev.map(slot => {
      const newDays = { ...slot.days };
      DAYS.forEach(day => {
        if (newDays[day]?.subjectName === removed.name) {
          newDays[day] = null;
        }
      });
      return { ...slot, days: newDays };
    }));
  };

  // Add a new time slot row
  const handleAddSlot = () => {
    const lastSlot = timeSlots[timeSlots.length - 1];
    let startH = 16, startM = 0;
    if (lastSlot) {
      const [eh, em] = lastSlot.endTime.split(':').map(Number);
      startH = eh + 1;
      startM = em;
      if (startH >= 24) startH = 8;
    }
    setTimeSlots(prev => [...prev, {
      id: `slot_${Date.now()}`,
      startTime: `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`,
      endTime: `${String(Math.min(23, startH + 1)).padStart(2, '0')}:${String(startM).padStart(2, '0')}`,
      days: { mon: null, tue: null, wed: null, thu: null, fri: null, sat: null }
    }]);
  };

  // Remove a time slot row
  const handleRemoveSlot = (slotId) => {
    setTimeSlots(prev => prev.filter(s => s.id !== slotId));
  };

  // Update time on a slot
  const handleSlotTimeChange = (slotId, field, val) => {
    setTimeSlots(prev => prev.map(s => s.id === slotId ? { ...s, [field]: val } : s));
  };

  // Assign subject to a specific day cell
  const handleAssignSubject = (slotId, day, subjectName) => {
    setTimeSlots(prev => prev.map(s => {
      if (s.id !== slotId) return s;
      const newDays = { ...s.days };
      if (!subjectName || subjectName === '__free__') {
        newDays[day] = null;
      } else {
        const subj = subjects.find(sub => sub.name === subjectName);
        newDays[day] = { subjectName, color: subj?.color || '#8E4CF6' };
      }
      return { ...s, days: newDays };
    }));
  };

  // Save handler
  const handleSave = () => {
    if (!title.trim()) return;
    const data = {
      title: title.trim(),
      startDate: ttStartDate,
      endDate: ttEndDate,
      timeSlots: timeSlots.map(s => ({
        startTime: s.startTime,
        endTime: s.endTime,
        durationMinutes: calcDuration(s.startTime, s.endTime),
        days: s.days
      })),
      subjects: subjects.map(s => ({ name: s.name, color: s.color }))
    };
    if (onSaveTimetable) onSaveTimetable(data);
  };

  // Compute daily lecture count per subject (for attendance integration)
  const subjectDailyCounts = {};
  subjects.forEach(s => { subjectDailyCounts[s.name] = 0; });
  timeSlots.forEach(slot => {
    DAYS.forEach(day => {
      if (slot.days[day]?.subjectName) {
        subjectDailyCounts[slot.days[day].subjectName] = (subjectDailyCounts[slot.days[day].subjectName] || 0) + 1;
      }
    });
  });

  return (
    <div className="bg-white dark:bg-[#111115] rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs overflow-hidden">
      
      {/* Header */}
      <div className="p-5 border-b border-[#E8DFF2] dark:border-[#22222B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#F59E0B]/15 text-[#F59E0B] rounded-2xl flex items-center justify-center border border-[#F59E0B]/25 shadow-xs flex-shrink-0">
            <FiCalendar size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#17171C] dark:text-white tracking-tight">
              📅 Manual Weekly Timetable Creator
            </h2>
            <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA]">
              Build your custom attendance timetable with specific time slots, subjects, and active days.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-3.5 py-2 bg-[#FAF7FD] dark:bg-[#18181F] hover:bg-[#F3EEFB] dark:hover:bg-[#20202A] text-[#17171C] dark:text-white rounded-xl font-bold text-xs border border-[#E8DFF2] dark:border-[#22222B] flex items-center gap-1.5 transition"
          >
            <FiEye size={14} />
            <span>{showPreview ? 'Hide Preview' : 'Preview Timetable'}</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[#F3EEFB] dark:hover:bg-[#18181F] text-[#6B7082] transition"
            >
              <FiX size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="p-5 space-y-6">

        {/* Section 1: Title & Date Range */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#8E4CF6] dark:text-[#C49CFF] flex items-center gap-2">
            <FiEdit3 size={14} /> Timetable Info & Duration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#6B7082] dark:text-[#A9A2BA] block mb-1">Timetable Name</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Semester 2 Study Schedule"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-white dark:bg-[#111115] text-[#17171C] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#8E4CF6]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#6B7082] dark:text-[#A9A2BA] block mb-1">Start Date</label>
              <input
                type="date"
                value={ttStartDate}
                onChange={(e) => setTtStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-white dark:bg-[#111115] text-[#17171C] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#8E4CF6]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#6B7082] dark:text-[#A9A2BA] block mb-1">End Date</label>
              <input
                type="date"
                value={ttEndDate}
                onChange={(e) => setTtEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-white dark:bg-[#111115] text-[#17171C] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#8E4CF6]"
              />
            </div>
          </div>

          {/* Duration Info */}
          {ttStartDate && ttEndDate && (
            <div className="flex items-center gap-3 text-[11px] text-[#6B7082] dark:text-[#A9A2BA]">
              <FiClock size={13} className="text-[#8E4CF6]" />
              <span>
                Duration: <strong className="text-[#17171C] dark:text-white">
                  {Math.max(0, Math.ceil((new Date(ttEndDate) - new Date(ttStartDate)) / (1000 * 60 * 60 * 24)))} days
                </strong> ({Math.ceil(Math.max(0, (new Date(ttEndDate) - new Date(ttStartDate)) / (1000 * 60 * 60 * 24 * 7)))} weeks)
              </span>
            </div>
          )}
        </div>

        {/* Section 2: Subject Setup */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#8E4CF6] dark:text-[#C49CFF] flex items-center gap-2">
            <FiCheckCircle size={14} /> Subjects ({subjects.length})
          </h3>

          {/* Existing Subjects Grid */}
          <div className="flex flex-wrap gap-2">
            {subjects.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#FAF7FD] dark:bg-[#18181F] rounded-full border border-[#E8DFF2] dark:border-[#22222B] text-xs font-bold"
              >
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-[#17171C] dark:text-white">{s.name}</span>
                <button
                  onClick={() => handleRemoveSubject(idx)}
                  className="p-0.5 text-gray-400 hover:text-red-500 transition"
                  title="Remove subject"
                >
                  <FiX size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Subject Inline */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
            <div className="flex-1">
              <label className="text-[11px] font-bold text-[#6B7082] dark:text-[#A9A2BA] block mb-1">New Subject Name</label>
              <input
                type="text"
                value={newSubjName}
                onChange={(e) => setNewSubjName(e.target.value)}
                placeholder="e.g. English, Reasoning..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-white dark:bg-[#111115] text-[#17171C] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#8E4CF6]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#6B7082] dark:text-[#A9A2BA] block mb-1">Color</label>
              <div className="flex items-center gap-1">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewSubjColor(c)}
                    className={`w-6 h-6 rounded-full transition ${newSubjColor === c ? 'ring-2 ring-[#8E4CF6] ring-offset-1 dark:ring-offset-[#111115] scale-110' : 'hover:scale-105 opacity-60'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={handleAddSubject}
              disabled={!newSubjName.trim()}
              className="px-4 py-2 bg-[#8E4CF6] hover:bg-[#7839D4] text-white rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition disabled:opacity-40 self-end"
            >
              <FiPlus size={14} />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Section 3: Time Slot Rows & Day Assignments */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#8E4CF6] dark:text-[#C49CFF] flex items-center gap-2">
              <FiClock size={14} /> Daily Time Slots & Lecture Assignments ({timeSlots.length} slots)
            </h3>
            <button
              onClick={handleAddSlot}
              className="px-3 py-1.5 bg-[#FAF7FD] dark:bg-[#18181F] hover:bg-[#F3EEFB] dark:hover:bg-[#20202A] text-[#8E4CF6] dark:text-[#C49CFF] rounded-xl font-bold text-xs border border-dashed border-[#8E4CF6]/40 flex items-center gap-1 transition"
            >
              <FiPlus size={13} /> Add Time Slot
            </button>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {timeSlots.map((slot, slotIdx) => {
              const dur = calcDuration(slot.startTime, slot.endTime);
              return (
                <div
                  key={slot.id}
                  className="p-4 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] space-y-3"
                >
                  {/* Slot Header: Time Range & Delete */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 bg-[#8E4CF6]/15 text-[#8E4CF6] dark:text-[#C49CFF] rounded-lg flex items-center justify-center text-[10px] font-black">
                        {slotIdx + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => handleSlotTimeChange(slot.id, 'startTime', e.target.value)}
                          className="px-2 py-1.5 text-xs rounded-lg border border-[#E8DFF2] dark:border-[#22222B] bg-white dark:bg-[#111115] text-[#17171C] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#8E4CF6] font-bold"
                        />
                        <span className="text-xs text-[#6B7082]">to</span>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => handleSlotTimeChange(slot.id, 'endTime', e.target.value)}
                          className="px-2 py-1.5 text-xs rounded-lg border border-[#E8DFF2] dark:border-[#22222B] bg-white dark:bg-[#111115] text-[#17171C] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#8E4CF6] font-bold"
                        />
                      </div>
                      {dur > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-[#10B981]/15 text-[#10B981] rounded-full">
                          {dur} min
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleRemoveSlot(slot.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition self-end sm:self-auto"
                      title="Remove slot"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>

                  {/* Day Assignments Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {DAYS.map(day => {
                      const assigned = slot.days[day];
                      return (
                        <div key={day} className="space-y-1">
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA]">
                            {DAY_SHORT[day]}
                          </label>
                          <select
                            value={assigned?.subjectName || '__free__'}
                            onChange={(e) => handleAssignSubject(slot.id, day, e.target.value)}
                            className="w-full px-2 py-1.5 text-xs rounded-lg border border-[#E8DFF2] dark:border-[#22222B] bg-white dark:bg-[#111115] text-[#17171C] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#8E4CF6] font-semibold"
                            style={assigned ? { borderColor: assigned.color, borderWidth: '2px' } : {}}
                          >
                            <option value="__free__">— Free —</option>
                            {subjects.map((s, i) => (
                              <option key={i} value={s.name}>{s.name}</option>
                            ))}
                          </select>
                          {assigned && (
                            <div
                              className="w-full h-1 rounded-full"
                              style={{ backgroundColor: assigned.color }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Visual Timetable Preview */}
        {showPreview && (
          <div className="space-y-3 animate-fadeIn">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#17171C] dark:text-white flex items-center gap-2">
              <FiEye size={14} className="text-[#8E4CF6]" /> Weekly Timetable Preview
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-[#E8DFF2] dark:border-[#22222B]">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#141416] dark:bg-[#09090B] text-white text-[11px] font-extrabold uppercase tracking-wider">
                    <th className="py-3 px-4 border-r border-white/10 w-36">
                      <div className="flex items-center gap-1.5">
                        <FiClock size={13} />
                        <span>Time Slot</span>
                      </div>
                    </th>
                    {DAYS.map(day => (
                      <th key={day} className="py-3 px-3 text-center border-r border-white/10 last:border-r-0">
                        {DAY_SHORT[day]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot, idx) => {
                    const dur = calcDuration(slot.startTime, slot.endTime);
                    return (
                      <tr
                        key={slot.id}
                        className={`border-b border-[#E8DFF2] dark:border-[#22222B] ${
                          idx % 2 === 0 ? 'bg-white dark:bg-[#111115]' : 'bg-[#FAF7FD] dark:bg-[#18181F]'
                        }`}
                      >
                        {/* Time Cell */}
                        <td className="py-3 px-4 border-r border-[#E8DFF2] dark:border-[#22222B]">
                          <div className="text-xs font-black text-[#17171C] dark:text-white">
                            {formatTime12(slot.startTime)} – {formatTime12(slot.endTime)}
                          </div>
                          <div className="text-[10px] text-[#6B7082] dark:text-[#A9A2BA]">
                            {dur > 0 ? `${dur} min` : ''}
                          </div>
                        </td>

                        {/* Day Cells */}
                        {DAYS.map(day => {
                          const cell = slot.days[day];
                          if (cell) {
                            return (
                              <td key={day} className="py-2 px-2 text-center border-r border-[#E8DFF2] dark:border-[#22222B] last:border-r-0">
                                <div
                                  className="px-2 py-2 rounded-xl text-white font-bold text-[11px] shadow-xs"
                                  style={{ backgroundColor: cell.color }}
                                >
                                  {cell.subjectName}
                                </div>
                              </td>
                            );
                          }
                          return (
                            <td key={day} className="py-2 px-2 text-center border-r border-[#E8DFF2] dark:border-[#22222B] last:border-r-0">
                              <span className="text-[10px] text-[#9CA0B0] dark:text-[#555] italic">Free</span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Subject-wise Weekly Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {subjects.map((s, idx) => {
                const weeklyCount = subjectDailyCounts[s.name] || 0;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] flex items-center gap-2"
                  >
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[#17171C] dark:text-white truncate">{s.name}</div>
                      <div className="text-[10px] text-[#6B7082] dark:text-[#A9A2BA]">
                        {weeklyCount} slots/week
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Save & Cancel Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#E8DFF2] dark:border-[#22222B]">
          <div className="text-[11px] text-[#6B7082] dark:text-[#A9A2BA]">
            {subjects.length} subjects • {timeSlots.length} time slots • {DAYS.length} days configured
          </div>

          <div className="flex items-center gap-2">
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B7082] hover:bg-[#FAF7FD] dark:hover:bg-[#18181F] transition"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!title.trim() || subjects.length === 0}
              className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-extrabold text-xs shadow-xs flex items-center gap-1.5 transition disabled:opacity-40 active:scale-95"
            >
              <FiSave size={14} />
              <span>Save Timetable & Apply to Attendance</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManualTimetableCreator;
