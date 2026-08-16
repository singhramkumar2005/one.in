# Advanced Syllabus Detail Page - Complete Code

Replace the content of `frontend/src/pages/SyllabusDetail.jsx` with this code:

```jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Layout from '../components/Layout';
import { FiArrowLeft, FiBarChart2, FiCalendar, FiCheckCircle, FiClock, FiEdit2, FiTrash2, FiTrendingUp, FiTrendingDown, FiTarget, FiBook, FiAward, FiActivity, FiSave, FiX, FiPlus, FiMinus } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

const SyllabusDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [syllabus, setSyllabus] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
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
    if (!window.confirm('Delete this syllabus?')) return;
    try {
      await api.delete(`/syllabus/${id}`);
      toast.success('Syllabus deleted');
      navigate('/syllabus');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (!syllabus) return null;

  const percentage = stats?.completionPercentage || 0;
  const pieData = stats?.subjectStats?.map(s => ({ name: s.name, value: s.completedLectures, color: s.color })) || [];
  const barData = stats?.subjectStats?.map(s => ({ name: s.name, completed: s.completedLectures, total: s.totalLectures })) || [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/syllabus')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <FiArrowLeft className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{syllabus.title}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{syllabus.description}</p>
            </div>
          </div>
          <button onClick={deleteSyllabus} className="p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400">
            <FiTrash2 className="h-5 w-5" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
            <FiTarget className="h-10 w-10 mb-4 opacity-80" />
            <p className="text-sm opacity-90 mb-1">Overall Progress</p>
            <p className="text-4xl font-bold">{percentage}%</p>
            <div className="mt-3 bg-white bg-opacity-20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
            <FiCalendar className="h-10 w-10 mb-4 opacity-80" />
            <p className="text-sm opacity-90 mb-1">Days Remaining</p>
            <p className="text-4xl font-bold">{stats?.daysRemaining || 0}</p>
            <p className="text-xs opacity-75 mt-2">of {syllabus.targetDays} days</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
            <FiActivity className="h-10 w-10 mb-4 opacity-80" />
            <p className="text-sm opacity-90 mb-1">Daily Target</p>
            <p className="text-4xl font-bold">{syllabus.dailyTarget}</p>
            <p className="text-xs opacity-75 mt-2">lectures per day</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <FiAward className="h-10 w-10 mb-4 opacity-80" />
            <p className="text-sm opacity-90 mb-1">Status</p>
            <p className="text-2xl font-bold">{stats?.isOnTrack ? 'On Track' : 'Behind'}</p>
            <p className="text-xs opacity-75 mt-2">{syllabus.completedLectures} / {syllabus.totalLectures}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-2 p-2">
              {['overview', 'subjects', 'analytics'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Progress Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Subject Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" fill="#6366f1" name="Completed" />
                      <Bar dataKey="total" fill="#e5e7eb" name="Total" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'subjects' && (
              <div className="space-y-6">
                {syllabus.subjects.map(subject => {
                  const subjectStat = stats?.subjectStats.find(s => s.id === subject._id);
                  const subjectPercentage = subjectStat?.completionPercentage || 0;
                  const isEditing = editingSubject === subject._id;

                  return (
                    <div key={subject._id} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: subject.color }}></div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{subject.name}</h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{subject.completedLectures} / {subject.totalLectures}</span>
                        </div>
                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{subjectPercentage}%</span>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-6">
                        <div className="h-4 rounded-full transition-all duration-500" style={{ width: `${subjectPercentage}%`, backgroundColor: subject.color }}></div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isEditing ? (
                          <>
                            <input type="number" min="0" max={subject.totalLectures} value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white w-32" />
                            <button onClick={() => { updateSubjectProgress(subject._id, parseInt(tempValue)); }} disabled={updating} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">
                              <FiSave className="h-4 w-4" /> Save
                            </button>
                            <button onClick={() => { setEditingSubject(null); setTempValue(''); }} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500">
                              <FiX className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleQuickUpdate(subject._id, subject.completedLectures, -1)} disabled={updating || subject.completedLectures === 0} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 flex items-center gap-2">
                              <FiMinus className="h-4 w-4" /> 1
                            </button>
                            <button onClick={() => handleQuickUpdate(subject._id, subject.completedLectures, 1)} disabled={updating || subject.completedLectures >= subject.totalLectures} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
                              <FiPlus className="h-4 w-4" /> 1
                            </button>
                            <button onClick={() => handleQuickUpdate(subject._id, subject.completedLectures, 5)} disabled={updating || subject.completedLectures >= subject.totalLectures} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
                              <FiPlus className="h-4 w-4" /> 5
                            </button>
                            <button onClick={() => { setEditingSubject(subject._id); setTempValue(subject.completedLectures.toString()); }} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-2">
                              <FiEdit2 className="h-4 w-4" /> Edit
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                      <FiClock className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-3" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Days Elapsed</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.daysElapsed || 0}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
                      <FiCheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mb-3" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Lectures Remaining</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{syllabus.totalLectures - syllabus.completedLectures}</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
                      <FiTrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-3" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Expected Progress</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.daysElapsed * syllabus.dailyTarget || 0}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Timeline</h3>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{new Date(syllabus.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Target End Date:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{new Date(syllabus.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span className={`font-semibold ${stats?.isOnTrack ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {stats?.isOnTrack ? 'On Track' : 'Behind Schedule'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SyllabusDetail;
```

## Installation

Make sure you have recharts installed:
```bash
cd frontend
npm install recharts
```

## Features

1. **Advanced Stats Cards** - Gradient cards with icons
2. **Tab Navigation** - Overview, Subjects, Analytics
3. **Interactive Charts** - Pie chart and bar chart using Recharts
4. **Edit Mode** - Click edit to manually enter lecture count
5. **Quick Updates** - +1, +5, -1 buttons
6. **Smooth Animations** - Progress bars with transitions
7. **Dark Mode Support** - Full dark mode compatibility
