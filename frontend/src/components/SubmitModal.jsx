import React from 'react';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const SubmitModal = ({ onClose, onSubmit, answers, totalQuestions }) => {
  const getStatistics = () => {
    const answered = Object.values(answers).filter(a => a?.selectedAnswer).length;
    const notAnswered = Object.values(answers).filter(a => !a?.selectedAnswer && a?.status !== 'not-visited').length;
    const notVisited = totalQuestions - Object.keys(answers).length;
    
    return { answered, notAnswered, notVisited };
  };

  const stats = getStatistics();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E8DFF2] dark:border-[#22222B] shadow-xl space-y-6">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-[#FFF0DD] text-[#9B5305] rounded-2xl flex items-center justify-center font-bold">
            <FiAlertCircle size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#17171C] dark:text-white">Submit Exam?</h2>
            <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA]">Confirm your final submission below</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm font-medium text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
          Are you sure you want to finish this test? Once submitted, your answers will be evaluated and finalized.
        </p>

        <div className="bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl p-4 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#17171C] dark:text-white mb-2">Attempt Summary</h3>
          <div className="flex justify-between text-xs font-semibold text-[#6B7082] dark:text-[#A9A2BA]">
            <span>Total Questions:</span>
            <span className="text-[#17171C] dark:text-white font-bold">{totalQuestions}</span>
          </div>
          <div className="flex justify-between text-xs font-semibold text-[#147034]">
            <span>Answered:</span>
            <span className="font-bold">{stats.answered}</span>
          </div>
          <div className="flex justify-between text-xs font-semibold text-[#A1183A]">
            <span>Unanswered:</span>
            <span className="font-bold">{stats.notAnswered}</span>
          </div>
          <div className="flex justify-between text-xs font-semibold text-[#6B7082] dark:text-[#A9A2BA]">
            <span>Not Visited:</span>
            <span className="font-bold">{Math.max(0, stats.notVisited)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] rounded-full text-xs font-bold text-[#6B7082] dark:text-[#A9A2BA] hover:bg-[#F3EEFB] transition"
          >
            Review Questions
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 py-3 px-4 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] rounded-full text-xs font-bold transition shadow-xs"
          >
            Yes, Submit Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;
