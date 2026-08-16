import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import Layout from '../components/Layout';
import { FiArrowLeft, FiTrendingUp, FiCheckCircle, FiClock, FiTarget, FiBarChart2 } from 'react-icons/fi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const TestAnalysis = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [questionAnalysis, setQuestionAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalysis();
  }, [testId]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const [analysisRes, questionRes] = await Promise.all([
        api.get(`/results/test/${testId}/analysis`),
        api.get(`/results/test/${testId}/question-analysis`)
      ]);

      setAnalysis(analysisRes.data.analysis);
      setQuestionAnalysis(questionRes.data.questionAnalysis);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#E8DFF2] border-t-[#8E4CF6]"></div>
            <p className="text-xs font-bold text-[#6B7082] dark:text-[#A9A2BA]">Computing progress analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !analysis) {
    return (
      <Layout>
        <div className="bg-white dark:bg-[#111115] rounded-3xl p-12 text-center border border-[#E8DFF2] dark:border-[#22222B] max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 bg-[#FFE8EE] text-[#A1183A] rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h2 className="text-lg font-bold text-[#17171C] dark:text-white">Analysis Error</h2>
          <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA]">{error || 'No analysis data available for this test.'}</p>
          <Link to="/results" className="inline-block px-6 py-2.5 bg-[#141416] text-white rounded-full text-xs font-bold">
            Return to Results
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/results"
            className="inline-flex items-center space-x-2 text-xs font-bold text-[#8E4CF6] hover:underline"
          >
            <FiArrowLeft size={16} />
            <span>Return to Results</span>
          </Link>
        </div>

        {/* Header Banner */}
        <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-[#EFE7FC] text-[#5D2D9C] rounded-full text-xs font-bold">
                {analysis.testInfo?.examType || 'Mock Analysis'}
              </span>
              <span className="px-3 py-1 bg-[#DDF9E2] text-[#147034] rounded-full text-xs font-bold">
                {analysis.totalAttempts} Attempt{analysis.totalAttempts > 1 ? 's' : ''} Analyzed
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17171C] dark:text-white">
              {analysis.testInfo?.title}
            </h1>
            <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA]">
              Performance trends, score progression, and question level mastery.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                activeTab === 'overview'
                  ? 'bg-[#141416] text-white dark:bg-white dark:text-[#141416] shadow-xs'
                  : 'bg-[#FAF7FD] dark:bg-[#18181F] text-[#6B7082] dark:text-[#A9A2BA] border border-[#E8DFF2] dark:border-[#22222B]'
              }`}
            >
              Overview Trend
            </button>
            <button
              onClick={() => setActiveTab('sections')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                activeTab === 'sections'
                  ? 'bg-[#141416] text-white dark:bg-white dark:text-[#141416] shadow-xs'
                  : 'bg-[#FAF7FD] dark:bg-[#18181F] text-[#6B7082] dark:text-[#A9A2BA] border border-[#E8DFF2] dark:border-[#22222B]'
              }`}
            >
              Section Drilldown
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] block mb-1">First Attempt</span>
            <span className="text-2xl font-extrabold text-[#17171C] dark:text-white">
              {analysis.firstAttemptScore || 0}%
            </span>
          </div>

          <div className="bg-white dark:bg-[#111115] rounded-3xl p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#147034] block mb-1">Best Score</span>
            <span className="text-2xl font-extrabold text-[#147034]">
              {analysis.bestScore || 0}%
            </span>
          </div>

          <div className="bg-white dark:bg-[#111115] rounded-3xl p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E4CF6] block mb-1">Latest Attempt</span>
            <span className="text-2xl font-extrabold text-[#8E4CF6]">
              {analysis.latestAttemptScore || 0}%
            </span>
          </div>

          <div className="bg-white dark:bg-[#111115] rounded-3xl p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B5305] block mb-1">Net Improvement</span>
            <span className="text-2xl font-extrabold text-[#9B5305]">
              {analysis.improvement > 0 ? `+${analysis.improvement}` : analysis.improvement || 0}%
            </span>
          </div>
        </div>

        {/* Charts Container */}
        <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-[#E8DFF2] dark:border-[#22222B]">
            <h2 className="text-base font-extrabold text-[#17171C] dark:text-white">
              {activeTab === 'overview' ? 'Score Progression Over Attempts' : 'Section Score Breakdown'}
            </h2>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'overview' ? (
                <LineChart data={analysis.attemptProgression || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8DFF2" />
                  <XAxis dataKey="attemptNumber" stroke="#9CA0B0" />
                  <YAxis domain={[0, 100]} stroke="#9CA0B0" />
                  <Tooltip />
                  <Line type="monotone" dataKey="percentage" stroke="#8E4CF6" strokeWidth={3} dot={{ r: 5, fill: '#8E4CF6' }} />
                </LineChart>
              ) : (
                <BarChart data={analysis.sectionProgression || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8DFF2" />
                  <XAxis dataKey="name" stroke="#9CA0B0" />
                  <YAxis domain={[0, 100]} stroke="#9CA0B0" />
                  <Tooltip />
                  <Bar dataKey="averageScore" fill="#44D368" radius={[8, 8, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default TestAnalysis;
