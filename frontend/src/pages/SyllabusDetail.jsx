import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Layout from '../components/Layout';
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiCheckCircle, 
  FiClock, 
  FiEdit2, 
  FiTrash2, 
  FiTrendingUp, 
  FiTarget, 
  FiAward, 
  FiActivity, 
  FiSave, 
  FiX, 
  FiPlus, 
  FiMinus,
  FiCheckSquare,
  FiFolder
} from 'react-icons/fi';

const SyllabusDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [syllabus, setSyllabus] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('subjects');
  const [editingSubject, setEditingSubject] = useState(null);
  const [tempValue, setTempValue] = useState('');

  useEffect(() => {
    fetchSyllabus();
    fetchStats();
  }, [id]);

  const fetchSyllabus = async () => {
    try {
      const response = await api.get(`/syllabus/${id}`);
      if (response.data.success) setSyllabus(response.data.data);
    } catch (error) {
      toast.error('Failed to load syllabus');
      navigate('/syllabus');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get(`/syllabus/${id}/stats`);
      if (response.data.success) setStats(response.data.data);
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const updateSubjectProgress = async (subjectId, completedLectures) => {
    setUpdating(true);
    try {
      const response = await api.put(`/syllabus/${id}/subject/${subjectId}/progress`, { completedLectures });
      if (response.data.success) {
        setSyllabus(response.data.data);
        await fetchStats();
        toast.success('Progress updated!');
        setEditingSubject(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickUpdate = (subjectId, currentCompleted, change) => {
    const newCompleted = Math.max(0, currentCompleted + change);
    const subject = syllabus.subjects.find(s => s._id === subjectId);
    if (newCompleted <= subject.totalLectures) {
      updateSubjectProgress(subjectId, newCompleted);
    } else {
      toast.error('Cannot exceed total lectures');
    }
  };

  const deleteSyllabus = async () => {
    if (!window.confirm('Delete this syllabus plan?')) return;
    try {
      await api.delete(`/syllabus/${id}`);
      toast.success('Syllabus plan deleted');
      navigate('/syllabus');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#E8DFF2] border-t-[#8E4CF6]"></div>
            <p className="text-xs font-bold text-[#6B7082] dark:text-[#A9A2BA]">Loading syllabus details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!syllabus) return null;

  const percentage = stats?.completionPercentage || 0;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/syllabus"
            className="inline-flex items-center space-x-2 text-xs font-bold text-[#8E4CF6] hover:underline"
          >
            <FiArrowLeft size={16} />
            <span>Return to All Syllabus Plans</span>
          </Link>
          <button
            onClick={deleteSyllabus}
            className="p-2 text-[#FF708F] hover:bg-[#FFE8EE] rounded-full transition"
            title="Delete Plan"
          >
            <FiTrash2 size={16} />
          </button>
        </div>

        {/* Top Header Card */}
        <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-[#EFE7FC] text-[#5D2D9C] rounded-full text-xs font-bold">
                Study Timeline
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                stats?.isOnTrack ? 'bg-[#DDF9E2] text-[#147034]' : 'bg-[#FFE8EE] text-[#A1183A]'
              }`}>
                {stats?.isOnTrack ? 'On Track' : 'At Risk'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17171C] dark:text-white">
              {syllabus.title}
            </h1>
            <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA]">
              {syllabus.description || 'Target schedule and lecture completion breakdown.'}
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-[#FAF7FD] dark:bg-[#18181F] p-4 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B]">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] block">Completion</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#8E4CF6]">{percentage}%</span>
            </div>
            <div className="h-10 w-[1px] bg-[#E8DFF2] dark:border-[#22222B]"></div>
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] block">Remaining</span>
              <span className="text-lg font-bold text-[#17171C] dark:text-white">{stats?.daysRemaining || 0} Days</span>
            </div>
          </div>
        </div>

        {/* 4 Stat Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] block mb-1">Total Progress</span>
            <span className="text-2xl font-extrabold text-[#17171C] dark:text-white">{percentage}%</span>
          </div>

          <div className="bg-white dark:bg-[#111115] rounded-3xl p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] block mb-1">Daily Lecture Target</span>
            <span className="text-2xl font-extrabold text-[#8E4CF6]">{syllabus.dailyTarget || 2}</span>
          </div>

          <div className="bg-white dark:bg-[#111115] rounded-3xl p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] block mb-1">Days Remaining</span>
            <span className="text-2xl font-extrabold text-[#9B5305]">{stats?.daysRemaining || 0}</span>
          </div>

          <div className="bg-white dark:bg-[#111115] rounded-3xl p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] block mb-1">Lectures Done</span>
            <span className="text-2xl font-extrabold text-[#147034]">{syllabus.completedLectures || 0} / {syllabus.totalLectures || 0}</span>
          </div>
        </div>

        {/* Subjects Checklist Cards */}
        <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-[#E8DFF2] dark:border-[#22222B]">
            <div>
              <h2 className="text-base font-extrabold text-[#17171C] dark:text-white">Subject Modules & Lectures</h2>
              <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA]">Update your completed lectures daily to keep metrics fresh</p>
            </div>
          </div>

          <div className="space-y-4">
            {syllabus.subjects?.map((subject) => {
              const subjectStat = stats?.subjectStats?.find(s => s.id === subject._id);
              const subjectPercentage = subjectStat?.completionPercentage || 0;
              const isEditing = editingSubject === subject._id;

              return (
                <div
                  key={subject._id}
                  className="p-5 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] space-y-3.5"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-[#8E4CF6]"></div>
                      <h3 className="text-sm font-extrabold text-[#17171C] dark:text-white">{subject.name}</h3>
                      <span className="text-xs font-semibold text-[#6B7082] dark:text-[#A9A2BA]">
                        ({subject.completedLectures} / {subject.totalLectures} Lectures)
                      </span>
                    </div>
                    <span className="px-3 py-0.5 bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-full text-xs font-bold text-[#8E4CF6]">
                      {subjectPercentage}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 bg-white dark:bg-[#111115] rounded-full overflow-hidden border border-[#E8DFF2] dark:border-[#22222B]">
                    <div
                      className="h-full bg-[#44D368] rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(subjectPercentage, 100)}%` }}
                    ></div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2 pt-1">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max={subject.totalLectures}
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          className="w-24 px-3 py-1.5 bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-xl text-xs font-bold text-center outline-none"
                        />
                        <button
                          onClick={() => updateSubjectProgress(subject._id, parseInt(tempValue))}
                          disabled={updating}
                          className="px-4 py-1.5 bg-[#141416] text-white rounded-full text-xs font-bold hover:bg-[#26272E]"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => { setEditingSubject(null); setTempValue(''); }}
                          className="p-1.5 text-[#6B7082] hover:bg-[#FFE8EE] rounded-full"
                        >
                          <FiX size={15} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuickUpdate(subject._id, subject.completedLectures, 1)}
                          disabled={updating || subject.completedLectures >= subject.totalLectures}
                          className="px-3.5 py-1.5 bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] text-[#17171C] dark:text-white rounded-full text-xs font-bold hover:bg-[#F3EEFB] transition flex items-center gap-1"
                        >
                          <FiPlus size={13} /> 1 Lecture
                        </button>
                        <button
                          onClick={() => handleQuickUpdate(subject._id, subject.completedLectures, -1)}
                          disabled={updating || subject.completedLectures === 0}
                          className="px-3 py-1.5 bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] text-[#6B7082] dark:text-[#A9A2BA] rounded-full text-xs font-bold hover:bg-[#F3EEFB] transition flex items-center gap-1"
                        >
                          <FiMinus size={13} /> 1
                        </button>
                        <button
                          onClick={() => { setEditingSubject(subject._id); setTempValue(subject.completedLectures.toString()); }}
                          className="px-3 py-1.5 text-[#8E4CF6] text-xs font-bold hover:underline"
                        >
                          Custom
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default SyllabusDetail;
