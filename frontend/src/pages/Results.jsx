import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiCheckCircle, FiTrendingUp, FiChevronDown, FiChevronUp, FiEye, FiAward, FiTarget, FiCheckSquare } from 'react-icons/fi';
import api from '../utils/api';
import Layout from '../components/Layout';

const Results = () => {
  const [attempts, setAttempts] = useState([]);
  const [groupedTests, setGroupedTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    testsCompleted: 0
  });

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await api.get('/results/my-tests');
      const allAttempts = response.data.attempts || [];
      setAttempts(allAttempts);
      
      const totalAttempts = allAttempts.length;
      const avgScore = totalAttempts > 0 
        ? (allAttempts.reduce((sum, a) => sum + parseFloat(a.score?.percentage || 0), 0) / totalAttempts).toFixed(1)
        : 0;
      const bestScore = totalAttempts > 0
        ? Math.max(...allAttempts.map(a => parseFloat(a.score?.percentage || 0)))
        : 0;
      
      const grouped = {};
      allAttempts.forEach(attempt => {
        const testId = attempt.test?._id || 'unknown';
        if (!grouped[testId]) {
          grouped[testId] = {
            test: attempt.test || { title: 'Mock Exam', examType: 'General' },
            attempts: []
          };
        }
        grouped[testId].attempts.push(attempt);
      });
      
      const groupedArray = Object.values(grouped).map(group => ({
        ...group,
        latestAttempt: group.attempts[0],
        totalAttempts: group.attempts.length,
        bestScore: Math.max(...group.attempts.map(a => a.score?.total || 0)),
        bestPercentage: Math.max(...group.attempts.map(a => parseFloat(a.score?.percentage || 0))),
        avgPercentage: (group.attempts.reduce((sum, a) => sum + parseFloat(a.score?.percentage || 0), 0) / group.attempts.length).toFixed(1)
      }));
      
      setStats({
        totalAttempts,
        averageScore: avgScore,
        bestScore: bestScore.toFixed(1),
        testsCompleted: Object.keys(grouped).length
      });
      
      setGroupedTests(groupedArray);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch results:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#E8DFF2] border-t-[#8E4CF6]"></div>
            <p className="text-xs font-bold text-[#6B7082] dark:text-[#A9A2BA]">Loading evaluated results...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Title Section */}
        <div className="bg-white dark:bg-[#111115] p-6 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 bg-[#D6A6FF]/25 text-[#8E4CF6] rounded-2xl flex items-center justify-center font-bold text-lg border border-[#D6A6FF]/30">
              <FiCheckSquare size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#17171C] dark:text-white">Exam Results & History</h1>
              <p className="text-xs font-medium text-[#6B7082] dark:text-[#A9A2BA]">Detailed analysis of your completed tests and score benchmarks</p>
            </div>
          </div>
          <span className="self-start sm:self-auto px-3.5 py-1.5 bg-[#DDF9E2] text-[#147034] rounded-full text-xs font-bold">
            {stats.totalAttempts} Attempts Evaluated
          </span>
        </div>

        {/* Stats Overview Cards */}
        {groupedTests.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-3xl p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-1">Tests Completed</p>
                <p className="text-2xl font-extrabold text-[#17171C] dark:text-white">{stats.testsCompleted}</p>
              </div>
              <div className="w-11 h-11 bg-[#DDF9E2] text-[#147034] rounded-2xl flex items-center justify-center">
                <FiCheckCircle size={20} />
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-3xl p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-1">Total Attempts</p>
                <p className="text-2xl font-extrabold text-[#17171C] dark:text-white">{stats.totalAttempts}</p>
              </div>
              <div className="w-11 h-11 bg-[#EFE7FC] text-[#5D2D9C] rounded-2xl flex items-center justify-center">
                <FiTarget size={20} />
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-3xl p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-1">Top Score</p>
                <p className="text-2xl font-extrabold text-[#17171C] dark:text-white">{stats.bestScore}%</p>
              </div>
              <div className="w-11 h-11 bg-[#FFF0DD] text-[#9B5305] rounded-2xl flex items-center justify-center">
                <FiAward size={20} />
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-3xl p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-1">Average Score</p>
                <p className="text-2xl font-extrabold text-[#17171C] dark:text-white">{stats.averageScore}%</p>
              </div>
              <div className="w-11 h-11 bg-[#E5EFFF] text-[#1B459B] rounded-2xl flex items-center justify-center">
                <FiTrendingUp size={20} />
              </div>
            </div>
          </div>
        )}

        {/* Results List */}
        {groupedTests.length === 0 ? (
          <div className="bg-white dark:bg-[#111115] rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] p-12 text-center space-y-4">
            <div className="w-14 h-14 bg-[#EFE7FC] text-[#8E4CF6] rounded-3xl flex items-center justify-center mx-auto text-2xl">
              📊
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#17171C] dark:text-white">No Results Recorded Yet</h3>
              <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] mt-1">Take your first mock test to see your evaluated score cards here.</p>
            </div>
            <Link 
              to="/tests" 
              className="inline-block px-6 py-2.5 bg-[#141416] hover:bg-[#26272E] text-white font-bold text-xs rounded-full transition shadow-xs"
            >
              Browse Mock Tests →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedTests.map(group => (
              <TestResultCard key={group.test?._id || Math.random()} group={group} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

const TestResultCard = ({ group }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const isPassing = group.bestPercentage >= 60;

  return (
    <div className="bg-white dark:bg-[#111115] rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs hover:shadow-md transition overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-[#FAF7FD] dark:bg-[#18181F] border-b border-[#E8DFF2] dark:border-[#22222B]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-[#EFE7FC] text-[#5D2D9C] rounded-full text-xs font-bold">
                {group.test?.examType || 'Mock Test'}
              </span>
              <span className="px-3 py-1 bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] text-[#6B7082] dark:text-[#A9A2BA] rounded-full text-xs font-semibold">
                {group.totalAttempts} {group.totalAttempts === 1 ? 'Attempt' : 'Attempts'}
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-[#17171C] dark:text-white">
              {group.test?.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left md:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] block">Best Score</span>
              <div className={`px-4 py-1.5 rounded-full text-lg font-extrabold inline-block ${
                isPassing ? 'bg-[#DDF9E2] text-[#147034]' : 'bg-[#FFE8EE] text-[#A1183A]'
              }`}>
                {group.bestPercentage}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B]">
            <p className="text-[10px] font-semibold text-[#6B7082] dark:text-[#A9A2BA]">Total Attempts</p>
            <p className="text-base font-extrabold text-[#17171C] dark:text-white">{group.totalAttempts}</p>
          </div>
          <div className="p-3 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B]">
            <p className="text-[10px] font-semibold text-[#6B7082] dark:text-[#A9A2BA]">Highest Marks</p>
            <p className="text-base font-extrabold text-[#17171C] dark:text-white">{group.bestScore}</p>
          </div>
          <div className="p-3 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B]">
            <p className="text-[10px] font-semibold text-[#6B7082] dark:text-[#A9A2BA]">Latest Attempt</p>
            <p className="text-base font-extrabold text-[#17171C] dark:text-white">{group.latestAttempt?.score?.percentage || 0}%</p>
          </div>
          <div className="p-3 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B]">
            <p className="text-[10px] font-semibold text-[#6B7082] dark:text-[#A9A2BA]">Average Score</p>
            <p className="text-base font-extrabold text-[#17171C] dark:text-white">{group.avgPercentage}%</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 min-w-[140px] flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] text-[#17171C] dark:text-white rounded-full hover:bg-[#F3EEFB] text-xs font-bold transition"
          >
            {expanded ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
            <span>{expanded ? 'Hide History' : `View All Attempts (${group.totalAttempts})`}</span>
          </button>
          <button
            onClick={() => navigate(`/test/${group.test?._id}/analysis`)}
            className="px-6 py-2.5 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] rounded-full text-xs font-bold transition shadow-xs flex items-center space-x-1.5"
          >
            <FiTrendingUp size={15} />
            <span>Deep Analysis</span>
          </button>
        </div>
      </div>

      {/* Expanded Attempts */}
      {expanded && (
        <div className="border-t border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD]/60 dark:bg-[#18181F]/60 p-6 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-2">
            Historical Attempt Records
          </h4>
          <div className="space-y-2.5">
            {group.attempts?.map((attempt, index) => (
              <div
                key={attempt._id || index}
                onClick={() => navigate(`/results/${attempt._id}`)}
                className="bg-white dark:bg-[#111115] p-4 rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] hover:border-[#8E4CF6] cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="font-bold text-xs text-[#17171C] dark:text-white">
                      Attempt #{attempt.attemptNumber || (group.attempts.length - index)}
                    </span>
                    {index === 0 && (
                      <span className="bg-[#EFE7FC] text-[#5D2D9C] px-2 py-0.5 text-[10px] font-bold rounded-full">
                        Latest
                      </span>
                    )}
                    {attempt.score?.total === group.bestScore && (
                      <span className="bg-[#DDF9E2] text-[#147034] px-2 py-0.5 text-[10px] font-bold rounded-full">
                        Best Score
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#6B7082] dark:text-[#A9A2BA] flex items-center space-x-1">
                    <FiCalendar size={12} />
                    <span>
                      {new Date(attempt.submittedAt || Date.now()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                      (attempt.score?.percentage || 0) >= 60 ? 'bg-[#DDF9E2] text-[#147034]' : 'bg-[#FFE8EE] text-[#A1183A]'
                    }`}>
                      {attempt.score?.percentage || 0}%
                    </span>
                    <p className="text-[10px] text-[#6B7082] dark:text-[#A9A2BA] mt-0.5">
                      {attempt.score?.total || 0} / {attempt.score?.totalMarks || 100} Marks
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#8E4CF6]">Review →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
