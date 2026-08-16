import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiClock, FiFileText, FiCheckCircle, FiAlertCircle, FiAward, FiUsers, FiInfo, FiCheckSquare, FiArrowRight, FiShield } from 'react-icons/fi';
import api from '../utils/api';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

const TestInstructions = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [attemptInfo, setAttemptInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    fetchTestInstructions();
    checkAttempts();
  }, [testId]);

  const fetchTestInstructions = async () => {
    try {
      const response = await api.get(`/tests/${testId}/instructions`);
      setTest(response.data.test);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load test instructions');
      navigate('/tests');
    }
  };

  const checkAttempts = async () => {
    try {
      const response = await api.get(`/results/test/${testId}/attempts`);
      setAttemptInfo(response.data);
      
      if (!response.data.canReattempt && response.data.totalAttempts > 0) {
        toast.error('Maximum attempts reached for this test');
        navigate(`/test/${testId}/attempts`);
      }
    } catch (error) {
      console.log('No previous attempts found');
    }
  };

  const handleStartTest = () => {
    if (!agreed) {
      toast.warning('Please agree to the instructions before starting');
      return;
    }
    navigate(`/test/${testId}/exam`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#E8DFF2] border-t-[#8E4CF6]"></div>
            <p className="text-xs font-bold text-[#6B7082] dark:text-[#A9A2BA]">Loading test details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const totalQuestions = test.sections?.reduce((sum, s) => sum + s.totalQuestions, 0) || 0;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Test Header Card */}
        <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#EFE7FC] text-[#5D2D9C] rounded-full text-xs font-bold">
              {test.examType || 'Mock Exam'}
            </span>
            <span className="px-3 py-1 bg-[#DDF9E2] text-[#147034] rounded-full text-xs font-bold">
              {test.difficulty ? test.difficulty.toUpperCase() : 'STANDARD'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17171C] dark:text-white leading-tight">
            {test.title}
          </h1>
          
          <p className="text-sm font-medium text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
            {test.description || 'Prepare thoroughly and complete all sections within the allotted timer limit.'}
          </p>
        </div>

        {/* Previous Attempts Alert */}
        {attemptInfo && attemptInfo.totalAttempts > 0 && (
          <div className="bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#EFE7FC] text-[#8E4CF6] rounded-2xl flex items-center justify-center font-bold">
                <FiInfo size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#17171C] dark:text-white">Previous Attempts Recorded</p>
                <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA]">
                  You have attempted this test {attemptInfo.totalAttempts} time{attemptInfo.totalAttempts > 1 ? 's' : ''}.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/test/${testId}/attempts`)}
              className="px-4 py-2 bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] text-[#17171C] dark:text-white rounded-full text-xs font-bold hover:bg-[#F3EEFB] transition"
            >
              View Past Results
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-3xl p-4 shadow-xs">
            <div className="w-9 h-9 bg-[#EFE7FC] text-[#5D2D9C] rounded-2xl flex items-center justify-center mb-2">
              <FiClock size={16} />
            </div>
            <p className="text-[11px] font-semibold text-[#6B7082] dark:text-[#A9A2BA]">Total Duration</p>
            <p className="text-lg font-extrabold text-[#17171C] dark:text-white">{test.duration} mins</p>
          </div>

          <div className="bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-3xl p-4 shadow-xs">
            <div className="w-9 h-9 bg-[#DDF9E2] text-[#147034] rounded-2xl flex items-center justify-center mb-2">
              <FiFileText size={16} />
            </div>
            <p className="text-[11px] font-semibold text-[#6B7082] dark:text-[#A9A2BA]">Total Questions</p>
            <p className="text-lg font-extrabold text-[#17171C] dark:text-white">{totalQuestions}</p>
          </div>

          <div className="bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-3xl p-4 shadow-xs">
            <div className="w-9 h-9 bg-[#FFF0DD] text-[#9B5305] rounded-2xl flex items-center justify-center mb-2">
              <FiAward size={16} />
            </div>
            <p className="text-[11px] font-semibold text-[#6B7082] dark:text-[#A9A2BA]">Total Marks</p>
            <p className="text-lg font-extrabold text-[#17171C] dark:text-white">{test.totalMarks}</p>
          </div>

          <div className="bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-3xl p-4 shadow-xs">
            <div className="w-9 h-9 bg-[#FFE8EE] text-[#A1183A] rounded-2xl flex items-center justify-center mb-2">
              <FiUsers size={16} />
            </div>
            <p className="text-[11px] font-semibold text-[#6B7082] dark:text-[#A9A2BA]">Pass Criteria</p>
            <p className="text-lg font-extrabold text-[#17171C] dark:text-white">{test.passPercentage || 40}%</p>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center space-x-3 pb-2 border-b border-[#E8DFF2] dark:border-[#22222B]">
            <div className="w-8 h-8 bg-[#D6A6FF]/25 text-[#8E4CF6] rounded-xl flex items-center justify-center font-bold text-sm">
              <FiShield size={16} />
            </div>
            <h2 className="text-lg font-extrabold text-[#17171C] dark:text-white">Exam Guidelines & Rules</h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm font-medium text-[#6B7082] dark:text-[#A9A2BA]">
            <div className="flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] text-[#8E4CF6] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </span>
              <p className="pt-0.5">The countdown timer starts as soon as you press <strong>Start Test</strong>. It will auto-submit when time runs out.</p>
            </div>

            <div className="flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] text-[#8E4CF6] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </span>
              <p className="pt-0.5">You may mark questions for review and jump between questions freely using the Question Navigator.</p>
            </div>

            <div className="flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] text-[#8E4CF6] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </span>
              <p className="pt-0.5">Anti-cheating security is enabled. Switching tabs or minimizing full-screen mode may trigger an automatic submission.</p>
            </div>

            <div className="flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] text-[#8E4CF6] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                4
              </span>
              <p className="pt-0.5">Ensure a stable internet connection for seamless answer synchronization.</p>
            </div>
          </div>
        </div>

        {/* Section List if any */}
        {test.sections && test.sections.length > 0 && (
          <div className="bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-3xl p-6 shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-[#17171C] dark:text-white">Subject Sections ({test.sections.length})</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {test.sections.map((section, idx) => (
                <div key={idx} className="p-4 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#17171C] dark:text-white">{section.name}</h3>
                    <p className="text-[11px] text-[#6B7082] dark:text-[#A9A2BA]">{section.totalQuestions || 0} Questions</p>
                  </div>
                  {section.duration && (
                    <span className="px-2.5 py-1 bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-full text-[11px] font-bold text-[#8E4CF6]">
                      {section.duration} min
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agreement & Action */}
        <div className="bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <label className="flex items-center space-x-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 text-[#8E4CF6] rounded-md focus:ring-0 cursor-pointer accent-[#8E4CF6]"
            />
            <span className="text-xs sm:text-sm font-semibold text-[#17171C] dark:text-white">
              I have read and agree to follow the test instructions and guidelines.
            </span>
          </label>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => navigate('/tests')}
              className="px-6 py-3.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] text-[#6B7082] dark:text-[#A9A2BA] rounded-full text-xs font-bold hover:bg-[#F3EEFB] transition"
            >
              Cancel & Return
            </button>
            <button
              onClick={handleStartTest}
              disabled={!agreed}
              className={`flex-1 py-3.5 px-6 rounded-full font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs ${
                agreed
                  ? 'bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416]'
                  : 'bg-[#FAF7FD] text-[#9CA0B0] border border-[#E8DFF2] cursor-not-allowed'
              }`}
            >
              <span>Begin Exam Workspace</span>
              <FiArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default TestInstructions;
