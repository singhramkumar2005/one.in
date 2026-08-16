import React from 'react';
import { useAuthStore } from '../store/authStore';
import { FiCheckSquare } from 'react-icons/fi';

const QuestionNavigator = ({ 
  sections, 
  answers, 
  currentSection, 
  currentQuestion, 
  onQuestionClick 
}) => {
  const { user } = useAuthStore();

  const getQuestionStatus = (question) => {
    const answer = answers[question._id];
    
    if (!answer || answer.status === 'not-visited') {
      return { bg: 'bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B]', text: 'text-[#6B7082] dark:text-[#A9A2BA]', label: 'Not Visited' };
    }
    if (answer.isMarkedForReview && answer.selectedAnswer) {
      return { bg: 'bg-[#EFE7FC] text-[#5D2D9C] border border-[#9C6ADE]/40', text: 'text-[#5D2D9C]', label: 'Marked & Answered' };
    }
    if (answer.isMarkedForReview) {
      return { bg: 'bg-[#FFF0DD] text-[#9B5305] border border-[#FF9F38]/40', text: 'text-[#9B5305]', label: 'Marked' };
    }
    if (answer.selectedAnswer) {
      return { bg: 'bg-[#DDF9E2] text-[#147034] border border-[#44D368]/40', text: 'text-[#147034]', label: 'Answered' };
    }
    return { bg: 'bg-[#FFE8EE] text-[#A1183A] border border-[#FF708F]/40', text: 'text-[#A1183A]', label: 'Not Answered' };
  };

  const getStatistics = () => {
    const stats = {
      notVisited: 0,
      answered: 0,
      notAnswered: 0,
      marked: 0,
      markedAnswered: 0
    };

    sections?.forEach(section => {
      section.questions?.forEach(question => {
        const answer = answers[question._id];
        if (!answer || answer.status === 'not-visited') {
          stats.notVisited++;
        } else if (answer.isMarkedForReview && answer.selectedAnswer) {
          stats.markedAnswered++;
        } else if (answer.isMarkedForReview) {
          stats.marked++;
        } else if (answer.selectedAnswer) {
          stats.answered++;
        } else {
          stats.notAnswered++;
        }
      });
    });

    return stats;
  };

  const stats = getStatistics();

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#111115]">
      {/* Candidate Banner */}
      <div className="p-3 sm:p-4 border-b border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#DDF9E2] text-[#147034] border border-[#44D368]/40 flex items-center justify-center text-[10px] sm:text-xs font-bold shadow-xs shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] sm:text-xs font-bold text-[#17171C] dark:text-white truncate">{user?.name || 'Candidate'}</p>
            <p className="text-[9px] sm:text-[10px] text-[#6B7082] dark:text-[#A9A2BA] truncate">{user?.email || 'Active Candidate'}</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="p-3 sm:p-4 border-b border-[#E8DFF2] dark:border-[#22222B] space-y-2">
        <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA]">Status Overview</h3>
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold">
          <div className="flex items-center justify-between p-1.5 bg-[#DDF9E2]/50 dark:bg-[#0D331A]/50 rounded-lg sm:rounded-xl">
            <span className="text-[#147034] dark:text-[#4ADE80] flex items-center gap-1 text-[10px] sm:text-[11px]">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#44D368]"></span> Answered
            </span>
            <span className="font-bold text-[#147034] dark:text-[#4ADE80]">{stats.answered}</span>
          </div>

          <div className="flex items-center justify-between p-1.5 bg-[#FFE8EE]/50 dark:bg-[#38121E]/50 rounded-lg sm:rounded-xl">
            <span className="text-[#A1183A] dark:text-[#FB7185] flex items-center gap-1 text-[10px] sm:text-[11px]">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FF708F]"></span> Unanswered
            </span>
            <span className="font-bold text-[#A1183A] dark:text-[#FB7185]">{stats.notAnswered}</span>
          </div>

          <div className="flex items-center justify-between p-1.5 bg-[#FFF0DD]/50 dark:bg-[#422006]/50 rounded-lg sm:rounded-xl">
            <span className="text-[#9B5305] dark:text-[#FB923C] flex items-center gap-1 text-[10px] sm:text-[11px]">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FF9F38]"></span> Marked
            </span>
            <span className="font-bold text-[#9B5305] dark:text-[#FB923C]">{stats.marked}</span>
          </div>

          <div className="flex items-center justify-between p-1.5 bg-[#EFE7FC]/50 dark:bg-[#1E0F3C]/50 rounded-lg sm:rounded-xl">
            <span className="text-[#5D2D9C] dark:text-[#C084FC] flex items-center gap-1 text-[10px] sm:text-[11px]">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#9C6ADE]"></span> Reviewed
            </span>
            <span className="font-bold text-[#5D2D9C] dark:text-[#C084FC]">{stats.markedAnswered}</span>
          </div>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 sm:space-y-5">
        {sections?.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-[11px] sm:text-xs font-extrabold text-[#17171C] dark:text-white truncate">
                {section.name}
              </h3>
              <span className="text-[9px] sm:text-[10px] text-[#6B7082] dark:text-[#A9A2BA] font-semibold shrink-0 ml-2">
                {section.questions?.length || 0} Qs
              </span>
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-5 gap-1.5 sm:gap-2">
              {section.questions?.map((question, questionIndex) => {
                const status = getQuestionStatus(question);
                const isCurrent = sectionIndex === currentSection && questionIndex === currentQuestion;
                
                return (
                  <button
                    key={question._id}
                    onClick={() => onQuestionClick(sectionIndex, questionIndex)}
                    className={`h-8 sm:h-9 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs transition-all flex items-center justify-center shadow-2xs ${status.bg} ${
                      isCurrent ? 'ring-2 ring-[#8E4CF6] ring-offset-1 sm:ring-offset-2 scale-105 font-extrabold' : 'hover:opacity-80 active:scale-95'
                    }`}
                  >
                    {questionIndex + 1}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionNavigator;

