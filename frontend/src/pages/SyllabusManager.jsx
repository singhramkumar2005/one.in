import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Layout from '../components/Layout';
import {
  FiPlus,
  FiBookOpen,
  FiBarChart2,
  FiClock,
  FiCheckCircle,
  FiTrendingUp,
  FiCalendar,
  FiTarget,
  FiAward,
  FiEdit,
  FiTrash2,
  FiEye,
  FiCheckSquare
} from 'react-icons/fi';

const SyllabusManager = () => {
  const navigate = useNavigate();
  const [syllabi, setSyllabi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchSyllabi();
  }, []);

  const fetchSyllabi = async () => {
    try {
      const response = await api.get('/syllabus');
      if (response.data.success) {
        setSyllabi(response.data.data);
        response.data.data.forEach(syllabus => {
          fetchSyllabusStats(syllabus._id);
        });
      }
    } catch (error) {
      console.error('Fetch syllabi error:', error);
      toast.error('Failed to load syllabus plans');
    } finally {
      setLoading(false);
    }
  };

  const fetchSyllabusStats = async (syllabusId) => {
    try {
      const response = await api.get(`/syllabus/${syllabusId}/stats`);
      if (response.data.success) {
        setStats(prev => ({
          ...prev,
          [syllabusId]: response.data.data
        }));
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-[#DDF9E2] text-[#147034]';
      case 'in_progress':
        return 'bg-[#EFE7FC] text-[#5D2D9C]';
      case 'overdue':
        return 'bg-[#FFE8EE] text-[#A1183A]';
      default:
        return 'bg-[#FFF0DD] text-[#9B5305]';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'overdue': return 'At Risk';
      default: return 'Not Started';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#E8DFF2] border-t-[#8E4CF6]"></div>
            <p className="text-xs font-bold text-[#6B7082] dark:text-[#A9A2BA]">Loading syllabus plans...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Card */}
        <div className="bg-white dark:bg-[#111115] p-6 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 bg-[#D6A6FF]/25 text-[#8E4CF6] rounded-2xl flex items-center justify-center font-bold text-lg border border-[#D6A6FF]/30">
              <FiCheckSquare size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#17171C] dark:text-white">Syllabus Tracker</h1>
              <p className="text-xs font-medium text-[#6B7082] dark:text-[#A9A2BA]">Organize lectures, track topic completion, and stay on schedule</p>
            </div>
          </div>
          <Link
            to="/syllabus/create"
            className="px-5 py-2.5 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] rounded-full font-bold text-xs transition shadow-xs flex items-center gap-2 self-start sm:self-auto"
          >
            <FiPlus size={16} />
            <span>Create New Plan</span>
          </Link>
        </div>

        {/* Syllabi Cards Grid */}
        {syllabi.length === 0 ? (
          <div className="bg-white dark:bg-[#111115] rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] p-12 text-center space-y-4">
            <div className="w-14 h-14 bg-[#EFE7FC] text-[#8E4CF6] rounded-3xl flex items-center justify-center mx-auto text-2xl">
              📚
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#17171C] dark:text-white">No Syllabus Plans Yet</h3>
              <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] mt-1">Create a study plan to track subjects, topics, and daily lecture completion.</p>
            </div>
            <Link
              to="/syllabus/create"
              className="inline-block px-6 py-2.5 bg-[#141416] hover:bg-[#26272E] text-white font-bold text-xs rounded-full shadow-xs transition"
            >
              + Create First Syllabus Plan
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {syllabi.map((syllabus, idx) => {
              const stat = stats[syllabus._id] || {};
              const completionPercent = stat.completionPercentage || 0;
              const isHighlight = idx === 1; // sample highlight

              return (
                <div
                  key={syllabus._id}
                  className={`rounded-3xl p-6 border transition flex flex-col justify-between space-y-5 shadow-xs ${
                    isHighlight
                      ? 'bg-[#44D368] text-[#141416] border-[#38C35A]'
                      : 'bg-white dark:bg-[#111115] border-[#E8DFF2] dark:border-[#22222B]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-base font-extrabold line-clamp-1 ${isHighlight ? 'text-[#141416]' : 'text-[#17171C] dark:text-white'}`}>
                        {syllabus.title}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isHighlight ? 'bg-[#141416] text-white' : getStatusColor(syllabus.completionStatus)
                      }`}>
                        {getStatusText(syllabus.completionStatus)}
                      </span>
                    </div>

                    <p className={`text-xs font-medium line-clamp-2 ${isHighlight ? 'text-[#141416]/80' : 'text-[#6B7082] dark:text-[#A9A2BA]'}`}>
                      {syllabus.description || 'Comprehensive subject breakdown and topic lecture plan.'}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className={isHighlight ? 'text-[#141416]' : 'text-[#6B7082] dark:text-[#A9A2BA]'}>Progress</span>
                        <span className={isHighlight ? 'text-[#141416]' : 'text-[#8E4CF6]'}>{completionPercent}%</span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${isHighlight ? 'bg-white/40' : 'bg-[#FAF7FD] dark:bg-[#18181F]'}`}>
                        <div
                          className={`h-full rounded-full ${isHighlight ? 'bg-[#141416]' : 'bg-[#44D368]'}`}
                          style={{ width: `${Math.min(completionPercent, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className={`flex items-center justify-between text-xs font-semibold pt-1 ${isHighlight ? 'text-[#141416]' : 'text-[#6B7082] dark:text-[#A9A2BA]'}`}>
                      <span className="flex items-center gap-1"><FiCalendar size={13} /> {syllabus.targetDays || 30} Days Plan</span>
                      <span>{syllabus.subjects?.length || 0} Subjects</span>
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 pt-3 border-t ${isHighlight ? 'border-[#141416]/15' : 'border-[#E8DFF2] dark:border-[#22222B]'}`}>
                    <Link
                      to={`/syllabus/${syllabus._id}`}
                      className={`flex-1 py-2 rounded-full font-bold text-xs text-center transition shadow-xs ${
                        isHighlight
                          ? 'bg-[#141416] text-white hover:bg-[#26272E]'
                          : 'bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416]'
                      }`}
                    >
                      Open Study Tracker →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </Layout>
  );
};

export default SyllabusManager;
