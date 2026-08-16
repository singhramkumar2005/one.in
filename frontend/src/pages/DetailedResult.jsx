import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiClock, FiArrowLeft, FiAward, FiTarget, FiBarChart2, FiCheckSquare, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import api from '../utils/api';
import Layout from '../components/Layout';

const DetailedResult = () => {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetailedResult();
  }, [attemptId]);

  const fetchDetailedResult = async () => {
    try {
      const response = await api.get(`/results/${attemptId}/detailed`);
      setResult(response.data.result);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch result:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#E8DFF2] border-t-[#8E4CF6]"></div>
            <p className="text-xs font-bold text-[#6B7082] dark:text-[#A9A2BA]">Generating detailed report...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!result) {
    return (
      <Layout>
        <div className="bg-white dark:bg-[#111115] rounded-3xl p-12 text-center border border-[#E8DFF2] dark:border-[#22222B] max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 bg-[#FFE8EE] text-[#A1183A] rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h2 className="text-lg font-bold text-[#17171C] dark:text-white">Result Not Found</h2>
          <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA]">We couldn't retrieve the details for this test attempt.</p>
          <Link to="/results" className="inline-block px-6 py-2.5 bg-[#141416] text-white rounded-full text-xs font-bold">
            Back to Results
          </Link>
        </div>
      </Layout>
    );
  }

  const { attempt, questions } = result;
  const stats = attempt.statistics || {};

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/results"
            className="inline-flex items-center space-x-2 text-xs font-bold text-[#8E4CF6] hover:underline"
          >
            <FiArrowLeft size={16} />
            <span>Return to All Results</span>
          </Link>
          <span className="text-xs font-semibold text-[#6B7082] dark:text-[#A9A2BA]">
            Submitted on {new Date(attempt.submittedAt).toLocaleDateString('en-US', { 
              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </span>
        </div>

        {/* Top Summary Banner Card */}
        <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-[#EFE7FC] text-[#5D2D9C] rounded-full text-xs font-bold">
                Attempt Scorecard
              </span>
              <span className="px-3 py-1 bg-[#DDF9E2] text-[#147034] rounded-full text-xs font-bold">
                {attempt.score?.percentage >= 60 ? 'PASSED' : 'COMPLETED'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17171C] dark:text-white">
              {attempt.test?.title || 'Mock Test Examination'}
            </h1>
            <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA]">
              Review your question responses, correct answers, and detailed explanations below.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-[#FAF7FD] dark:bg-[#18181F] p-4 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B]">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] block">Overall Score</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#8E4CF6]">
                {attempt.score?.percentage}%
              </span>
            </div>
            <div className="h-10 w-[1px] bg-[#E8DFF2] dark:border-[#22222B]"></div>
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] block">Marks Awarded</span>
              <span className="text-lg font-bold text-[#17171C] dark:text-white">
                {attempt.score?.total} / {attempt.score?.totalMarks}
              </span>
            </div>
          </div>
        </div>

        {/* 5-Column Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl p-4 text-center shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] block mb-1">Attempted</span>
            <span className="text-lg font-extrabold text-[#17171C] dark:text-white">
              {stats.attempted || 0}/{stats.totalQuestions || 0}
            </span>
          </div>

          <div className="bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl p-4 text-center shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#147034] block mb-1">Correct</span>
            <span className="text-lg font-extrabold text-[#147034]">
              {stats.correct || 0}
            </span>
          </div>

          <div className="bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl p-4 text-center shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1183A] block mb-1">Incorrect</span>
            <span className="text-lg font-extrabold text-[#A1183A]">
              {stats.incorrect || 0}
            </span>
          </div>

          <div className="bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl p-4 text-center shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5D2D9C] block mb-1">Accuracy</span>
            <span className="text-lg font-extrabold text-[#5D2D9C]">
              {stats.accuracy || 0}%
            </span>
          </div>

          <div className="bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl p-4 text-center shadow-xs col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B5305] block mb-1">Time Taken</span>
            <span className="text-lg font-extrabold text-[#9B5305]">
              {formatTime(attempt.totalTimeSpent || 0)}
            </span>
          </div>
        </div>

        {/* Section Breakdown Table */}
        {attempt.sections && attempt.sections.length > 0 && (
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-[#17171C] dark:text-white">Section Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#E8DFF2] dark:border-[#22222B] text-[#6B7082] dark:text-[#A9A2BA]">
                    <th className="text-left py-3 font-bold uppercase tracking-wider">Section Name</th>
                    <th className="text-center py-3 font-bold uppercase tracking-wider">Score</th>
                    <th className="text-center py-3 font-bold uppercase tracking-wider">Attempted</th>
                    <th className="text-center py-3 font-bold uppercase tracking-wider">Correct</th>
                    <th className="text-center py-3 font-bold uppercase tracking-wider">Incorrect</th>
                    <th className="text-center py-3 font-bold uppercase tracking-wider">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {attempt.sections?.map((sec, idx) => (
                    <tr key={idx} className="border-b border-[#E8DFF2]/60 dark:border-[#22222B]/60 font-semibold">
                      <td className="py-3 text-[#17171C] dark:text-white font-bold">{sec.sectionName}</td>
                      <td className="text-center py-3 text-[#8E4CF6] font-bold">{sec.score || 0}</td>
                      <td className="text-center py-3">{sec.attempted || 0}/{sec.answers?.length || 0}</td>
                      <td className="text-center py-3 text-[#147034] font-bold">{sec.correct || 0}</td>
                      <td className="text-center py-3 text-[#A1183A] font-bold">{sec.incorrect || 0}</td>
                      <td className="text-center py-3">
                        <span className="px-2.5 py-0.5 bg-[#FAF7FD] dark:bg-[#18181F] rounded-full border border-[#E8DFF2] dark:border-[#22222B]">
                          {sec.accuracy || 0}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Question Solutions List */}
        <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-5">
          <div className="flex justify-between items-center pb-2 border-b border-[#E8DFF2] dark:border-[#22222B]">
            <h2 className="text-lg font-extrabold text-[#17171C] dark:text-white">Detailed Question Solutions</h2>
            <span className="text-xs font-bold text-[#6B7082] dark:text-[#A9A2BA]">{questions?.length || 0} Questions</span>
          </div>

          <div className="space-y-4">
            {questions?.map((item, index) => (
              <SolutionCard
                key={index}
                question={item.question}
                userAnswer={item.userAnswer}
                isCorrect={item.isCorrect}
                marksAwarded={item.marksAwarded}
                timeSpent={item.timeSpent}
                questionNumber={index + 1}
              />
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-center items-center gap-3 pt-4">
          <Link
            to="/tests"
            className="px-6 py-3 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] rounded-full text-xs font-bold shadow-xs transition"
          >
            Take Another Practice Test →
          </Link>
        </div>

      </div>
    </Layout>
  );
};

const SolutionCard = ({ question, userAnswer, isCorrect, marksAwarded, timeSpent, questionNumber }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`p-5 rounded-2xl border transition space-y-3 ${
      isCorrect 
        ? 'border-[#44D368]/50 bg-[#DDF9E2]/25 dark:bg-[#163622]/30' 
        : userAnswer
        ? 'border-[#FF708F]/50 bg-[#FFE8EE]/25 dark:bg-[#2D121B]/30'
        : 'border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F]'
    }`}>
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 bg-[#141416] text-white dark:bg-white dark:text-[#141416] rounded-full text-[11px] font-bold">
            Q{questionNumber}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
            isCorrect 
              ? 'bg-[#DDF9E2] text-[#147034]' 
              : userAnswer 
              ? 'bg-[#FFE8EE] text-[#A1183A]' 
              : 'bg-[#FFF0DD] text-[#9B5305]'
          }`}>
            {isCorrect ? 'Correct' : userAnswer ? 'Incorrect' : 'Skipped'}
          </span>
          <span className="text-[11px] font-semibold text-[#6B7082] dark:text-[#A9A2BA]">
            ⏱️ {Math.floor(timeSpent || 0)}s
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`text-xs font-bold ${marksAwarded > 0 ? 'text-[#147034]' : 'text-[#A1183A]'}`}>
            {marksAwarded > 0 ? `+${marksAwarded}` : marksAwarded || 0} Marks
          </span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs font-bold text-[#8E4CF6] hover:underline flex items-center gap-1"
          >
            {showDetails ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
            <span>{showDetails ? 'Hide Options' : 'View Options'}</span>
          </button>
        </div>
      </div>

      <p className="text-sm font-bold text-[#17171C] dark:text-white leading-relaxed">
        {question.questionText}
      </p>

      {showDetails && (
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            {question.options?.map((opt, idx) => {
              const label = String.fromCharCode(65 + idx);
              const isSelected = opt._id === userAnswer;
              const isCorrectOpt = opt.isCorrect;

              return (
                <div
                  key={idx}
                  className={`flex items-center p-3 rounded-xl border text-xs font-semibold ${
                    isCorrectOpt 
                      ? 'border-[#44D368] bg-[#DDF9E2] text-[#147034]' 
                      : isSelected 
                      ? 'border-[#FF708F] bg-[#FFE8EE] text-[#A1183A]' 
                      : 'border-[#E8DFF2] dark:border-[#22222B] bg-white dark:bg-[#111115] text-[#17171C] dark:text-white'
                  }`}
                >
                  <span className="font-extrabold mr-2.5">{label}.</span>
                  <span className="flex-1">{opt.optionText}</span>
                  {isCorrectOpt && <span className="font-bold text-[#147034] ml-2">✓ Correct Answer</span>}
                  {isSelected && !isCorrectOpt && <span className="font-bold text-[#A1183A] ml-2">✗ Your Choice</span>}
                </div>
              );
            })}
          </div>

          {question.explanation && (
            <div className="p-3.5 bg-[#EFE7FC]/60 dark:bg-[#221538]/40 rounded-xl border border-[#E8DFF2] dark:border-[#22222B] text-xs space-y-1">
              <span className="font-bold text-[#5D2D9C] dark:text-[#C49CFF] block uppercase tracking-wider text-[10px]">
                Explanation & Rationale:
              </span>
              <p className="text-[#17171C] dark:text-white leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

export default DetailedResult;
