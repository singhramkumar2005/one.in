import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiCheckCircle, FiTrendingUp, FiArrowLeft, FiRotateCcw, FiAward, FiCheckSquare } from 'react-icons/fi';
import api from '../utils/api';
import Layout from '../components/Layout';

const TestAttempts = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttempts();
  }, [testId]);

  const fetchAttempts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/results/test/${testId}/attempts`);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load attempts');
    } finally {
      setLoading(false);
    }
  };

  const handleReattempt = () => {
    if (window.confirm('Are you sure you want to start a new attempt for this test?')) {
      navigate(`/test/${testId}/instructions`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#E8DFF2] border-t-[#8E4CF6]"></div>
            <p className="text-xs font-bold text-[#6B7082] dark:text-[#A9A2BA]">Loading attempt history...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="bg-white dark:bg-[#111115] rounded-3xl p-12 text-center border border-[#E8DFF2] dark:border-[#22222B] max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 bg-[#FFE8EE] text-[#A1183A] rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h2 className="text-lg font-bold text-[#17171C] dark:text-white">Error Loading Attempts</h2>
          <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA]">{error || 'No attempt data found.'}</p>
          <Link to="/tests" className="inline-block px-6 py-2.5 bg-[#141416] text-white rounded-full text-xs font-bold">
            Back to Tests Catalog
          </Link>
        </div>
      </Layout>
    );
  }

  const { attempts, totalAttempts, allowedAttempts, canReattempt, test } = data;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/tests"
            className="inline-flex items-center space-x-2 text-xs font-bold text-[#8E4CF6] hover:underline"
          >
            <FiArrowLeft size={16} />
            <span>Return to Catalog</span>
          </Link>
        </div>

        {/* Header Card */}
        <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#EFE7FC] text-[#5D2D9C] rounded-full text-xs font-bold">
                {test?.examType || 'Mock Exam'}
              </span>
              <span className="px-3 py-1 bg-[#DDF9E2] text-[#147034] rounded-full text-xs font-bold">
                {totalAttempts} Total Attempt{totalAttempts > 1 ? 's' : ''}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17171C] dark:text-white">
              {test?.title}
            </h1>
            <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA]">
              ⏱️ {test?.duration} mins • {test?.totalMarks} marks • Pass: {test?.passPercentage || 40}%
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {canReattempt && (
              <button
                onClick={handleReattempt}
                className="px-5 py-2.5 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] rounded-full font-bold text-xs shadow-xs transition flex items-center gap-1.5"
              >
                <FiRotateCcw size={14} />
                <span>Re-attempt Test</span>
              </button>
            )}
            <Link
              to={`/test/${testId}/analysis`}
              className="px-5 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] text-[#17171C] dark:text-white rounded-full font-bold text-xs hover:bg-[#F3EEFB] transition flex items-center gap-1.5"
            >
              <FiTrendingUp size={14} />
              <span>Full Analytics</span>
            </Link>
          </div>
        </div>

        {/* Attempts Timeline */}
        <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-[#17171C] dark:text-white">
            Attempt Records ({attempts?.length || 0})
          </h2>

          <div className="space-y-3">
            {attempts?.map((attempt, index) => (
              <div
                key={attempt._id || index}
                onClick={() => navigate(`/results/${attempt._id}`)}
                className="bg-[#FAF7FD] dark:bg-[#18181F] hover:bg-white dark:hover:bg-[#1E1E28] p-5 rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-sm text-[#17171C] dark:text-white">
                      Attempt #{attempt.attemptNumber || (attempts.length - index)}
                    </span>
                    {index === 0 && (
                      <span className="px-2.5 py-0.5 bg-[#EFE7FC] text-[#5D2D9C] rounded-full text-[10px] font-bold">
                        Latest
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] flex items-center space-x-1.5">
                    <FiCalendar size={13} />
                    <span>
                      {new Date(attempt.submittedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
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
                  <span className="text-xs font-bold text-[#8E4CF6]">View Breakdown →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default TestAttempts;
